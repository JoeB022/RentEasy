from datetime import datetime, timezone
from sqlalchemy.sql import func
import enum

class LeaseStatus(enum.Enum):
    PENDING = "pending"
    ACTIVE = "active"
    EXPIRED = "expired"
    TERMINATED = "terminated"

# Global variable to store the Lease model
_lease_model = None

def create_lease_model(db):
    """Create the Lease model dynamically to avoid circular imports."""
    global _lease_model
    
    if _lease_model is not None:
        return _lease_model
    
    class Lease(db.Model):
        __tablename__ = 'leases'
        
        id = db.Column(db.Integer, primary_key=True, autoincrement=True)
        property_id = db.Column(db.Integer, db.ForeignKey('properties.id'), nullable=False)
        tenant_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
        landlord_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
        
        # Lease terms
        monthly_rent = db.Column(db.Float, nullable=False)
        security_deposit = db.Column(db.Float, nullable=False)
        start_date = db.Column(db.Date, nullable=False)
        end_date = db.Column(db.Date, nullable=False)
        lease_duration_months = db.Column(db.Integer, nullable=False)
        
        # Lease status
        status = db.Column(db.Enum(LeaseStatus), nullable=False, default=LeaseStatus.PENDING)
        
        # Additional terms
        pet_deposit = db.Column(db.Float, nullable=True)
        utilities_included = db.Column(db.Boolean, default=False)
        parking_included = db.Column(db.Boolean, default=False)
        
        # Timestamps
        created_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)
        updated_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
        signed_at = db.Column(db.DateTime(timezone=True), nullable=True)
        
        def __init__(self, **kwargs):
            super(Lease, self).__init__(**kwargs)
            if self.created_at is None:
                self.created_at = datetime.now(timezone.utc)
            if self.updated_at is None:
                self.updated_at = datetime.now(timezone.utc)
        
        def to_dict(self):
            """Convert lease to dictionary for JSON response."""
            return {
                'id': self.id,
                'property_id': self.property_id,
                'tenant_id': self.tenant_id,
                'landlord_id': self.landlord_id,
                'monthly_rent': self.monthly_rent,
                'security_deposit': self.security_deposit,
                'start_date': self.start_date.isoformat() if self.start_date else None,
                'end_date': self.end_date.isoformat() if self.end_date else None,
                'lease_duration_months': self.lease_duration_months,
                'status': self.status.value if self.status else None,
                'pet_deposit': self.pet_deposit,
                'utilities_included': self.utilities_included,
                'parking_included': self.parking_included,
                'created_at': self.created_at.isoformat() if self.created_at else None,
                'updated_at': self.updated_at.isoformat() if self.updated_at else None,
                'signed_at': self.signed_at.isoformat() if self.signed_at else None
            }
        
        def is_active(self):
            """Check if lease is currently active."""
            if self.status != LeaseStatus.ACTIVE:
                return False
            
            today = datetime.now().date()
            return self.start_date <= today <= self.end_date
        
        def days_remaining(self):
            """Get number of days remaining in lease."""
            if not self.is_active():
                return 0
            
            today = datetime.now().date()
            return (self.end_date - today).days
        
        def __repr__(self):
            return f'<Lease {self.id}: Property {self.property_id} - Tenant {self.tenant_id}>'
    
    _lease_model = Lease
    return Lease

# Create a placeholder class for imports
class Lease:
    """Placeholder Lease class for imports."""
    pass

