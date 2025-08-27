import pytest
from app import db
from models.user import User, UserRole
import bcrypt

def test_user_model_creation(app):
    """Test that User model can be created and saved."""
    with app.app_context():
        # Create a test user
        user = User(
            username="testuser2",
            email="test2@example.com",
            password="hashedpassword",
            role=UserRole.LANDLORD
        )
        
        db.session.add(user)
        db.session.commit()
        
        # Verify user was saved
        saved_user = User.query.filter_by(username="testuser2").first()
        assert saved_user is not None
        assert saved_user.email == "test2@example.com"
        assert saved_user.role == UserRole.LANDLORD
        assert saved_user.id is not None
        
        # Clean up
        db.session.delete(saved_user)
        db.session.commit()

def test_user_role_enum(app):
    """Test that UserRole enum works correctly."""
    assert UserRole.TENANT.value == "tenant"
    assert UserRole.LANDLORD.value == "landlord"
    assert UserRole.ADMIN.value == "admin"

def test_user_to_dict(app):
    """Test that User.to_dict() method works correctly."""
    with app.app_context():
        user = User(
            username="dictuser",
            email="dict@example.com",
            password="password",
            role=UserRole.ADMIN
        )
        
        user_dict = user.to_dict()
        assert user_dict['username'] == "dictuser"
        assert user_dict['email'] == "dict@example.com"
        assert user_dict['role'] == "admin"
        assert 'password' not in user_dict  # Password should not be included
        assert 'created_at' in user_dict

def test_user_unique_constraints(app):
    """Test that username and email uniqueness constraints work."""
    with app.app_context():
        # Create first user
        user1 = User(
            username="uniqueuser",
            email="unique@example.com",
            password="password",
            role=UserRole.TENANT
        )
        db.session.add(user1)
        db.session.commit()
        
        # Try to create second user with same username
        user2 = User(
            username="uniqueuser",  # Same username
            email="different@example.com",
            password="password",
            role=UserRole.TENANT
        )
        db.session.add(user2)
        
        # This should raise an integrity error
        with pytest.raises(Exception):
            db.session.commit()
        
        db.session.rollback()
        
        # Try to create second user with same email
        user3 = User(
            username="differentuser",
            email="unique@example.com",  # Same email
            password="password",
            role=UserRole.TENANT
        )
        db.session.add(user3)
        
        # This should also raise an integrity error
        with pytest.raises(Exception):
            db.session.commit()
        
        db.session.rollback()
        
        # Clean up
        db.session.delete(user1)
        db.session.commit()

def test_user_default_values(app):
    """Test that User model has correct default values."""
    with app.app_context():
        user = User(
            username="defaultuser",
            email="default@example.com",
            password="password"
            # role and created_at should have defaults
        )
        
        assert user.role == UserRole.TENANT
        assert user.created_at is not None

def test_database_connection(app):
    """Test that database connection is working."""
    with app.app_context():
        # This should not raise an error
        result = db.session.execute(db.text('SELECT 1')).scalar()
        assert result == 1
