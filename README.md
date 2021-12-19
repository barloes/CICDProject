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
docker-compose up -d
docker build -t fe ./fe
docker run -d -v $(pwd)/fe/default.conf:/etc/nginx/conf.d/default.conf -p 80:80 fe
```

```
language: java

 jdk:
    - openjdk7
    - oraclejdk7

after_success:
   - mvn clean cobertura:cobertura
   - mvn test

notifications:
   email:
       recipients:
          - mymail@gmail.com
```
