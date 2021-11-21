CREATE TABLE User (
    username varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    accessId varchar(255) NULL,
    accessSecret varchar(255) NULL,
    PRIMARY KEY (username)
);

Create TABLE Project (
    projectName varchar(255) NOT NULL,
    status ENUM('Clean', 'Pending', 'Complete'),
    link varchar(255),
    port varchar(255),
    username varchar(255) NOT NULL,
    PRIMARY KEY (projectName),
    FOREIGN KEY (username) REFERENCES User(username) ON DELETE CASCADE
);

Create TABLE Config (
    language varchar(255) NOT NULL,
    version varchar(255) NOT NULL,
    docker TEXT NOT NULL,
    config TEXT NOT NULL,
    PRIMARY KEY (language,version)
);

INSERT INTO User (username, password)
VALUES ('test', 'test');

insert into
   Config (language, version, docker, config) 
values
   (
      'python', '3.8', 'FROM python:3.8-slim-buster \n \nWORKDIR /app \nCOPY . /app \nRUN pip3 install -r requirements.txt \n \nCMD [ "python3","app.py" ]', 'on: push \n \njobs: \n  deploy: \n    name: Deploy \n    runs-on: ubuntu-latest \n   \n    steps: \n    - name: Check out code \n      uses: actions/checkout@v2 \n \n    - name: Configure AWS credentials \n      uses: aws-actions/configure-aws-credentials@v1 \n      with: \n        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }} \n        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }} \n        aws-region: ap-southeast-1 \n \n    - name: Login to Amazon ECR \n      id: login-ecr \n      uses: aws-actions/amazon-ecr-login@v1 \n \n    - name: Build, tag, and push image to Amazon ECR \n      env: \n        ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }} \n        ECR_REPOSITORY: ${{PROJECT_NAME}} \n        IMAGE_TAG: latest \n      run: | \n        docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG . \n        docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG \n \n    - name: update fargate service with latest image AWS CLI \n      env: \n        ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }} \n        SERVICE: ${{PROJECT_NAME}} \n      run: | \n        aws ecs update-service --cluster $SERVICE --service $SERVICE --task-definition $SERVICE --force-new-deployment'
   )
;