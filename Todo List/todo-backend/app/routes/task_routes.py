from datetime import datetime
from flask import Blueprint, request, jsonify, url_for
from pymysql import IntegrityError

from ..models import Task, Tag
from .. import db

task_blueprint = Blueprint('task', __name__)

@task_blueprint.route('/tasks/create_task', methods=['POST'])
def create_task():
    data = request.get_json()
    
    task_date = data.get('task_date')
    if task_date:
        task_date = datetime.strptime(task_date, '%Y-%m-%d').date()
    else:
        task_date = datetime.today

    task_title = data.get('task_title')
    task_completed = data.get('task_completed', False)
    category_id = data.get('category_id')

    tags = data.get('tags', [])

    try:
        with db.session.begin_nested():
            new_task = Task(task_date=task_date, 
                            task_title=task_title, 
                            task_completed=task_completed, 
                            category_id=category_id
                            )
            db.session.add(new_task)
            db.session.flush()

            tags = Tag.query.filter(Tag.tag_id.in_(tags)).all()
            new_task.tags = tags

            db.session.commit()

        task_data = new_task.serialize()
        task_data['task_url'] = url_for('task.get_task', id=new_task.task_id, _external=True)

        return jsonify({
            'message': 'Task created successfully',
            'task': task_data,
        }), 201

    except IntegrityError as e:
        db.session.rollback()
        return jsonify({
            'error': 'Database constraint error',
            'details': str(e)
        }), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': 'Unexpected Error',
            'details': str(e)
        }), 400


@task_blueprint.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    result = [task.serialize() for task in tasks]

    return jsonify(result)

@task_blueprint.route('/tasks/<int:id>', methods=['GET'])
def get_task(id):
    task = Task.query.get_or_404(id)

    return jsonify(task.serialize())

@task_blueprint.route('/tasks/<int:id>', methods=['PUT'])
def update_task(id):
    data = request.get_json()
    task = Task.query.get_or_404(id)
    update_type = data.get('update_type', 'detail')
    message = '',

    if update_type == 'detail':    
        task_date = data.get('task_date')
        if task_date:
            task_date = datetime.strptime(task_date, '%Y-%m-%d').date()
        else:
            task_date = datetime.today
        
        tags = data.get('tags', task.tags)

        with db.session.begin_nested():    
            task.task_date = task_date
            task.task_title = data.get('task_title', task.task_title)
            task.category_id = data.get('category_id', task.category_id)
            
            new_tags = Tag.query.filter(Tag.tag_id.in_(tags)).all()
            task.tags = new_tags
            db.session.flush()

        message = 'Task update successfully'
    elif update_type == 'status':
        task.task_completed = data.get('task_completed', task.task_completed)

        message = 'Task completed'
    else:
        task.task_id = id
    
    db.session.commit()    

    task_data = task.serialize()
    task_data['task_url'] = url_for('task.get_task', id=task_data['task_id'], _external=True)

    return jsonify({
        'message': message,
        'task': task_data,
        })

@task_blueprint.route('/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    task = Task.query.get_or_404(id)
    db.session.delete(task)
    db.session.commit()

    return jsonify({
        'message': 'Task deleted successfully',
    })

@task_blueprint.route('/tasks/<int:task_id>/tag/<int:tag_id>', methods=['POST', 'DELETE'])
def manage_task_tag(task_id, tag_id):
    task = Task.query.get(task_id)
    tag = Tag.query.get(tag_id)

    if not task or not tag:
        return jsonify({'error': 'Task or Tag not found'}), 404
    
    if request.method == 'DELETE':
        if tag in task.tags:
            task.tags.remove(tag)
            db.session.commit()
            
            return jsonify({'message': f'Tag {tag_id} removed from Task {task_id}'}), 200
        else:
            return jsonify({'error': 'Tag is not associated with this task'}), 404
    elif request.method == 'POST':
        if tag not in task.tags:
            task.tags.append(tag)
            db.session.commit()
            return jsonify({'message': f'Tag {tag_id} added to Task {task_id}'}), 201
        else:
            return jsonify({'message': 'Tag relationship already exists'}), 400
    else:
        return jsonify({'error': 'Invalid Method'}), 405