import pytest
import pytest
from app import db, jwt, migrate
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

@pytest.mark.unit
def test_sqlalchemy_initialization():
    """Test that SQLAlchemy is properly initialized."""
    assert isinstance(db, SQLAlchemy)
    assert hasattr(db, 'init_app')

@pytest.mark.unit
def test_jwt_initialization():
    """Test that JWT is properly initialized."""
    assert isinstance(jwt, JWTManager)
    assert hasattr(jwt, 'init_app')

@pytest.mark.unit
def test_migrate_initialization():
    """Test that Flask-Migrate is properly initialized."""
    assert isinstance(migrate, Migrate)
    assert hasattr(migrate, 'init_app')

@pytest.mark.unit
def test_extensions_in_app_context(app):
    """Test that extensions are properly bound to the app."""
    with app.app_context():
        # Check that extensions are accessible
        assert app.extensions['sqlalchemy'] is not None
        assert app.extensions['flask-jwt-extended'] is not None
        assert app.extensions['migrate'] is not None

@pytest.mark.unit
def test_database_metadata(app):
    """Test that database metadata is accessible."""
    with app.app_context():
        # This should not raise an error
        metadata = db.metadata
        assert metadata is not None

@pytest.mark.unit
def test_cors_config_in_app(app):
    """Test that CORS configuration is properly set in the app."""
    with app.app_context():
        # Check CORS configuration
        assert app.config['CORS_ORIGINS'] == ['http://localhost:5173']
        assert app.config['CORS_SUPPORTS_CREDENTIALS'] is True

@pytest.mark.unit
def test_jwt_config_in_app(app):
    """Test that JWT configuration is properly set in the app."""
    with app.app_context():
        # Check JWT configuration
        assert app.config['JWT_SECRET_KEY'] == 'test-jwt-secret-key'
        assert app.config['JWT_ACCESS_TOKEN_EXPIRES'] == 3600
        assert app.config['JWT_REFRESH_TOKEN_EXPIRES'] == 2592000
