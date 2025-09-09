-- Database initialization script for RentEasy
-- This script runs when the PostgreSQL container starts

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create database if it doesn't exist (handled by POSTGRES_DB)
-- The database 'renteasy' will be created automatically

-- Set timezone
SET timezone = 'UTC';

-- Create a read-only user for monitoring
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'renteasy_readonly') THEN
        CREATE ROLE renteasy_readonly;
    END IF;
END
$$;

-- Grant connect permission
GRANT CONNECT ON DATABASE renteasy TO renteasy_readonly;

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO renteasy_readonly;

-- Grant select on all tables (will be applied after tables are created)
-- This will be handled by Alembic migrations

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO renteasy_readonly;

-- Log initialization
INSERT INTO pg_stat_statements_info (dealloc) VALUES (0) ON CONFLICT DO NOTHING;
