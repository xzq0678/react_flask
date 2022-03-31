from create import Menu, SecondMenu
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

import sys
sys.path.append("D:/xzq/HSBC/back-end/database")
import flask_config

app = Flask(__name__)
app.config.from_object(flask_config)
db = SQLAlchemy(app)
db.init_app(app)

def add_menu(k,t,p,g):
    # 创建一个新用户对象
    menu = Menu()
    menu.key = k
    menu.title = t
    menu.pagepermission = p
    menu.grade = g

    # 将新创建的用户添加到数据库会话中
    db.session.add(menu)
    # 将数据库会话中的变动提交到数据库中, 记住, 如果不 commit, 数据库中是没有变化的.
    db.session.commit()

def add_secmenu(k,t,p,g,m):
    # 创建一个新用户对象
    menu = SecondMenu()
    menu.key = k
    menu.title = t
    menu.pagepermission = p
    menu.grade = g
    menu.menu_id = m

    # 将新创建的用户添加到数据库会话中
    db.session.add(menu)
    # 将数据库会话中的变动提交到数据库中, 记住, 如果不 commit, 数据库中是没有变化的.
    db.session.commit()

add_menu("/home", "首页", 1,1)
add_menu("/stock", "我的股票", 0,1)
add_secmenu("/stock/info", "具体股票A", 1,2,2)