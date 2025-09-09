#!/usr/bin/env python3
"""
Database utility functions for the Flask backend.
"""

from app import app, db
from models.user import User, UserRole
import bcrypt

def init_db():
    """Initialize the database with tables."""
    with app.app_context():
        db.create_all()
        print("Database initialized successfully!")

def drop_db():
    """Drop all database tables."""
    with app.app_context():
        db.drop_all()
        print("Database dropped successfully!")

def create_sample_user(username, email, password, role=UserRole.TENANT):
    """Create a sample user with hashed password."""
    with app.app_context():
        # Hash the password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # Create user
        user = User(
            username=username,
            email=email,
            password=hashed_password.decode('utf-8'),
            role=role
        )
        
        db.session.add(user)
        db.session.commit()
        print(f"User {username} created successfully!")
        return user

def list_users():
    """List all users in the database."""
    with app.app_context():
        users = User.query.all()
        print(f"Found {len(users)} users:")
        for user in users:
            print(f"  - {user.username} ({user.email}) - Role: {user.role.value}")
        return users

def verify_user_password(username, password):
    """Verify a user's password."""
    with app.app_context():
        user = User.query.filter_by(username=username).first()
        if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            print(f"Password verified for user {username}")
            return True
        else:
            print(f"Invalid password for user {username}")
            return False

def delete_user_by_username(username):
    """Delete a user by username."""
    with app.app_context():
        user = User.query.filter_by(username=username).first()
        if user:
            db.session.delete(user)
            db.session.commit()
            print(f"User {username} deleted successfully!")
            return True
        else:
            print(f"User {username} not found!")
            return False

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python db_utils.py [init|drop|create|list|verify|delete]")
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == "init":
        init_db()
    elif command == "drop":
        drop_db()
    elif command == "create":
        if len(sys.argv) < 5:
            print("Usage: python db_utils.py create <username> <email> <password> [role]")
            sys.exit(1)
        username = sys.argv[2]
        email = sys.argv[3]
        password = sys.argv[4]
        role = UserRole(sys.argv[5]) if len(sys.argv) > 5 else UserRole.TENANT
        create_sample_user(username, email, password, role)
    elif command == "list":
        list_users()
    elif command == "verify":
        if len(sys.argv) < 4:
            print("Usage: python db_utils.py verify <username> <password>")
            sys.exit(1)
        username = sys.argv[2]
        password = sys.argv[3]
        verify_user_password(username, password)
    elif command == "delete":
        if len(sys.argv) < 3:
            print("Usage: python db_utils.py delete <username>")
            sys.exit(1)
        username = sys.argv[2]
        delete_user_by_username(username)
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)
