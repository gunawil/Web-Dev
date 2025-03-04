from .task import Task
from .tag import Tag
from .category import Category
from .. import db

task_tag = db.Table(
    'task_tag',
    db.Model.metadata,
    db.Column('task_id', db.Integer, db.ForeignKey('task.task_id', ondelete='CASCADE'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.tag_id', ondelete='CASCADE'), primary_key=True)
)