import boto3
from pprint import pprint

response = boto3.client("ec2").create_vpc(
    CidrBlock="10.0.0.0/16",
)

# pprint(f"created vpc: {response}")

vpc_id = response["Vpc"]["VpcId"]
cidr_block = "10.0.0.0/24"

response = boto3.client("ec2").create_subnet(
    CidrBlock=cidr_block,
    VpcId=vpc_id,
)
subnet_id = response["Subnet"]["SubnetId"]

# pprint(f"created subnet: {response}")

response = boto3.client("ec2").create_security_group(
    Description="sg for fargate svc",
    GroupName="fargateSg",
    VpcId=vpc_id,
)

pprint(f"created sg:{response}")

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

pprint(f"created sg rule:{response}")
print()


pprint(response)

response = boto3.client('ec2').create_internet_gateway()

igw_id = response["InternetGateway"]["InternetGatewayId"]

response = boto3.client('ec2').attach_internet_gateway(
    InternetGatewayId=igw_id,
    VpcId=vpc_id
)

response = boto3.client("ec2").describe_route_tables(
    Filters=[
        {
            'Name': 'vpc-id',
            'Values': [
                vpc_id,
            ]
        },
    ],
)

route_table_id = response["RouteTables"][0]["RouteTableId"]

response = boto3.client("ec2").create_route(
    DestinationCidrBlock='0.0.0.0/0',
    GatewayId=igw_id,
    RouteTableId=route_table_id,
)
pprint(response)


print(
    f" vpc_id='{vpc_id}' subnet_id='{subnet_id}' security_group_id='{security_group_id}' "
)



response = boto3.client("logs").create_log_group(
    logGroupName="cicd",
)
pprint(response)

