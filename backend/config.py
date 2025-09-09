import os
from dotenv import load_dotenv

load_dotenv()

def get_required_env(key):
    """Get required environment variable, raise RuntimeError if not set."""
    value = os.environ.get(key)
    if not value:
        raise RuntimeError(f"Required environment variable {key} not set")
    return value

def get_optional_env(key, default=None):
    """Get optional environment variable with default value."""
    return os.environ.get(key, default)

class BaseConfig:
    """Base configuration class with common settings."""
    
    # Database configuration
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT configuration
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 hour
    JWT_REFRESH_TOKEN_EXPIRES = 2592000  # 30 days
    
    # CORS configuration
    CORS_SUPPORTS_CREDENTIALS = True
    
    # Logging
    LOG_LEVEL = get_optional_env("LOG_LEVEL", "INFO")
    LOG_FORMAT = get_optional_env("LOG_FORMAT", "text")  # text or json
    LOG_FILE = get_optional_env("LOG_FILE", None)

class DevelopmentConfig(BaseConfig):
    """Development configuration."""
    DEBUG = True
    SQLALCHEMY_ECHO = True
    
    # Development secrets (with fallbacks)
    SECRET_KEY = get_optional_env("SECRET_KEY", "dev-secret-key-change-in-production")
    JWT_SECRET_KEY = get_optional_env("JWT_SECRET_KEY", "jwt-secret-key-change-in-production")
    
    # Development database
    SQLALCHEMY_DATABASE_URI = get_optional_env("DATABASE_URL", "sqlite:///app.db")
    
    # Development CORS
    CORS_ORIGINS = [
        get_optional_env("FRONTEND_URL", "http://localhost:5173"),
        "http://localhost:3000",
        "http://localhost:5173", 
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ]

class TestingConfig(BaseConfig):
    """Testing configuration."""
    TESTING = True
    WTF_CSRF_ENABLED = False
    
    # Test secrets
    SECRET_KEY = "test-secret-key"
    JWT_SECRET_KEY = "test-jwt-secret-key"
    
    # Test database
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    
    # Test CORS
    CORS_ORIGINS = ["http://localhost:3000", "http://localhost:5173"]

def create_production_config():
    """Create production configuration with required environment variables."""
    class ProductionConfig(BaseConfig):
        """Production configuration with strict security requirements."""
        DEBUG = False
        SQLALCHEMY_ECHO = False
        
        # Security settings
        SESSION_COOKIE_SECURE = True
        SESSION_COOKIE_HTTPONLY = True
        SESSION_COOKIE_SAMESITE = 'Lax'
        
    # Database connection pooling for production
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_size": 10,
        "max_overflow": 20,
        "pool_pre_ping": True,
        "pool_recycle": 300
    }
    
    # Production logging
    LOG_FORMAT = "json"  # Always JSON in production
    LOG_FILE = get_optional_env("LOG_FILE", "/var/log/renteasy/app.log")
    
    # Set required environment variables
    ProductionConfig.SECRET_KEY = get_required_env("SECRET_KEY")
    ProductionConfig.JWT_SECRET_KEY = get_required_env("JWT_SECRET_KEY")
    ProductionConfig.SQLALCHEMY_DATABASE_URI = get_required_env("DATABASE_URL")
    ProductionConfig.CORS_ORIGINS = [
        get_required_env("FRONTEND_URL"),
        get_optional_env("ADMIN_URL")
    ]
    
    return ProductionConfig

# Configuration dictionary
config = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": create_production_config,
    "default": DevelopmentConfig
}
