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

# Property Model
class Property(db.Model):
    __tablename__ = 'properties'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    location = db.Column(db.String(200), nullable=False)
    price = db.Column(db.Float, nullable=False)
    property_type = db.Column(db.String(50), nullable=False)
    bedrooms = db.Column(db.Integer, nullable=False)
    bathrooms = db.Column(db.Integer, default=1)
    square_feet = db.Column(db.Float, nullable=True)
    available = db.Column(db.Boolean, default=True)
    landlord_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc), nullable=False)
    
    # Amenities as JSON string
    amenities = db.Column(db.Text, nullable=True)  # JSON string of amenities
    
    # Images as JSON string
    images = db.Column(db.Text, nullable=True)  # JSON string of image URLs
    
    # Location coordinates
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    
    def __init__(self, **kwargs):
        super(Property, self).__init__(**kwargs)
        if self.created_at is None:
            self.created_at = datetime.now(timezone.utc)
        if self.updated_at is None:
            self.updated_at = datetime.now(timezone.utc)
    
    def to_dict(self):
        """Convert property to dictionary for JSON response."""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'location': self.location,
            'price': self.price,
            'property_type': self.property_type,
            'bedrooms': self.bedrooms,
            'bathrooms': self.bathrooms,
            'square_feet': self.square_feet,
            'available': self.available,
            'landlord_id': self.landlord_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'amenities': json.loads(self.amenities) if self.amenities else [],
            'images': json.loads(self.images) if self.images else [],
            'latitude': self.latitude,
            'longitude': self.longitude
        }
    
    @staticmethod
    def from_dict(data, landlord_id):
        """Create property from dictionary data."""
        # Convert amenities and images to JSON strings
        amenities = json.dumps(data.get('amenities', [])) if data.get('amenities') else None
        images = json.dumps(data.get('images', [])) if data.get('images') else None
        
        return Property(
            name=data['name'],
            description=data.get('description', ''),
            location=data['location'],
            price=float(data['price']),
            property_type=data['property_type'],
            bedrooms=int(data['bedrooms']),
            bathrooms=int(data.get('bathrooms', 1)),
            square_feet=float(data.get('square_feet', 0)) if data.get('square_feet') else None,
            available=data.get('available', True),
            landlord_id=landlord_id,
            amenities=amenities,
            images=images,
            latitude=float(data.get('latitude', 0)) if data.get('latitude') else None,
            longitude=float(data.get('longitude', 0)) if data.get('longitude') else None
        )

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
    CORS(app, origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"], supports_credentials=True)
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

    # Property Management Routes
    @app.route('/api/properties', methods=['GET'])
    def get_properties():
        """Get all available properties (for tenants to browse)."""
        try:
            # Get query parameters for filtering
            property_type = request.args.get('type')
            location = request.args.get('location')
            min_price = request.args.get('min_price')
            max_price = request.args.get('max_price')
            bedrooms = request.args.get('bedrooms')
            has_gps = request.args.get('has_gps')  # New filter for properties with GPS coordinates
            
            # Start with base query
            query = Property.query.filter_by(available=True)
            
            # Apply filters
            if property_type:
                query = query.filter(Property.property_type == property_type)
            if location:
                query = query.filter(Property.location.ilike(f'%{location}%'))
            if min_price:
                query = query.filter(Property.price >= float(min_price))
            if max_price:
                query = query.filter(Property.price <= float(max_price))
            if bedrooms:
                query = query.filter(Property.bedrooms >= int(bedrooms))
            if has_gps == 'true':
                query = query.filter(Property.latitude.isnot(None), Property.longitude.isnot(None))
            elif has_gps == 'false':
                query = query.filter((Property.latitude.is_(None)) | (Property.longitude.is_(None)))
            
            # Order by creation date (newest first)
            properties = query.order_by(Property.created_at.desc()).all()
            
            # Convert to dictionaries
            properties_data = [prop.to_dict() for prop in properties]
            
            return jsonify({
                'message': 'Properties retrieved successfully',
                'properties': properties_data,
                'total': len(properties_data)
            }), 200
            
        except Exception as e:
            print(f"Error getting properties: {str(e)}")
            return jsonify({'error': 'Failed to retrieve properties', 'details': str(e)}), 500

    @app.route('/api/properties', methods=['POST'])
    @jwt_required()
    def create_property():
        """Create a new property (landlords only)."""
        try:
            current_user = get_jwt_identity()
            user_data = json.loads(current_user)
            
            # Check if user is a landlord
            if user_data.get('role') != 'landlord':
                return jsonify({'error': 'Only landlords can create properties'}), 403
            
            if not request.is_json:
                return jsonify({'error': 'Content-Type must be application/json'}), 400
            
            data = request.get_json()
            
            # Validate required fields
            required_fields = ['name', 'location', 'price', 'property_type', 'bedrooms']
            for field in required_fields:
                if not data.get(field):
                    return jsonify({'error': f'{field} is required'}), 400
            
            # Create property
            property_obj = Property.from_dict(data, user_data['user_id'])
            
            db.session.add(property_obj)
            db.session.commit()
            
            print(f"Property '{property_obj.name}' created by landlord {user_data['username']}")
            
            return jsonify({
                'message': 'Property created successfully',
                'property': property_obj.to_dict()
            }), 201
            
        except Exception as e:
            db.session.rollback()
            print(f"Error creating property: {str(e)}")
            return jsonify({'error': 'Failed to create property', 'details': str(e)}), 500

    @app.route('/api/properties/<int:property_id>', methods=['GET'])
    def get_property(property_id):
        """Get a specific property by ID."""
        try:
            property_obj = Property.query.get(property_id)
            
            if not property_obj:
                return jsonify({'error': 'Property not found'}), 404
            
            return jsonify({
                'message': 'Property retrieved successfully',
                'property': property_obj.to_dict()
            }), 200
            
        except Exception as e:
            print(f"Error getting property {property_id}: {str(e)}")
            return jsonify({'error': 'Failed to retrieve property', 'details': str(e)}), 500

    @app.route('/api/properties/<int:property_id>', methods=['PUT'])
    @jwt_required()
    def update_property(property_id):
        """Update a property (landlord who owns it only)."""
        try:
            current_user = get_jwt_identity()
            user_data = json.loads(current_user)
            
            property_obj = Property.query.get(property_id)
            
            if not property_obj:
                return jsonify({'error': 'Property not found'}), 404
            
            # Check if user owns this property
            if property_obj.landlord_id != user_data['user_id']:
                return jsonify({'error': 'You can only update your own properties'}), 403
            
            if not request.is_json:
                return jsonify({'error': 'Content-Type must be application/json'}), 400
            
            data = request.get_json()
            
            # Update fields
            if 'name' in data:
                property_obj.name = data['name']
            if 'description' in data:
                property_obj.description = data['description']
            if 'location' in data:
                property_obj.location = data['location']
            if 'price' in data:
                property_obj.price = float(data['price'])
            if 'property_type' in data:
                property_obj.property_type = data['property_type']
            if 'bedrooms' in data:
                property_obj.bedrooms = int(data['bedrooms'])
            if 'bathrooms' in data:
                property_obj.bathrooms = int(data['bathrooms'])
            if 'square_feet' in data:
                property_obj.square_feet = float(data['square_feet']) if data['square_feet'] else None
            if 'available' in data:
                property_obj.available = bool(data['available'])
            if 'amenities' in data:
                property_obj.amenities = json.dumps(data['amenities']) if data['amenities'] else None
            if 'images' in data:
                property_obj.images = json.dumps(data['images']) if data['images'] else None
            if 'latitude' in data:
                property_obj.latitude = float(data['latitude']) if data['latitude'] else None
            if 'longitude' in data:
                property_obj.longitude = float(data['longitude']) if data['longitude'] else None
            
            property_obj.updated_at = datetime.now(timezone.utc)
            
            db.session.commit()
            
            print(f"Property '{property_obj.name}' updated by landlord {user_data['username']}")
            
            return jsonify({
                'message': 'Property updated successfully',
                'property': property_obj.to_dict()
            }), 200
            
        except Exception as e:
            db.session.rollback()
            print(f"Error updating property {property_id}: {str(e)}")
            return jsonify({'error': 'Failed to update property', 'details': str(e)}), 500

    @app.route('/api/properties/<int:property_id>', methods=['DELETE'])
    @jwt_required()
    def delete_property(property_id):
        """Delete a property (landlord who owns it only)."""
        try:
            current_user = get_jwt_identity()
            user_data = json.loads(current_user)
            
            property_obj = Property.query.get(property_id)
            
            if not property_obj:
                return jsonify({'error': 'Property not found'}), 404
            
            # Check if user owns this property
            if property_obj.landlord_id != user_data['user_id']:
                return jsonify({'error': 'You can only delete your own properties'}), 404
            
            property_name = property_obj.name
            
            db.session.delete(property_obj)
            db.session.commit()
            
            print(f"Property '{property_name}' deleted by landlord {user_data['username']}")
            
            return jsonify({'message': 'Property deleted successfully'}), 200
            
        except Exception as e:
            db.session.rollback()
            print(f"Error deleting property {property_id}: {str(e)}")
            return jsonify({'error': 'Failed to delete property', 'details': str(e)}), 500

    @app.route('/api/landlord/properties', methods=['GET'])
    @jwt_required()
    def get_landlord_properties():
        """Get properties owned by the authenticated landlord."""
        try:
            current_user = get_jwt_identity()
            user_data = json.loads(current_user)
            
            # Check if user is a landlord
            if user_data.get('role') != 'landlord':
                return jsonify({'error': 'Only landlords can access this endpoint'}), 403
            
            # Get properties owned by this landlord
            properties = Property.query.filter_by(landlord_id=user_data['user_id']).order_by(Property.created_at.desc()).all()
            
            # Convert to dictionaries
            properties_data = [prop.to_dict() for prop in properties]
            
            return jsonify({
                'message': 'Landlord properties retrieved successfully',
                'properties': properties_data,
                'total': len(properties_data)
            }), 200
            
        except Exception as e:
            print(f"Error getting landlord properties: {str(e)}")
            return jsonify({'error': 'Failed to retrieve landlord properties', 'details': str(e)}), 500

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

    return app

# Create the app instance for CLI commands
app = create_app()

# Register CLI commands with the app instance
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

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)
