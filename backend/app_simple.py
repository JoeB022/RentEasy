#!/usr/bin/env python3
"""
Simplified Flask app for testing endpoints without circular import issues.
"""

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, 
    create_access_token, 
    create_refresh_token, 
    jwt_required, 
    get_jwt_identity,
    decode_token
)
from flask_migrate import Migrate
from datetime import datetime, timezone, timedelta
import bcrypt
import json
import enum
import click

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()

# User Role Enum
class UserRole(enum.Enum):
    TENANT = "tenant"
    LANDLORD = "landlord"
    ADMIN = "admin"

# User Model
class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(10), nullable=False, default='tenant')
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    
    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)
        if self.role is None:
            self.role = 'tenant'
        if self.created_at is None:
            self.created_at = datetime.now(timezone.utc)
    
    @staticmethod
    def is_valid_role(role):
        """Check if the role is valid for public registration."""
        valid_public_roles = ['tenant', 'landlord']
        return role in valid_public_roles
    
    @staticmethod
    def is_admin_role(role):
        """Check if the role is admin (restricted)."""
        return role == 'admin'

def create_app():
    """Create Flask application."""
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = 'test-secret-key'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'test-jwt-secret-key'
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
    
    # Initialize extensions
    db.init_app(app)
    CORS(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    # Auth routes
    @app.route('/auth/register', methods=['POST'])
    def register():
        """Register a new user."""
        try:
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
            role = data.get('role', 'tenant').lower()
            
            # Validate role - prevent admin role assignment through public registration
            if not User.is_valid_role(role):
                return jsonify({
                    'error': 'Invalid role for public registration',
                    'message': 'Admin role cannot be assigned through public registration',
                    'allowed_roles': ['tenant', 'landlord']
                }), 403
            
            # Additional validation for role
            if role not in [r.value for r in UserRole]:
                return jsonify({'error': f'Invalid role. Must be one of: {[r.value for r in UserRole]}'}), 400
            
            # Check if username already exists
            if User.query.filter_by(username=username).first():
                return jsonify({'error': 'Username already exists'}), 409
            
            # Check if email already exists
            if User.query.filter_by(email=email).first():
                return jsonify({'error': 'Email already exists'}), 409
            
            # Hash password
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            
            # Create new user
            new_user = User(
                username=username,
                email=email,
                password=hashed_password,
                role=role
            )
            
            # Save to database
            db.session.add(new_user)
            db.session.commit()
            
            # Generate tokens
            token_identity = json.dumps({
                'user_id': new_user.id,
                'username': new_user.username,
                'role': new_user.role
            })
            
            access_token = create_access_token(identity=token_identity)
            refresh_token = create_refresh_token(identity=token_identity)
            
            return jsonify({
                'message': 'User registered successfully',
                'user': {
                    'id': new_user.id,
                    'username': new_user.username,
                    'email': new_user.email,
                    'role': new_user.role,
                    'created_at': new_user.created_at.isoformat()
                },
                'tokens': {
                    'access_token': access_token,
                    'refresh_token': refresh_token
                }
            }), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': 'Registration failed', 'details': str(e)}), 500

    @app.route('/auth/login', methods=['POST'])
    def login():
        """Authenticate user and return JWT tokens."""
        try:
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
            user = User.query.filter_by(email=email).first()
            
            if not user:
                return jsonify({'error': 'Invalid credentials'}), 401
            
            # Verify password
            if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
                return jsonify({'error': 'Invalid credentials'}), 401
            
            # Generate tokens
            token_identity = json.dumps({
                'user_id': user.id,
                'username': user.username,
                'role': user.role
            })
            
            access_token = create_access_token(identity=token_identity)
            refresh_token = create_refresh_token(identity=token_identity)
            
            return jsonify({
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'role': user.role,
                    'created_at': user.created_at.isoformat()
                },
                'tokens': {
                    'access_token': access_token,
                    'refresh_token': refresh_token
                }
            }), 200
            
        except Exception as e:
            return jsonify({'error': 'Login failed', 'details': str(e)}), 500

    @app.route('/auth/me', methods=['GET'])
    @jwt_required()
    def get_profile():
        """Get current user's profile."""
        try:
            current_user = get_jwt_identity()
            
            if not current_user:
                return jsonify({'error': 'No valid token found'}), 401
            
            user_info = json.loads(current_user)
            user_id = user_info.get('user_id')
            
            user = User.query.get(user_id)
            
            if not user:
                return jsonify({'error': 'User not found'}), 404
            
            return jsonify({
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'role': user.role,
                    'created_at': user.created_at.isoformat()
                }
            }), 200
            
        except Exception as e:
            return jsonify({'error': 'Failed to get profile', 'details': str(e)}), 500

    @app.route('/auth/logout', methods=['POST'])
    @jwt_required()
    def logout():
        """Logout user."""
        try:
            current_user = get_jwt_identity()
            
            if current_user:
                user_info = json.loads(current_user)
                username = user_info.get('username', 'Unknown')
                
                return jsonify({
                    'message': f'User {username} logged out successfully'
                }), 200
            else:
                return jsonify({'error': 'No valid token found'}), 401
                
        except Exception as e:
            return jsonify({'error': 'Logout failed', 'details': str(e)}), 500

    @app.route('/auth/refresh', methods=['POST'])
    @jwt_required(refresh=True)
    def refresh():
        """Refresh access token."""
        try:
            current_user = get_jwt_identity()
            
            if not current_user:
                return jsonify({'error': 'No valid refresh token found'}), 401
            
            new_access_token = create_access_token(identity=current_user)
            
            return jsonify({
                'message': 'Token refreshed successfully',
                'access_token': new_access_token
            }), 200
            
        except Exception as e:
            return jsonify({'error': 'Token refresh failed', 'details': str(e)}), 500

    @app.route('/auth/validate', methods=['POST'])
    @jwt_required()
    def validate_token():
        """Validate current access token."""
        try:
            current_user = get_jwt_identity()
            
            if not current_user:
                return jsonify({'error': 'No valid token found'}), 401
            
            user_info = json.loads(current_user)
            
            return jsonify({
                'valid': True,
                'user': user_info
            }), 200
            
        except Exception as e:
            return jsonify({'error': 'Token validation failed', 'details': str(e)}), 500

    # Protected routes
    @app.route('/dashboard/tenant', methods=['GET'])
    @jwt_required()
    def tenant_dashboard():
        """Tenant dashboard - accessible only by tenant role."""
        try:
            current_user = get_jwt_identity()
            
            if not current_user:
                return jsonify({'error': 'No valid token found'}), 401
            
            user_info = json.loads(current_user)
            user_role = user_info.get('role')
            
            if user_role != 'tenant':
                return jsonify({
                    'error': 'Insufficient permissions',
                    'required_roles': ['tenant'],
                    'user_role': user_role
                }), 403
            
            return jsonify({
                'message': 'Welcome to Tenant Dashboard',
                'user': {
                    'id': user_info.get('user_id'),
                    'username': user_info.get('username'),
                    'role': user_info.get('role')
                },
                'dashboard_data': {
                    'rental_history': [
                        {'property': 'Sunset Apartments', 'duration': '12 months', 'status': 'Active'},
                        {'property': 'Downtown Lofts', 'duration': '6 months', 'status': 'Completed'}
                    ],
                    'current_rent': '$1,200/month',
                    'next_payment': '2025-09-01',
                    'maintenance_requests': 2,
                    'notifications': 5
                },
                'available_actions': [
                    'View rental history',
                    'Submit maintenance request',
                    'Update profile',
                    'View lease documents'
                ]
            }), 200
            
        except Exception as e:
            return jsonify({'error': 'Failed to load tenant dashboard', 'details': str(e)}), 500

    @app.route('/dashboard/landlord', methods=['GET'])
    @jwt_required()
    def landlord_dashboard():
        """Landlord dashboard - accessible only by landlord role."""
        try:
            current_user = get_jwt_identity()
            
            if not current_user:
                return jsonify({'error': 'No valid token found'}), 401
            
            user_info = json.loads(current_user)
            user_role = user_info.get('role')
            
            if user_role != 'landlord':
                return jsonify({
                    'error': 'Insufficient permissions',
                    'required_roles': ['landlord'],
                    'user_role': user_role
                }), 403
            
            return jsonify({
                'message': 'Welcome to Landlord Dashboard',
                'user': {
                    'id': user_info.get('user_id'),
                    'username': user_info.get('username'),
                    'role': user_info.get('role')
                },
                'dashboard_data': {
                    'properties': [
                        {'name': 'Sunset Apartments', 'units': 12, 'occupancy': '92%', 'monthly_revenue': '$14,400'},
                        {'name': 'Downtown Lofts', 'units': 8, 'occupancy': '100%', 'monthly_revenue': '$12,800'}
                    ],
                    'total_properties': 2,
                    'total_units': 20,
                    'overall_occupancy': '95%',
                    'monthly_revenue': '$27,200',
                    'pending_applications': 3,
                    'maintenance_requests': 7
                },
                'available_actions': [
                    'Manage properties',
                    'View tenant applications',
                    'Handle maintenance requests',
                    'Generate financial reports',
                    'Add new properties'
                ]
            }), 200
            
        except Exception as e:
            return jsonify({'error': 'Failed to load landlord dashboard', 'details': str(e)}), 500

    @app.route('/dashboard/admin', methods=['GET'])
    @jwt_required()
    def admin_dashboard():
        """Admin dashboard - accessible only by admin role."""
        try:
            current_user = get_jwt_identity()
            
            if not current_user:
                return jsonify({'error': 'No valid token found'}), 401
            
            user_info = json.loads(current_user)
            user_role = user_info.get('role')
            
            if user_role != 'admin':
                return jsonify({
                    'error': 'Insufficient permissions',
                    'required_roles': ['admin'],
                    'user_role': user_role
                }), 403
            
            return jsonify({
                'message': 'Welcome to Admin Dashboard',
                'user': {
                    'id': user_info.get('user_id'),
                    'username': user_info.get('username'),
                    'role': user_info.get('role')
                },
                'dashboard_data': {
                    'system_stats': {
                        'total_users': 156,
                        'total_properties': 89,
                        'active_rentals': 134,
                        'pending_approvals': 12
                    },
                    'user_breakdown': {
                        'tenants': 98,
                        'landlords': 45,
                        'admins': 3
                    },
                    'system_health': {
                        'database': 'Healthy',
                        'api_uptime': '99.9%',
                        'last_backup': '2025-08-27 02:00:00'
                    }
                },
                'available_actions': [
                    'Manage all users',
                    'View system logs',
                    'Generate system reports',
                    'Manage system settings',
                    'Monitor system health',
                    'Backup database'
                ]
            }), 200
            
        except Exception as e:
            return jsonify({'error': 'Failed to load admin dashboard', 'details': str(e)}), 500

    @app.route('/dashboard/profile', methods=['GET'])
    @jwt_required()
    def user_profile():
        """User profile - accessible by any authenticated user."""
        try:
            current_user = get_jwt_identity()
            
            if not current_user:
                return jsonify({'error': 'No valid token found'}), 401
            
            user_info = json.loads(current_user)
            
            return jsonify({
                'message': 'User profile retrieved successfully',
                'profile': {
                    'user_id': user_info.get('user_id'),
                    'username': user_info.get('username'),
                    'role': user_info.get('role'),
                    'permissions': get_role_permissions(user_info.get('role'))
                }
            }), 200
            
        except Exception as e:
            return jsonify({'error': 'Failed to retrieve profile', 'details': str(e)}), 500

    @app.route('/dashboard/health', methods=['GET'])
    @jwt_required()
    def health_check():
        """Health check endpoint - accessible by any authenticated user."""
        try:
            current_user = get_jwt_identity()
            
            if not current_user:
                return jsonify({'error': 'No valid token found'}), 401
            
            user_info = json.loads(current_user)
            
            return jsonify({
                'status': 'healthy',
                'message': 'Protected routes are working correctly',
                'user': {
                    'user_id': user_info.get('user_id'),
                    'username': user_info.get('username'),
                    'role': user_info.get('role')
                },
                'timestamp': '2025-08-27T14:00:00Z'
            }), 200
            
        except Exception as e:
            return jsonify({'error': 'Health check failed', 'details': str(e)}), 500

    def get_role_permissions(role):
        """Get permissions for a given role."""
        permissions = {
            'tenant': [
                'view_own_profile',
                'submit_maintenance_requests',
                'view_lease_documents',
                'update_own_profile'
            ],
            'landlord': [
                'view_own_profile',
                'manage_own_properties',
                'view_tenant_applications',
                'handle_maintenance_requests',
                'generate_property_reports',
                'add_edit_properties'
            ],
            'admin': [
                'view_all_profiles',
                'manage_all_users',
                'manage_all_properties',
                'view_system_logs',
                'generate_system_reports',
                'manage_system_settings',
                'monitor_system_health'
            ]
        }
        
        return permissions.get(role, [])

    # Flask CLI Commands
    @app.cli.command("create-admin")
    @click.option("--email", required=True, help="Admin email address")
    @click.option("--password", required=True, help="Admin password")
    @click.option("--username", help="Admin username (optional, defaults to email)")
    def create_admin(email, password, username=None):
        """Create an admin user securely through CLI."""
        try:
            # Set default username if not provided
            if not username:
                username = email.split('@')[0]
            
            # Check if user already exists
            existing_user = User.query.filter_by(email=email).first()
            if existing_user:
                if existing_user.role == 'admin':
                    click.echo(f"⚠️  Warning: Admin user with email '{email}' already exists.")
                    return
                else:
                    click.echo(f"⚠️  Warning: User with email '{email}' already exists with role '{existing_user.role}'.")
                    click.echo("   To promote to admin, you'll need to update the database manually.")
                    return
            
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
            
            click.echo(f"✅ Admin user created successfully!")
            click.echo(f"   Email: {email}")
            click.echo(f"   Username: {username}")
            click.echo(f"   Role: admin")
            click.echo(f"   ID: {admin_user.id}")
            
        except Exception as e:
            db.session.rollback()
            click.echo(f"❌ Failed to create admin user: {str(e)}")
            raise click.Abort()

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, host="0.0.0.0", port=8000)
