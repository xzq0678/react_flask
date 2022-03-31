from flask import Flask
from .models import db
import sys
sys.path.append("D:/xzq/HSBC/back-end/database")
import flask_config

def create_app():
    app = Flask(__name__)
    app.config.from_object(flask_config)

    db.app=app
    db.init_app(app)

    return app
