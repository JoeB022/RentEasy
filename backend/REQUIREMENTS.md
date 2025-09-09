# Requirements and Dependencies

This document explains the different requirements files and how to use them.

## Requirements Files

### `requirements.txt`
**Core dependencies for development and testing**
- Flask and related extensions
- Database ORM (SQLAlchemy)
- Authentication (JWT, bcrypt)
- Development tools (pytest, coverage)

**Install:**
```bash
pip install -r requirements.txt
```

### `requirements-prod.txt`
**Production dependencies including WSGI server and monitoring**
- **WSGI Server:** gunicorn
- **Database:** psycopg2-binary (PostgreSQL driver)
- **Logging:** loguru, sentry-sdk
- **Caching:** redis, Flask-Caching
- **Security:** Flask-Limiter, Flask-Talisman

**Install:**
```bash
pip install -r requirements-prod.txt
```

### `test_requirements.txt`
**Test-only dependencies**
- Testing framework (pytest, pytest-flask)
- Test utilities (requests, PyJWT)
- Includes base requirements

**Install:**
```bash
pip install -r test_requirements.txt
```

## Installation Commands

### Development Setup
```bash
# Install core dependencies
pip install -r requirements.txt

# Install test dependencies
pip install -r test_requirements.txt
```

### Production Setup
```bash
# Install all production dependencies
pip install -r requirements-prod.txt
```

### CI/CD Setup
```bash
# Install test dependencies for CI
pip install -r test_requirements.txt
```

## Dependency Categories

| Category | Files | Purpose |
|----------|-------|---------|
| **Core** | `requirements.txt` | Flask app, database, auth |
| **Production** | `requirements-prod.txt` | WSGI server, monitoring, security |
| **Testing** | `test_requirements.txt` | Test framework, test utilities |

## Version Pinning

All dependencies are pinned to specific versions for:
- **Reproducible builds**
- **Security** (known good versions)
- **Stability** (prevents breaking changes)

## Security Notes

- `psycopg2-binary` is used for production PostgreSQL support
- `sentry-sdk` provides error monitoring and performance tracking
- `Flask-Talisman` adds security headers
- `Flask-Limiter` provides rate limiting
- `redis` enables session storage and caching
