import json, boto3
from pprint import pprint

# create vpc,subnet, attach igw and add route table for igw to allow public access to the vpc

response = boto3.client("ec2").create_vpc(
    CidrBlock="10.0.0.0/16",
)

vpc_id = response["Vpc"]["VpcId"]
cidr_block = "10.0.0.0/24"

response = boto3.client("ec2").create_subnet(
    CidrBlock=cidr_block,
    VpcId=vpc_id,
)
subnet_id = response["Subnet"]["SubnetId"]

response = boto3.client("ec2").create_security_group(
    Description="sg for fargate svc",
    GroupName="fargateSg",
    VpcId=vpc_id,
)

security_group_id = response["GroupId"]

response = boto3.client("ec2").authorize_security_group_ingress(
    GroupId=security_group_id,
    IpPermissions=[
        {
            "FromPort": 0,
            "IpProtocol": "tcp",
            "IpRanges": [
                {
                    "CidrIp": "0.0.0.0/0",
                    "Description": "access from everywhere",
                },
            ],
            "ToPort": 65535,
        },
    ],
)

response = boto3.client("ec2").create_internet_gateway()

igw_id = response["InternetGateway"]["InternetGatewayId"]
response = boto3.client("ec2").attach_internet_gateway(
    InternetGatewayId=igw_id, VpcId=vpc_id
)

response = boto3.client("ec2").describe_route_tables(
    Filters=[
        {
            "Name": "vpc-id",
            "Values": [
                vpc_id,
            ],
        },
    ],
)
route_table_id = response["RouteTables"][0]["RouteTableId"]

response = boto3.client("ec2").create_route(
    DestinationCidrBlock="0.0.0.0/0",
    GatewayId=igw_id,
    RouteTableId=route_table_id,
)


# declare vars
# create sg for fargate and sg for user
app_name = "cicd"
role_name = "ecs_task"
policy_name = role_name + "_policy"

trust_relationship_policy = {
    "Version": "2008-10-17",
    "Statement": [
        {
            "Sid": "",
            "Effect": "Allow",
            "Principal": {"Service": "ecs-tasks.amazonaws.com"},
            "Action": "sts:AssumeRole",
        }
    ],
}

create_role_res = boto3.client("iam").create_role(
    RoleName=role_name,
    AssumeRolePolicyDocument=json.dumps(trust_relationship_policy),
    Description="ecs task exec role",
)

task_exec_role_arn = create_role_res["Role"]["Arn"]

policy_json = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ecr:GetAuthorizationToken",
                "ecr:BatchCheckLayerAvailability",
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchGetImage",
                "ecr:InitiateLayerUpload",
                "ecr:CompleteLayerUpload",
                "ecr:UploadLayerPart",
                "ecr:PutImage",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
                "ecs:UpdateService",
                "iam:PassRole",
            ],
            "Resource": "*",
        }
    ],
}

policy_res = boto3.client("iam").create_policy(
    PolicyName=policy_name, PolicyDocument=json.dumps(policy_json)
)
policy_arn = policy_res["Policy"]["Arn"]

policy_attach_res = boto3.client("iam").attach_role_policy(
    RoleName=role_name, PolicyArn=policy_arn
)

print(
    f" subnet_id='{subnet_id}', security_group_id='{security_group_id}', task_exec_role_arn='{task_exec_role_arn}' ,policy_arn='{policy_arn}'"
)

response = boto3.client("logs").create_log_group(
    logGroupName=app_name,
)
pprint(response)
