CREATE TABLE User (
    userId int NOT NULL AUTO_INCREMENT,
    username varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    PRIMARY KEY (userId)
);

INSERT INTO `User`(username, password) VALUES('test', 'test');
