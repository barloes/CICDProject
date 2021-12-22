#!/bin/bash

bucket_name=$1 #junhuibucket
project_name=$2 #cicdfyp

aws s3 rm --recursive s3:///$bucket_name/$project_name
aws s3 sync ./ s3://$bucket_name/$project_name  --exclude "*node_modules/*"

INSTANCE_ID=$(aws ec2 describe-instances --query 'Reservations[].Instances[].[InstanceId, Tags[?Key==`Name`], Tags[?Key==`cicdfyp`]][0][0]' --output text)
aws ec2 stop-instances --instance-ids $INSTANCE_ID
sleep 60
aws ec2 start-instances --instance-ids $INSTANCE_ID