# SQLite to PostgreSQL Migration Plan

This document outlines the migration strategy from SQLite to PostgreSQL for the RentEasy Backend.

## Overview

The application has been refactored to support both SQLite (development/testing) and PostgreSQL (production). This migration plan covers moving from SQLite to PostgreSQL in production environments.

## Migration Options

### Option 1: pg_dump/pg_restore (Recommended)

**Pros:**
- Simple and reliable
- Preserves data integrity
- Built-in PostgreSQL tools
- Handles schema and data migration

**Cons:**
- Requires manual data export from SQLite
- May need data transformation

**Steps:**
1. **Export SQLite data:**
   ```bash
   # Export schema and data from SQLite
   sqlite3 app.db .schema > schema.sql
   sqlite3 app.db .dump > data.sql
   ```

2. **Transform data for PostgreSQL:**
   ```bash
   # Convert SQLite dump to PostgreSQL format
   sed -i 's/INTEGER PRIMARY KEY AUTOINCREMENT/SERIAL PRIMARY KEY/g' schema.sql
   sed -i 's/DATETIME DEFAULT CURRENT_TIMESTAMP/TIMESTAMP DEFAULT CURRENT_TIMESTAMP/g' schema.sql
   ```

3. **Import to PostgreSQL:**
   ```bash
   # Create database
   createdb renteasy
   
   # Import schema
   psql -d renteasy -f schema.sql
   
   # Import data
   psql -d renteasy -f data.sql
   ```

### Option 2: pgloader (Automated)

**Pros:**
- Fully automated migration
- Handles data type conversions
- Built-in error handling
- Supports incremental migration

**Cons:**
- Requires additional tool installation
- May need configuration tuning

**Steps:**
1. **Install pgloader:**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install pgloader
   
   # macOS
   brew install pgloader
   ```

2. **Create migration script:**
   ```lisp
   ;; migrate.load
   LOAD DATABASE
       FROM sqlite:///path/to/app.db
       INTO postgresql://user:password@localhost/renteasy
   
   WITH include drop, create tables, create indexes, reset sequences
   
   SET work_mem to '256MB',
       maintenance_work_mem to '512 MB';
   ```

3. **Run migration:**
   ```bash
   pgloader migrate.load
   ```

### Option 3: Custom Python Script

**Pros:**
- Full control over data transformation
- Can handle complex business logic
- Easy to customize and debug

**Cons:**
- Requires custom development
- More time-consuming

**Example script:**
```python
#!/usr/bin/env python3
"""
Custom migration script from SQLite to PostgreSQL
"""
import sqlite3
import psycopg2
from datetime import datetime

def migrate_users():
    # Connect to SQLite
    sqlite_conn = sqlite3.connect('app.db')
    sqlite_cursor = sqlite_conn.cursor()
    
    # Connect to PostgreSQL
    pg_conn = psycopg2.connect(
        host='localhost',
        database='renteasy',
        user='renteasy',
        password='password'
    )
    pg_cursor = pg_conn.cursor()
    
    # Migrate users table
    sqlite_cursor.execute('SELECT * FROM users')
    users = sqlite_cursor.fetchall()
    
    for user in users:
        pg_cursor.execute("""
            INSERT INTO users (id, username, email, password, role, created_at)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT (id) DO NOTHING
        """, user)
    
    pg_conn.commit()
    sqlite_conn.close()
    pg_conn.close()

if __name__ == '__main__':
    migrate_users()
```

## Pre-Migration Checklist

- [ ] **Backup SQLite database:**
  ```bash
  cp app.db app.db.backup.$(date +%Y%m%d_%H%M%S)
  ```

- [ ] **Verify PostgreSQL is running:**
  ```bash
  sudo systemctl status postgresql
  ```

- [ ] **Create PostgreSQL database:**
  ```bash
  createdb renteasy
  ```

- [ ] **Test connection:**
  ```bash
  psql -d renteasy -c "SELECT version();"
  ```

- [ ] **Update environment variables:**
  ```bash
  export DATABASE_URL="postgresql://renteasy:password@localhost:5432/renteasy"
  ```

## Migration Steps

### 1. Prepare Environment

```bash
# Set production environment
export FLASK_ENV=production
export DATABASE_URL="postgresql://renteasy:password@localhost:5432/renteasy"

# Install production dependencies
pip install -r requirements-prod.txt
```

### 2. Run Database Migrations

```bash
# Initialize migrations for PostgreSQL
python run_cli.py cli setup-db --init

# Apply migrations
python run_cli.py cli setup-db --upgrade
```

### 3. Migrate Data

Choose one of the migration options above (recommended: pgloader).

### 4. Verify Migration

```bash
# Check database status
python run_cli.py cli status

# Verify data integrity
python run_cli.py cli list-users

# Test application
curl http://localhost:8000/healthz
```

### 5. Update Application Configuration

```bash
# Update .env file
echo "DATABASE_URL=postgresql://renteasy:password@localhost:5432/renteasy" >> .env
echo "REDIS_URL=redis://localhost:6379/0" >> .env
```

## Post-Migration Tasks

- [ ] **Update monitoring:**
  - Configure PostgreSQL monitoring
  - Set up database backup procedures
  - Update health checks

- [ ] **Performance tuning:**
  - Analyze query performance
  - Create appropriate indexes
  - Configure connection pooling

- [ ] **Security hardening:**
  - Review database permissions
  - Enable SSL connections
  - Configure firewall rules

## Rollback Plan

If migration fails:

1. **Stop application:**
   ```bash
   sudo systemctl stop renteasy-backend
   ```

2. **Restore SQLite:**
   ```bash
   cp app.db.backup.* app.db
   export DATABASE_URL="sqlite:///app.db"
   ```

3. **Restart application:**
   ```bash
   sudo systemctl start renteasy-backend
   ```

## Monitoring and Validation

### Database Health Checks

```bash
# Check PostgreSQL status
psql -d renteasy -c "SELECT pg_database_size('renteasy');"

# Check application health
curl http://localhost:8000/healthz

# Check database connectivity
python run_cli.py cli status
```

### Performance Monitoring

```sql
-- Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Check database size
SELECT pg_size_pretty(pg_database_size('renteasy'));

-- Check active connections
SELECT count(*) FROM pg_stat_activity WHERE datname = 'renteasy';
```

## Troubleshooting

### Common Issues

1. **Connection refused:**
   - Check PostgreSQL service status
   - Verify connection parameters
   - Check firewall settings

2. **Authentication failed:**
   - Verify username/password
   - Check pg_hba.conf configuration
   - Ensure user has proper permissions

3. **Data type errors:**
   - Check for SQLite-specific data types
   - Verify schema compatibility
   - Review migration logs

### Support Commands

```bash
# Check PostgreSQL logs
sudo journalctl -u postgresql -f

# Check application logs
tail -f /var/log/renteasy/backend.log

# Test database connection
psql -h localhost -U renteasy -d renteasy -c "SELECT 1;"
```

## Timeline

- **Preparation:** 1-2 hours
- **Migration:** 30 minutes - 2 hours (depending on data size)
- **Verification:** 30 minutes
- **Monitoring:** Ongoing

## Success Criteria

- [ ] All data migrated successfully
- [ ] Application starts without errors
- [ ] Health checks pass
- [ ] Performance meets requirements
- [ ] Monitoring is in place
- [ ] Rollback plan is tested
