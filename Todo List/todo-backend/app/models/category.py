from .. import db
from enum import Enum
from sqlalchemy.orm import relationship

class StatusEnum(Enum):
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'

class Category(db.Model):
    __tablename__ = 'category'
    category_id = db.Column(db.Integer, primary_key=True)
    category_description = db.Column(db.String(100), nullable=False, unique=True)
    category_status = db.Column(db.Enum(StatusEnum), default=StatusEnum.ACTIVE, nullable=False)

    tasks = relationship('Task', backref='category_task')

    def __init__(self, category_description, category_status):
        self.category_description = category_description
        self.category_status = category_status


    def serialize(self, include_task=True):
        category_data = {
            'category_id': self.category_id,
            'category_description': self.category_description,
            'category_status': self.category_status.value,            
        }

        if include_task:
            category_data['tasks'] = [task.serialize(include_category=False, include_tag=False) for task in self.tasks] if self.tasks else []

        return category_data