from flask import Blueprint, jsonify, request, url_for
from ..models import Tag, Task
from .. import db
import re

tag_blueprint = Blueprint('tag', __name__)

@tag_blueprint.route('/tags/create_tag', methods=['POST'])
def create_tag():
    data = request.get_json()

    new_tag = Tag(tag_description=data.get('tag_description'), tag_color_code=data.get('tag_color_code', '#FFFFFF'))
    db.session.add(new_tag)
    db.session.commit()

    tag_data = new_tag.serialize()
    tag_data['tag_url'] = url_for('tag.get_tag', id=new_tag.tag_id, _external=True)

    return jsonify({
        'message': 'Tag created successfully',
        'tag': tag_data,
    }), 201

@tag_blueprint.route('/tags', methods=['GET'])
def get_tags():
    tags = Tag.query.all()
    result = [tag.serialize(include_task=False) for tag in tags]

    return jsonify(result)

@tag_blueprint.route('/tags/<int:id>', methods=['GET'])
def get_tag(id):
    tag = Tag.query.get_or_404(id)

    return jsonify(tag.serialize())
    

@tag_blueprint.route('/tags/<int:id>', methods=['PUT'])
def update_tag(id):
    data = request.get_json()
    tag = Tag.query.get_or_404(id)

    new_color_code = data.get('tag_color_code')
    if new_color_code is not None:
        if not re.match(r'^#[0-9a-fA-F]{6}$', new_color_code):
            return jsonify({'error': 'Invalid color code format'}), 400
        tag.tag_color_code = new_color_code
        

    tag.tag_description = data.get('tag_description', tag.tag_description)
    db.session.commit()

    tag_data = tag.serialize()
    tag_data['tag_url'] = url_for('tag.get_tag', id=tag_data['tag_id'], _external=True)

    return jsonify({
        'message': 'Tag updated successfully',
        'tag': tag_data,
    })

@tag_blueprint.route('/tags/<int:id>', methods=['DELETE'])
def delete_tag(id):
    tag = Tag.query.get_or_404(id)

    db.session.delete(tag)
    db.session.commit()

    return jsonify({
        'message': 'Tag deleted successfully',
    })