from flask import Blueprint, request, jsonify, url_for
from ..models.category import Category, db, StatusEnum
from ..models.task import Task
from sqlalchemy import or_

category_blueprint = Blueprint('category', __name__)

@category_blueprint.route('/categories', methods=['GET'])
def get_categories():
    query = db.session.query(
        Category, 
        db.func.count(Task.task_id).label('task_count')
    ).outerjoin(Task).filter(
        or_( 
            Task.task_completed.is_(False), # type: ignore
            Task.task_id.is_(None)
        )
    ).group_by(Category.category_id).order_by(
        db.desc('task_count')
    )

    result = query.all()

    serialized = []

    for cat, count in result:
        cat_data = cat.serialize(include_task=False)
        cat_data['task_count'] = count
        serialized.append(cat_data)

    return jsonify(serialized)

@category_blueprint.route('/categories/<int:id>', methods=['GET'])
def get_category(id):
    category = Category.query.get_or_404(id)

    return jsonify(category.serialize())

@category_blueprint.route('/categories/create_category', methods=['POST'])
def create_category():
    data = request.get_json()

    new_category = Category(category_description=data.get('category_description'), 
                            category_status=StatusEnum(data.get('category_status').upper() if data.get('category_status') else StatusEnum.ACTIVE))
    db.session.add(new_category)
    db.session.commit()

    category_data = new_category.serialize()
    category_data['category_url'] = url_for('category.get_category', id=new_category.category_id, _external=True)

    return jsonify({
        'message': 'Category created successfully',
        'category': category_data,
    }), 201

@category_blueprint.route('/categories/<int:id>', methods=['PUT'])
def update_category(id):
    data = request.get_json()
    update_type = data.get('update_type')
    category = Category.query.get_or_404(id)

    if update_type == 'desc':
        category.category_description = data.get('category_description', category.category_description)
    elif update_type == 'stat':
        category.category_status = StatusEnum(data.get('category_status').upper()) if data.get('category_status') else category.category_status
    else: 
        return jsonify({'error': 'Invalid update type'}), 400


    db.session.commit()

    category_data = category.serialize()
    category_data['category_url'] = url_for('category.get_category', id=category_data['category_id'], _external=True)

    return jsonify({
      'message': 'Category updated successfully',
      'category': category_data,  
    })