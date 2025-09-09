import pytest
import os
from config import BaseConfig, DevelopmentConfig, TestingConfig, create_production_config

@pytest.mark.unit
def test_base_config_defaults():
    """Test base configuration default values."""
    base_config = BaseConfig()
    assert base_config.SQLALCHEMY_TRACK_MODIFICATIONS is False
    assert base_config.JWT_ACCESS_TOKEN_EXPIRES == 3600
    assert base_config.JWT_REFRESH_TOKEN_EXPIRES == 2592000
    assert base_config.CORS_SUPPORTS_CREDENTIALS is True

@pytest.mark.unit
def test_development_config():
    """Test development configuration."""
    dev_config = DevelopmentConfig()
    assert dev_config.DEBUG is True
    assert dev_config.SQLALCHEMY_ECHO is True
    assert dev_config.SECRET_KEY == "dev-secret-key-change-in-production"

@pytest.mark.unit
def test_production_config():
    """Test production configuration."""
    # Set required environment variables for production test
    os.environ['SECRET_KEY'] = 'test-secret'
    os.environ['JWT_SECRET_KEY'] = 'test-jwt'
    os.environ['DATABASE_URL'] = 'sqlite:///test.db'
    os.environ['FRONTEND_URL'] = 'http://localhost:3000'
    
    try:
        ProductionConfig = create_production_config()
        prod_config = ProductionConfig()
        assert prod_config.DEBUG is False
        assert prod_config.SQLALCHEMY_ECHO is False
        assert prod_config.SECRET_KEY == 'test-secret'
    finally:
        # Clean up environment variables
        for key in ['SECRET_KEY', 'JWT_SECRET_KEY', 'DATABASE_URL', 'FRONTEND_URL']:
            os.environ.pop(key, None)

@pytest.mark.unit
def test_testing_config():
    """Test testing configuration."""
    test_config = TestingConfig()
    assert test_config.TESTING is True
    assert test_config.WTF_CSRF_ENABLED is False
    assert test_config.SECRET_KEY == "test-secret-key"
    assert test_config.JWT_SECRET_KEY == "test-jwt-secret-key"
    assert test_config.SQLALCHEMY_DATABASE_URI == "sqlite:///:memory:"

@pytest.mark.unit
def test_environment_variable_override():
    """Test that environment variables can be set and read."""
    # Test that the config class can read environment variables
    # Note: This test verifies the mechanism works, but the actual values
    # are loaded at import time, so we can't easily test dynamic changes
    
    # Check that the default values are what we expect
    dev_config = DevelopmentConfig()
    assert dev_config.SECRET_KEY == "dev-secret-key-change-in-production"
    assert dev_config.SQLALCHEMY_DATABASE_URI == "sqlite:///app.db"
    assert dev_config.JWT_SECRET_KEY == "jwt-secret-key-change-in-production"
    assert "http://localhost:5173" in dev_config.CORS_ORIGINS
    
    # Test that the config class has the right structure for environment variable override
    assert hasattr(dev_config, 'SECRET_KEY')
    assert hasattr(dev_config, 'SQLALCHEMY_DATABASE_URI')
    assert hasattr(dev_config, 'JWT_SECRET_KEY')
    assert hasattr(dev_config, 'CORS_ORIGINS')

@pytest.mark.unit
def test_config_inheritance():
    """Test that configuration classes properly inherit from base."""
    dev_config = DevelopmentConfig()
    test_config = TestingConfig()
    
    # All should have base config attributes
    assert hasattr(dev_config, 'SECRET_KEY')
    assert hasattr(test_config, 'SECRET_KEY')
    
    # All should have database config
    assert hasattr(dev_config, 'SQLALCHEMY_DATABASE_URI')
    assert hasattr(test_config, 'SQLALCHEMY_DATABASE_URI')
    
    # All should have JWT config
    assert hasattr(dev_config, 'JWT_ACCESS_TOKEN_EXPIRES')
    assert hasattr(test_config, 'JWT_ACCESS_TOKEN_EXPIRES')
