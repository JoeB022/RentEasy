from datetime import datetime, timezone
from sqlalchemy.sql import func
import enum

class UserRole(enum.Enum):
    TENANT = "tenant"
    LANDLORD = "landlord"
    ADMIN = "admin"

def create_user_model(db):
    """Create the User model dynamically to avoid circular imports."""
    class User(db.Model):
        __tablename__ = 'users'
        __table_args__ = {'extend_existing': True}

        id = db.Column(db.Integer, primary_key=True, autoincrement=True)
        username = db.Column(db.String(80), unique=True, nullable=False, index=True)
        email = db.Column(db.String(120), unique=True, nullable=False, index=True)
        password = db.Column(db.String(255), nullable=False)  # Hashed password
        role = db.Column(db.Enum(UserRole), nullable=False, default=UserRole.TENANT)
        created_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)

        def __init__(self, **kwargs):
            super(User, self).__init__(**kwargs)
            # Ensure default values are set
            if self.role is None:
                self.role = UserRole.TENANT
            if self.created_at is None:
                self.created_at = datetime.now(timezone.utc)

        def __repr__(self):
            return f'<User {self.username}>'

        def to_dict(self):
            return {
                'id': self.id,
                'username': self.username,
                'email': self.email,
                'role': self.role.value if self.role else None,
                'created_at': self.created_at.isoformat() if self.created_at else None
            }
    
    return User

# Create a placeholder class for imports
class User:
    """Placeholder User class for imports."""
    pass
