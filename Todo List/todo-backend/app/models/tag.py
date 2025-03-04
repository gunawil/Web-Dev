import re
from tkinter import N
from .. import db
from sqlalchemy.orm import relationship

class Tag(db.Model):
    __tablename__ = 'tag'

    tag_id = db.Column(db.Integer, primary_key=True)
    tag_description = db.Column(db.String(100), nullable=False, unique=True)
    tag_color_code = db.Column(db.String(10), nullable=False, default='#FFFFFF')
    tasks = relationship('Task', secondary='task_tag', back_populates='tags')

    def __init__(self, tag_description, tag_color_code = "#FFFFFF"):
        if not re.match(r'^#[0-9a-fA-F]{6}$', tag_color_code):
            raise ValueError("Invalid hex color code")
        self.tag_description = tag_description
        self.tag_color_code = tag_color_code

    def serialize(self, include_task=True):
        tag_data = {
            'tag_id': self.tag_id,
            'tag_description': self.tag_description,
            'tag_color_code': self.tag_color_code,
        }

        if include_task:
            tag_data['tasks'] = [task.serialize(include_tag=False, include_category=False) for task in self.tasks] if self.tasks else []

        return tag_data        