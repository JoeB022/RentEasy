"""
Security middleware configuration for Flask.
"""
import os
from flask import Flask, request, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_talisman import Talisman
from utils.logger import get_logger, log_security_event

logger = get_logger(__name__)


def setup_rate_limiting(app: Flask) -> None:
    """Setup rate limiting with Redis backend if available."""
    redis_url = os.environ.get('REDIS_URL')
    
    if redis_url:
        # Use Redis as storage backend
        limiter = Limiter(
            key_func=get_remote_address,
            storage_uri=redis_url,
            default_limits=["1000 per hour", "100 per minute"]
        )
        limiter.init_app(app)
        logger.info("Rate limiting configured with Redis backend")
    else:
        # Use in-memory storage (development)
        limiter = Limiter(
            key_func=get_remote_address,
            default_limits=["1000 per hour", "100 per minute"]
        )
        limiter.init_app(app)
        logger.warning("Rate limiting configured with in-memory storage (not suitable for production)")
    
    # Register rate limit decorators
    app.limiter = limiter
    
    # Apply rate limits to specific routes
    app.before_request(lambda: apply_rate_limits(app, limiter))


def apply_rate_limits(app: Flask, limiter: Limiter) -> None:
    """Apply rate limits based on route patterns."""
    if request.endpoint:
        # Authentication endpoints
        if request.endpoint.startswith('auth.'):
            if request.endpoint in ['auth.register', 'auth.login', 'auth.forgot_password']:
                # Stricter limits for sensitive auth operations
                limiter.limit("5 per minute")(lambda: None)()
            else:
                # Standard limits for other auth endpoints
                limiter.limit("10 per minute")(lambda: None)()
        
        # Admin endpoints
        elif request.endpoint.startswith('admin.'):
            limiter.limit("20 per minute")(lambda: None)()
        
        # API endpoints
        elif request.endpoint.startswith('api.'):
            limiter.limit("100 per minute")(lambda: None)()


def setup_security_headers(app: Flask) -> None:
    """Setup security headers using Flask-Talisman."""
    
    # Content Security Policy
    csp = {
        'default-src': "'self'",
        'script-src': [
            "'self'",
            "'unsafe-inline'",  # Required for some frontend frameworks
            "https://cdn.jsdelivr.net",
            "https://unpkg.com"
        ],
        'style-src': [
            "'self'",
            "'unsafe-inline'",  # Required for inline styles
            "https://fonts.googleapis.com"
        ],
        'font-src': [
            "'self'",
            "https://fonts.gstatic.com"
        ],
        'img-src': [
            "'self'",
            "data:",
            "https:"
        ],
        'connect-src': [
            "'self'",
            "https://api.sentry.io"  # For Sentry
        ],
        'frame-ancestors': "'none'",
        'base-uri': "'self'",
        'form-action': "'self'"
    }
    
    # Initialize Talisman with security headers
    Talisman(
        app,
        force_https=app.config.get('FORCE_HTTPS', False),
        force_https_permanent=app.config.get('FORCE_HTTPS_PERMANENT', False),
        strict_transport_security=app.config.get('STRICT_TRANSPORT_SECURITY', True),
        strict_transport_security_max_age=app.config.get('STRICT_TRANSPORT_SECURITY_MAX_AGE', 31536000),
        strict_transport_security_include_subdomains=app.config.get('STRICT_TRANSPORT_SECURITY_INCLUDE_SUBDOMAINS', True),
        content_security_policy=csp,
        content_security_policy_nonce_in=['script-src', 'style-src'],
        referrer_policy=app.config.get('REFERRER_POLICY', 'strict-origin-when-cross-origin'),
        feature_policy={
            'geolocation': "'none'",
            'microphone': "'none'",
            'camera': "'none'",
            'payment': "'none'"
        }
    )
    
    logger.info("Security headers configured with Flask-Talisman")


def setup_csrf_protection(app: Flask) -> None:
    """Setup CSRF protection for session-based forms."""
    from flask_wtf.csrf import CSRFProtect
    
    # Only enable CSRF for session-based authentication
    if app.config.get('SESSION_COOKIE_SECURE', False) or app.config.get('TESTING', False):
        csrf = CSRFProtect()
        csrf.init_app(app)
        
        # Exempt API endpoints from CSRF protection
        @csrf.exempt
        def api_endpoints():
            """Exempt API endpoints from CSRF protection."""
            pass
        
        # Apply CSRF exemption to API routes
        app.before_request(lambda: apply_csrf_exemptions(app, csrf))
        
        logger.info("CSRF protection enabled for session-based forms")
    else:
        logger.info("CSRF protection disabled (API-only mode)")


def apply_csrf_exemptions(app: Flask, csrf) -> None:
    """Apply CSRF exemptions to API endpoints."""
    if request.endpoint and request.endpoint.startswith('api.'):
        # Exempt all API endpoints from CSRF
        csrf.exempt(lambda: None)()


def setup_security_middleware(app: Flask) -> None:
    """Setup all security middleware components."""
    logger.info("Setting up security middleware")
    
    # Setup rate limiting
    setup_rate_limiting(app)
    
    # Setup security headers
    setup_security_headers(app)
    
    # Setup CSRF protection
    setup_csrf_protection(app)
    
    # Add security event logging
    setup_security_logging(app)
    
    logger.info("Security middleware setup complete")


def setup_security_logging(app: Flask) -> None:
    """Setup security event logging."""
    
    @app.before_request
    def log_security_events():
        """Log potential security events."""
        # Log suspicious requests
        if request.headers.get('User-Agent', '').lower() in ['curl', 'wget', 'python-requests']:
            log_security_event('suspicious_user_agent', {
                'user_agent': request.headers.get('User-Agent'),
                'path': request.path
            })
        
        # Log requests with unusual headers
        suspicious_headers = ['X-Forwarded-For', 'X-Real-IP', 'X-Originating-IP']
        for header in suspicious_headers:
            if header in request.headers:
                log_security_event('proxy_header_detected', {
                    'header': header,
                    'value': request.headers[header],
                    'path': request.path
                })
    
    @app.after_request
    def log_security_responses(response):
        """Log security-related responses."""
        # Log 4xx and 5xx responses
        if response.status_code >= 400:
            log_security_event('error_response', {
                'status_code': response.status_code,
                'path': request.path,
                'method': request.method
            })
        
        return response
