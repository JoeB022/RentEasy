import pytest
import tempfile
import os
from app import create_app, db
from config import Config

class TestConfig(Config):
    """Test configuration class."""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    WTF_CSRF_ENABLED = False
    SECRET_KEY = 'test-secret-key'
    JWT_SECRET_KEY = 'test-jwt-secret-key'

def create_test_app():
    """Create a test app with TestConfig."""
    app = create_app()
    app.config.from_object(TestConfig)
    return app

@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""
    app = create_test_app()
    
    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()

@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()

@pytest.fixture
def runner(app):
    """A test runner for the app's Click commands."""
    return app.test_cli_runner()

@pytest.fixture
def app_context(app):
    """Application context for testing."""
    with app.app_context():
        yield app
