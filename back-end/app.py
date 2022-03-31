from flask import Flask, request,jsonify 
from database import flask_config
from database.modelschema import *
from database.models import *
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_restful import Api, Resource, request, reqparse  # new
import baostock as bs
import pandas as pd
import json
from sqlalchemy import or_,and_


app = Flask(__name__)
app.config.from_object(flask_config)
db = SQLAlchemy(app)
db.init_app(app)
ma = Marshmallow(app)

api = Api(app)


@app.route('/')
def hi():
    return 'hi!'


class UserListResource(Resource):
    # def get(self):
    #     for i in range(1,Menu.query.count()+1):
    #         menu = Menu.query.filter(Menu.id==i)
    #         secmenu = SecondMenu.query.filter(SecondMenu.menu_id==i)
    #         a.append(setattr(menu,'secondmenu',secmenu))
    #     return menu_schema.dump(menu)
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument(
            'params', location=['json', 'args'], type=dict)
        super().__init__()
        # menu = Menu.query.all()
        # self.menuList=menu_schemas.dump(menu)
        # db.session.commit()


    def get(self):
        # db.session.query(User.username,Roles.roleName).\
        #     join(Roles,Roles.id==User.role_id)
        user = User.query.all()
        return user_schemas.dump(user)

api.add_resource(UserListResource, '/users')

class UserResource(Resource):
    # def get(self):
    #     for i in range(1,Menu.query.count()+1):
    #         menu = Menu.query.filter(Menu.id==i)
    #         secmenu = SecondMenu.query.filter(SecondMenu.menu_id==i)
    #         a.append(setattr(menu,'secondmenu',secmenu))
    #     return menu_schema.dump(menu)
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument(
            'params', location=['json', 'args'], type=dict)
        super().__init__()
        # menu = Menu.query.all()
        # self.menuList=menu_schemas.dump(menu)
        # db.session.commit()


    def get(self, username,password):
        # db.session.query(User.username,Roles.roleName).\
        #     join(Roles,Roles.id==User.role_id)
        print(username)
        a = db.session.query(User).filter(and_(User.username==username,User.password==password)).first()
        return user_schema.dump(a)

api.add_resource(UserResource, '/users/username=<string:username>&password=<string:password>')

class RoleListResource(Resource):
    # def get(self):
    #     for i in range(1,Menu.query.count()+1):
    #         menu = Menu.query.filter(Menu.id==i)
    #         secmenu = SecondMenu.query.filter(SecondMenu.menu_id==i)
    #         a.append(setattr(menu,'secondmenu',secmenu))
    #     return menu_schema.dump(menu)
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument(
            'params', location=['json', 'args'], type=dict)
        super().__init__()
        # menu = Menu.query.all()
        # self.menuList=menu_schemas.dump(menu)
        # db.session.commit()


    def get(self):
        rolelist = db.session.query(Roles).all()
        result = []
        for role in rolelist:
            roleright_list=role.to_right.all()
            right_list = []
            for right in roleright_list:
                right_list.append(right.to_right.key)
            rolelist1=role_schema.dump(role)
            rolelist1['rights'] = right_list
            result.append(rolelist1)
        db.session.commit()
        return result

api.add_resource(RoleListResource, '/roles')

class RoleResource(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument(
            'params', location=['json', 'args'], type=dict)
        super().__init__()

    def get(self, role_id):
        roleright = db.session.query(RoleRights.right_id).filter(RoleRights.role_id==role_id).subquery()
        rightslist = db.session.query(Rights).filter(Rights.id.in_(roleright)).all()
        result = []
        for r in rightslist:
            result.append(r.key)
        db.session.commit()
        return jsonify({'key':result})

    def put(self,role_id):
        args = self.parser.parse_args()
        # role = db.session.query(Roles).get_or_404(role_id)
        # db2=db.session
        db.session.query(RoleRights).filter(RoleRights.role_id==role_id).delete()
        db.session.commit()

        rightlist = db.session.query(Rights).filter(Rights.key.in_(args.params['rights'])).all()
        rolerights = []
        for right in rightlist:
            rr = RoleRights(role_id=role_id, right_id=right.id)
            rolerights.append(rr)
        print(rolerights)
        db.session.add_all(rolerights)
        # # print(rightid)
        # # print(role_id)

        # # rolerights=db1.query(RoleRights).filter((RoleRights.role_id==role_id) & (RoleRights.right_id.notin_(rightid))).all()
        # # for i in rolerights:
        # #     db1.delete(rolerights)
        db.session.commit()


    def delete(self, role_id):
        # print("###################")

        # print("menu_id ",menu_id)
        # print("###################")

        role = db.session.query(Roles).get_or_404(role_id)
        print(role)
        db.session.delete(role)
        db.session.commit()
        return '', 204

api.add_resource(RoleResource, '/roles/<int:role_id>/rights')



class StockResource(Resource):
    def get(self, stockid):
        stockid1 = stockid[:2]+'.'+stockid[2:]
        print(stockid1)
        lg = bs.login()
        rs = bs.query_history_k_data_plus(stockid1,
            "date,code,open,high,low,close,preclose,volume,amount,adjustflag,turn,tradestatus,pctChg,isST",
            start_date='2017-07-01', end_date='2017-12-31',
            frequency="d", adjustflag="3")
        data_list = []
        while (rs.error_code == '0') & rs.next():
            data_list.append(rs.get_row_data())

        result = pd.DataFrame(data_list, columns=rs.fields)
        print(result)
        result1=json.loads(result.to_json(orient='records'))
        bs.logout()
        return result1

    # def patch(self, menu_id):
    #     menu = Menu.query.get_or_404(menu_id)
    #     args = self.parser.parse_args()
    #     if 'title' in args.params:
    #         menu.title = args.params['title']
    #     if 'key' in args.params:
    #         menu.content = args.params['key']
    #     if 'pagepermission' in args.params:
    #         menu.content = args.params['pagepermission']
    #     if 'grade' in args.params:
    #         menu.content = args.params['grade']
    #     if 'menu_id' in args.params:
    #         menu.content = args.params['menu_id']

    #     db.session.commit()
    #     return menu_schema.dump(menu)

    # def delete(self, menu_id):
    #     # print("###################")

    #     # print("menu_id ",menu_id)
    #     # print("###################")

    #     menu = db.session.query(Menu).get_or_404(menu_id)
    #     print(menu)
    #     db.session.delete(menu)
    #     db.session.commit()
    #     return '', 204

api.add_resource(StockResource, '/stock/<string:stockid>')


class StockNameResource(Resource):
    def get(self, stockid):
        if stockid == None:
            return None
        stockid2 = stockid
        if len(stockid) > 2:
            if stockid[:2] in ['sz', 'sh']:
                stockid2 = stockid[:2]+'.'+stockid[2:]
        else:
            stockid2 = stockid

        stock = db.session.query(StockIndustry).filter(StockIndustry.code.like('%'+stockid2+'%')).all()
        return si_schemas.dump(stock)

    # def patch(self, menu_id):
    #     menu = Menu.query.get_or_404(menu_id)
    #     args = self.parser.parse_args()
    #     if 'title' in args.params:
    #         menu.title = args.params['title']
    #     if 'key' in args.params:
    #         menu.content = args.params['key']
    #     if 'pagepermission' in args.params:
    #         menu.content = args.params['pagepermission']
    #     if 'grade' in args.params:
    #         menu.content = args.params['grade']
    #     if 'menu_id' in args.params:
    #         menu.content = args.params['menu_id']

    #     db.session.commit()
    #     return menu_schema.dump(menu)

    # def delete(self, menu_id):
    #     # print("###################")

    #     # print("menu_id ",menu_id)
    #     # print("###################")

    #     menu = db.session.query(Menu).get_or_404(menu_id)
    #     print(menu)
    #     db.session.delete(menu)
    #     db.session.commit()
    #     return '', 204

api.add_resource(StockNameResource, '/stock/<string:stockid>/name')

class MenuListResource(Resource):
    # def get(self):
    #     for i in range(1,Menu.query.count()+1):
    #         menu = Menu.query.filter(Menu.id==i)
    #         secmenu = SecondMenu.query.filter(SecondMenu.menu_id==i)
    #         a.append(setattr(menu,'secondmenu',secmenu))
    #     return menu_schema.dump(menu)
    def __init__(self):
        self.parser = reqparse.RequestParser()
        self.parser.add_argument(
            'params', location=['json', 'args'], type=dict)
        super().__init__()
        # menu = Menu.query.all()
        # self.menuList=menu_schemas.dump(menu)
        # db.session.commit()


    def get(self):
        menu = Menu.query.all()
        return menu_schemas.dump(menu)
    # def get(self):
    #     return self.menuList

    def put(self):
        args = self.parser.parse_args()
        print(args.params)
        if args.params['grade'] == 1:
            db.session.query(Menu).filter(Menu.id==args.params['id']).update(args.params)
        else:
            db.session.query(SecondMenu).filter(SecondMenu.id==args.params['id']).update(args.params)
        db.session.commit()

    def patch(self):
        args = self.parser.parse_args()
        print(args)
        print(args.params)
        if args.params['grade'] == 1:
            Menu.query.filter(Menu.id==args.params['id']).update(args.params)
            db.session.commit()
        else:
            SecondMenu.query.filter(SecondMenu.id==args.params['id']).update(args.params)
            db.session.commit()
        menu = Menu.query.all()
        db.session.commit()
        return menu_schemas.dump(menu)
        # if args.params['grade'] == 1:
        #     # print(args.params['id'])
        #     # data = Menu.query.filter(Menu.id==args.params['id'])
        #     menu = Menu.query.get_or_404(args.params['id'])
        # else:
        #     menu = SecondMenu.query.get_or_404(args.params['id'])
        # if 'title' in args.params:
        #     menu.title = args.params['title']
        # if 'key' in args.params:
        #     menu.key = args.params['key']
        # if 'pagepermission' in args.params:
        #     menu.pagepermission = args.params['pagepermission']
        # if 'grade' in args.params:
        #     menu.grade = args.params['grade']
        # if 'menu_id' in args.params:
        #     menu.menu_id = args.params['menu_id']
        # print(menu_schema.dump(menu))
        # db.session.commit()
        # if args.params['grade'] == 1:
        #     # print(args.params['id'])
        #     # data = Menu.query.filter(Menu.id==args.params['id'])
        #     menu = Menu.query.get_or_404(args.params['id'])
        # else:
        #     menu = SecondMenu.query(SecondMenu).get_or_404(args.params['id'])

        # if 'title' in args.params:
        #     menu.title = args.params['title']
        # if 'key' in args.params:
        #     menu.key = args.params['key']
        # if 'pagepermission' in args.params:
        #     A = menu.pagepermission
        #     menu.pagepermission = args.params['pagepermission']
        # if 'grade' in args.params:
        #     menu.grade = args.params['grade']
        # if 'menu_id' in args.params:
        #     menu.menu_id = args.params['menu_id']
        # menu1 = Menu.query.all()
        # self.menuList=menu_schemas.dump(menu1)
        # menu.pagepermission=A
        # db.session.commit()
        # print(menuList)
        # return menuList

    # def delete(self):
    #     args = self.parser.parse_args()
    #     print(args)
    #     if args.params['grade'] == 1:
    #         # print(args.params['id'])
    #         # data = Menu.query.filter(Menu.id==args.params['id'])
    #         data = db.session.query(Menu).get(args.params['id'])
    #     else:
    #         data = db.session.query(SecondMenu).get(args.params['id'])
    #     db.session.delete(data)
    #     db.session.commit()
    #     return {'msg': "del "}


api.add_resource(MenuListResource, '/menu/list')

class MenuIdResource(Resource):
    def get(self, menu_id):
        menu = Menu.query.get_or_404(menu_id)
        return menu_schema.dump(menu)

    def patch(self, menu_id):
        menu = Menu.query.get_or_404(menu_id)
        args = self.parser.parse_args()
        if 'title' in args.params:
            menu.title = args.params['title']
        if 'key' in args.params:
            menu.content = args.params['key']
        if 'pagepermission' in args.params:
            menu.content = args.params['pagepermission']
        if 'grade' in args.params:
            menu.content = args.params['grade']
        if 'menu_id' in args.params:
            menu.content = args.params['menu_id']

        db.session.commit()
        return menu_schema.dump(menu)

    def delete(self, menu_id):
        # print("###################")

        # print("menu_id ",menu_id)
        # print("###################")

        menu = db.session.query(Menu).get_or_404(menu_id)
        print(menu)
        db.session.delete(menu)
        db.session.commit()
        return '', 204

api.add_resource(MenuIdResource, '/menu/<int:menu_id>', endpoint='menu')

class MenuResource(Resource):
    def get(self):
        menu = db.session.query(Menu).all()
        return menu_schemas2.dump(menu)

api.add_resource(MenuResource, '/menu')

class SecMenuResource(Resource):
    def get(self):
        menu = db.session.query(SecondMenu).all()
        return menu_schemas2.dump(menu)

api.add_resource(SecMenuResource, '/secondmenu')



class PostSecMenu(Resource):
    def get(self, menu_id):
        menu = SecondMenu.query.get_or_404(menu_id)
        return menu_schema.dump(menu)

    def patch(self, menu_id):
        args = self.parser.parse_args()
        print(args.params['pagepermission'])
        menu = SecondMenu.query.get_or_404(menu_id)

        if 'title' in args.params:
            menu.title = args.params['title']
        if 'key' in args.params:
            menu.content = args.params['key']
        if 'pagepermission' in args.params:
            menu.content = args.params['pagepermission']
        if 'grade' in args.params:
            menu.content = args.params['grade']
        if 'menu_id' in args.params:
            menu.content = args.params['menu_id']

        db.session.commit()
        return menu_schema.dump(menu)

    def delete(self, menu_id):
        # print("###################")

        # print("menu_id ",menu_id)
        # print("###################")

        menu = db.session.query(SecondMenu).get_or_404(menu_id)
        # print(menu)
        db.session.delete(menu)
        db.session.commit()
        return '', 204

api.add_resource(PostSecMenu, '/menu/<int:menu_id>/secmenu')



# api接口前缀
apiPrefix = '/api/v1/'


if __name__ == "__main__":
    app.run(debug=True)
