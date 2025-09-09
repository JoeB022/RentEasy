"""
Authentication routes for user registration, login, logout, and profile.
"""

from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import (
    create_access_token, 
    create_refresh_token, 
    jwt_required, 
    get_jwt_identity,
    get_jwt
)
from werkzeug.security import generate_password_hash
from datetime import timedelta
import json

from models.user import UserRole
from auth.utils import hash_password, verify_password

# Create Blueprint
auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Register a new user.
    
    Expected JSON payload:
    {
        "username": "string",
        "email": "string", 
        "password": "string",
        "role": "tenant|landlord|admin" (optional, defaults to tenant)
    }
    """
    try:
        # Check if request has JSON data
        if not request.is_json:
            return jsonify({'error': 'Content-Type must be application/json'}), 400
        
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate required fields
        required_fields = ['username', 'email', 'password']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        username = data['username'].strip()
        email = data['email'].strip().lower()
        password = data['password']
        role_str = data.get('role', 'tenant').lower()
        
        # Validate username
        if len(username) < 3:
            return jsonify({'error': 'Username must be at least 3 characters long'}), 400
        
        # Validate email format
        if '@' not in email or '.' not in email:
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Validate password strength
        if len(password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters long'}), 400
        
        # Validate role
        try:
            role = UserRole(role_str)
        except ValueError:
            return jsonify({'error': f'Invalid role. Must be one of: {[r.value for r in UserRole]}'}), 400
        
        # Check if username already exists
        User = current_app.User
        if User.query.filter_by(username=username).first():
            return jsonify({'error': 'Username already exists'}), 409
        
        # Check if email already exists
        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already exists'}), 409
        
        # Hash password
        hashed_password = hash_password(password)
        
        # Create new user
        new_user = User(
            username=username,
            email=email,
            password=hashed_password,
            role=role
        )
        
        # Save to database
        from app import db
        db.session.add(new_user)
        db.session.commit()
        
        # Generate tokens
        token_identity = json.dumps({
            'user_id': new_user.id,
            'username': new_user.username,
            'role': new_user.role.value
        })
        
        access_token = create_access_token(
            identity=token_identity,
            expires_delta=timedelta(hours=1)
        )
        
        refresh_token = create_refresh_token(
            identity=token_identity,
            expires_delta=timedelta(days=30)
        )
        
        return jsonify({
            'message': 'User registered successfully',
            'user': {
                'id': new_user.id,
                'username': new_user.username,
                'email': new_user.email,
                'role': new_user.role.value,
                'created_at': new_user.created_at.isoformat()
            },
            'tokens': {
                'access_token': access_token,
                'refresh_token': refresh_token
            }
        }), 201
        
    except Exception as e:
        from app import db
        db.session.rollback()
        return jsonify({'error': 'Registration failed', 'details': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Authenticate user and return JWT tokens.
    
    Expected JSON payload:
    {
        "email": "string",
        "password": "string"
    }
    """
    try:
        # Check if request has JSON data
        if not request.is_json:
            return jsonify({'error': 'Content-Type must be application/json'}), 400
        
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Validate email format
        if '@' not in email or '.' not in email:
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Find user by email
        User = current_app.User
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Verify password
        if not verify_password(password, user.password):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Generate tokens
        token_identity = json.dumps({
            'user_id': user.id,
            'username': user.username,
            'role': user.role.value
        })
        
        access_token = create_access_token(
            identity=token_identity,
            expires_delta=timedelta(hours=1)
        )
        
        refresh_token = create_refresh_token(
            identity=token_identity,
            expires_delta=timedelta(days=30)
        )
        
        return jsonify({
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role.value,
                'created_at': user.created_at.isoformat()
            },
            'tokens': {
                'access_token': access_token,
                'refresh_token': refresh_token
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Login failed', 'details': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """
    Logout user (token invalidation).
    Note: This is a basic implementation. For production, consider using a token blacklist.
    """
    try:
        # Get current token identity
        current_user = get_jwt_identity()
        
        if current_user:
            # Parse user info from token
            user_info = json.loads(current_user)
            username = user_info.get('username', 'Unknown')
            
            return jsonify({
                'message': f'User {username} logged out successfully'
            }), 200
        else:
            return jsonify({'error': 'No valid token found'}), 401
            
    except Exception as e:
        return jsonify({'error': 'Logout failed', 'details': str(e)}), 500

@auth_bp.route('/delete-account', methods=['DELETE'])
@jwt_required()
def delete_account():
    """
    Delete current user's account.
    Requires valid JWT token in Authorization header.
    """
    try:
        # Get current user from token
        current_user = get_jwt_identity()
        
        if not current_user:
            return jsonify({'error': 'No valid token found'}), 401
        
        # Parse user info from token
        user_info = json.loads(current_user)
        username = user_info.get('username')
        user_id = user_info.get('id')
        
        if not username or not user_id:
            return jsonify({'error': 'Invalid user information'}), 400
        
        # Get User model from app context
        User = current_app.User
        
        # Find the user in database
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Store user info for response
        deleted_username = user.username
        deleted_email = user.email
        
        # Delete the user
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({
            'message': f'Account for {deleted_username} ({deleted_email}) has been deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete account', 'details': str(e)}), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_profile():
    """
    Get current user's profile information.
    Requires valid JWT token in Authorization header.
    """
    try:
        # Get current user from token
        current_user = get_jwt_identity()
        
        if not current_user:
            return jsonify({'error': 'No valid token found'}), 401
        
        # Parse user info from token
        user_info = json.loads(current_user)
        user_id = user_info.get('user_id')
        
        # Get user from database using Session.get() for SQLAlchemy 2.0
        from app import db
        user = db.session.get(User, user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role.value,
                'created_at': user.created_at.isoformat()
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to get profile', 'details': str(e)}), 500

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """
    Refresh access token using refresh token.
    """
    try:
        # Get current user from refresh token
        current_user = get_jwt_identity()
        
        if not current_user:
            return jsonify({'error': 'No valid refresh token found'}), 401
        
        # Generate new access token
        new_access_token = create_access_token(
            identity=current_user,
            expires_delta=timedelta(hours=1)
        )
        
        return jsonify({
            'message': 'Token refreshed successfully',
            'access_token': new_access_token
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Token refresh failed', 'details': str(e)}), 500

@auth_bp.route('/validate', methods=['POST'])
@jwt_required()
def validate_token():
    """
    Validate current access token and return user info.
    """
    try:
        current_user = get_jwt_identity()
        
        if not current_user:
            return jsonify({'error': 'No valid token found'}), 401
        
        # Parse user info from token
        user_info = json.loads(current_user)
        
        return jsonify({
            'valid': True,
            'user': user_info
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Token validation failed', 'details': str(e)}), 500
