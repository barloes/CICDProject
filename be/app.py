# save this as app.py
from flask import *
from datetime import datetime
import mysql.connector
import boto3
from flask_cors import CORS
from flask_jwt import JWT, jwt_required, current_identity

app = Flask(__name__)
CORS(app)
app.secret_key = "super secret key"
app.debug = True


config = {
    "user": "root",
    "password": "root",
    "host": "host.docker.internal",
    "database": "db",
    "raise_on_warnings": True,
}

class Object(object):
    pass

def getUserIdWithUsername(username):
    query = "select userId from User where username=%s"
    data = (username,)
    res = select_query(query, data)

    if len(res) > 0: 
        user = Object()
        user.id = res[0][0]
        return res[0][0]
    else:
        return None
        
def authenticate(username, password):
    query = "select username from User where username=%s and password=%s"
    data = (username,password)
    app.logger.info(f"data:{data}")
    res = select_query(query, data)
    if len(res) > 0: 
        user = Object()
        user.id = getUserIdWithUsername(username)
        user.username = username
        user.password = password
        return user
    else:
        return None

def identity(payload):
    userId = payload['identity']
    app.logger.debug(f"userId {userId}")

    query = "select userId from User where userId=%s"
    data = (userId,)
    res = select_query(query, data)

    if len(res) > 0: 
        user = Object()
        user.id = res[0][0]
        return res[0][0]
    else:
        return None

jwt = JWT(app, authenticate, identity)

@app.route('/test', methods=["POST"])
def test():
    data = request.json
    username = data['username']
    password = data['password']

    query = "select username from User where username=%s and password=%s"
    data = (username,password)

    res = select_query(query, data)
    if len(res) > 0: 
        return res[0][0]
    else:
        return Response(
        "User not found",
        status=400,
    )

@app.route('/protected', methods=["POST"])
@jwt_required()
def protected():
    return '%s' % current_identity

def insert_query(query, data=()):
    try:
        cnx = mysql.connector.connect(**config)
        cursor = cnx.cursor(buffered=True)
        app.logger.info(f"query: {query%data}")
        cursor.execute(query, data)

        cnx.commit()
        cursor.close()
        cnx.close()
    except Exception as e:
        app.logger.exception(e)


def select_query(query, data=()):
    try:
        # commit is False if you are not inserting query

        cnx = mysql.connector.connect(**config)
        cursor = cnx.cursor(buffered=True)
        app.logger.info(f"query: {query%data}")
        cursor.execute(query, data)

        response = cursor.fetchall()
        app.logger.info(f"response: {response}")

        cursor.close()
        cnx.close()
        return response
    except Exception as e:
        app.logger.exception(e)
    return [()]

@app.route("/login", methods=["POST"])
def login():
    app.logger.info(request.form)
    return {"token":"test123"}

@app.route("/", methods=["GET"])
def healthcheck():
    return Response(status=200)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
