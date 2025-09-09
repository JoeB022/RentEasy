"""
Health check endpoints for monitoring and load balancers.
"""
import time
import os
import psutil
from datetime import datetime, timezone
from flask import Blueprint, jsonify, current_app
from utils.logger import get_logger

logger = get_logger(__name__)

health_bp = Blueprint('health', __name__)

# Track application start time for uptime calculation
_app_start_time = time.time()

def get_uptime():
    """Calculate application uptime in seconds."""
    return int(time.time() - _app_start_time)

def get_uptime_human():
    """Get human-readable uptime."""
    uptime_seconds = get_uptime()
    days = uptime_seconds // 86400
    hours = (uptime_seconds % 86400) // 3600
    minutes = (uptime_seconds % 3600) // 60
    seconds = uptime_seconds % 60
    
    if days > 0:
        return f"{days}d {hours}h {minutes}m {seconds}s"
    elif hours > 0:
        return f"{hours}h {minutes}m {seconds}s"
    elif minutes > 0:
        return f"{minutes}m {seconds}s"
    else:
        return f"{seconds}s"

def check_database_health():
    """Check database connectivity and return health status."""
    try:
        from app import db
        from sqlalchemy import text
        from utils.database import get_database_health
        
        # Test basic connectivity
        db.session.execute(text('SELECT 1'))
        
        # Get detailed database health
        db_health = get_database_health()
        
        return {
            "status": "ok",
            "details": db_health
        }
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        return {
            "status": "error",
            "error": str(e)
        }

def check_redis_health():
    """Check Redis connectivity and return health status."""
    try:
        import redis
        from urllib.parse import urlparse
        
        redis_url = os.environ.get('REDIS_URL')
        if not redis_url:
            return {
                "status": "not_configured",
                "message": "Redis not configured"
            }
        
        # Parse Redis URL
        parsed_url = urlparse(redis_url)
        redis_client = redis.Redis(
            host=parsed_url.hostname or 'localhost',
            port=parsed_url.port or 6379,
            password=parsed_url.password,
            db=int(parsed_url.path.lstrip('/')) if parsed_url.path else 0,
            socket_timeout=5,
            socket_connect_timeout=5
        )
        
        # Test Redis connection
        redis_client.ping()
        
        # Get Redis info
        info = redis_client.info()
        
        return {
            "status": "ok",
            "details": {
                "version": info.get('redis_version'),
                "uptime": info.get('uptime_in_seconds'),
                "connected_clients": info.get('connected_clients'),
                "used_memory": info.get('used_memory_human'),
                "keyspace": info.get('db0', 'N/A')
            }
        }
    except Exception as e:
        logger.error(f"Redis health check failed: {e}")
        return {
            "status": "error",
            "error": str(e)
        }

def get_system_metrics():
    """Get system resource metrics."""
    try:
        # CPU usage
        cpu_percent = psutil.cpu_percent(interval=1)
        
        # Memory usage
        memory = psutil.virtual_memory()
        
        # Disk usage
        disk = psutil.disk_usage('/')
        
        return {
            "cpu": {
                "usage_percent": cpu_percent,
                "count": psutil.cpu_count()
            },
            "memory": {
                "total": memory.total,
                "available": memory.available,
                "used": memory.used,
                "usage_percent": memory.percent
            },
            "disk": {
                "total": disk.total,
                "used": disk.used,
                "free": disk.free,
                "usage_percent": (disk.used / disk.total) * 100
            }
        }
    except Exception as e:
        logger.error(f"Failed to get system metrics: {e}")
        return {
            "error": str(e)
        }


@health_bp.route('/healthz', methods=['GET'])
def healthz():
    """Comprehensive health check endpoint with service info, uptime, and component status."""
    try:
        # Get basic service info
        service_info = {
            "service": "renteasy-backend",
            "version": "1.0.0",
            "environment": current_app.config.get('ENV', 'development'),
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "uptime": {
                "seconds": get_uptime(),
                "human": get_uptime_human()
            }
        }
        
        # Check database health
        db_health = check_database_health()
        
        # Check Redis health
        redis_health = check_redis_health()
        
        # Determine overall status
        overall_status = "healthy"
        if db_health["status"] != "ok":
            overall_status = "unhealthy"
        elif redis_health["status"] == "error":
            overall_status = "degraded"  # Redis error but not critical
        
        # Build response
        response = {
            "status": overall_status,
            **service_info,
            "checks": {
                "database": db_health["status"],
                "redis": redis_health["status"]
            },
            "components": {
                "database": db_health,
                "redis": redis_health
            }
        }
        
        # Add system metrics if available
        try:
            system_metrics = get_system_metrics()
            if "error" not in system_metrics:
                response["system"] = system_metrics
        except Exception:
            pass  # System metrics are optional
        
        # Determine HTTP status code
        status_code = 200
        if overall_status == "unhealthy":
            status_code = 503
        elif overall_status == "degraded":
            status_code = 200  # Still operational but with warnings
        
        return jsonify(response), status_code
        
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return jsonify({
            "status": "error",
            "service": "renteasy-backend",
            "error": str(e),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }), 500


@health_bp.route('/health', methods=['GET'])
def health_check():
    """Basic health check endpoint (legacy compatibility)."""
    return jsonify({
        "status": "healthy",
        "service": "renteasy-backend",
        "version": "1.0.0",
        "uptime": get_uptime_human()
    }), 200


@health_bp.route('/health/ready', methods=['GET'])
def readiness_check():
    """Readiness check for Kubernetes/container orchestration."""
    try:
        # Check database connectivity
        db_health = check_database_health()
        
        if db_health["status"] != "ok":
            return jsonify({
                "status": "not_ready",
                "service": "renteasy-backend",
                "checks": {
                    "database": "error"
                },
                "error": db_health.get("error", "Database check failed")
            }), 503
        
        return jsonify({
            "status": "ready",
            "service": "renteasy-backend",
            "checks": {
                "database": "ok"
            },
            "database_health": db_health.get("details", {})
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
        "service": "renteasy-backend",
        "uptime": get_uptime_human()
    }), 200


@health_bp.route('/health/metrics', methods=['GET'])
def metrics():
    """Detailed metrics endpoint for monitoring systems."""
    try:
        # Get system metrics
        system_metrics = get_system_metrics()
        
        # Get database health
        db_health = check_database_health()
        
        # Get Redis health
        redis_health = check_redis_health()
        
        # Get application metrics
        app_metrics = {
            "uptime_seconds": get_uptime(),
            "uptime_human": get_uptime_human(),
            "environment": current_app.config.get('ENV', 'development'),
            "debug_mode": current_app.debug,
            "config": {
                "database_uri": current_app.config.get('SQLALCHEMY_DATABASE_URI', '').split('@')[-1] if '@' in current_app.config.get('SQLALCHEMY_DATABASE_URI', '') else 'hidden',
                "redis_configured": bool(os.environ.get('REDIS_URL')),
                "cors_origins": len(current_app.config.get('CORS_ORIGINS', [])),
                "jwt_enabled": bool(current_app.config.get('JWT_SECRET_KEY'))
            }
        }
        
        response = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "service": "renteasy-backend",
            "version": "1.0.0",
            "application": app_metrics,
            "system": system_metrics,
            "components": {
                "database": db_health,
                "redis": redis_health
            }
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        logger.error(f"Metrics collection failed: {e}")
        return jsonify({
            "error": str(e),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }), 500
