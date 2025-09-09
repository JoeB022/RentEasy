import pytest
import pytest
import json
from auth.utils import hash_password

@pytest.mark.unit
def test_register_success(client):
    """Test successful user registration."""
    data = {
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'password123',
        'role': 'tenant'
    }
    
    response = client.post('/auth/register', 
                          data=json.dumps(data),
                          content_type='application/json')
    
    assert response.status_code == 201
    response_data = json.loads(response.data)
    
    assert response_data['message'] == 'User registered successfully'
    assert 'user' in response_data
    assert 'tokens' in response_data
    
    user = response_data['user']
    assert user['username'] == 'testuser'
    assert user['email'] == 'test@example.com'
    assert user['role'] == 'tenant'
    assert 'id' in user
    assert 'created_at' in user
    
    tokens = response_data['tokens']
    assert 'access_token' in tokens
    assert 'refresh_token' in tokens

@pytest.mark.unit
def test_register_default_role(client):
    """Test user registration with default role (tenant)."""
    data = {
        'username': 'defaultuser',
        'email': 'default@example.com',
        'password': 'password123'
        # role not specified, should default to tenant
    }
    
    response = client.post('/auth/register', 
                          data=json.dumps(data),
                          content_type='application/json')
    
    assert response.status_code == 201
    response_data = json.loads(response.data)
    
    user = response_data['user']
    assert user['role'] == 'tenant'

@pytest.mark.unit
def test_register_admin_role(client):
    """Test user registration with admin role."""
    data = {
        'username': 'adminuser',
        'email': 'admin@example.com',
        'password': 'password123',
        'role': 'admin'
    }
    
    response = client.post('/auth/register', 
                          data=json.dumps(data),
                          content_type='application/json')
    
    assert response.status_code == 201
    response_data = json.loads(response.data)
    
    user = response_data['user']
    assert user['role'] == 'admin'

@pytest.mark.unit
def test_register_missing_fields(client):
    """Test registration with missing required fields."""
    # Missing username
    data = {
        'email': 'test@example.com',
        'password': 'password123'
    }
    
    response = client.post('/auth/register', 
                          data=json.dumps(data),
                          content_type='application/json')
    
    assert response.status_code == 400
    assert 'Missing required field: username' in response.data.decode()
    
    # Missing email
    data = {
        'username': 'testuser',
        'password': 'password123'
    }
    
    response = client.post('/auth/register', 
                          data=json.dumps(data),
                          content_type='application/json')
    
    assert response.status_code == 400
    assert 'Missing required field: email' in response.data.decode()
    
    # Missing password
    data = {
        'username': 'testuser',
        'email': 'test@example.com'
    }
    
    response = client.post('/auth/register', 
                          data=json.dumps(data),
                          content_type='application/json')
    
    assert response.status_code == 400
    assert 'Missing required field: password' in response.data.decode()

@pytest.mark.unit
def test_register_validation_errors(client):
    """Test registration validation errors."""
    # Username too short
    data = {
        'username': 'ab',  # Less than 3 characters
        'email': 'test@example.com',
        'password': 'password123'
    }
    
    response = client.post('/auth/register', 
                          data=json.dumps(data),
                          content_type='application/json')
    
    assert response.status_code == 400
    assert 'Username must be at least 3 characters long' in response.data.decode()
    
    # Invalid email format
    data = {
        'username': 'testuser',
        'email': 'invalid-email',
        'password': 'password123'
    }
    
    response = client.post('/auth/register', 
                          data=json.dumps(data),
                          content_type='application/json')
    
    assert response.status_code == 400
    assert 'Invalid email format' in response.data.decode()
    
    # Password too short
    data = {
        'username': 'testuser',
        'email': 'test@example.com',
        'password': '123'  # Less than 6 characters
    }
    
    response = client.post('/auth/register', 
                          data=json.dumps(data),
                          content_type='application/json')
    
    assert response.status_code == 400
    assert 'Password must be at least 6 characters long' in response.data.decode()
    
    # Invalid role
    data = {
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'password123',
        'role': 'invalid_role'
    }
    
    response = client.post('/auth/register', 
                          data=json.dumps(data),
                          content_type='application/json')
    
    assert response.status_code == 400
    assert 'Invalid role' in response.data.decode()

@pytest.mark.unit
def test_register_duplicate_username(client):
    """Test registration with duplicate username."""
    # First registration
    data = {
        'username': 'duplicateuser',
        'email': 'first@example.com',
        'password': 'password123'
    }
    
    response = client.post('/auth/register', 
                          data=json.dumps(data),
                          content_type='application/json')
    
    assert response.status_code == 201
    
    # Second registration with same username
    data = {
        'username': 'duplicateuser',
        'email': 'second@example.com',
        'password': 'password123'
    }
    
    response = client.post('/auth/register', 
                          data=json.dumps(data),
                          content_type='application/json')
    
    assert response.status_code == 409
    assert 'Username already exists' in response.data.decode()

@pytest.mark.unit
def test_register_duplicate_email(client):
    """Test registration with duplicate email."""
    # First registration
    data = {
        'username': 'firstuser',
        'email': 'duplicate@example.com',
        'password': 'password123'
    }
    
    response = client.post('/auth/register', 
                          data=json.dumps(data),
                          content_type='application/json')
    
    assert response.status_code == 201
    
    # Second registration with same email
    data = {
        'username': 'seconduser',
        'email': 'duplicate@example.com',
        'password': 'password123'
    }
    
    response = client.post('/auth/register', 
                          data=json.dumps(data),
                          content_type='application/json')
    
    assert response.status_code == 409
    assert 'Email already exists' in response.data.decode()

@pytest.mark.unit
def test_login_success(client):
    """Test successful user login."""
    # First register a user
    register_data = {
        'username': 'logintest',
        'email': 'login@example.com',
        'password': 'password123'
    }
    
    client.post('/auth/register', 
                data=json.dumps(register_data),
                content_type='application/json')
    
    # Then login
    login_data = {
        'username': 'logintest',
        'password': 'password123'
    }
    
    response = client.post('/auth/login', 
                          data=json.dumps(login_data),
                          content_type='application/json')
    
    assert response.status_code == 200
    response_data = json.loads(response.data)
    
    assert response_data['message'] == 'Login successful'
    assert 'user' in response_data
    assert 'tokens' in response_data
    
    user = response_data['user']
    assert user['username'] == 'logintest'
    assert user['email'] == 'login@example.com'
    
    tokens = response_data['tokens']
    assert 'access_token' in tokens
    assert 'refresh_token' in tokens

@pytest.mark.unit
def test_login_invalid_credentials(client):
    """Test login with invalid credentials."""
    # Wrong username
    data = {
        'username': 'nonexistent',
        'password': 'password123'
    }
    
    response = client.post('/auth/login', 
                          data=json.dumps(data),
                          content_type='application/json')
    
    assert response.status_code == 401
    assert 'Invalid credentials' in response.data.decode()
    
    # Wrong password
    data = {
        'username': 'testuser',
        'password': 'wrongpassword'
    }
    
    response = client.post('/auth/login', 
                          data=json.dumps(data),
                          content_type='application/json')
    
    assert response.status_code == 401
    assert 'Invalid credentials' in response.data.decode()

@pytest.mark.unit
def test_login_missing_fields(client):
    """Test login with missing fields."""
    # Missing username
    data = {
        'password': 'password123'
    }
    
    response = client.post('/auth/login', 
                          data=json.dumps(data),
                          content_type='application/json')
    
    assert response.status_code == 400
    assert 'Username and password are required' in response.data.decode()
    
    # Missing password
    data = {
        'username': 'testuser'
    }
    
    response = client.post('/auth/login', 
                          data=json.dumps(data),
                          content_type='application/json')
    
    assert response.status_code == 400
    assert 'Username and password are required' in response.data.decode()

@pytest.mark.unit
def test_get_profile_authenticated(client):
    """Test getting profile with valid JWT token."""
    # First register and login to get tokens
    register_data = {
        'username': 'profiletest',
        'email': 'profile@example.com',
        'password': 'password123'
    }
    
    response = client.post('/auth/register', 
                          data=json.dumps(register_data),
                          content_type='application/json')
    
    assert response.status_code == 201
    response_data = json.loads(response.data)
    access_token = response_data['tokens']['access_token']
    
    # Get profile using the token
    headers = {'Authorization': f'Bearer {access_token}'}
    response = client.get('/auth/me', headers=headers)
    
    assert response.status_code == 200
    response_data = json.loads(response.data)
    
    assert 'user' in response_data
    user = response_data['user']
    assert user['username'] == 'profiletest'
    assert user['email'] == 'profile@example.com'
    assert 'id' in user
    assert 'role' in user
    assert 'created_at' in user

@pytest.mark.unit
def test_get_profile_unauthenticated(client):
    """Test getting profile without JWT token."""
    response = client.get('/auth/me')
    
    assert response.status_code == 401
    assert 'Missing Authorization Header' in response.data.decode()

@pytest.mark.unit
def test_logout_authenticated(client):
    """Test logout with valid JWT token."""
    # First register and login to get tokens
    register_data = {
        'username': 'logouttest',
        'email': 'logout@example.com',
        'password': 'password123'
    }
    
    response = client.post('/auth/register', 
                          data=json.dumps(register_data),
                          content_type='application/json')
    
    assert response.status_code == 201
    response_data = json.loads(response.data)
    access_token = response_data['tokens']['access_token']
    
    # Logout using the token
    headers = {'Authorization': f'Bearer {access_token}'}
    response = client.post('/auth/logout', headers=headers)
    
    assert response.status_code == 200
    response_data = json.loads(response.data)
    assert 'logged out successfully' in response_data['message']

@pytest.mark.unit
def test_logout_unauthenticated(client):
    """Test logout without JWT token."""
    response = client.post('/auth/logout')
    
    assert response.status_code == 401
    assert 'Missing Authorization Header' in response.data.decode()

@pytest.mark.unit
def test_refresh_token(client):
    """Test token refresh functionality."""
    # First register and login to get tokens
    register_data = {
        'username': 'refreshtest',
        'email': 'refresh@example.com',
        'password': 'password123'
    }
    
    response = client.post('/auth/register', 
                          data=json.dumps(register_data),
                          content_type='application/json')
    
    assert response.status_code == 201
    response_data = json.loads(response.data)
    refresh_token = response_data['tokens']['refresh_token']
    
    # Refresh access token
    headers = {'Authorization': f'Bearer {refresh_token}'}
    response = client.post('/auth/refresh', headers=headers)
    
    assert response.status_code == 200
    response_data = json.loads(response.data)
    
    assert response_data['message'] == 'Token refreshed successfully'
    assert 'access_token' in response_data

@pytest.mark.unit
def test_validate_token(client):
    """Test token validation."""
    # First register and login to get tokens
    register_data = {
        'username': 'validatetest',
        'email': 'validate@example.com',
        'password': 'password123'
    }
    
    response = client.post('/auth/register', 
                          data=json.dumps(register_data),
                          content_type='application/json')
    
    assert response.status_code == 201
    response_data = json.loads(response.data)
    access_token = response_data['tokens']['access_token']
    
    # Validate token
    headers = {'Authorization': f'Bearer {access_token}'}
    response = client.post('/auth/validate', headers=headers)
    
    assert response.status_code == 200
    response_data = json.loads(response.data)
    
    assert response_data['valid'] is True
    assert 'user' in response_data
    user = response_data['user']
    assert user['username'] == 'validatetest'
    assert 'user_id' in user
    assert 'role' in user

@pytest.mark.unit
def test_register_no_data(client):
    """Test registration with no data."""
    response = client.post('/auth/register')
    
    assert response.status_code == 400
    assert 'Content-Type must be application/json' in response.data.decode()

@pytest.mark.unit
def test_login_no_data(client):
    """Test login with no data."""
    response = client.post('/auth/login')
    
    assert response.status_code == 400
    assert 'Content-Type must be application/json' in response.data.decode()
