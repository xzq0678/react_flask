from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Menu(db.Model):
    __tablename__ = 'menu'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    key = db.Column(db.String(100), nullable=False, unique=True)
    title = db.Column(db.String(100), nullable=False)
    pagepermission = db.Column(db.Boolean, nullable=True)
    grade = db.Column(db.Integer)
    menu_id = db.Column(db.Integer, nullable=True)
    secondmenu = db.relationship('SecondMenu', backref='menu')


class SecondMenu(db.Model):
    __tablename__ = 'secondmenu'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    key = db.Column(db.String(100), nullable=False, unique=True)
    title = db.Column(db.String(100), nullable=False)
    menu_id = db.Column(db.Integer, db.ForeignKey('menu.id'))
    pagepermission = db.Column(db.Boolean, nullable=True)
    grade = db.Column(db.Integer)


class Roles(db.Model):
    __tablename__ = 'roles'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    roleName = db.Column(db.String(100), nullable=False, unique=True)
    roleType = db.Column(db.Integer, nullable=False)
    to_right =  db.relationship('RoleRights', uselist=True, backref="to_role", lazy='dynamic')

class Rights(db.Model):
    __tablename__ = 'rights'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    key = db.Column(db.String(100), nullable=False, unique=True)
    to_role =  db.relationship('RoleRights', uselist=True, backref="to_right", lazy='dynamic')

class RoleRights(db.Model):
    __tablename__ = 'rolerights'
    id = db.Column(db.Integer, primary_key=True)
    role_id = db.Column(db.Integer, db.ForeignKey(Roles.id), nullable=True)
    right_id = db.Column(db.Integer, db.ForeignKey(Rights.id), nullable=True)

# rolerights = db.Table("rolerights",
#     db.Column("id",db.Integer, primary_key=True),
#     db.Column("id",db.Integer, db.ForeignKey('roles.id')),
#     db.Column("id",db.Integer, db.ForeignKey('rights.id'))

# )
class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)
    roleState = db.Column(db.Boolean, nullable=True)
    default = db.Column(db.Boolean, nullable=True)
    region = db.Column(db.String(100), nullable=True)
    role_id = db.Column(db.Integer, nullable=False)

class StockIndustry(db.Model):
    __tablename__ = 'stockindustry'
    updateDate = db.Column(db.Date, nullable=False, unique=True)
    code = db.Column(db.String(100),  primary_key=True)
    code_name = db.Column(db.String(100), nullable=False)
    industry = db.Column(db.String(100), nullable=True)
    industryClassification = db.Column(db.String(100), nullable=True)
