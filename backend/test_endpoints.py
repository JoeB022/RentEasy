#!/usr/bin/env python3
"""
Test script to test all endpoints without circular import issues.
"""

import requests
import json
import time

# Base URL for the Flask app
BASE_URL = "http://localhost:8000"

def test_endpoints():
    """Test all endpoints systematically."""
    print("🔒 Testing All Endpoints")
    print("=" * 50)
    
    # Wait for app to be ready
    print("Waiting for Flask app to be ready...")
    for i in range(10):
        try:
            response = requests.get(f"{BASE_URL}/dashboard/health", timeout=2)
            if response.status_code in [401, 422]:  # Expected for unauthenticated access
                print("✅ App is responding!")
                break
        except requests.exceptions.RequestException:
            print(f"Attempt {i+1}/10: App not ready yet...")
            time.sleep(2)
    else:
        print("❌ App is not responding after 20 seconds")
        return
    
    print("\n1. Testing Health Endpoint Without Auth (should fail):")
    try:
        response = requests.get(f"{BASE_URL}/dashboard/health")
        print(f"   Status: {response.status_code}")
        if response.status_code in [401, 422]:
            print("   ✅ Correctly denied access without token")
        else:
            print("   ❌ Should have denied access")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print("\n2. Testing User Registration:")
    register_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "password123",
        "role": "tenant"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/register",
            json=register_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"   Status: {response.status_code}")
        if response.status_code == 201:
            print("   ✅ User registered successfully!")
            response_data = response.json()
            access_token = response_data['tokens']['access_token']
            refresh_token = response_data['tokens']['refresh_token']
            print(f"   User ID: {response_data['user']['id']}")
            print(f"   Role: {response_data['user']['role']}")
        else:
            print(f"   ❌ Registration failed: {response.text}")
            return
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return
    
    print("\n3. Testing User Login:")
    login_data = {
        "username": "testuser",
        "password": "password123"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json=login_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print("   ✅ Login successful!")
            response_data = response.json()
            print(f"   Welcome back, {response_data['user']['username']}!")
        else:
            print(f"   ❌ Login failed: {response.text}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print("\n4. Testing Protected Routes with Token:")
    headers = {'Authorization': f'Bearer {access_token}'}
    
    # Test tenant dashboard
    print("\n   4a. Testing Tenant Dashboard:")
    try:
        response = requests.get(f"{BASE_URL}/dashboard/tenant", headers=headers)
        print(f"      Status: {response.status_code}")
        if response.status_code == 200:
            print("      ✅ Tenant dashboard accessible!")
            dashboard_data = response.json()
            print(f"      Message: {dashboard_data['message']}")
        else:
            print(f"      ❌ Tenant dashboard failed: {response.text}")
    except Exception as e:
        print(f"      ❌ Error: {e}")
    
    # Test landlord dashboard (should be denied for tenant)
    print("\n   4b. Testing Landlord Dashboard (should be denied for tenant):")
    try:
        response = requests.get(f"{BASE_URL}/dashboard/landlord", headers=headers)
        print(f"      Status: {response.status_code}")
        if response.status_code == 403:
            print("      ✅ Correctly denied access to landlord dashboard!")
            error_data = response.json()
            print(f"      Error: {error_data['error']}")
        else:
            print(f"      ❌ Should have denied access: {response.text}")
    except Exception as e:
        print(f"      ❌ Error: {e}")
    
    # Test admin dashboard (should be denied for tenant)
    print("\n   4c. Testing Admin Dashboard (should be denied for tenant):")
    try:
        response = requests.get(f"{BASE_URL}/dashboard/admin", headers=headers)
        print(f"      Status: {response.status_code}")
        if response.status_code == 403:
            print("      ✅ Correctly denied access to admin dashboard!")
            error_data = response.json()
            print(f"      Error: {error_data['error']}")
        else:
            print(f"      ❌ Should have denied access: {response.text}")
    except Exception as e:
        print(f"      ❌ Error: {e}")
    
    # Test universal endpoints
    print("\n   4d. Testing Universal Protected Endpoints:")
    
    # Test profile
    try:
        response = requests.get(f"{BASE_URL}/dashboard/profile", headers=headers)
        print(f"      Profile Status: {response.status_code}")
        if response.status_code == 200:
            print("      ✅ Profile accessible!")
            profile_data = response.json()
            print(f"      Username: {profile_data['profile']['username']}")
            print(f"      Permissions: {len(profile_data['profile']['permissions'])}")
        else:
            print(f"      ❌ Profile failed: {response.text}")
    except Exception as e:
        print(f"      ❌ Profile Error: {e}")
    
    # Test health check
    try:
        response = requests.get(f"{BASE_URL}/dashboard/health", headers=headers)
        print(f"      Health Status: {response.status_code}")
        if response.status_code == 200:
            print("      ✅ Health check accessible!")
            health_data = response.json()
            print(f"      Status: {health_data['status']}")
        else:
            print(f"      ❌ Health check failed: {response.text}")
    except Exception as e:
        print(f"      ❌ Health Error: {e}")
    
    print("\n5. Testing Role-Based Access Control:")
    
    # Register a landlord user
    print("\n   5a. Registering Landlord User:")
    landlord_data = {
        "username": "testlandlord",
        "email": "landlord@example.com",
        "password": "password123",
        "role": "landlord"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/register",
            json=landlord_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 201:
            print("      ✅ Landlord registered successfully!")
            landlord_response = response.json()
            landlord_token = landlord_response['tokens']['access_token']
            
            # Test landlord dashboard access
            landlord_headers = {'Authorization': f'Bearer {landlord_token}'}
            response = requests.get(f"{BASE_URL}/dashboard/landlord", headers=landlord_headers)
            
            if response.status_code == 200:
                print("      ✅ Landlord dashboard accessible!")
                dashboard_data = response.json()
                print(f"      Total properties: {dashboard_data['dashboard_data']['total_properties']}")
            else:
                print(f"      ❌ Landlord dashboard failed: {response.text}")
                
            # Test that landlord cannot access admin dashboard
            response = requests.get(f"{BASE_URL}/dashboard/admin", headers=landlord_headers)
            
            if response.status_code == 403:
                print("      ✅ Landlord correctly denied access to admin dashboard!")
            else:
                print(f"      ❌ Landlord should not have admin access: {response.status_code}")
                
        else:
            print(f"      ❌ Landlord registration failed: {response.text}")
    except Exception as e:
        print(f"      ❌ Error: {e}")
    
    # Register an admin user
    print("\n   5b. Registering Admin User:")
    admin_data = {
        "username": "testadmin",
        "email": "admin@example.com",
        "password": "password123",
        "role": "admin"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/register",
            json=admin_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 201:
            print("      ✅ Admin registered successfully!")
            admin_response = response.json()
            admin_token = admin_response['tokens']['access_token']
            
            # Test admin dashboard access
            admin_headers = {'Authorization': f'Bearer {admin_token}'}
            response = requests.get(f"{BASE_URL}/dashboard/admin", headers=admin_headers)
            
            if response.status_code == 200:
                print("      ✅ Admin dashboard accessible!")
                dashboard_data = response.json()
                print(f"      Total users: {dashboard_data['dashboard_data']['system_stats']['total_users']}")
            else:
                print(f"      ❌ Admin dashboard failed: {response.text}")
                
        else:
            print(f"      ❌ Admin registration failed: {response.text}")
    except Exception as e:
        print(f"      ❌ Error: {e}")
    
    print("\n6. Testing Token Validation:")
    try:
        response = requests.post(f"{BASE_URL}/auth/validate", headers=headers)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print("   ✅ Token validation successful!")
            validation_data = response.json()
            print(f"   Token valid: {validation_data['valid']}")
        else:
            print(f"   ❌ Token validation failed: {response.text}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print("\n7. Testing Token Refresh:")
    try:
        refresh_headers = {'Authorization': f'Bearer {refresh_token}'}
        response = requests.post(f"{BASE_URL}/auth/refresh", headers=refresh_headers)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print("   ✅ Token refresh successful!")
            refresh_data = response.json()
            print(f"   New access token generated!")
        else:
            print(f"   ❌ Token refresh failed: {response.text}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print("\n8. Testing Logout:")
    try:
        response = requests.post(f"{BASE_URL}/auth/logout", headers=headers)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print("   ✅ Logout successful!")
            logout_data = response.json()
            print(f"   Message: {logout_data['message']}")
        else:
            print(f"   ❌ Logout failed: {response.text}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print("\n" + "=" * 50)
    print("✅ Endpoint testing completed!")
    print("\n📊 Summary:")
    print("   - Authentication: Register, Login, Logout")
    print("   - Protected Routes: Role-based access control")
    print("   - Token Management: Validation and refresh")
    print("   - Security: Proper JWT validation and role checking")

if __name__ == "__main__":
    test_endpoints()
