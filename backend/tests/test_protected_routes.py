import pytest
import json

def test_tenant_dashboard_access(client):
    """Test tenant dashboard access with tenant role."""
    # First register a tenant user
    register_data = {
        'username': 'tenantuser',
        'email': 'tenant@example.com',
        'password': 'password123',
        'role': 'tenant'
    }
    
    response = client.post('/auth/register', 
                          data=json.dumps(register_data),
                          content_type='application/json')
    
    assert response.status_code == 201
    response_data = json.loads(response.data)
    access_token = response_data['tokens']['access_token']
    
    # Access tenant dashboard
    headers = {'Authorization': f'Bearer {access_token}'}
    response = client.get('/dashboard/tenant', headers=headers)
    
    assert response.status_code == 200
    response_data = json.loads(response.data)
    
    assert response_data['message'] == 'Welcome to Tenant Dashboard'
    assert 'user' in response_data
    assert 'dashboard_data' in response_data
    assert 'available_actions' in response_data
    
    user = response_data['user']
    assert user['role'] == 'tenant'
    assert user['username'] == 'tenantuser'

def test_tenant_dashboard_denied_for_landlord(client):
    """Test tenant dashboard access denied for landlord role."""
    # First register a landlord user
    register_data = {
        'username': 'landlorduser',
        'email': 'landlord@example.com',
        'password': 'password123',
        'role': 'landlord'
    }
    
    response = client.post('/auth/register', 
                          data=json.dumps(register_data),
                          content_type='application/json')
    
    assert response.status_code == 201
    response_data = json.loads(response.data)
    access_token = response_data['tokens']['access_token']
    
    # Try to access tenant dashboard (should be denied)
    headers = {'Authorization': f'Bearer {access_token}'}
    response = client.get('/dashboard/tenant', headers=headers)
    
    assert response.status_code == 403
    response_data = json.loads(response.data)
    
    assert 'Insufficient permissions' in response_data['error']
    assert 'tenant' in response_data['required_roles']
    assert response_data['user_role'] == 'landlord'

def test_landlord_dashboard_access(client):
    """Test landlord dashboard access with landlord role."""
    # First register a landlord user
    register_data = {
        'username': 'landlorduser2',
        'email': 'landlord2@example.com',
        'password': 'password123',
        'role': 'landlord'
    }
    
    response = client.post('/auth/register', 
                          data=json.dumps(register_data),
                          content_type='application/json')
    
    assert response.status_code == 201
    response_data = json.loads(response.data)
    access_token = response_data['tokens']['access_token']
    
    # Access landlord dashboard
    headers = {'Authorization': f'Bearer {access_token}'}
    response = client.get('/dashboard/landlord', headers=headers)
    
    assert response.status_code == 200
    response_data = json.loads(response.data)
    
    assert response_data['message'] == 'Welcome to Landlord Dashboard'
    assert 'user' in response_data
    assert 'dashboard_data' in response_data
    assert 'available_actions' in response_data
    
    user = response_data['user']
    assert user['role'] == 'landlord'
    assert user['username'] == 'landlorduser2'
    
    dashboard_data = response_data['dashboard_data']
    assert 'properties' in dashboard_data
    assert 'total_properties' in dashboard_data
    assert 'monthly_revenue' in dashboard_data

def test_landlord_dashboard_denied_for_tenant(client):
    """Test landlord dashboard access denied for tenant role."""
    # First register a tenant user
    register_data = {
        'username': 'tenantuser2',
        'email': 'tenant2@example.com',
        'password': 'password123',
        'role': 'tenant'
    }
    
    response = client.post('/auth/register', 
                          data=json.dumps(register_data),
                          content_type='application/json')
    
    assert response.status_code == 201
    response_data = json.loads(response.data)
    access_token = response_data['tokens']['access_token']
    
    # Try to access landlord dashboard (should be denied)
    headers = {'Authorization': f'Bearer {access_token}'}
    response = client.get('/dashboard/landlord', headers=headers)
    
    assert response.status_code == 403
    response_data = json.loads(response.data)
    
    assert 'Insufficient permissions' in response_data['error']
    assert 'landlord' in response_data['required_roles']
    assert response_data['user_role'] == 'tenant'

def test_admin_dashboard_access(client):
    """Test admin dashboard access with admin role."""
    # First register an admin user
    register_data = {
        'username': 'adminuser',
        'email': 'admin@example.com',
        'password': 'password123',
        'role': 'admin'
    }
    
    response = client.post('/auth/register', 
                          data=json.dumps(register_data),
                          content_type='application/json')
    
    assert response.status_code == 201
    response_data = json.loads(response.data)
    access_token = response_data['tokens']['access_token']
    
    # Access admin dashboard
    headers = {'Authorization': f'Bearer {access_token}'}
    response = client.get('/dashboard/admin', headers=headers)
    
    assert response.status_code == 200
    response_data = json.loads(response.data)
    
    assert response_data['message'] == 'Welcome to Admin Dashboard'
    assert 'user' in response_data
    assert 'dashboard_data' in response_data
    assert 'available_actions' in response_data
    
    user = response_data['user']
    assert user['role'] == 'admin'
    assert user['username'] == 'adminuser'
    
    dashboard_data = response_data['dashboard_data']
    assert 'system_stats' in dashboard_data
    assert 'user_breakdown' in dashboard_data
    assert 'system_health' in dashboard_data

def test_admin_dashboard_denied_for_tenant(client):
    """Test admin dashboard access denied for tenant role."""
    # First register a tenant user
    register_data = {
        'username': 'tenantuser3',
        'email': 'tenant3@example.com',
        'password': 'password123',
        'role': 'tenant'
    }
    
    response = client.post('/auth/register', 
                          data=json.dumps(register_data),
                          content_type='application/json')
    
    assert response.status_code == 201
    response_data = json.loads(response.data)
    access_token = response_data['tokens']['access_token']
    
    # Try to access admin dashboard (should be denied)
    headers = {'Authorization': f'Bearer {access_token}'}
    response = client.get('/dashboard/admin', headers=headers)
    
    assert response.status_code == 403
    response_data = json.loads(response.data)
    
    assert 'Insufficient permissions' in response_data['error']
    assert 'admin' in response_data['required_roles']
    assert response_data['user_role'] == 'tenant'

def test_dashboard_access_without_token(client):
    """Test dashboard access without JWT token."""
    # Try to access tenant dashboard without token
    response = client.get('/dashboard/tenant')
    
    assert response.status_code == 401
    assert 'Missing Authorization Header' in response.data.decode()
    
    # Try to access landlord dashboard without token
    response = client.get('/dashboard/landlord')
    
    assert response.status_code == 401
    assert 'Missing Authorization Header' in response.data.decode()
    
    # Try to access admin dashboard without token
    response = client.get('/dashboard/admin')
    
    assert response.status_code == 401
    assert 'Missing Authorization Header' in response.data.decode()

def test_user_profile_access(client):
    """Test user profile access for any authenticated user."""
    # First register a tenant user
    register_data = {
        'username': 'profileuser',
        'email': 'profile@example.com',
        'password': 'password123',
        'role': 'tenant'
    }
    
    response = client.post('/auth/register', 
                          data=json.dumps(register_data),
                          content_type='application/json')
    
    assert response.status_code == 201
    response_data = json.loads(response.data)
    access_token = response_data['tokens']['access_token']
    
    # Access user profile
    headers = {'Authorization': f'Bearer {access_token}'}
    response = client.get('/dashboard/profile', headers=headers)
    
    assert response.status_code == 200
    response_data = json.loads(response.data)
    
    assert response_data['message'] == 'User profile retrieved successfully'
    assert 'profile' in response_data
    
    profile = response_data['profile']
    assert profile['username'] == 'profileuser'
    assert profile['role'] == 'tenant'
    assert 'permissions' in profile

def test_user_settings_get(client):
    """Test user settings retrieval."""
    # First register a user
    register_data = {
        'username': 'settingsuser',
        'email': 'settings@example.com',
        'password': 'password123',
        'role': 'landlord'
    }
    
    response = client.post('/auth/register', 
                          data=json.dumps(register_data),
                          content_type='application/json')
    
    assert response.status_code == 201
    response_data = json.loads(response.data)
    access_token = response_data['tokens']['access_token']
    
    # Get user settings
    headers = {'Authorization': f'Bearer {access_token}'}
    response = client.get('/dashboard/settings', headers=headers)
    
    assert response.status_code == 200
    response_data = json.loads(response.data)
    
    assert response_data['message'] == 'User settings retrieved successfully'
    assert 'settings' in response_data
    
    settings = response_data['settings']
    assert settings['username'] == 'settingsuser'
    assert settings['role'] == 'landlord'
    assert 'preferences' in settings

def test_user_settings_update(client):
    """Test user settings update."""
    # First register a user
    register_data = {
        'username': 'updateuser',
        'email': 'update@example.com',
        'password': 'password123',
        'role': 'admin'
    }
    
    response = client.post('/auth/register', 
                          data=json.dumps(register_data),
                          content_type='application/json')
    
    assert response.status_code == 201
    response_data = json.loads(response.data)
    access_token = response_data['tokens']['access_token']
    
    # Update user settings
    update_data = {
        'email_notifications': False,
        'language': 'es',
        'timezone': 'EST'
    }
    
    headers = {'Authorization': f'Bearer {access_token}'}
    response = client.put('/dashboard/settings', 
                         data=json.dumps(update_data),
                         content_type='application/json',
                         headers=headers)
    
    assert response.status_code == 200
    response_data = json.loads(response.data)
    
    assert response_data['message'] == 'User settings updated successfully'
    assert 'updated_settings' in response_data
    assert response_data['updated_settings'] == update_data

def test_health_check_endpoint(client):
    """Test health check endpoint."""
    # First register a user
    register_data = {
        'username': 'healthuser',
        'email': 'health@example.com',
        'password': 'password123',
        'role': 'tenant'
    }
    
    response = client.post('/auth/register', 
                          data=json.dumps(register_data),
                          content_type='application/json')
    
    assert response.status_code == 201
    response_data = json.loads(response.data)
    access_token = response_data['tokens']['access_token']
    
    # Access health check
    headers = {'Authorization': f'Bearer {access_token}'}
    response = client.get('/dashboard/health', headers=headers)
    
    assert response.status_code == 200
    response_data = json.loads(response.data)
    
    assert response_data['status'] == 'healthy'
    assert 'Protected routes are working correctly' in response_data['message']
    assert 'user' in response_data
    assert 'timestamp' in response_data

def test_role_permissions_functionality(client):
    """Test that role permissions are correctly returned."""
    # Test tenant permissions
    register_data = {
        'username': 'permissionuser',
        'email': 'permission@example.com',
        'password': 'password123',
        'role': 'tenant'
    }
    
    response = client.post('/auth/register', 
                          data=json.dumps(register_data),
                          content_type='application/json')
    
    assert response.status_code == 201
    response_data = json.loads(response.data)
    access_token = response_data['tokens']['access_token']
    
    # Get user profile to check permissions
    headers = {'Authorization': f'Bearer {access_token}'}
    response = client.get('/dashboard/profile', headers=headers)
    
    assert response.status_code == 200
    response_data = json.loads(response.data)
    
    profile = response_data['profile']
    permissions = profile['permissions']
    
    # Check tenant-specific permissions
    assert 'view_own_profile' in permissions
    assert 'submit_maintenance_requests' in permissions
    assert 'view_lease_documents' in permissions
    
    # Check that admin permissions are not included
    assert 'manage_all_users' not in permissions
    assert 'view_system_logs' not in permissions

def test_invalid_token_format(client):
    """Test behavior with invalid token format."""
    # Create an invalid token (not a real JWT)
    invalid_token = "invalid.token.format"
    
    headers = {'Authorization': f'Bearer {invalid_token}'}
    response = client.get('/dashboard/tenant', headers=headers)
    
    # Flask-JWT-Extended returns 422 for invalid token format
    assert response.status_code == 422

def test_missing_role_in_token(client):
    """Test behavior when token is missing role information."""
    # This test would require creating a custom token without role info
    # For now, we'll test the basic JWT requirement
    
    # Try to access dashboard without any token
    response = client.get('/dashboard/tenant')
    assert response.status_code == 401

def test_multiple_role_access(client):
    """Test access to routes that allow multiple roles."""
    # This would test the @role_required decorator with multiple roles
    # For now, we'll test that the decorator works with single roles
    
    # Register a tenant user
    register_data = {
        'username': 'multiuser',
        'email': 'multi@example.com',
        'password': 'password123',
        'role': 'tenant'
    }
    
    response = client.post('/auth/register', 
                          data=json.dumps(register_data),
                          content_type='application/json')
    
    assert response.status_code == 201
    response_data = json.loads(response.data)
    access_token = response_data['tokens']['access_token']
    
    # Access tenant dashboard (should work)
    headers = {'Authorization': f'Bearer {access_token}'}
    response = client.get('/dashboard/tenant', headers=headers)
    assert response.status_code == 200
    
    # Access landlord dashboard (should be denied)
    response = client.get('/dashboard/landlord', headers=headers)
    assert response.status_code == 403
