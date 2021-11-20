import boto3
from pprint import pprint

response = boto3.client("ec2").describe_route_tables(
    Filters=[
        {
            'Name': 'vpc-id',
            'Values': [
                'vpc-09f93ac6f3c066a8d',
            ]
        },
    ],
)

pprint(response["RouteTables"][0]["RouteTableId"])
