#!/usr/bin/env python3
"""
Flask CLI management commands for RentEasy backend.

This module provides idempotent commands for setup, cleanup, and maintenance
operations that work across development, testing, and production environments.
"""

import os
import sys
import click
from flask.cli import with_appcontext
from flask_migrate import init, migrate, upgrade, downgrade, current, history
from sqlalchemy import text
from app import create_app, db
from models.user import create_user_model, UserRole
from auth.utils import hash_password
from utils.logger import get_logger

logger = get_logger(__name__)

# Flask app will be created by FlaskGroup or CLI context

@click.group()
def cli():
    """RentEasy Backend Management CLI"""
    pass

@cli.command()
@click.option('--email', required=True, help='Admin email address')
@click.option('--password', required=True, help='Admin password')
@click.option('--username', help='Admin username (defaults to email)')
@click.option('--force', is_flag=True, help='Force creation even if admin exists')
@with_appcontext
def create_admin(email, password, username, force):
    """Create an admin user with the specified credentials."""
    try:
        # Get User model
        User = create_user_model(db)
        
        # Check if admin already exists
        existing_admin = User.query.filter_by(email=email).first()
        if existing_admin and not force:
            click.echo(f"❌ Admin with email {email} already exists. Use --force to overwrite.")
            return
        
        # Use email as username if not provided
        if not username:
            username = email.split('@')[0]
        
        # Hash password
        hashed_password = hash_password(password)
        
        # Create or update admin user
        if existing_admin:
            existing_admin.username = username
            existing_admin.password = hashed_password
            existing_admin.role = UserRole.ADMIN
            db.session.commit()
            click.echo(f"✅ Admin user {username} ({email}) updated successfully!")
        else:
            admin_user = User(
                username=username,
                email=email,
                password=hashed_password,
                role=UserRole.ADMIN
            )
            db.session.add(admin_user)
            db.session.commit()
            click.echo(f"✅ Admin user {username} ({email}) created successfully!")
            
        # Verify creation
        admin = User.query.filter_by(email=email).first()
        click.echo(f"   User ID: {admin.id}")
        click.echo(f"   Role: {admin.role.value}")
        click.echo(f"   Created: {admin.created_at}")
        
    except Exception as e:
        logger.error(f"Failed to create admin user: {e}")
        click.echo(f"❌ Error creating admin user: {e}")
        sys.exit(1)

@cli.command()
@click.option('--init', 'init_migrations', is_flag=True, help='Initialize migrations if not exists')
@click.option('--message', default='Auto-generated migration', help='Migration message')
@click.option('--upgrade', 'run_upgrade', is_flag=True, help='Run migrations after creating')
@with_appcontext
def setup_db(init_migrations, message, run_upgrade):
    """Setup database with migrations and upgrades."""
    try:
        from flask import current_app
        app = current_app
        
        # Check if migrations directory exists
        migrations_dir = os.path.join(app.root_path, 'migrations')
        if not os.path.exists(migrations_dir) or init_migrations:
            click.echo("📁 Initializing database migrations...")
            init()
            click.echo("✅ Migrations initialized!")
        
        # Create migration if there are changes
        click.echo("📝 Creating migration...")
        migrate(message=message)
        click.echo("✅ Migration created!")
        
        # Run migrations if requested
        if run_upgrade:
            click.echo("⬆️  Running database migrations...")
            upgrade()
            click.echo("✅ Database migrations completed!")
        
        # Show current migration status
        current_rev = current()
        click.echo(f"📊 Current migration: {current_rev}")
        
    except Exception as e:
        logger.error(f"Failed to setup database: {e}")
        click.echo(f"❌ Error setting up database: {e}")
        sys.exit(1)

@cli.command()
@click.option('--drop-test-data', is_flag=True, help='Drop test data (requires CONFIRM env var in production)')
@click.option('--reset-migrations', is_flag=True, help='Reset all migrations (DANGEROUS)')
@click.option('--drop-all', is_flag=True, help='Drop all tables (DANGEROUS)')
@with_appcontext
def cleanup(drop_test_data, reset_migrations, drop_all):
    """Cleanup database and test data with safety checks."""
    try:
        from flask import current_app
        app = current_app
        
        # Safety check for production
        if app.config.get('ENV') == 'production':
            if not os.environ.get('CONFIRM'):
                click.echo("❌ Production cleanup requires CONFIRM environment variable!")
                click.echo("   Set CONFIRM=true to confirm production cleanup")
                sys.exit(1)
            click.echo("⚠️  WARNING: Running cleanup in PRODUCTION environment!")
        
        # Get User model
        User = create_user_model(db)
        
        if drop_test_data:
            click.echo("🧹 Cleaning up test data...")
            
            # Count test users
            test_users = User.query.filter(
                User.email.like('%@test.%') |
                User.email.like('%@example.com') |
                User.username.like('test%')
            ).count()
            
            if test_users > 0:
                # Delete test users
                User.query.filter(
                    User.email.like('%@test.%') |
                    User.email.like('%@example.com') |
                    User.username.like('test%')
                ).delete()
                db.session.commit()
                click.echo(f"✅ Removed {test_users} test users")
            else:
                click.echo("ℹ️  No test data found")
        
        if reset_migrations:
            if app.config.get('ENV') == 'production':
                click.echo("❌ Cannot reset migrations in production!")
                sys.exit(1)
            
            click.echo("🔄 Resetting migrations...")
            # Drop all tables
            db.drop_all()
            # Remove migrations directory
            import shutil
            migrations_dir = os.path.join(app.root_path, 'migrations')
            if os.path.exists(migrations_dir):
                shutil.rmtree(migrations_dir)
            click.echo("✅ Migrations reset!")
        
        if drop_all:
            if app.config.get('ENV') == 'production':
                click.echo("❌ Cannot drop all tables in production!")
                sys.exit(1)
            
            click.echo("🗑️  Dropping all tables...")
            db.drop_all()
            db.session.commit()
            click.echo("✅ All tables dropped!")
        
        # Show current status
        if not drop_all:
            user_count = User.query.count()
            click.echo(f"📊 Current users: {user_count}")
        
    except Exception as e:
        logger.error(f"Failed to cleanup: {e}")
        click.echo(f"❌ Error during cleanup: {e}")
        sys.exit(1)

@cli.command()
@with_appcontext
def status():
    """Show current database and application status."""
    try:
        from flask import current_app
        app = current_app
        
        # Database status
        click.echo("📊 Database Status:")
        click.echo(f"   URI: {app.config['SQLALCHEMY_DATABASE_URI']}")
        click.echo(f"   Environment: {app.config.get('ENV', 'development')}")
        
        # Migration status
        try:
            current_rev = current()
            click.echo(f"   Migration: {current_rev}")
        except:
            click.echo("   Migration: Not initialized")
        
        # User count
        User = create_user_model(db)
        user_count = User.query.count()
        admin_count = User.query.filter_by(role=UserRole.ADMIN).count()
        click.echo(f"   Users: {user_count} (Admins: {admin_count})")
        
        # Health check
        try:
            db.session.execute(text('SELECT 1'))
            click.echo("   Status: ✅ Healthy")
        except Exception as e:
            click.echo(f"   Status: ❌ Error - {e}")
        
    except Exception as e:
        logger.error(f"Failed to get status: {e}")
        click.echo(f"❌ Error getting status: {e}")
        sys.exit(1)

@cli.command()
@click.option('--email', help='Filter by email')
@click.option('--role', type=click.Choice(['admin', 'landlord', 'tenant']), help='Filter by role')
@with_appcontext
def list_users(email, role):
    """List users in the database."""
    try:
        User = create_user_model(db)
        
        # Build query
        query = User.query
        if email:
            query = query.filter(User.email.like(f'%{email}%'))
        if role:
            query = query.filter_by(role=UserRole[role.upper()])
        
        users = query.all()
        
        if not users:
            click.echo("ℹ️  No users found")
            return
        
        click.echo(f"👥 Found {len(users)} users:")
        click.echo("-" * 80)
        click.echo(f"{'ID':<5} {'Username':<20} {'Email':<30} {'Role':<10} {'Created'}")
        click.echo("-" * 80)
        
        for user in users:
            click.echo(f"{user.id:<5} {user.username:<20} {user.email:<30} {user.role.value:<10} {user.created_at.strftime('%Y-%m-%d')}")
        
    except Exception as e:
        logger.error(f"Failed to list users: {e}")
        click.echo(f"❌ Error listing users: {e}")
        sys.exit(1)

@cli.command()
@click.option('--user-id', type=int, help='User ID to delete')
@click.option('--email', help='Email of user to delete')
@click.option('--username', help='Username of user to delete')
@click.option('--force', is_flag=True, help='Force deletion without confirmation')
@with_appcontext
def delete_user(user_id, email, username, force):
    """Delete a user from the database."""
    try:
        if not any([user_id, email, username]):
            click.echo("❌ Must specify --user-id, --email, or --username")
            return
        
        User = create_user_model(db)
        
        # Find user
        user = None
        if user_id:
            user = User.query.get(user_id)
        elif email:
            user = User.query.filter_by(email=email).first()
        elif username:
            user = User.query.filter_by(username=username).first()
        
        if not user:
            click.echo("❌ User not found")
            return
        
        # Confirmation
        if not force:
            click.echo(f"⚠️  Are you sure you want to delete user '{user.username}' ({user.email})?")
            if not click.confirm("This action cannot be undone"):
                click.echo("❌ Operation cancelled")
                return
        
        # Delete user
        db.session.delete(user)
        db.session.commit()
        click.echo(f"✅ User '{user.username}' deleted successfully!")
        
    except Exception as e:
        logger.error(f"Failed to delete user: {e}")
        click.echo(f"❌ Error deleting user: {e}")
        sys.exit(1)

if __name__ == '__main__':
    cli()
