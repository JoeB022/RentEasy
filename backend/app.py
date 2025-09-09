from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from config import config

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()

def create_app(config_name="default"):
    """Application factory function."""
    app = Flask(__name__)
    
    # Load configuration
    config_class = config[config_name]
    if callable(config_class):
        # Handle factory functions like create_production_config
        config_class = config_class()
    app.config.from_object(config_class)
    
    # Ensure JWT has the correct secret key
    if 'JWT_SECRET_KEY' in app.config:
        app.config['SECRET_KEY'] = app.config['JWT_SECRET_KEY']
    
    # Initialize extensions
    db.init_app(app)
    CORS(app, 
         origins=app.config['CORS_ORIGINS'], 
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
    jwt.init_app(app)
    migrate.init_app(app, db)
    
    # Create User model dynamically
    from models.user import create_user_model, UserRole
    User = create_user_model(db)
    
    # Register blueprints
    from routes.auth import auth_bp
    from routes.protected import protected_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(protected_bp)
    
    # Make User model available globally
    app.User = User
    app.UserRole = UserRole
    
    return app

# Create the app instance
app = create_app()

# Import models after app creation to avoid circular imports
with app.app_context():
    User = app.User
    UserRole = app.UserRole
    # Initialize database tables
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)
