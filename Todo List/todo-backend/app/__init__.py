from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app)

    from .routes import blueprints
    for blueprint in blueprints:
        app.register_blueprint(blueprint)

    with app.app_context():
        db.create_all()

    return app