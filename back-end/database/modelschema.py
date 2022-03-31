from flask_marshmallow import Marshmallow
from marshmallow import Schema, fields

ma = Marshmallow()

# class SecMenuSchema(ma.Schema):
#     class Meta:
#         fields = ("id", "key", "title", "pagepermission", "grade")

class MenuSchema(ma.Schema):
    id = fields.Integer()
    key = fields.String()
    title = fields.String()
    pagepermission = fields.Boolean()
    grade = fields.Integer()
    menu_id = fields.Integer()
    secondmenu = fields.Nested('self', many=True)

menu_schema = MenuSchema()
menu_schemas = MenuSchema(many=True)

class MenuSchema2(ma.Schema):
    id = fields.Integer()
    key = fields.String()
    title = fields.String()
    pagepermission = fields.Boolean()
    grade = fields.Integer()
    menu_id = fields.Integer()

menu_schema2 = MenuSchema2()
menu_schemas2 = MenuSchema2(many=True)



class RightSchema(ma.Schema):
    id = fields.Integer()
    key = fields.String()

class RoleSchema(ma.Schema):
    id = fields.Integer()
    roleName = fields.String()
    roleType = fields.Integer()
    # rights = fields.Nested(RightSchema, many=True)


right_schema = RightSchema()
right_schemas = RightSchema(many=True)


role_schema = RoleSchema()
role_schemas = RoleSchema(many=True)


class UserSchema(ma.Schema):
    id = fields.Integer()
    username = fields.String()
    password = fields.String()
    roleState = fields.Boolean()
    default = fields.Boolean()
    region = fields.String()
    role_id = fields.Integer()
    role = fields.Nested(RoleSchema, many=True)

user_schema = UserSchema()
user_schemas = UserSchema(many=True)


class StockIndusrySchema(ma.Schema):
    updateDate = fields.String()
    code = fields.String()
    code_name = fields.String()
    industry = fields.String()
    industryClassification = fields.String()

si_schema = StockIndusrySchema()
si_schemas = StockIndusrySchema(many=True)