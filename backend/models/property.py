from datetime import datetime, timezone
from sqlalchemy.sql import func
import json

# Global variable to store the Property model
_property_model = None

def create_property_model(db):
    """Create the Property model dynamically to avoid circular imports."""
    global _property_model
    
    if _property_model is not None:
        return _property_model
    
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
        created_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)
        updated_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
        
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
        
        def set_amenities(self, amenities_list):
            """Set amenities from a list."""
            self.amenities = json.dumps(amenities_list) if amenities_list else None
        
        def get_amenities(self):
            """Get amenities as a list."""
            return json.loads(self.amenities) if self.amenities else []
        
        def set_images(self, images_list):
            """Set images from a list."""
            self.images = json.dumps(images_list) if images_list else None
        
        def get_images(self):
            """Get images as a list."""
            return json.loads(self.images) if self.images else []
        
        def __repr__(self):
            return f'<Property {self.name}>'
    
    _property_model = Property
    return Property

# Create a placeholder class for imports
class Property:
    """Placeholder Property class for imports."""
    pass