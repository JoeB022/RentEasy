# RentEasy Backend CLI Commands

This document describes the Flask CLI management commands available for the RentEasy backend.

## Usage

All commands are run through the `run_cli.py` script:

```bash
# Activate virtual environment
source venv/bin/activate

# Run commands
python run_cli.py cli <command> [options]
```

## Available Commands

### 1. Status Command
Show current database and application status.

```bash
python run_cli.py cli status
```

**Output:**
- Database URI and environment
- Migration status
- User count (total and admins)
- Database health status

### 2. Create Admin Command
Create an admin user with specified credentials.

```bash
python run_cli.py cli create-admin --email admin@example.com --password secret123
```

**Options:**
- `--email` (required): Admin email address
- `--password` (required): Admin password
- `--username`: Admin username (defaults to email prefix)
- `--force`: Force creation even if admin exists

**Features:**
- Automatically hashes password
- Prevents duplicate emails (unless --force)
- Updates existing admin if found
- Shows user details after creation

### 3. Setup Database Command
Setup database with migrations and upgrades.

```bash
python run_cli.py cli setup-db --init --upgrade
```

**Options:**
- `--init`: Initialize migrations if not exists
- `--message`: Migration message (default: "Auto-generated migration")
- `--upgrade`: Run migrations after creating

**Features:**
- Creates migration directory if needed
- Generates migration files
- Runs database upgrades
- Shows current migration status

### 4. Cleanup Command
Cleanup database and test data with safety checks.

```bash
python run_cli.py cli cleanup --drop-test-data
```

**Options:**
- `--drop-test-data`: Drop test data (requires CONFIRM env var in production)
- `--reset-migrations`: Reset all migrations (DANGEROUS)
- `--drop-all`: Drop all tables (DANGEROUS)

**Safety Features:**
- Production safety checks (requires CONFIRM env var)
- Test data detection (emails ending in @test.*, @example.com, usernames starting with 'test')
- Confirmation prompts for dangerous operations
- Environment-specific restrictions

### 5. List Users Command
List users in the database with filtering options.

```bash
python run_cli.py cli list-users --role admin
```

**Options:**
- `--email`: Filter by email (partial match)
- `--role`: Filter by role (admin, landlord, tenant)

**Output:**
- Tabular format with ID, username, email, role, and creation date
- User count summary

### 6. Delete User Command
Delete a user from the database.

```bash
python run_cli.py cli delete-user --email user@example.com
```

**Options:**
- `--user-id`: User ID to delete
- `--email`: Email of user to delete
- `--username`: Username of user to delete
- `--force`: Force deletion without confirmation

**Safety Features:**
- Confirmation prompt (unless --force)
- Multiple identification methods
- Clear success/error messages

## Environment Support

### Development
- Uses SQLite database
- No special environment variables required
- Full command access

### Testing
- Uses in-memory SQLite
- Commands work with test database
- Safe for CI/CD pipelines

### Production
- Uses PostgreSQL database
- Requires CONFIRM env var for cleanup operations
- Additional safety checks and warnings

## Examples

### Initial Setup
```bash
# 1. Check status
python run_cli.py cli status

# 2. Setup database migrations
python run_cli.py cli setup-db --init --upgrade

# 3. Create admin user
python run_cli.py cli create-admin --email admin@example.com --password secret123

# 4. Verify setup
python run_cli.py cli list-users
```

### Daily Operations
```bash
# Check system status
python run_cli.py cli status

# List all users
python run_cli.py cli list-users

# List only admins
python run_cli.py cli list-users --role admin

# Clean up test data
python run_cli.py cli cleanup --drop-test-data
```

### Production Maintenance
```bash
# Set confirmation for production cleanup
export CONFIRM=true

# Clean up test data in production
python run_cli.py cli cleanup --drop-test-data

# Create additional admin
python run_cli.py cli create-admin --email admin2@company.com --password secure123
```

## Error Handling

All commands include comprehensive error handling:
- Database connection errors
- Invalid input validation
- Permission checks
- Rollback on failures
- Clear error messages with suggestions

## Logging

Commands use structured logging:
- INFO level for normal operations
- ERROR level for failures
- WARNING level for safety notices
- Request ID tracking for debugging
