# Routes package
from .auth import auth_bp
from .protected import protected_bp
from .properties import properties_bp

__all__ = ['auth_bp', 'protected_bp', 'properties_bp']
