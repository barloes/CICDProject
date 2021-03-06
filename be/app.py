# save this as app.py
from flask import *
from datetime import datetime
import mysql.connector
import boto3
from flask_cors import CORS
import time
from flask_jwt_extended import (
    JWTManager,
    jwt_required,
    get_jwt_identity,
    create_access_token,
)
from datetime import timedelta

app = Flask(__name__)
CORS(app)
app.secret_key = "super secret key"
app.debug = True
app.config["JWT_SECRET_KEY"] = "super-secret"  # Change this!
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=7)

jwt = JWTManager(app)

config = {
    "user": "root",  # change to db user
    "password": "root",  # change to db pw
    "host": "172.17.0.1",  # change to db endpoint
    "database": "db",
    "raise_on_warnings": True,
}


def authenticated(username, password):
    query = "select username from User where username=%s and password=%s"
    data = (username, password)
    app.logger.info(f"data:{data}")
    res = select_query(query, data)

    app.logger.info(f"length: {len(res)}")
    if len(res) == 1:
        return True
    else:
        return False


def user_existed(username):
    query = "select username from User where username=%s"
    data = (username,)
    app.logger.info(f"data:{data}")
    res = select_query(query, data)

    app.logger.info(f"length: {len(res)}")
    if len(res) == 1:
        return True
    else:
        return False


def convert_res_to_json_list(nameList, responses):
    result = list()
    for res in responses:
        d = dict()
        for count, value in enumerate(res):
            d[nameList[count]] = value

        result.append(d)
    return result


def create_fargate(
    projectName, port, ecr_uri, task_exec_role_arn, subnet_id, security_group_id
):

    cpu = 256
    memory = 512

    response = boto3.client("ecs", region_name="ap-southeast-1").create_cluster(
        clusterName=projectName,
    )
    app.logger.info(response)

    response = boto3.client(
        "ecs", region_name="ap-southeast-1"
    ).register_task_definition(
        family=projectName,
        executionRoleArn=task_exec_role_arn,
        networkMode="awsvpc",
        containerDefinitions=[
            {
                "name": projectName,
                "image": ecr_uri,
                "cpu": cpu,
                "memory": memory,
                "portMappings": [
                    {"containerPort": port, "hostPort": port, "protocol": "tcp"},
                ],
                "disableNetworking": False,
                "privileged": False,
                "logConfiguration": {
                    "logDriver": "awslogs",
                    "options": {
                        "awslogs-region": "ap-southeast-1",
                        "awslogs-group": "cicd",
                        "awslogs-stream-prefix": projectName,
                    },
                },
            },
        ],
        requiresCompatibilities=[
            "FARGATE",
        ],
        cpu=str(cpu),
        memory=str(memory),
        runtimePlatform={"cpuArchitecture": "X86_64", "operatingSystemFamily": "LINUX"},
    )
    app.logger.info(response)

    response = boto3.client("ecs", region_name="ap-southeast-1").create_service(
        cluster=projectName,
        serviceName=projectName,
        taskDefinition=projectName,
        desiredCount=1,
        launchType="FARGATE",
        deploymentConfiguration={
            "deploymentCircuitBreaker": {"enable": True, "rollback": True},
        },
        networkConfiguration={
            "awsvpcConfiguration": {
                "subnets": [
                    subnet_id,
                ],
                "securityGroups": [
                    security_group_id,
                ],
                "assignPublicIp": "ENABLED",
            }
        },
        schedulingStrategy="REPLICA",
        deploymentController={"type": "ECS"},
    )
    app.logger.info(response)


def remove_fargate(name):

    response = boto3.client("ecs", region_name="ap-southeast-1").delete_service(
        cluster=name, service=name, force=True
    )
    app.logger.info(response)

    time.sleep(30)

    response = boto3.client("ecs", region_name="ap-southeast-1").delete_cluster(
        cluster=name
    )
    app.logger.info(response)


def get_fargate_public_ip(name):
    response = boto3.client("ecs", region_name="ap-southeast-1").list_tasks(
        cluster=name,
        family=name,
    )

    if len(response["taskArns"]) == 0:
        return None

    task_arn = response["taskArns"][0]
    app.logger.info(response)

    response = boto3.client("ecs", region_name="ap-southeast-1").describe_tasks(
        cluster=name,
        tasks=[
            task_arn,
        ],
    )
    app.logger.info(response)
    response = response["tasks"][0]["attachments"][0]["details"]

    network_interface_id = next(
        (x["value"] for x in response if x["name"] == "networkInterfaceId"), None
    )
    print(network_interface_id)

    response = boto3.client(
        "ec2", region_name="ap-southeast-1"
    ).describe_network_interfaces(
        NetworkInterfaceIds=[
            network_interface_id,
        ],
    )

    public_ip = response["NetworkInterfaces"][0]["Association"]["PublicIp"]
    app.logger.info(public_ip)
    return public_ip


# get access key
@app.route("/accesskey", methods=["GET"])
@jwt_required()
def get_access_key():
    app.logger.info(f"cur user: {get_jwt_identity()}")

    policy_arn = "arn:aws:iam::642151248908:policy/ecs_task_policy"

    query = "SELECT accessId,accessSecret from User where username=%s;"
    data = (get_jwt_identity(),)

    try:
        responses = select_query(query, data)
        if responses == [(None, None)]:
            # create user and get accessId and get accessSecret

            response = boto3.client("iam").create_user(
                Path="/cicd/",
                UserName=get_jwt_identity(),
                PermissionsBoundary=policy_arn,
            )

            response = boto3.client("iam").attach_user_policy(
                UserName=get_jwt_identity(),
                PolicyArn=policy_arn,
            )

            response = boto3.client("iam").create_access_key(
                UserName=get_jwt_identity()
            )

            app.logger.info(response)
            accessId = response["AccessKey"]["AccessKeyId"]
            accessSecret = response["AccessKey"]["SecretAccessKey"]

            query = "UPDATE User SET accessId = %s, accessSecret = %s WHERE username=%s"
            data = (
                accessId,
                accessSecret,
                get_jwt_identity(),
            )
            insert_query(query, data)
            app.logger.info(f"{accessId} {accessSecret}")

            query = "SELECT accessId,accessSecret from User where username=%s;"
            data = (get_jwt_identity(),)
            responses = select_query(query, data)

        nameList = ["accessId", "accessSecret"]
        results = convert_res_to_json_list(nameList, responses)

        return jsonify(results=results[0])
    except Exception as e:
        app.logger.exception(e)
        return jsonify({"msg": "Bad Request", "exception": e, "status": 401})


@app.route("/project", methods=["GET"])
@jwt_required()
def list_projects():
    app.logger.info(f"cur user: {get_jwt_identity()}")
    username = get_jwt_identity()

    try:
        query = "select projectName,status,link from Project where username=%s"
        data = (username,)
        responses = select_query(query, data)
        app.logger.info(f"responses: {str(responses)}")

        nameList = ["name", "status", "link"]
        results = convert_res_to_json_list(nameList, responses)

        for res in results:
            projectName = res["name"]
            public_ip = get_fargate_public_ip(projectName)
            if public_ip != None:
                query = "select port from Project where projectName=%s"
                data = (projectName,)
                response = select_query(query, data)
                app.logger.info(response)
                port = response[0][0]
                res["link"] = f"{public_ip}:{port}"

        app.logger.info(results)
        return jsonify(results=results)

    except Exception as e:
        app.logger.exception(e)
        return jsonify({"msg": "Bad Request", "exception": e, "status": 401})


# add project
@app.route("/project", methods=["POST"])
@jwt_required()
def add_project():
    app.logger.info(f"cur user: {get_jwt_identity()}")

    projectName = request.json.get("projectName", None)
    port = request.json.get("port", None)

    try:

        response = boto3.client("ecr", region_name="ap-southeast-1").create_repository(
            repositoryName=projectName,
            imageTagMutability="MUTABLE",
            imageScanningConfiguration={"scanOnPush": False},
        )
        app.logger.info(f"Response from creating ecr: {response}")

        # declare var
        ecr_uri = f"{response['repository']['repositoryUri']}:latest"
        subnet_id = "subnet-0024568afd67f42c0"
        security_group_id = "sg-0def7b112e8c5e6e8"
        task_exec_role_arn = "arn:aws:iam::642151248908:role/ecs_task"

        create_fargate(
            projectName,
            int(port),
            ecr_uri,
            task_exec_role_arn,
            subnet_id,
            security_group_id,
        )

        query = "INSERT INTO Project (projectName, status, username, port) VALUES (%s, 'Clean', %s, %s);"
        data = (projectName, get_jwt_identity(), port)
        insert_query(query, data)

        return jsonify({"status": 200})
    except Exception as e:
        app.logger.exception(e)
        return jsonify({"msg": "Bad Request", "exception": e, "status": 401})


# remove project
@app.route("/project", methods=["DELETE"])
@jwt_required()
def remove_project():
    app.logger.info(f"cur user: {get_jwt_identity()}")
    app.logger.info(request.json)
    projectName = request.json.get("projectName", None)

    try:
        response = boto3.client("ecr", region_name="ap-southeast-1").delete_repository(
            repositoryName=projectName, force=True
        )
        app.logger.info(f"Response from deleting ecr: {response}")

        remove_fargate(projectName)

        query = "DELETE FROM Project where projectName=%s and username=%s;"
        data = (projectName, get_jwt_identity())
        insert_query(query, data)

        return jsonify({"status": 200})
    except Exception as e:
        app.logger.exception(e)
        return jsonify({"msg": "Bad Request", "exception": e, "status": 401})


# get language
@app.route("/config", methods=["GET"])
@jwt_required()
def list_language():
    app.logger.info(f"cur user: {get_jwt_identity()}")
    query = "SELECT DISTINCT (language) from Config;"
    data = ()
    try:
        responses = select_query(query, data)
        nameList = ["language"]
        results = convert_res_to_json_list(nameList, responses)

        return jsonify(results=results)
    except Exception as e:
        app.logger.exception(e)
        return jsonify({"msg": "Bad Request", "exception": e, "status": 401})


# get language
@app.route("/config", methods=["POST"])
@jwt_required()
def create_language():
    language = request.json.get("language", None)
    version = request.json.get("version", None)
    docker_config = request.json.get("config", None)
    try:
        app.logger.info(language)
        app.logger.info(version)
        app.logger.info(config)

        github_config = """on: push \n \njobs: \n  deploy: \n    name: Deploy \n    runs-on: ubuntu-latest \n   \n    steps: \n    - name: Check out code \n      uses: actions/checkout@v2 \n \n    - name: Configure AWS credentials \n      uses: aws-actions/configure-aws-credentials@v1 \n      with: \n        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }} \n        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} \n        aws-region: ap-southeast-1 \n \n    - name: Login to Amazon ECR \n      id: login-ecr \n      uses: aws-actions/amazon-ecr-login@v1 \n \n    - name: Build, tag, and push image to Amazon ECR \n      env: \n        ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }} \n        ECR_REPOSITORY: ${{PROJECT_NAME}} \n        IMAGE_TAG: latest \n      run: | \n        docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG . \n        docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG \n \n    - name: update fargate service with latest image AWS CLI \n      env: \n        ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }} \n        SERVICE: ${{PROJECT_NAME}} \n      run: | \n        aws ecs update-service --cluster $SERVICE --service $SERVICE --task-definition $SERVICE --force-new-deployment"""
        query = "INSERT INTO Config (language, version, docker, config) VALUES (%s, %s, %s, %s);"
        data = (language, version, docker_config, github_config)
        responses = insert_query(query, data)

        return Response(status=200)
    except Exception as e:
        app.logger.exception(e)
        return jsonify({"msg": "Bad Request", "exception": e, "status": 401})


# get version
@app.route("/config/<string:language>", methods=["GET"])
@jwt_required()
def get_versions(language):
    app.logger.info(f"cur user: {get_jwt_identity()}")
    query = "SELECT version from Config where language=%s order by version asc;"
    data = (language,)
    try:
        responses = select_query(query, data)
        nameList = ["version"]
        results = convert_res_to_json_list(nameList, responses)

        return jsonify(results=results)
    except Exception as e:
        app.logger.exception(e)
        return jsonify({"msg": "Bad Request", "exception": e, "status": 401})


# get version
@app.route("/config/<string:language>/<string:version>", methods=["GET"])
@jwt_required()
def get_config(language, version):
    app.logger.info(f"cur user: {get_jwt_identity()}")
    query = "SELECT docker,config from Config where language=%s and version=%s;"
    data = (language, version)
    try:
        responses = select_query(query, data)
        nameList = ["docker", "config"]
        results = convert_res_to_json_list(nameList, responses)

        return jsonify(results=results[0])
    except Exception as e:
        app.logger.exception(e)
        return jsonify({"msg": "Bad Request", "exception": e, "status": 401})


@app.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    return "%s" % get_jwt_identity()


def insert_query(query, data=()):

    cnx = mysql.connector.connect(**config)
    cursor = cnx.cursor(buffered=True)
    app.logger.info(f"query: {query%data}")
    cursor.execute(query, data)

    cnx.commit()
    cursor.close()
    cnx.close()


def select_query(query, data=()):

    cnx = mysql.connector.connect(**config)
    cursor = cnx.cursor(buffered=True)
    app.logger.info(f"query: {query%data}")
    cursor.execute(query, data)

    response = cursor.fetchall()
    app.logger.info(f"response: {response}")

    cursor.close()
    cnx.close()
    return response


@app.route("/login", methods=["POST"])
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    if authenticated(username, password):
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token)
    else:
        return jsonify({"msg": "Bad username or password"}), 401


@app.route("/register", methods=["POST"])
def register():
    username = request.json.get("username", None)
    password = request.json.get("password", None)

    # check not in sql
    if not user_existed(username):

        # register acc
        query = "insert into User where username=%s"
        query = "INSERT INTO User (username, password) VALUES (%s, %s);"
        data = (username, password)
        app.logger.info(f"data:{data}")
        res = insert_query(query, data)

        app.logger.info(f"register user:{res}")

        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token)
    else:
        return jsonify({"msg": "Bad username or password"}), 401


@app.route("/", methods=["GET"])
def healthcheck():
    return Response(status=200)


@app.route("/hello", methods=["GET"])
def helloWorld():
    return jsonify({"msg": "HelloWorld"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
