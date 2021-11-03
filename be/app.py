# save this as app.py
from flask import *
from datetime import datetime
import mysql.connector
import boto3
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.secret_key = "super secret key"

config = {
    "user": "root",
    "password": "root",
    "host": "host.docker.internal",
    "database": "db",
    "raise_on_warnings": True,
}

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


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
