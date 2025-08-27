import pytest
from app import create_app, db, jwt, migrate

def test_create_app():
    """Test that the app factory creates an app instance."""
    app = create_app()
    assert app is not None
    assert app.config['DEBUG'] is True

def test_create_app_development():
    """Test that the app factory creates a development app."""
    app = create_app('development')
    assert app.config['DEBUG'] is True
    assert app.config['SQLALCHEMY_ECHO'] is True

def test_create_app_production():
    """Test that the app factory creates a production app."""
    app = create_app('production')
    assert app.config['DEBUG'] is False
    assert app.config['SQLALCHEMY_ECHO'] is False

def test_create_app_default():
    """Test that the app factory creates a default app."""
    app = create_app()
    assert app.config['DEBUG'] is True

def test_extensions_initialized(app):
    """Test that all extensions are properly initialized."""
    assert app.extensions['sqlalchemy'] is not None
    assert app.extensions['flask-jwt-extended'] is not None
    assert app.extensions['migrate'] is not None

def test_database_connection(app):
    """Test that the database connection is working."""
    with app.app_context():
        # This should not raise an error - using SQLAlchemy 2.0 syntax
        with db.engine.connect() as conn:
            result = conn.execute(db.text('SELECT 1'))
            assert result is not None

def test_config_values(app):
    """Test that configuration values are set correctly."""
    assert app.config['TESTING'] is True
    assert app.config['SQLALCHEMY_DATABASE_URI'] == 'sqlite:///:memory:'
    assert app.config['SECRET_KEY'] == 'test-secret-key'
    assert app.config['JWT_SECRET_KEY'] == 'test-jwt-secret-key'

def test_cors_configuration(app):
    """Test that CORS is configured correctly."""
    assert app.config['CORS_ORIGINS'] == ['http://localhost:5173']
    assert app.config['CORS_SUPPORTS_CREDENTIALS'] is True

def test_jwt_configuration(app):
    """Test that JWT is configured correctly."""
    assert app.config['JWT_ACCESS_TOKEN_EXPIRES'] == 3600
    assert app.config['JWT_REFRESH_TOKEN_EXPIRES'] == 2592000
