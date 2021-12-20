#!/bin/bash

aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin 642151248908.dkr.ecr.ap-southeast-1.amazonaws.com
ecr_name=$1 #junhuiimage
image_name=$2 #cicdfypfe
aws_acc=642151248908.dkr.ecr.ap-southeast-1.amazonaws.com

docker build -t $aws_acc/$ecr_name:$image_name ./fe
docker push $aws_acc/$ecr_name:$image_name