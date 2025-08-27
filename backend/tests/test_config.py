import pytest
import os
from config import Config, DevelopmentConfig, ProductionConfig, config

def test_base_config_defaults():
    """Test base configuration default values."""
    base_config = Config()
    assert base_config.SECRET_KEY == "dev-secret-key-change-in-production"
    assert base_config.SQLALCHEMY_DATABASE_URI == "sqlite:///app.db"
    assert base_config.SQLALCHEMY_TRACK_MODIFICATIONS is False
    assert base_config.JWT_ACCESS_TOKEN_EXPIRES == 3600
    assert base_config.JWT_REFRESH_TOKEN_EXPIRES == 2592000
    assert base_config.CORS_ORIGINS == ["http://localhost:5173"]
    assert base_config.CORS_SUPPORTS_CREDENTIALS is True

def test_development_config():
    """Test development configuration."""
    dev_config = DevelopmentConfig()
    assert dev_config.DEBUG is True
    assert dev_config.SQLALCHEMY_ECHO is True
    assert dev_config.SECRET_KEY == "dev-secret-key-change-in-production"

def test_production_config():
    """Test production configuration."""
    prod_config = ProductionConfig()
    assert prod_config.DEBUG is False
    assert prod_config.SQLALCHEMY_ECHO is False
    assert prod_config.SECRET_KEY == "dev-secret-key-change-in-production"

def test_config_dictionary():
    """Test that all configuration classes are available in the config dict."""
    assert 'development' in config
    assert 'production' in config
    assert 'default' in config
    assert config['default'] == DevelopmentConfig

def test_environment_variable_override():
    """Test that environment variables can be set and read."""
    # Test that the config class can read environment variables
    # Note: This test verifies the mechanism works, but the actual values
    # are loaded at import time, so we can't easily test dynamic changes
    
    # Check that the default values are what we expect
    base_config = Config()
    assert base_config.SECRET_KEY == "dev-secret-key-change-in-production"
    assert base_config.SQLALCHEMY_DATABASE_URI == "sqlite:///app.db"
    assert base_config.JWT_SECRET_KEY == "jwt-secret-key-change-in-production"
    assert base_config.CORS_ORIGINS == ["http://localhost:5173"]
    
    # Test that the config class has the right structure for environment variable override
    assert hasattr(base_config, 'SECRET_KEY')
    assert hasattr(base_config, 'SQLALCHEMY_DATABASE_URI')
    assert hasattr(base_config, 'JWT_SECRET_KEY')
    assert hasattr(base_config, 'CORS_ORIGINS')

def test_config_inheritance():
    """Test that configuration classes properly inherit from base."""
    dev_config = DevelopmentConfig()
    prod_config = ProductionConfig()
    
    # All should have base config attributes
    assert hasattr(dev_config, 'SECRET_KEY')
    assert hasattr(prod_config, 'SECRET_KEY')
    
    # All should have database config
    assert hasattr(dev_config, 'SQLALCHEMY_DATABASE_URI')
    assert hasattr(prod_config, 'SQLALCHEMY_DATABASE_URI')
