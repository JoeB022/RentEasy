from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from config import config
import os

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
    
    # Setup logging
    from utils.logger import setup_logger
    setup_logger(
        log_level=app.config.get('LOG_LEVEL', 'INFO'),
        json_output=(app.config.get('LOG_FORMAT', 'text') == 'json'),
        log_file=app.config.get('LOG_FILE')
    )
    
    # Initialize Sentry if DSN is provided
    sentry_dsn = os.environ.get('SENTRY_DSN')
    if sentry_dsn:
        try:
            import sentry_sdk
            from sentry_sdk.integrations.flask import FlaskIntegration
            from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
            
            sentry_sdk.init(
                dsn=sentry_dsn,
                integrations=[
                    FlaskIntegration(),
                    SqlalchemyIntegration(),
                ],
                traces_sample_rate=0.1,
                environment=config_name,
            )
            app.logger.info("Sentry initialized successfully")
        except ImportError:
            app.logger.warning("Sentry SDK not available, skipping Sentry initialization")
        except Exception as e:
            app.logger.error(f"Failed to initialize Sentry: {e}")
    
    # JWT will use JWT_SECRET_KEY from config, no need to override SECRET_KEY
    
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
    
    # Setup logging middleware
    from middleware.logging_middleware import setup_logging_middleware
    setup_logging_middleware(app)
    
    # Setup security middleware
    from middleware.security_middleware import setup_security_middleware
    setup_security_middleware(app)
    
    # Register blueprints
    from routes.auth import auth_bp
    from routes.protected import protected_bp
    from routes.health import health_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(protected_bp)
    app.register_blueprint(health_bp)
    
    # CLI commands are registered via FlaskGroup in run_cli.py
    
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
