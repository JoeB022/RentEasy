#!/usr/bin/env python3
"""
Script to create admin users directly.
This bypasses Flask CLI and creates admin users directly.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app_simple import app, db, User
import bcrypt

def create_admin_user(email, password, username=None):
    """Create an admin user."""
    try:
        # Set default username if not provided
        if not username:
            username = email.split('@')[0]
        
        with app.app_context():
            # Check if user already exists
            existing_user = User.query.filter_by(email=email).first()
            if existing_user:
                if existing_user.role == 'admin':
                    print(f"⚠️  Warning: Admin user with email '{email}' already exists.")
                    return False
                else:
                    print(f"⚠️  Warning: User with email '{email}' already exists with role '{existing_user.role}'.")
                    print("   To promote to admin, you'll need to update the database manually.")
                    return False
            
            # Hash password
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            
            # Create admin user
            admin_user = User(
                username=username,
                email=email.lower(),
                password=hashed_password,
                role='admin'
            )
            
            # Save to database
            db.session.add(admin_user)
            db.session.commit()
            
            print(f"✅ Admin user created successfully!")
            print(f"   Email: {email}")
            print(f"   Username: {username}")
            print(f"   Role: admin")
            print(f"   ID: {admin_user.id}")
            return True
            
    except Exception as e:
        print(f"❌ Failed to create admin user: {str(e)}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python create_admin.py <email> <password> [username]")
        print("Example: python create_admin.py admin@renteasy.com 123456")
        sys.exit(1)
    
    email = sys.argv[1]
    password = sys.argv[2]
    username = sys.argv[3] if len(sys.argv) > 3 else None
    
    success = create_admin_user(email, password, username)
    if not success:
        sys.exit(1)
