# RentEasy Backend

A Flask-based backend API for the RentEasy application.

## Setup

1. **Create and activate virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**
   Create a `.env` file in the backend directory with the following variables:
   ```
   FLASK_ENV=development
   FLASK_DEBUG=1
   DATABASE_URL=sqlite:///app.db
   SECRET_KEY=your-secret-key-here
   JWT_SECRET_KEY=your-jwt-secret-key-here
   FRONTEND_URL=http://localhost:5173
   ```

## Running the Application

**Development mode:**
```bash
python app.py
```

The server will start on `http://localhost:8000`

## API Endpoints

### Authentication Routes (`/auth`)

#### POST `/auth/register`
Register a new user.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "tenant|landlord|admin" (optional, defaults to tenant)
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "string",
    "email": "string",
    "role": "string",
    "created_at": "2025-08-27T14:00:00"
  },
  "tokens": {
    "access_token": "string",
    "refresh_token": "string"
  }
}
```

#### POST `/auth/login`
Authenticate user and get JWT tokens.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "string",
    "email": "string",
    "role": "string",
    "created_at": "2025-08-27T14:00:00"
  },
  "tokens": {
    "access_token": "string",
    "refresh_token": "string"
  }
}
```

#### GET `/auth/me`
Get current user's profile (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "username": "string",
    "email": "string",
    "role": "string",
    "created_at": "2025-08-27T14:00:00"
  }
}
```

#### POST `/auth/logout`
Logout user (requires authentication).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "message": "User username logged out successfully"
}
```

#### POST `/auth/refresh`
Refresh access token using refresh token.

**Headers:**
```
Authorization: Bearer <refresh_token>
```

**Response (200):**
```json
{
  "message": "Token refreshed successfully",
  "access_token": "string"
}
```

#### POST `/auth/validate`
Validate current access token.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "valid": true,
  "user": {
    "user_id": 1,
    "username": "string",
    "role": "string"
  }
}
```

### Protected Routes (`/dashboard`)

All dashboard routes require valid JWT authentication and appropriate role permissions.

#### GET `/dashboard/tenant`
**Access:** Tenant role only

Tenant dashboard with rental information and available actions.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "message": "Welcome to Tenant Dashboard",
  "user": {
    "id": 1,
    "username": "string",
    "role": "tenant"
  },
  "dashboard_data": {
    "rental_history": [...],
    "current_rent": "$1,200/month",
    "next_payment": "2025-09-01",
    "maintenance_requests": 2,
    "notifications": 5
  },
  "available_actions": [
    "View rental history",
    "Submit maintenance request",
    "Update profile",
    "View lease documents"
  ]
}
```

#### GET `/dashboard/landlord`
**Access:** Landlord role only

Landlord dashboard with property management and financial information.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "message": "Welcome to Landlord Dashboard",
  "user": {
    "id": 1,
    "username": "string",
    "role": "landlord"
  },
  "dashboard_data": {
    "properties": [...],
    "total_properties": 2,
    "total_units": 20,
    "overall_occupancy": "95%",
    "monthly_revenue": "$27,200",
    "pending_applications": 3,
    "maintenance_requests": 7
  },
  "available_actions": [
    "Manage properties",
    "View tenant applications",
    "Handle maintenance requests",
    "Generate financial reports",
    "Add new properties"
  ]
}
```

#### GET `/dashboard/admin`
**Access:** Admin role only

Admin dashboard with system-wide statistics and management tools.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "message": "Welcome to Admin Dashboard",
  "user": {
    "id": 1,
    "username": "string",
    "role": "admin"
  },
  "dashboard_data": {
    "system_stats": {
      "total_users": 156,
      "total_properties": 89,
      "active_rentals": 134,
      "pending_approvals": 12
    },
    "user_breakdown": {
      "tenants": 98,
      "landlords": 45,
      "admins": 3
    },
    "system_health": {
      "database": "Healthy",
      "api_uptime": "99.9%",
      "last_backup": "2025-08-27 02:00:00"
    }
  },
  "available_actions": [
    "Manage all users",
    "View system logs",
    "Generate system reports",
    "Manage system settings",
    "Monitor system health",
    "Backup database"
  ]
}
```

#### GET `/dashboard/profile`
**Access:** Any authenticated user

Get current user's profile with role-based permissions.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "message": "User profile retrieved successfully",
  "profile": {
    "user_id": 1,
    "username": "string",
    "role": "string",
    "permissions": [
      "view_own_profile",
      "submit_maintenance_requests",
      "view_lease_documents"
    ]
  }
}
```

#### GET/PUT `/dashboard/settings`
**Access:** Any authenticated user

Get or update user settings and preferences.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "message": "User settings retrieved successfully",
  "settings": {
    "user_id": 1,
    "username": "string",
    "role": "string",
    "preferences": {
      "email_notifications": true,
      "sms_notifications": false,
      "language": "en",
      "timezone": "UTC"
    }
  }
}
```

#### GET `/dashboard/health`
**Access:** Any authenticated user

Health check endpoint for protected routes.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "status": "healthy",
  "message": "Protected routes are working correctly",
  "user": {
    "user_id": 1,
    "username": "string",
    "role": "string"
  },
  "timestamp": "2025-08-27T14:00:00Z"
}
```

### Error Responses

All endpoints return consistent error responses:

**400 Bad Request:**
```json
{
  "error": "Error description"
}
```

**401 Unauthorized:**
```json
{
  "error": "Authentication required"
}
```

**403 Forbidden:**
```json
{
  "error": "Insufficient permissions",
  "required_roles": ["admin"],
  "user_role": "tenant"
}
```

**409 Conflict:**
```json
{
  "error": "Username already exists"
}
```

**422 Unprocessable Entity:**
```json
{
  "error": "Invalid token format"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Operation failed",
  "details": "Error details"
}
```

## Database Setup

**Initialize migrations (first time only):**
```bash
flask db init
```

**Create a new migration:**
```bash
flask db migrate -m "Description of changes"
```

**Apply migrations:**
```bash
flask db upgrade
```

**Rollback migrations:**
```bash
flask db downgrade
```

**View migration history:**
```bash
flask db history
```

## Database Models

### User Model
- **id**: Primary key (auto-increment)
- **username**: Unique username (80 chars, indexed)
- **email**: Unique email (120 chars, indexed)
- **password**: Hashed password (255 chars)
- **role**: User role (tenant/landlord/admin)
- **created_at**: Timestamp of account creation

### User Roles
- `TENANT`: Regular tenant user
- `LANDLORD`: Property owner/landlord
- `ADMIN`: System administrator

## Authentication System

### Password Management
- **Password Hashing**: Uses bcrypt for secure password storage
- **Password Verification**: Secure comparison of hashed passwords
- **Salt Generation**: Automatic salt generation for each password

### JWT Token Management
- **Access Tokens**: Short-lived (1 hour) for API access
- **Refresh Tokens**: Long-lived (30 days) for token renewal
- **Token Verification**: Secure token validation and decoding
- **User Information**: Encoded user data (ID, username, role) in tokens

### Auth Utilities
```python
from auth.utils import (
    hash_password,           # Hash a password
    verify_password,         # Verify password against hash
    generate_tokens,         # Generate access + refresh tokens
    verify_access_token,     # Verify access token
    verify_refresh_token,    # Verify refresh token
    refresh_access_token,    # Generate new access token
    get_user_info_from_token # Extract user info from token
)
```

## Database Utilities

**Initialize database:**
```bash
python db_utils.py init
```

**Create a test user:**
```bash
python db_utils.py create <username> <email> <password> [role]
```

**List all users:**
```bash
python db_utils.py list
```

**Verify user password:**
```bash
python db_utils.py verify <username> <password>
```

**Drop database (WARNING: destroys all data):**
```bash
python db_utils.py drop
```

## Testing

**Run all tests:**
```bash
python -m pytest tests/ -v
```

**Run tests with coverage:**
```bash
python -m pytest tests/ --cov=. --cov-report=term-missing --cov-report=html
```

**Use the test runner script:**
```bash
python run_tests.py
```

**Test coverage:**
- HTML coverage report is generated in the `htmlcov/` directory
- Current coverage: **75%** for core application code
- **80 tests** passing successfully

## Project Structure

- `app.py` - Main Flask application with extensions initialization
- `config.py` - Configuration classes for different environments
- `models/` - Database models (SQLAlchemy)
  - `user.py` - User model with authentication fields
  - `__init__.py` - Models package initialization
- `auth/` - Authentication utilities
  - `utils.py` - Password hashing and JWT token management
  - `__init__.py` - Auth package initialization
- `routes/` - API route handlers
  - `auth.py` - Authentication endpoints (register, login, logout, profile)
  - `protected.py` - Role-based protected routes (tenant/landlord/admin dashboards)
  - `__init__.py` - Routes package initialization
- `migrations/` - Database migration files (Alembic)
- `requirements.txt` - Python dependencies
- `db_utils.py` - Database utility functions
- `tests/` - Test suite
  - `conftest.py` - Test configuration and fixtures
  - `test_app.py` - Application tests
  - `test_config.py` - Configuration tests
  - `test_extensions.py` - Extension tests
  - `test_database.py` - Database and model tests
  - `test_auth.py` - Authentication utility tests
  - `test_auth_routes.py` - Authentication route tests
  - `test_protected_routes.py` - Protected route tests with role-based access control

## Extensions

- **Flask-SQLAlchemy** - Database ORM
- **Flask-Migrate** - Database migrations (Alembic)
- **Flask-JWT-Extended** - JWT authentication
- **Flask-CORS** - Cross-origin resource sharing
- **bcrypt** - Password hashing

## Database

The application uses SQLite by default in development. Database migrations are managed using Flask-Migrate (Alembic).

### Migration Commands
- `flask db init` - Initialize migrations directory
- `flask db migrate` - Create new migration
- `flask db upgrade` - Apply pending migrations
- `flask db downgrade` - Rollback last migration
- `flask db history` - View migration history
- `flask db current` - Show current migration version

## Test Configuration

Tests use an in-memory SQLite database and separate configuration to avoid interfering with development data.

## Security Features

- **Password Security**: bcrypt hashing with salt
- **JWT Security**: Signed tokens with expiration
- **Token Refresh**: Secure token renewal system
- **Input Validation**: Proper validation of authentication inputs
- **Error Handling**: Secure error responses without information leakage
- **Role-Based Access**: User roles (tenant/landlord/admin) for authorization
- **Request Validation**: JSON content-type validation and input sanitization
