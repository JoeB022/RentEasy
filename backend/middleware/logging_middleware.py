"""
Request/response logging middleware for Flask.
"""
import time
from flask import g, request, jsonify
from utils.logger import log_request_start, log_request_end, log_error


def setup_logging_middleware(app):
    """Setup request/response logging middleware."""
    
    @app.before_request
    def before_request():
        """Log request start."""
        log_request_start()
    
    @app.after_request
    def after_request(response):
        """Log request completion."""
        if hasattr(g, "request_start_time"):
            g.response_status = response.status_code
            log_request_end()
        return response
    
    @app.errorhandler(Exception)
    def handle_exception(error):
        """Log unhandled exceptions."""
        log_error(error, {
            "handler": "global_exception_handler",
        })
        
        # Return JSON error response
        return jsonify({
            "error": "Internal server error",
            "message": "An unexpected error occurred"
        }), 500
    
    @app.errorhandler(404)
    def handle_not_found(error):
        """Log 404 errors."""
        log_error(error, {
            "handler": "not_found_handler",
            "status_code": 404,
        })
        
        return jsonify({
            "error": "Not found",
            "message": "The requested resource was not found"
        }), 404
    
    @app.errorhandler(400)
    def handle_bad_request(error):
        """Log 400 errors."""
        log_error(error, {
            "handler": "bad_request_handler",
            "status_code": 400,
        })
        
        return jsonify({
            "error": "Bad request",
            "message": "The request was invalid"
        }), 400
    
    @app.errorhandler(401)
    def handle_unauthorized(error):
        """Log 401 errors."""
        log_error(error, {
            "handler": "unauthorized_handler",
            "status_code": 401,
        })
        
        return jsonify({
            "error": "Unauthorized",
            "message": "Authentication required"
        }), 401
    
    @app.errorhandler(403)
    def handle_forbidden(error):
        """Log 403 errors."""
        log_error(error, {
            "handler": "forbidden_handler",
            "status_code": 403,
        })
        
        return jsonify({
            "error": "Forbidden",
            "message": "Access denied"
        }), 403
