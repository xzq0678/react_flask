from database.models import db
from database import create_app

app = create_app()

if __name__ == '__main__':
    # 删除所有表
    db.drop_all()

    # 创建所有表
    db.create_all()