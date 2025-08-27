"""
Authentication utility functions for password hashing and JWT token management.
"""

import bcrypt
import json
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token, create_refresh_token, decode_token
from flask_jwt_extended.exceptions import JWTExtendedException
from typing import Tuple, Optional, Dict, Any
from flask import current_app

def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt.
    
    Args:
        password (str): Plain text password to hash
        
    Returns:
        str: Hashed password string
    """
    if not password:
        raise ValueError("Password cannot be empty")
    
    # Generate salt and hash password
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(password: str, hashed_password: str) -> bool:
    """
    Verify a password against its hash.
    
    Args:
        password (str): Plain text password to verify
        hashed_password (str): Hashed password to check against
        
    Returns:
        bool: True if password matches, False otherwise
    """
    if not password or not hashed_password:
        return False
    
    try:
        # Check if password matches hash
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception:
        return False

def generate_tokens(user_id: int, username: str, role: str) -> Tuple[str, str]:
    """
    Generate access and refresh tokens for a user.
    
    Args:
        user_id (int): User's unique identifier
        username (str): User's username
        role (str): User's role
        
    Returns:
        Tuple[str, str]: (access_token, refresh_token)
    """
    # Create token identity as a JSON string (JWT subject must be a string)
    token_identity = json.dumps({
        'user_id': user_id,
        'username': username,
        'role': role
    })
    
    # Generate access token (short-lived)
    access_token = create_access_token(
        identity=token_identity,
        expires_delta=timedelta(hours=1)  # 1 hour
    )
    
    # Generate refresh token (long-lived)
    refresh_token = create_refresh_token(
        identity=token_identity,
        expires_delta=timedelta(days=30)  # 30 days
    )
    
    return access_token, refresh_token

def verify_access_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Verify and decode an access token.
    
    Args:
        token (str): JWT access token to verify
        
    Returns:
        Optional[Dict[str, Any]]: Decoded token payload if valid, None otherwise
    """
    try:
        # Decode the token
        decoded = decode_token(token)
        return decoded
    except JWTExtendedException:
        return None
    except Exception:
        return None

def verify_refresh_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Verify and decode a refresh token.
    
    Args:
        token (str): JWT refresh token to verify
        
    Returns:
        Optional[Dict[str, Any]]: Decoded token payload if valid, None otherwise
    """
    try:
        # Decode the refresh token
        decoded = decode_token(token)
        return decoded
    except JWTExtendedException:
        return None
    except Exception:
        return None

def refresh_access_token(refresh_token: str) -> Optional[str]:
    """
    Generate a new access token using a valid refresh token.
    
    Args:
        refresh_token (str): Valid refresh token
        
    Returns:
        Optional[str]: New access token if refresh token is valid, None otherwise
    """
    try:
        # Decode refresh token to get user info
        decoded = decode_token(refresh_token)
        user_info_str = decoded.get('sub', '{}')
        
        if not user_info_str:
            return None
        
        # Parse the user info from JSON string
        user_info = json.loads(user_info_str)
        
        # Generate new access token
        new_access_token = create_access_token(
            identity=user_info_str,
            expires_delta=timedelta(hours=1)
        )
        
        return new_access_token
    except JWTExtendedException:
        return None
    except Exception:
        return None

def get_token_expiration(token: str) -> Optional[datetime]:
    """
    Get the expiration time of a token.
    
    Args:
        token (str): JWT token to check
        
    Returns:
        Optional[datetime]: Expiration datetime if token is valid, None otherwise
    """
    try:
        decoded = decode_token(token)
        exp_timestamp = decoded.get('exp')
        if exp_timestamp:
            return datetime.fromtimestamp(exp_timestamp, tz=timezone.utc)
        return None
    except JWTExtendedException:
        return None
    except Exception:
        return None

def is_token_expired(token: str) -> bool:
    """
    Check if a token is expired.
    
    Args:
        token (str): JWT token to check
        
    Returns:
        bool: True if token is expired, False otherwise
    """
    expiration = get_token_expiration(token)
    if expiration is None:
        return True
    
    return datetime.now(timezone.utc) >= expiration

def get_user_info_from_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Extract user information from a decoded token.
    
    Args:
        token (str): JWT token to decode
        
    Returns:
        Optional[Dict[str, Any]]: User information if token is valid, None otherwise
    """
    try:
        decoded = verify_access_token(token)
        if decoded and 'sub' in decoded:
            user_info_str = decoded['sub']
            return json.loads(user_info_str)
        return None
    except Exception:
        return None
