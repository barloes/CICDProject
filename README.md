# Init

- Install Docker
- docker compose build && docker compose up

# Features

- login to see home page
- home page allow users to redirect to recommendation, deploy

# Dashboard

- show the list of projects added with CICD (show IP also)
- Add and remove projects (will add ECR and remove ECR) (role -> push image to ECR and update service on fargate
  # Deploy
  - server create Fargate and deploy the corresponding ECR -> return IP of server

# Recommendation

- users need to answer a series of questions
- users will get back a completed CI / variables to be added to githuh workflow/ci.yml

https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html

# Editor

- add the following text to the Editor, it has some error

# Command

```
docker-compose -f docker-compose.local.yml up
cd fe && npm run start
```

```
---
after_success:
  - "mvn clean cobertura:cobertura"
  - "mvn test"
 jdk:
  - openjdk7
  - oraclejdk7
language: java
notifications:
  email:
    recipients:
      - mymail@gmail.com

```

# download docker-compose

sudo curl -L "https://github.com/docker/compose/releases/download/1.26.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo mv /usr/local/bin/docker-compose /usr/bin/docker-compose
sudo chmod +x /usr/bin/docker-compose
