import pytest
#!/usr/bin/env python3
"""
Comprehensive authentication and authorization tests for Flask + SQLAlchemy backend.
Tests user registration, login, JWT validation, role-based access control, and database migrations.
"""

import pytest
import requests
import json
import jwt
import bcrypt
from datetime import datetime, timedelta
import sqlite3
import os
import subprocess
import time

# Test configuration
BASE_URL = "http://localhost:8000"  # Updated to match your backend port
TEST_DB_PATH = "test_auth.db"

class TestAuthFlow:
    """Test class for authentication flow testing."""
    
    @pytest.fixture(autouse=True)
    def setup_and_teardown(self):
        """Setup and teardown for each test."""
        # Setup: Ensure clean test database
        self.setup_test_database()
        yield
        # Teardown: Clean up test database
        self.cleanup_test_database()
    
    def setup_test_database(self):
        """Setup test database with migrations."""
        try:
            # Set environment variables for testing
            os.environ['FLASK_APP'] = 'app_simple.py'
            os.environ['FLASK_ENV'] = 'test'
            
            # Run database migrations
            print("Setting up test database...")
            subprocess.run([
                'flask', 'db', 'migrate', '-m', 'test_migration'
            ], capture_output=True, text=True, cwd='.')
            
            subprocess.run([
                'flask', 'db', 'upgrade'
            ], capture_output=True, text=True, cwd='.')
            
            print("Database migrations completed.")
            
        except Exception as e:
            print(f"Warning: Could not run migrations: {e}")
            print("Tests will continue with existing database structure.")
    
    def cleanup_test_database(self):
        """Clean up test database."""
        try:
            if os.path.exists(TEST_DB_PATH):
                os.remove(TEST_DB_PATH)
        except Exception as e:
            print(f"Warning: Could not clean up test database: {e}")
    
    def test_1_register_user_tenant(self):
        """Test 1: Register a user with tenant role and verify password hashing."""
        print("\n=== Test 1: User Registration ===")
        
        # Test data
        user_data = {
            "username": "testtenant",
            "email": "tenant@test.com",
            "password": "testpassword123",
            "role": "tenant"
        }
        
        # Make registration request
        response = requests.post(
            f"{BASE_URL}/auth/register",
            json=user_data,
            headers={"Content-Type": "application/json"}
        )
        
        # Assertions
        assert response.status_code == 201, f"Expected 201, got {response.status_code}: {response.text}"
        
        response_data = response.json()
        assert "message" in response_data
        assert response_data["message"] == "User registered successfully"
        assert "user" in response_data
        assert "tokens" in response_data
        
        # Verify user data
        user = response_data["user"]
        assert user["username"] == "testtenant"
        assert user["email"] == "tenant@test.com"
        assert user["role"] == "tenant"
        assert "id" in user
        assert "created_at" in user
        
        # Verify tokens
        tokens = response_data["tokens"]
        assert "access_token" in tokens
        assert "refresh_token" in tokens
        
        # Verify password is hashed in database
        self.verify_password_is_hashed(user_data["password"])
        
        print("✅ User registration successful - password properly hashed")
        
        # Store user data for subsequent tests
        self.test_user = user
        self.test_tokens = tokens
        
        return user, tokens
    
    def verify_password_is_hashed(self, raw_password):
        """Verify that password is stored hashed in the database."""
        try:
            # Connect to database and check password
            conn = sqlite3.connect("instance/test.db")  # Use the actual database path
            cursor = conn.cursor()
            
            cursor.execute("SELECT password FROM users WHERE username = ?", ("testtenant",))
            result = cursor.fetchone()
            
            if result:
                stored_password = result[0]
                # Password should NOT be equal to raw input
                assert stored_password != raw_password, "Password is not hashed!"
                
                # Verify it's a valid bcrypt hash
                assert stored_password.startswith('$2b$'), "Password is not a valid bcrypt hash!"
                
                # Verify we can check the password
                assert bcrypt.checkpw(raw_password.encode('utf-8'), stored_password.encode('utf-8')), \
                    "Stored hash cannot verify the original password!"
                
                print("✅ Password verification successful - hash is valid")
            else:
                pytest.fail("User not found in database")
                
            conn.close()
            
        except Exception as e:
            pytest.fail(f"Database verification failed: {e}")
    
    def test_2_login_user(self):
        """Test 2: Login with the new user and verify JWT token."""
        print("\n=== Test 2: User Login ===")
        
        # First register a user if not already done
        if not hasattr(self, 'test_user'):
            self.test_user, self.test_tokens = self.test_1_register_user_tenant()
        
        # Login data
        login_data = {
            "username": "testtenant",
            "password": "testpassword123"
        }
        
        # Make login request
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json=login_data,
            headers={"Content-Type": "application/json"}
        )
        
        # Assertions
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        response_data = response.json()
        assert "message" in response_data
        assert response_data["message"] == "Login successful"
        assert "tokens" in response_data
        
        # Verify tokens
        tokens = response_data["tokens"]
        assert "access_token" in tokens
        assert "refresh_token" in tokens
        
        # Store new tokens
        self.access_token = tokens["access_token"]
        self.refresh_token = tokens["refresh_token"]
        
        # Verify JWT token structure and decode
        self.verify_jwt_token(tokens["access_token"])
        
        print("✅ User login successful - JWT token valid")
        
        return tokens
    
    def verify_jwt_token(self, token):
        """Verify JWT token structure and decode to check role."""
        try:
            # Decode token without verification (for testing purposes)
            # In production, you'd verify the signature
            decoded = jwt.decode(token, options={"verify_signature": False})
            
            # Check token structure
            assert "sub" in decoded, "Token missing 'sub' claim"
            assert "exp" in decoded, "Token missing 'exp' claim"
            assert "iat" in decoded, "Token missing 'iat' claim"
            
            # Decode the subject (user info)
            user_info = json.loads(decoded["sub"])
            assert "user_id" in user_info, "Token missing user_id"
            assert "username" in user_info, "Token missing username"
            assert "role" in user_info, "Token missing role"
            
            # Verify role is encoded correctly
            assert user_info["role"] == "tenant", f"Expected role 'tenant', got '{user_info['role']}'"
            assert user_info["username"] == "testtenant", f"Expected username 'testtenant', got '{user_info['username']}'"
            
            print(f"✅ JWT token decoded successfully - Role: {user_info['role']}")
            
        except Exception as e:
            pytest.fail(f"JWT token verification failed: {e}")
    
    def test_3_auth_me_endpoint(self):
        """Test 3: Call /auth/me with JWT token."""
        print("\n=== Test 3: /auth/me Endpoint ===")
        
        # Ensure we have a valid token
        if not hasattr(self, 'access_token'):
            self.test_2_login_user()
        
        # Make request to /auth/me
        headers = {"Authorization": f"Bearer {self.access_token}"}
        response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
        
        # Assertions
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        response_data = response.json()
        assert "user" in response_data
        
        user = response_data["user"]
        assert user["username"] == "testtenant"
        assert user["email"] == "tenant@test.com"
        assert user["role"] == "tenant"
        assert "id" in user
        assert "created_at" in user
        
        print("✅ /auth/me endpoint working correctly")
        
        return response_data
    
    def test_4_role_based_access_control(self):
        """Test 4: Test role-based access control."""
        print("\n=== Test 4: Role-Based Access Control ===")
        
        # Ensure we have a valid token
        if not hasattr(self, 'access_token'):
            self.test_2_login_user()
        
        headers = {"Authorization": f"Bearer {self.access_token}"}
        
        # Test 4a: Access tenant dashboard (should succeed)
        print("Testing tenant dashboard access...")
        response = requests.get(f"{BASE_URL}/dashboard/tenant", headers=headers)
        assert response.status_code == 200, f"Expected 200 for tenant dashboard, got {response.status_code}"
        
        response_data = response.json()
        assert "message" in response_data
        assert "Welcome to Tenant Dashboard" in response_data["message"]
        print("✅ Tenant dashboard access successful")
        
        # Test 4b: Try to access admin dashboard (should return 403)
        print("Testing admin dashboard access (should fail)...")
        response = requests.get(f"{BASE_URL}/dashboard/admin", headers=headers)
        assert response.status_code == 403, f"Expected 403 for admin dashboard, got {response.status_code}"
        
        response_data = response.json()
        assert "error" in response_data
        assert "Insufficient permissions" in response_data["error"]
        print("✅ Admin dashboard access correctly denied (403)")
        
        # Test 4c: Try to access landlord dashboard (should return 403)
        print("Testing landlord dashboard access (should fail)...")
        response = requests.get(f"{BASE_URL}/dashboard/landlord", headers=headers)
        assert response.status_code == 403, f"Expected 403 for landlord dashboard, got {response.status_code}"
        
        response_data = response.json()
        assert "error" in response_data
        assert "Insufficient permissions" in response_data["error"]
        print("✅ Landlord dashboard access correctly denied (403)")
        
        print("✅ Role-based access control working correctly")
    
    def test_5_unauthorized_access(self):
        """Test 5: Test access to protected routes without token."""
        print("\n=== Test 5: Unauthorized Access ===")
        
        # Test access without Authorization header
        response = requests.get(f"{BASE_URL}/dashboard/tenant")
        assert response.status_code == 401, f"Expected 401 for unauthorized access, got {response.status_code}"
        
        response_data = response.json()
        assert "msg" in response_data
        assert "Missing Authorization Header" in response_data["msg"]
        
        # Test with invalid token
        headers = {"Authorization": "Bearer invalid_token"}
        response = requests.get(f"{BASE_URL}/dashboard/tenant", headers=headers)
        assert response.status_code == 422, f"Expected 422 for invalid token, got {response.status_code}"
        
        print("✅ Unauthorized access correctly handled")
    
    def test_6_database_migrations(self):
        """Test 6: Confirm database migrations are working."""
        print("\n=== Test 6: Database Migrations ===")
        
        try:
            # Check if database file exists
            db_path = "instance/test.db"
            assert os.path.exists(db_path), f"Database file not found at {db_path}"
            
            # Connect to database and check tables
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            
            # Get list of tables
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
            tables = [row[0] for row in cursor.fetchall()]
            
            # Check required tables exist
            required_tables = ['users', 'alembic_version']
            for table in required_tables:
                assert table in tables, f"Required table '{table}' not found. Found: {tables}"
            
            # Check users table structure
            cursor.execute("PRAGMA table_info(users);")
            columns = {row[1]: row[2] for row in cursor.fetchall()}
            
            expected_columns = {
                'id': 'INTEGER',
                'username': 'VARCHAR',
                'email': 'VARCHAR',
                'password': 'VARCHAR',
                'role': 'VARCHAR',
                'created_at': 'DATETIME'
            }
            
            for col, expected_type in expected_columns.items():
                assert col in columns, f"Column '{col}' not found in users table"
                # Check if type contains expected type (allowing for length specifications)
                assert expected_type in columns[col], f"Column '{col}' has type '{columns[col]}', expected '{expected_type}'"
            
            # Check if we can query the users table
            cursor.execute("SELECT COUNT(*) FROM users;")
            user_count = cursor.fetchone()[0]
            print(f"✅ Users table accessible - {user_count} users found")
            
            conn.close()
            
            print("✅ Database migrations working correctly - all tables and columns present")
            
        except Exception as e:
            pytest.fail(f"Database migration test failed: {e}")
    
    def test_7_complete_workflow(self):
        """Test 7: Complete authentication workflow test."""
        print("\n=== Test 7: Complete Workflow Test ===")
        
        # Run all the individual tests in sequence
        user, tokens = self.test_1_register_user_tenant()
        login_tokens = self.test_2_login_user()
        profile = self.test_3_auth_me_endpoint()
        self.test_4_role_based_access_control()
        self.test_5_unauthorized_access()
        self.test_6_database_migrations()
        
        print("✅ Complete authentication workflow test passed!")
        
        return {
            'user': user,
            'tokens': tokens,
            'login_tokens': login_tokens,
            'profile': profile
        }


@pytest.mark.unit
def test_backend_health_check():
    """Test if backend is running and responding."""
    print("\n=== Backend Health Check ===")
    
    try:
        response = requests.get(f"{BASE_URL}/dashboard/health", timeout=5)
        if response.status_code == 401:
            print("✅ Backend is running (401 expected for unauthenticated access)")
            return True
        elif response.status_code == 200:
            print("✅ Backend is running and accessible")
            return True
        else:
            print(f"⚠️ Backend responded with unexpected status: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Backend is not running or not accessible")
        pytest.fail("Backend is not running. Please start the Flask app first.")
    except Exception as e:
        print(f"❌ Backend health check failed: {e}")
        pytest.fail(f"Backend health check failed: {e}")


if __name__ == "__main__":
    # Run tests directly if script is executed
    pytest.main([__file__, "-v", "-s"])
