"""
Protected routes with role-based access control.
"""

from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from functools import wraps
import json

from models.user import User

# Create Blueprint
protected_bp = Blueprint('protected', __name__, url_prefix='/dashboard')

def role_required(allowed_roles):
    """
    Decorator to check if user has required role(s).
    
    Args:
        allowed_roles: Single role string or list of allowed roles
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                # Get current user from JWT token
                current_user = get_jwt_identity()
                
                if not current_user:
                    return jsonify({'error': 'No valid token found'}), 401
                
                # Parse user info from token
                user_info = json.loads(current_user)
                user_role = user_info.get('role')
                
                if not user_role:
                    return jsonify({'error': 'No role information in token'}), 401
                
                # Check if user's role is allowed
                if isinstance(allowed_roles, str):
                    allowed_roles_list = [allowed_roles]
                else:
                    allowed_roles_list = allowed_roles
                
                if user_role not in allowed_roles_list:
                    return jsonify({
                        'error': 'Insufficient permissions',
                        'required_roles': allowed_roles_list,
                        'user_role': user_role
                    }), 403
                
                # Add user info to request context for use in route
                request.user_info = user_info
                
                return f(*args, **kwargs)
                
            except json.JSONDecodeError:
                return jsonify({'error': 'Invalid token format'}), 401
            except Exception as e:
                return jsonify({'error': 'Role verification failed', 'details': str(e)}), 500
        
        return decorated_function
    return decorator

@protected_bp.route('/tenant', methods=['GET'])
@jwt_required()
@role_required('tenant')
def tenant_dashboard():
    """
    Tenant dashboard - accessible only by users with tenant role.
    """
    try:
        user_info = request.user_info
        
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

@protected_bp.route('/landlord', methods=['GET'])
@jwt_required()
@role_required('landlord')
def landlord_dashboard():
    """
    Landlord dashboard - accessible only by users with landlord role.
    """
    try:
        user_info = request.user_info
        
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

@protected_bp.route('/admin', methods=['GET'])
@jwt_required()
@role_required('admin')
def admin_dashboard():
    """
    Admin dashboard - accessible only by users with admin role.
    """
    try:
        user_info = request.user_info
        
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
                'recent_activities': [
                    {'action': 'New user registration', 'user': 'john_doe', 'time': '2 hours ago'},
                    {'action': 'Property added', 'property': 'Riverside Complex', 'time': '4 hours ago'},
                    {'action': 'Maintenance request resolved', 'request_id': 'MR-00123', 'time': '6 hours ago'}
                ],
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

@protected_bp.route('/profile', methods=['GET'])
@jwt_required()
def user_profile():
    """
    User profile - accessible by any authenticated user.
    """
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
        
    except json.JSONDecodeError:
        return jsonify({'error': 'Invalid token format'}), 401
    except Exception as e:
        return jsonify({'error': 'Failed to retrieve profile', 'details': str(e)}), 500

@protected_bp.route('/settings', methods=['GET', 'PUT'])
@jwt_required()
def user_settings():
    """
    User settings - accessible by any authenticated user.
    """
    try:
        current_user = get_jwt_identity()
        
        if not current_user:
            return jsonify({'error': 'No valid token found'}), 401
        
        user_info = json.loads(current_user)
        
        if request.method == 'GET':
            return jsonify({
                'message': 'User settings retrieved successfully',
                'settings': {
                    'user_id': user_info.get('user_id'),
                    'username': user_info.get('username'),
                    'role': user_info.get('role'),
                    'preferences': {
                        'email_notifications': True,
                        'sms_notifications': False,
                        'language': 'en',
                        'timezone': 'UTC'
                    }
                }
            }), 200
        
        elif request.method == 'PUT':
            data = request.get_json()
            
            if not data:
                return jsonify({'error': 'No data provided'}), 400
            
            # Here you would typically update user settings in the database
            # For now, we'll just return a success message
            
            return jsonify({
                'message': 'User settings updated successfully',
                'updated_settings': data
            }), 200
        
    except json.JSONDecodeError:
        return jsonify({'error': 'Invalid token format'}), 401
    except Exception as e:
        return jsonify({'error': 'Failed to handle settings', 'details': str(e)}), 500

def get_role_permissions(role):
    """
    Get permissions for a given role.
    
    Args:
        role (str): User role
        
    Returns:
        list: List of permissions for the role
    """
    permissions = {
        'tenant': [
            'view_own_profile',
            'view_own_rental_history',
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

@protected_bp.route('/health', methods=['GET'])
@jwt_required()
def health_check():
    """
    Health check endpoint - accessible by any authenticated user.
    """
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
        
    except json.JSONDecodeError:
        return jsonify({'error': 'Invalid token format'}), 401
    except Exception as e:
        return jsonify({'error': 'Health check failed', 'details': str(e)}), 500
