from .task_routes import task_blueprint
from .category_routes import category_blueprint
from .tag_routes import tag_blueprint

blueprints = [task_blueprint, category_blueprint, tag_blueprint]