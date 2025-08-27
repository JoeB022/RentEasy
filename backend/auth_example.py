#!/usr/bin/env python3
"""
Example script demonstrating the authentication utilities.
"""

from app import app
from auth.utils import (
    hash_password,
    verify_password,
    generate_tokens,
    verify_access_token,
    get_user_info_from_token
)

def demonstrate_auth_utilities():
    """Demonstrate the authentication utilities."""
    print("🔐 Authentication Utilities Demo")
    print("=" * 50)
    
    with app.app_context():
        # 1. Password Hashing
        print("\n1. Password Hashing:")
        password = "mySecurePassword123"
        hashed_password = hash_password(password)
        print(f"   Original password: {password}")
        print(f"   Hashed password: {hashed_password[:20]}...")
        
        # 2. Password Verification
        print("\n2. Password Verification:")
        is_correct = verify_password(password, hashed_password)
        is_wrong = verify_password("wrongPassword", hashed_password)
        print(f"   Correct password: {is_correct}")
        print(f"   Wrong password: {is_wrong}")
        
        # 3. JWT Token Generation
        print("\n3. JWT Token Generation:")
        user_id = 123
        username = "john_doe"
        role = "landlord"
        
        access_token, refresh_token = generate_tokens(user_id, username, role)
        print(f"   User: {username} (ID: {user_id}, Role: {role})")
        print(f"   Access token: {access_token[:30]}...")
        print(f"   Refresh token: {refresh_token[:30]}...")
        
        # 4. Token Verification
        print("\n4. Token Verification:")
        decoded_token = verify_access_token(access_token)
        if decoded_token:
            print(f"   Token is valid: ✅")
            print(f"   Token payload keys: {list(decoded_token.keys())}")
        else:
            print(f"   Token is invalid: ❌")
        
        # 5. Extract User Information
        print("\n5. Extract User Information:")
        user_info = get_user_info_from_token(access_token)
        if user_info:
            print(f"   User ID: {user_info.get('user_id')}")
            print(f"   Username: {user_info.get('username')}")
            print(f"   Role: {user_info.get('role')}")
        else:
            print(f"   Could not extract user info: ❌")
        
        # 6. Invalid Token Handling
        print("\n6. Invalid Token Handling:")
        invalid_token = "invalid.token.here"
        invalid_decoded = verify_access_token(invalid_token)
        print(f"   Invalid token result: {invalid_decoded}")
        
        print("\n" + "=" * 50)
        print("✅ Demo completed successfully!")

if __name__ == "__main__":
    demonstrate_auth_utilities()
