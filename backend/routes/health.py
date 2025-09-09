"""
Health check endpoints for monitoring and load balancers.
"""
from flask import Blueprint, jsonify
from utils.logger import get_logger

logger = get_logger(__name__)

health_bp = Blueprint('health', __name__)


@health_bp.route('/health', methods=['GET'])
def health_check():
    """Basic health check endpoint."""
    return jsonify({
        "status": "healthy",
        "service": "renteasy-backend",
        "version": "1.0.0"
    }), 200


@health_bp.route('/health/ready', methods=['GET'])
def readiness_check():
    """Readiness check for Kubernetes/container orchestration."""
    try:
        # Check database connectivity
        from app import db
        db.session.execute('SELECT 1')
        
        return jsonify({
            "status": "ready",
            "service": "renteasy-backend",
            "checks": {
                "database": "ok"
            }
        }), 200
    except Exception as e:
        logger.error(f"Readiness check failed: {e}")
        return jsonify({
            "status": "not_ready",
            "service": "renteasy-backend",
            "error": str(e)
        }), 503


@health_bp.route('/health/live', methods=['GET'])
def liveness_check():
    """Liveness check for Kubernetes/container orchestration."""
    return jsonify({
        "status": "alive",
        "service": "renteasy-backend"
    }), 200
