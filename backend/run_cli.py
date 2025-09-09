#!/usr/bin/env python3
"""
Convenience script to run Flask CLI commands.

Usage:
    python run_cli.py <command> [options]
    
Examples:
    python run_cli.py create-admin --email admin@example.com --password secret123
    python run_cli.py setup-db --init --upgrade
    python run_cli.py status
    python run_cli.py list-users --role admin
"""

import sys
import os
from flask.cli import FlaskGroup
from app import create_app
from manage import cli as manage_cli

# Create Flask app
app = create_app()

# Create CLI group and register management commands
cli = FlaskGroup(create_app=lambda: app)
cli.add_command(manage_cli)

if __name__ == '__main__':
    cli()
