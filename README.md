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