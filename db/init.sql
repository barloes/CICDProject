CREATE TABLE User (
    username varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    PRIMARY KEY (username)
);

Create TABLE Project (
    projectName varchar(255) NOT NULL,
    status ENUM('Clean', 'Pending', 'Complete'),
    link varchar(255),
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

insert into Config (language,version,docker,config) values ('python','3.8','FROM python:3.8-slim-buster \n \nWORKDIR /app \nCOPY . /app \nRUN pip3 install -r requirements.txt \n \nCMD [ "python3","app.py" ]','test');