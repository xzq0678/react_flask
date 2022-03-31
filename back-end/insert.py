from operator import index
from sqlalchemy import null, create_engine
from database.models import *
import pandas as pd
from database import create_app

app = create_app()
conn = create_engine('mysql+pymysql://root:Qq84841686@localhost:3306/flask_db?charset=utf8')


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

def add_secmenu(k,t,p=None,g=1,m=None):
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
add_menu("/stock", "股票类别", 1,1)
add_secmenu("/stock/A", "A股", 1,2,2)
add_secmenu("/stock/HK", "港股", 1,2,2)
add_secmenu("/stock/AM", "美股", 1,2,2)
add_secmenu("/stock/add", "添加股票", g=2,m=2)
add_secmenu("/stock/delete", "删除股票", g=2,m=2)
add_menu("/user-manage", "用户管理", 1,1)
add_secmenu("/user-manage/user/list", "用户列表", 1,2,3)
add_menu("/right-manage", "权限管理", 1,1)
add_secmenu("/right-manage/right/list", "权限列表", 1,2,4)
add_secmenu("/right-manage/role/list", "角色列表", 1,2,4)


def add_role(n,t):
    # 创建一个新用户对象
    role = Roles()
    role.roleName = n
    role.roleType = t

    # 将新创建的用户添加到数据库会话中
    db.session.add(role)
    # 将数据库会话中的变动提交到数据库中, 记住, 如果不 commit, 数据库中是没有变化的.
    db.session.commit()

def add_right(k):
    # 创建一个新用户对象
    right = Rights()
    right.key = k

    # 将新创建的用户添加到数据库会话中
    db.session.add(right)
    # 将数据库会话中的变动提交到数据库中, 记住, 如果不 commit, 数据库中是没有变化的.
    db.session.commit()

def add_roleright(r1=None,r2=None):
    # 创建一个新用户对象
    rr = RoleRights()
    rr.role_id = r1
    rr.right_id = r2

    # 将新创建的用户添加到数据库会话中
    db.session.add(rr)
    # 将数据库会话中的变动提交到数据库中, 记住, 如果不 commit, 数据库中是没有变化的.
    db.session.commit()

add_role("超级管理员",1)
add_role("用户",2)
add_role("游客",3)
add_right("/home")
add_right("/stock")
add_right("/stock/A")
add_right("/stock/HK")
add_right("/stock/AM")
add_right("/stock/add")
add_right("/stock/delete")
add_right("/user-manage")
add_right("/user-manage/user/list")
add_right("/right-manage")
add_right("/right-manage/right/list")
add_right("/right-manage/role/list")


add_roleright(1,1)
add_roleright(1,2)
add_roleright(1,3)
add_roleright(1,4)
add_roleright(1,5)
add_roleright(1,6)
add_roleright(1,7)
add_roleright(1,8)
add_roleright(1,9)
add_roleright(1,10)
add_roleright(1,11)
add_roleright(1,12)

add_roleright(2,1)
add_roleright(2,2)
add_roleright(2,3)
add_roleright(2,4)
add_roleright(2,5)
add_roleright(2,6)
add_roleright(2,7)
add_roleright(3,1)

# add_roleright()

def add_user(u,p,r=True,d=False,re='A股',rid=3):
    # 创建一个新用户对象
    user = User()
    user.username = u
    user.password = p
    user.roleState = r
    user.default = d
    user.region = re
    user.role_id = rid

    # 将新创建的用户添加到数据库会话中
    db.session.add(user)
    # 将数据库会话中的变动提交到数据库中, 记住, 如果不 commit, 数据库中是没有变化的.
    db.session.commit()

add_user('admin','123456',d=True,re='',rid=1)
add_user('xzq','123456',re='',rid=2)

df=pd.read_csv("D:/xzq/HSBC/back-end/stock_industry.csv")

df.to_sql('stockindustry', con=conn, index=False, if_exists="replace")