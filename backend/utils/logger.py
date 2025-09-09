"""
Structured logging configuration using Loguru.
"""
import os
import sys
import json
import time
import uuid
from typing import Any, Dict, Optional
from loguru import logger
from flask import g, request, has_request_context


class RequestIDFilter:
    """Filter to add request ID to log records."""
    
    def __call__(self, record: Dict[str, Any]) -> bool:
        if has_request_context():
            record["extra"]["request_id"] = getattr(g, "request_id", "-")
        else:
            record["extra"]["request_id"] = "-"
        return True


def setup_logger(
    log_level: str = "INFO",
    json_output: bool = False,
    log_file: Optional[str] = None
) -> None:
    """
    Configure Loguru logger with structured output.
    
    Args:
        log_level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        json_output: Whether to use JSON format for structured logging
        log_file: Optional file path for log output
    """
    # Remove default handler
    logger.remove()
    
    # Configure log format
    if json_output:
        # JSON format for production
        log_format = (
            "{time:YYYY-MM-DD HH:mm:ss.SSS} | "
            "{level: <8} | "
            "{name}:{function}:{line} | "
            "{extra[request_id]} | "
            "{message}"
        )
    else:
        # Human-readable format for development
        log_format = (
            "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | "
            "<level>{level: <8}</level> | "
            "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> | "
            "<blue>{extra[request_id]}</blue> | "
            "<level>{message}</level>"
        )
    
    # Console handler
    logger.add(
        sys.stdout,
        format=log_format,
        level=log_level,
        colorize=not json_output,
        filter=RequestIDFilter(),
        serialize=json_output,
    )
    
    # File handler (if specified)
    if log_file:
        logger.add(
            log_file,
            format=log_format,
            level=log_level,
            rotation="100 MB",
            retention="30 days",
            compression="zip",
            filter=RequestIDFilter(),
            serialize=json_output,
        )


def get_logger(name: str = None):
    """Get a logger instance with optional name."""
    if name:
        return logger.bind(name=name)
    return logger


def log_request_start():
    """Log the start of a request."""
    if has_request_context():
        g.request_id = str(uuid.uuid4())[:8]
        g.request_start_time = time.time()
        
        logger.info(
            "Request started",
            extra={
                "method": request.method,
                "path": request.path,
                "remote_addr": request.remote_addr,
                "user_agent": request.headers.get("User-Agent", ""),
            }
        )


def log_request_end():
    """Log the end of a request with duration."""
    if has_request_context() and hasattr(g, "request_start_time"):
        duration = time.time() - g.request_start_time
        
        logger.info(
            "Request completed",
            extra={
                "method": request.method,
                "path": request.path,
                "status_code": getattr(g, "response_status", None),
                "duration_ms": round(duration * 1000, 2),
            }
        )


def log_error(error: Exception, context: Dict[str, Any] = None):
    """Log an error with context."""
    error_context = {
        "error_type": type(error).__name__,
        "error_message": str(error),
    }
    
    if context:
        error_context.update(context)
    
    if has_request_context():
        error_context.update({
            "method": request.method,
            "path": request.path,
            "remote_addr": request.remote_addr,
        })
    
    logger.error("Error occurred", extra=error_context)


def log_security_event(event_type: str, details: Dict[str, Any] = None):
    """Log security-related events."""
    security_context = {
        "event_type": event_type,
        "severity": "HIGH",
    }
    
    if details:
        security_context.update(details)
    
    if has_request_context():
        security_context.update({
            "method": request.method,
            "path": request.path,
            "remote_addr": request.remote_addr,
        })
    
    logger.warning("Security event", extra=security_context)
