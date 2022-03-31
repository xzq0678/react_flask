from flask import Flask, jsonify
from database.create import Menu
import sys
sys.path.append("D:/xzq/HSBC/back-end/database")
import flask_config
from tables.modelschema import menu_schema
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_restful import Api, Resource # new

app = Flask(__name__)
app.config.from_object(flask_config)
db = SQLAlchemy(app)
db.init_app(app)
ma = Marshmallow(app)
api = Api(app)

@app.route('/')
def hi():
    return 'hi!'

class PostSchema(ma.Schema):
    class Meta:
        fields = ("id", "key", "title", "pagepermission", "grade")

post_schema = PostSchema()
posts_schema = PostSchema(many=True)



class MenuListResource(Resource):
    def get(self):
        menu = Menu.query.all()
        return menu_schema.dump(menu)

api.add_resource(MenuListResource, '/posts')


# api接口前缀
apiPrefix = '/api/v1/'

############用户接口############
@app.route(apiPrefix + 'updatemenu', methods=['GET','POST'])
def list_menu():
    
    return model_to_json_test(Menu)


if __name__ == "__main__":
    app.run(debug=True)
