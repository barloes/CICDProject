# save this as app.py
from flask import *
from datetime import datetime
import mysql.connector
import boto3
from flask_cors import CORS
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


config = {
    "user": "root",
    "password": "root",
    "host": "host.docker.internal",
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


def convertResToJsonList(nameList, responses):
    result = list()
    for res in responses:
        d = dict()
        for count, value in enumerate(res):
            d[nameList[count]] = value

        result.append(d)
    return result


jwt = JWTManager(app)


@app.route("/test", methods=["GET"])
def test():
    app.logger.info(request.json)
    name = "cicd-be"
    response = boto3.client("ecs").create_cluster(
        clusterName=name,
    )
    app.logger.info(response)

    response = boto3.client("ecs").create_service(
        cluster=name,
        serviceName=name,
        taskDefinition="string",
        serviceRegistries=[
            {
                "registryArn": "string",
                "port": 123,
                "containerName": "string",
                "containerPort": 123,
            },
        ],
        desiredCount=1,
        launchType="FARGATE",
        deploymentConfiguration={
            "deploymentCircuitBreaker": {"enable": True, "rollback": True},
        },
        networkConfiguration={
            "awsvpcConfiguration": {
                "subnets": [
                    "string",
                ],
                "securityGroups": [
                    "string",
                ],
                "assignPublicIp": "ENABLED",
            }
        },
        healthCheckGracePeriodSeconds=2147483647,
        schedulingStrategy="REPLICA",
        deploymentController={"type": "CODE_DEPLOY"},
        enableExecuteCommand=True,
    )

    try:
        return jsonify({"status": 200})
    except Exception as e:
        return jsonify({"msg": "Bad Request", "status": 401})


@app.route("/project", methods=["GET"])
@jwt_required()
def list_projects():
    app.logger.info(f"cur user: {get_jwt_identity()}")
    username = get_jwt_identity()

    query = "select projectName,status,link from Project where username=%s"
    data = (username,)
    responses = select_query(query, data)
    app.logger.info(f"responses: {str(responses)}")

    nameList = ["name", "status", "link"]
    results = convertResToJsonList(nameList, responses)
    return jsonify(results=results)


# add project
@app.route("/project", methods=["POST"])
@jwt_required()
def add_project():
    app.logger.info(f"cur user: {get_jwt_identity()}")
    app.logger.info(request.json)
    projectName = request.json.get("projectName", None)

    query = (
        "INSERT INTO Project (projectName, status, username) VALUES (%s, 'Clean', %s );"
    )
    data = (projectName, get_jwt_identity())
    try:
        insert_query(query, data)

        ecr = boto3.client("ecr")
        response = ecr.create_repository(
            repositoryName=projectName,
            imageTagMutability="MUTABLE",
            imageScanningConfiguration={"scanOnPush": False},
        )
        app.logger.info(f"Response from creating ecr: {response}")

        return jsonify({"status": 200})
    except Exception as e:
        return jsonify({"msg": "Bad Request", "status": 401})


# remove project
@app.route("/project", methods=["DELETE"])
@jwt_required()
def remove_project():
    app.logger.info(f"cur user: {get_jwt_identity()}")
    app.logger.info(request.json)
    projectName = request.json.get("projectName", None)

    query = "DELETE FROM Project where projectName=%s and username=%s;"
    data = (projectName, get_jwt_identity())
    try:
        insert_query(query, data)

        ecr = boto3.client("ecr")
        response = ecr.delete_repository(repositoryName=projectName, force=True)
        app.logger.info(f"Response from deleting ecr: {response}")

        return jsonify({"status": 200})
    except Exception as e:
        return jsonify({"msg": "Bad Request", "status": 401})


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
        results = convertResToJsonList(nameList, responses)

        return jsonify(results=results)
    except Exception as e:
        app.logger.exception(e)
        return jsonify({"msg": "Bad Request", "status": 401})


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
        results = convertResToJsonList(nameList, responses)

        return jsonify(results=results)
    except Exception as e:
        app.logger.exception(e)
        return jsonify({"msg": "Bad Request", "status": 401})

# get version
@app.route("/config/<string:language>/<string:version>", methods=["GET"])
@jwt_required()
def getConfig(language,version):
    app.logger.info(f"cur user: {get_jwt_identity()}")
    query = "SELECT docker,config from Config where language=%s and version=%s;"
    data = (language,version)
    try:
        responses = select_query(query, data)
        nameList = ["docker","config"]
        results = convertResToJsonList(nameList, responses)

        return jsonify(results=results)
    except Exception as e:
        app.logger.exception(e)
        return jsonify({"msg": "Bad Request", "status": 401})

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


@app.route("/", methods=["GET"])
def healthcheck():
    return Response(status=200)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
