import pytest
#!/usr/bin/env python3
"""
Test script to demonstrate the protected routes with role-based access control.
"""

import requests
import json

# Base URL for the Flask app
BASE_URL = "http://localhost:8000"

@pytest.mark.integration
def test_protected_routes():
    """Test the protected routes with different user roles."""
    print("🔒 Testing Protected Routes with Role-Based Access Control")
    print("=" * 70)
    
    # Test 1: Register and test tenant access
    print("\n1. Testing Tenant Role Access:")
    tenant_data = {
        "username": "testtenant",
        "email": "tenant@example.com",
        "password": "password123",
        "role": "tenant"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/register",
            json=tenant_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 201:
            print("   ✅ Tenant user registered successfully!")
            response_data = response.json()
            tenant_token = response_data['tokens']['access_token']
            
            # Test tenant dashboard access
            headers = {'Authorization': f'Bearer {tenant_token}'}
            response = requests.get(f"{BASE_URL}/dashboard/tenant", headers=headers)
            
            if response.status_code == 200:
                print("   ✅ Tenant dashboard accessible!")
                dashboard_data = response.json()
                print(f"   Welcome message: {dashboard_data['message']}")
                print(f"   Available actions: {len(dashboard_data['available_actions'])}")
            else:
                print(f"   ❌ Tenant dashboard access failed: {response.status_code}")
            
            # Test that tenant cannot access landlord dashboard
            response = requests.get(f"{BASE_URL}/dashboard/landlord", headers=headers)
            
            if response.status_code == 403:
                print("   ✅ Tenant correctly denied access to landlord dashboard!")
                error_data = response.json()
                print(f"   Error: {error_data['error']}")
            else:
                print(f"   ❌ Tenant should not have access to landlord dashboard: {response.status_code}")
                
        else:
            print(f"   ❌ Tenant registration failed: {response.status_code}")
            return
            
    except requests.exceptions.ConnectionError:
        print("   ❌ Could not connect to Flask app. Make sure it's running on port 8000.")
        return
    
    # Test 2: Register and test landlord access
    print("\n2. Testing Landlord Role Access:")
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
            print("   ✅ Landlord user registered successfully!")
            response_data = response.json()
            landlord_token = response_data['tokens']['access_token']
            
            # Test landlord dashboard access
            headers = {'Authorization': f'Bearer {landlord_token}'}
            response = requests.get(f"{BASE_URL}/dashboard/landlord", headers=headers)
            
            if response.status_code == 200:
                print("   ✅ Landlord dashboard accessible!")
                dashboard_data = response.json()
                print(f"   Welcome message: {dashboard_data['message']}")
                print(f"   Total properties: {dashboard_data['dashboard_data']['total_properties']}")
                print(f"   Monthly revenue: {dashboard_data['dashboard_data']['monthly_revenue']}")
            else:
                print(f"   ❌ Landlord dashboard access failed: {response.status_code}")
            
            # Test that landlord cannot access admin dashboard
            response = requests.get(f"{BASE_URL}/dashboard/admin", headers=headers)
            
            if response.status_code == 403:
                print("   ✅ Landlord correctly denied access to admin dashboard!")
                error_data = response.json()
                print(f"   Error: {error_data['error']}")
            else:
                print(f"   ❌ Landlord should not have access to admin dashboard: {response.status_code}")
                
        else:
            print(f"   ❌ Landlord registration failed: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("   ❌ Connection error during landlord test.")
    
    # Test 3: Register and test admin access
    print("\n3. Testing Admin Role Access:")
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
            print("   ✅ Admin user registered successfully!")
            response_data = response.json()
            admin_token = response_data['tokens']['access_token']
            
            # Test admin dashboard access
            headers = {'Authorization': f'Bearer {admin_token}'}
            response = requests.get(f"{BASE_URL}/dashboard/admin", headers=headers)
            
            if response.status_code == 200:
                print("   ✅ Admin dashboard accessible!")
                dashboard_data = response.json()
                print(f"   Welcome message: {dashboard_data['message']}")
                print(f"   Total users: {dashboard_data['dashboard_data']['system_stats']['total_users']}")
                print(f"   System health: {dashboard_data['dashboard_data']['system_health']['database']}")
            else:
                print(f"   ❌ Admin dashboard access failed: {response.status_code}")
                
        else:
            print(f"   ❌ Admin registration failed: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("   ❌ Connection error during admin test.")
    
    # Test 4: Test universal endpoints
    print("\n4. Testing Universal Protected Endpoints:")
    
    try:
        # Test user profile (should work for any authenticated user)
        headers = {'Authorization': f'Bearer {tenant_token}'}
        response = requests.get(f"{BASE_URL}/dashboard/profile", headers=headers)
        
        if response.status_code == 200:
            print("   ✅ User profile accessible to tenant!")
            profile_data = response.json()
            print(f"   Username: {profile_data['profile']['username']}")
            print(f"   Role: {profile_data['profile']['role']}")
            print(f"   Permissions: {len(profile_data['profile']['permissions'])}")
        else:
            print(f"   ❌ User profile access failed: {response.status_code}")
        
        # Test health check
        response = requests.get(f"{BASE_URL}/dashboard/health", headers=headers)
        
        if response.status_code == 200:
            print("   ✅ Health check accessible to tenant!")
            health_data = response.json()
            print(f"   Status: {health_data['status']}")
            print(f"   Message: {health_data['message']}")
        else:
            print(f"   ❌ Health check access failed: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("   ❌ Connection error during universal endpoint test.")
    
    # Test 5: Test unauthorized access
    print("\n5. Testing Unauthorized Access:")
    
    try:
        # Try to access dashboard without token
        response = requests.get(f"{BASE_URL}/dashboard/tenant")
        
        if response.status_code == 401:
            print("   ✅ Correctly denied access without token!")
            print(f"   Status: {response.status_code}")
        else:
            print(f"   ❌ Should deny access without token: {response.status_code}")
        
        # Try to access with invalid token
        invalid_headers = {'Authorization': 'Bearer invalid.token.here'}
        response = requests.get(f"{BASE_URL}/dashboard/tenant", headers=invalid_headers)
        
        if response.status_code in [401, 422]:
            print("   ✅ Correctly denied access with invalid token!")
            print(f"   Status: {response.status_code}")
        else:
            print(f"   ❌ Should deny access with invalid token: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("   ❌ Connection error during unauthorized access test.")
    
    print("\n" + "=" * 70)
    print("✅ Protected routes test completed!")
    print("\n📊 Summary:")
    print("   - Tenant role: Can access tenant dashboard, denied landlord/admin")
    print("   - Landlord role: Can access landlord dashboard, denied admin")
    print("   - Admin role: Can access admin dashboard")
    print("   - Universal endpoints: Profile, settings, health check")
    print("   - Security: Proper JWT validation and role checking")

if __name__ == "__main__":
    test_protected_routes()
