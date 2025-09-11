#!/usr/bin/env python3
"""
WSGI entry point for production deployment.
This file should be in the backend directory for Render deployment.
"""

import os
import sys

# Add the current directory to the Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

from app import create_app

# Create the application instance for production
application = create_app(config_name="production")

if __name__ == "__main__":
    # This should not be used in production
    # Use a WSGI server like Gunicorn instead
    application.run(debug=False, host="0.0.0.0", port=8000)
