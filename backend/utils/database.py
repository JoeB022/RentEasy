"""
Database utilities for health checks and connection management.
"""
import os
from typing import Dict, Any, Optional
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError
from utils.logger import get_logger

logger = get_logger(__name__)


def get_database_info() -> Dict[str, Any]:
    """Get database connection information."""
    database_url = os.environ.get('DATABASE_URL', 'sqlite:///app.db')
    
    # Parse database URL to extract connection info
    if database_url.startswith('postgresql://'):
        # PostgreSQL connection
        return {
            'type': 'postgresql',
            'url': database_url,
            'driver': 'psycopg2',
            'pooling': True
        }
    elif database_url.startswith('sqlite://'):
        # SQLite connection
        return {
            'type': 'sqlite',
            'url': database_url,
            'driver': 'sqlite',
            'pooling': False
        }
    else:
        return {
            'type': 'unknown',
            'url': database_url,
            'driver': 'unknown',
            'pooling': False
        }


def test_database_connection(database_url: str) -> Dict[str, Any]:
    """
    Test database connection and return status information.
    
    Args:
        database_url: Database connection URL
        
    Returns:
        Dict with connection status and information
    """
    try:
        # Create engine with minimal configuration for testing
        engine = create_engine(
            database_url,
            pool_pre_ping=True,
            pool_recycle=300,
            pool_size=1,
            max_overflow=0
        )
        
        # Test connection
        with engine.connect() as connection:
            # Execute a simple query
            if database_url.startswith('postgresql://'):
                result = connection.execute(text("SELECT version()"))
                version = result.fetchone()[0]
                db_type = "PostgreSQL"
            elif database_url.startswith('sqlite://'):
                result = connection.execute(text("SELECT sqlite_version()"))
                version = result.fetchone()[0]
                db_type = "SQLite"
            else:
                version = "Unknown"
                db_type = "Unknown"
            
            # Get connection pool information safely
            pool_info = {}
            try:
                pool_info = {
                    'pool_size': engine.pool.size(),
                    'checked_in': engine.pool.checkedin(),
                    'checked_out': engine.pool.checkedout(),
                    'overflow': engine.pool.overflow()
                }
                # Only add invalid if it exists (not available in all pool types)
                if hasattr(engine.pool, 'invalid'):
                    pool_info['invalid'] = engine.pool.invalid()
            except Exception as e:
                pool_info = {'error': f'Could not get pool info: {e}'}
            
            return {
                'status': 'healthy',
                'database_type': db_type,
                'version': version,
                'connection_pool': pool_info
            }
            
    except SQLAlchemyError as e:
        logger.error(f"Database connection test failed: {e}")
        return {
            'status': 'unhealthy',
            'error': str(e),
            'database_type': 'Unknown',
            'version': 'Unknown'
        }
    except Exception as e:
        logger.error(f"Unexpected error during database connection test: {e}")
        return {
            'status': 'error',
            'error': str(e),
            'database_type': 'Unknown',
            'version': 'Unknown'
        }


def get_database_health() -> Dict[str, Any]:
    """
    Get comprehensive database health information.
    
    Returns:
        Dict with database health status and metrics
    """
    database_url = os.environ.get('DATABASE_URL', 'sqlite:///app.db')
    db_info = get_database_info()
    connection_test = test_database_connection(database_url)
    
    return {
        'database_info': db_info,
        'connection_test': connection_test,
        'environment': {
            'DATABASE_URL_set': bool(os.environ.get('DATABASE_URL')),
            'FLASK_ENV': os.environ.get('FLASK_ENV', 'development')
        }
    }


def check_migration_status() -> Dict[str, Any]:
    """
    Check Alembic migration status.
    
    Returns:
        Dict with migration status information
    """
    try:
        from flask_migrate import current, heads
        from app import create_app
        
        app = create_app()
        with app.app_context():
            current_rev = current()
            head_rev = heads()
            
            return {
                'status': 'success',
                'current_revision': current_rev,
                'head_revision': head_rev,
                'up_to_date': current_rev == head_rev
            }
    except Exception as e:
        logger.error(f"Migration status check failed: {e}")
        return {
            'status': 'error',
            'error': str(e),
            'current_revision': None,
            'head_revision': None,
            'up_to_date': False
        }
