from datetime import datetime, timezone
from sqlalchemy.sql import func
import enum

class UserRole(enum.Enum):
    TENANT = "tenant"
    LANDLORD = "landlord"
    ADMIN = "admin"

class ApprovalStatus(enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

# Global variable to store the User model
_user_model = None

def create_user_model(db):
    """Create the User model dynamically to avoid circular imports."""
    global _user_model
    
    if _user_model is not None:
        return _user_model
    
    class User(db.Model):
        __tablename__ = 'users'

        id = db.Column(db.Integer, primary_key=True, autoincrement=True)
        username = db.Column(db.String(80), unique=True, nullable=False, index=True)
        email = db.Column(db.String(120), unique=True, nullable=False, index=True)
        password = db.Column(db.String(255), nullable=False)  # Hashed password
        phone = db.Column(db.String(20), nullable=True)  # Phone number for contact
        role = db.Column(db.Enum(UserRole), nullable=False, default=UserRole.TENANT)
        approval_status = db.Column(db.Enum(ApprovalStatus), nullable=False, default=ApprovalStatus.PENDING)
        created_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)

        def __init__(self, **kwargs):
            super(User, self).__init__(**kwargs)
            # Ensure default values are set
            if self.role is None:
                self.role = UserRole.TENANT
            if self.approval_status is None:
                # Admins are auto-approved, others need approval
                self.approval_status = ApprovalStatus.APPROVED if self.role == UserRole.ADMIN else ApprovalStatus.PENDING
            if self.created_at is None:
                self.created_at = datetime.now(timezone.utc)

        def __repr__(self):
            return f'<User {self.username}>'

        def to_dict(self):
            return {
                'id': self.id,
                'username': self.username,
                'email': self.email,
                'phone': self.phone,
                'role': self.role.value if self.role else None,
                'approval_status': self.approval_status.value if self.approval_status else None,
                'created_at': self.created_at.isoformat() if self.created_at else None
            }
    
    _user_model = User
    return User

# Create a placeholder class for imports
class User:
    """Placeholder User class for imports."""
    pass
