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
INSERT INTO User (username, password)
VALUES ('test', 'test');
INSERT INTO Project (projectName, status, username)
VALUES ('p1', 'Clean', 'test');
INSERT INTO Project (projectName, status, link, username)
VALUES ('p2', 'Completed', 'l1', 'test');