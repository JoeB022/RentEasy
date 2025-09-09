import os
from dotenv import load_dotenv

load_dotenv()

def get_required_env(key, default=None):
    """Get environment variable, raise error if not set in production."""
    value = os.environ.get(key, default)
    if not value and os.environ.get('FLASK_ENV') == 'production':
        raise ValueError(f"Required environment variable {key} not set for production")
    return value

class Config:
    """Base configuration class."""
    SECRET_KEY = get_required_env("SECRET_KEY", "dev-secret-key-change-in-production")
    
    # Database configuration
    SQLALCHEMY_DATABASE_URI = get_required_env("DATABASE_URL", "sqlite:///app.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT configuration
    JWT_SECRET_KEY = get_required_env("JWT_SECRET_KEY", "jwt-secret-key-change-in-production")
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 hour
    JWT_REFRESH_TOKEN_EXPIRES = 2592000  # 30 days
    
    # CORS configuration
    CORS_ORIGINS = [
        os.environ.get("FRONTEND_URL", "http://localhost:5173"),
        "http://localhost:3000",
        "http://localhost:5173", 
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ]
    CORS_SUPPORTS_CREDENTIALS = True

class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True
    SQLALCHEMY_ECHO = True

class ProductionConfig(Config):
    """Production configuration."""
    DEBUG = False
    SQLALCHEMY_ECHO = False
    
    # Production-specific settings
    CORS_ORIGINS = [
        os.environ.get("FRONTEND_URL", "https://yourdomain.com"),
        os.environ.get("ADMIN_URL", "https://admin.yourdomain.com")
    ]
    
    # Security settings
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    
    # Logging
    LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO")
    
    # Database connection pooling for production
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
        'pool_size': 10,
        'max_overflow': 20
    }

# Configuration dictionary
config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig
}
