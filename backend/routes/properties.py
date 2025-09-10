"""
Property routes for CRUD operations on properties.
"""

from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from auth.utils import role_required
from datetime import datetime, timezone
import json

# Create Blueprint
properties_bp = Blueprint('properties', __name__, url_prefix='/api')


@properties_bp.route('/properties', methods=['GET'])
@jwt_required()
def get_all_properties():
    """Get all available properties."""
    try:
        Property = current_app.Property
        properties = Property.query.filter_by(available=True).all()
        
        return jsonify({
            'properties': [property.to_dict() for property in properties],
            'count': len(properties)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch properties', 'details': str(e)}), 500

@properties_bp.route('/landlord/properties', methods=['GET'])
@jwt_required()
@role_required(['landlord', 'admin'])
def get_landlord_properties():
    """Get properties for the current landlord."""
    try:
        # Get user info from JWT token
        user_info = get_jwt_identity()
        if isinstance(user_info, str):
            user_info = json.loads(user_info)
        
        landlord_id = user_info.get('user_id')
        Property = current_app.Property
        
        properties = Property.query.filter_by(landlord_id=landlord_id).all()
        
        return jsonify({
            'properties': [property.to_dict() for property in properties],
            'count': len(properties)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch landlord properties', 'details': str(e)}), 500

@properties_bp.route('/landlord/properties', methods=['POST'])
@jwt_required()
@role_required(['landlord', 'admin'])
def create_property():
    """Create a new property."""
    try:
        # Get user info from JWT token
        user_info = get_jwt_identity()
        if isinstance(user_info, str):
            user_info = json.loads(user_info)
        
        landlord_id = user_info.get('user_id')
        
        # Get data from request
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate required fields
        required_fields = ['name', 'location', 'price', 'property_type', 'bedrooms']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        Property = current_app.Property
        
        # Create new property
        new_property = Property(
            name=data['name'],
            description=data.get('description', ''),
            location=data['location'],
            price=float(data['price']),
            property_type=data['property_type'],
            bedrooms=int(data['bedrooms']),
            bathrooms=int(data.get('bathrooms', 1)),
            square_feet=float(data['square_feet']) if data.get('square_feet') else None,
            available=data.get('available', True),
            landlord_id=landlord_id,
            latitude=float(data['latitude']) if data.get('latitude') else None,
            longitude=float(data['longitude']) if data.get('longitude') else None
        )
        
        # Set amenities if provided
        if 'amenities' in data and data['amenities']:
            new_property.set_amenities(data['amenities'])
        
        # Set images if provided
        if 'images' in data and data['images']:
            new_property.set_images(data['images'])
        
        # Save to database
        current_app.db.session.add(new_property)
        current_app.db.session.commit()
        
        return jsonify({
            'message': 'Property created successfully',
            'property': new_property.to_dict()
        }), 201
        
    except Exception as e:
        current_app.db.session.rollback()
        return jsonify({'error': 'Failed to create property', 'details': str(e)}), 500

@properties_bp.route('/landlord/properties/<int:property_id>', methods=['PUT'])
@jwt_required()
@role_required(['landlord', 'admin'])
def update_property(property_id):
    """Update a property."""
    try:
        # Get user info from JWT token
        user_info = get_jwt_identity()
        if isinstance(user_info, str):
            user_info = json.loads(user_info)
        
        landlord_id = user_info.get('user_id')
        Property = current_app.Property
        
        # Find property
        property = Property.query.filter_by(id=property_id, landlord_id=landlord_id).first()
        if not property:
            return jsonify({'error': 'Property not found'}), 404
        
        # Get data from request
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Update fields
        if 'name' in data:
            property.name = data['name']
        if 'description' in data:
            property.description = data['description']
        if 'location' in data:
            property.location = data['location']
        if 'price' in data:
            property.price = float(data['price'])
        if 'property_type' in data:
            property.property_type = data['property_type']
        if 'bedrooms' in data:
            property.bedrooms = int(data['bedrooms'])
        if 'bathrooms' in data:
            property.bathrooms = int(data['bathrooms'])
        if 'square_feet' in data:
            property.square_feet = float(data['square_feet']) if data['square_feet'] else None
        if 'available' in data:
            property.available = data['available']
        if 'latitude' in data:
            property.latitude = float(data['latitude']) if data['latitude'] else None
        if 'longitude' in data:
            property.longitude = float(data['longitude']) if data['longitude'] else None
        
        # Update amenities if provided
        if 'amenities' in data:
            property.set_amenities(data['amenities'])
        
        # Update images if provided
        if 'images' in data:
            property.set_images(data['images'])
        
        # Update timestamp
        property.updated_at = datetime.now(timezone.utc)
        
        # Save to database
        current_app.db.session.commit()
        
        return jsonify({
            'message': 'Property updated successfully',
            'property': property.to_dict()
        }), 200
        
    except Exception as e:
        current_app.db.session.rollback()
        return jsonify({'error': 'Failed to update property', 'details': str(e)}), 500

@properties_bp.route('/landlord/properties/<int:property_id>', methods=['DELETE'])
@jwt_required()
@role_required(['landlord', 'admin'])
def delete_property(property_id):
    """Delete a property."""
    try:
        # Get user info from JWT token
        user_info = get_jwt_identity()
        if isinstance(user_info, str):
            user_info = json.loads(user_info)
        
        landlord_id = user_info.get('user_id')
        Property = current_app.Property
        
        # Find property
        property = Property.query.filter_by(id=property_id, landlord_id=landlord_id).first()
        if not property:
            return jsonify({'error': 'Property not found'}), 404
        
        # Delete property
        current_app.db.session.delete(property)
        current_app.db.session.commit()
        
        return jsonify({'message': 'Property deleted successfully'}), 200
        
    except Exception as e:
        current_app.db.session.rollback()
        return jsonify({'error': 'Failed to delete property', 'details': str(e)}), 500

@properties_bp.route('/properties/<int:property_id>', methods=['GET'])
@jwt_required()
def get_property(property_id):
    """Get a specific property by ID."""
    try:
        Property = current_app.Property
        property = Property.query.get(property_id)
        
        if not property:
            return jsonify({'error': 'Property not found'}), 404
        
        return jsonify({'property': property.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch property', 'details': str(e)}), 500

@properties_bp.route('/properties/<int:property_id>/landlord', methods=['GET'])
@jwt_required()
def get_property_landlord(property_id):
    """Get landlord details for a specific property."""
    try:
        Property = current_app.Property
        User = current_app.User
        
        # Get the property
        property = Property.query.get(property_id)
        if not property:
            return jsonify({'error': 'Property not found'}), 404
        
        # Get the landlord
        landlord = User.query.get(property.landlord_id)
        if not landlord:
            return jsonify({'error': 'Landlord not found'}), 404
        
        # Return landlord contact information
        return jsonify({
            'landlord': {
                'id': landlord.id,
                'username': landlord.username,
                'email': landlord.email,
                'phone': landlord.phone,
                'property_name': property.name,
                'property_location': property.location
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Failed to fetch landlord details', 'details': str(e)}), 500
