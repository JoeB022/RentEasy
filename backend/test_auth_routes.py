#!/usr/bin/env python3
"""
Simple test script to demonstrate the auth routes working.
"""

import requests
import json

# Base URL for the Flask app
BASE_URL = "http://localhost:8000"

def test_auth_routes():
    """Test the authentication routes."""
    print("🔐 Testing Auth Routes")
    print("=" * 50)
    
    # Test 1: Register a new user
    print("\n1. Testing User Registration:")
    register_data = {
        "username": "testuser123",
        "email": "test123@example.com",
        "password": "password123",
        "role": "tenant"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/register",
            json=register_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 201:
            print("   ✅ Registration successful!")
            response_data = response.json()
            print(f"   User ID: {response_data['user']['id']}")
            print(f"   Username: {response_data['user']['username']}")
            print(f"   Role: {response_data['user']['role']}")
            
            # Store tokens for later use
            access_token = response_data['tokens']['access_token']
            refresh_token = response_data['tokens']['refresh_token']
            
        else:
            print(f"   ❌ Registration failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return
            
    except requests.exceptions.ConnectionError:
        print("   ❌ Could not connect to Flask app. Make sure it's running on port 8000.")
        return
    
    # Test 2: Login with the registered user
    print("\n2. Testing User Login:")
    login_data = {
        "username": "testuser123",
        "password": "password123"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json=login_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            print("   ✅ Login successful!")
            response_data = response.json()
            print(f"   Welcome back, {response_data['user']['username']}!")
            
        else:
            print(f"   ❌ Login failed: {response.status_code}")
            print(f"   Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("   ❌ Connection error during login test.")
    
    # Test 3: Get user profile (requires authentication)
    print("\n3. Testing Profile Retrieval:")
    try:
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
        
        if response.status_code == 200:
            print("   ✅ Profile retrieved successfully!")
            response_data = response.json()
            user = response_data['user']
            print(f"   Username: {user['username']}")
            print(f"   Email: {user['email']}")
            print(f"   Role: {user['role']}")
            
        else:
            print(f"   ❌ Profile retrieval failed: {response.status_code}")
            print(f"   Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("   ❌ Connection error during profile test.")
    
    # Test 4: Validate token
    print("\n4. Testing Token Validation:")
    try:
        response = requests.post(
            f"{BASE_URL}/auth/validate",
            headers=headers
        )
        
        if response.status_code == 200:
            print("   ✅ Token validation successful!")
            response_data = response.json()
            print(f"   Token is valid: {response_data['valid']}")
            
        else:
            print(f"   ❌ Token validation failed: {response.status_code}")
            print(f"   Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("   ❌ Connection error during token validation test.")
    
    # Test 5: Refresh token
    print("\n5. Testing Token Refresh:")
    try:
        refresh_headers = {
            "Authorization": f"Bearer {refresh_token}",
            "Content-Type": "application/json"
        }
        
        response = requests.post(
            f"{BASE_URL}/auth/refresh",
            headers=refresh_headers
        )
        
        if response.status_code == 200:
            print("   ✅ Token refresh successful!")
            response_data = response.json()
            print(f"   New access token generated!")
            
        else:
            print(f"   ❌ Token refresh failed: {response.status_code}")
            print(f"   Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("   ❌ Connection error during token refresh test.")
    
    # Test 6: Logout
    print("\n6. Testing Logout:")
    try:
        response = requests.post(
            f"{BASE_URL}/auth/logout",
            headers=headers
        )
        
        if response.status_code == 200:
            print("   ✅ Logout successful!")
            response_data = response.json()
            print(f"   Message: {response_data['message']}")
            
        else:
            print(f"   ❌ Logout failed: {response.status_code}")
            print(f"   Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("   ❌ Connection error during logout test.")
    
    print("\n" + "=" * 50)
    print("✅ Auth routes test completed!")

if __name__ == "__main__":
    test_auth_routes()
