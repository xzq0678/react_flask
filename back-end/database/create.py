from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import sys
sys.path.append("D:/xzq/HSBC/back-end/database")
import flask_config

app = Flask(__name__)
app.config.from_object(flask_config)
db = SQLAlchemy(app)
db.init_app(app)

class Menu(db.Model):
    __tablename__ = 'menu'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    key = db.Column(db.String(100), nullable=False, unique=True)
    title = db.Column(db.String(100), nullable=False)
    pagepermission = db.Column(db.Boolean, nullable=False)
    grade = db.Column(db.Integer)
    secondmenu = db.relationship('SecondMenu',backref='menu')

class SecondMenu(db.Model):
    __tablename__ = 'secondmenu'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    key = db.Column(db.String(100), nullable=False, unique=True)
    title = db.Column(db.String(100), nullable=False)
    menu_id = db.Column(db.Integer, db.ForeignKey('menu.id'))
    pagepermission = db.Column(db.Boolean, nullable=False)
    grade = db.Column(db.Integer)


if __name__ == '__main__':

    # 删除所有表
    db.drop_all()

    # 创建所有表
    db.create_all()