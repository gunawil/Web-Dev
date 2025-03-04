from tkinter import NO
from .. import db
from datetime import date
from sqlalchemy.orm import relationship

class Task(db.Model):
    __tablename__ = 'task'

    task_id = db.Column(db.Integer, primary_key=True)
    task_date = db.Column(db.Date, nullable=False, default=date.today)  
    task_title = db.Column(db.String(100), nullable=False)
    task_completed = db.Column(db.Boolean, default=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.category_id', name='fk_task_category'))

    category = db.relationship('Category', backref='task_category')

    tags = relationship('Tag', secondary='task_tag', back_populates='tasks')

    def __init__(self, task_date, task_title, task_completed=False, category_id=None):
        self.task_date = task_date
        self.task_title = task_title
        self.task_completed = task_completed
        self.category_id = category_id

    def serialize(self, include_category=True, include_tag=True):
        task_data = {
            'task_id': self.task_id,
            'task_title': self.task_title,
            'task_date': self. task_date.isoformat(),
            'task_completed': self.task_completed,
            'category_id': self.category_id,
        }

        if include_category:
            task_data['category'] = self.category.serialize(include_task=False) if self.category else []

        if include_tag:
            task_data['tags'] = [tag.serialize(include_task=False) for tag in self.tags] if self.tags else []

        return task_data