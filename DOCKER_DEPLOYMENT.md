# Docker Deployment Guide

This guide covers deploying RentEasy Backend using Docker and Docker Compose.

## Quick Start

1. **Clone and setup environment:**
   ```bash
   git clone <repository-url>
   cd RentEasy-2
   cp .env.example .env
   # Edit .env with your production values
   ```

2. **Start all services:**
   ```bash
   docker-compose up -d
   ```

3. **Initialize database:**
   ```bash
   docker-compose exec web python run_cli.py cli setup-db --init --upgrade
   ```

4. **Create admin user:**
   ```bash
   docker-compose exec web python run_cli.py cli create-admin --email admin@example.com --password your-password
   ```

## Environment Configuration

Create a `.env` file in the project root with the following variables:

```bash
# Security (REQUIRED)
SECRET_KEY=your-super-secret-key-change-this-in-production
JWT_SECRET_KEY=your-jwt-secret-key-change-this-in-production

# Database
POSTGRES_PASSWORD=your-postgres-password
DATABASE_URL=postgresql://renteasy:your-postgres-password@postgres:5432/renteasy

# Redis
REDIS_PASSWORD=your-redis-password
REDIS_URL=redis://:your-redis-password@redis:6379/0

# Frontend
FRONTEND_URL=http://localhost:3000

# Optional
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=INFO
```

## Services

### Core Services
- **web**: RentEasy Backend API (port 8000)
- **postgres**: PostgreSQL database (port 5432)
- **redis**: Redis cache (port 6379)

### Management Tools (optional)
- **pgadmin**: Database management UI (port 5050)
- **redis-commander**: Redis management UI (port 8081)

To start with management tools:
```bash
docker-compose --profile tools up -d
```

## Docker Commands

### Build and start
```bash
# Build and start all services
docker-compose up -d --build

# Start specific services
docker-compose up -d postgres redis web

# View logs
docker-compose logs -f web
docker-compose logs -f postgres
```

### Database management
```bash
# Run migrations
docker-compose exec web python run_cli.py cli setup-db --upgrade

# Create admin user
docker-compose exec web python run_cli.py cli create-admin --email admin@example.com --password secret123

# Check status
docker-compose exec web python run_cli.py cli status
```

### Health checks
```bash
# Check service health
curl http://localhost:8000/healthz

# Check readiness
curl http://localhost:8000/health/ready

# Check liveness
curl http://localhost:8000/health/live
```

## Production Deployment

### Using Docker Compose

1. **Set production environment variables:**
   ```bash
   export FLASK_ENV=production
   export SECRET_KEY=your-production-secret
   export JWT_SECRET_KEY=your-production-jwt-secret
   export POSTGRES_PASSWORD=your-secure-postgres-password
   export REDIS_PASSWORD=your-secure-redis-password
   ```

2. **Start services:**
   ```bash
   docker-compose up -d
   ```

3. **Initialize database:**
   ```bash
   docker-compose exec web python run_cli.py cli setup-db --init --upgrade
   ```

### Using systemd (non-container)

1. **Install systemd service:**
   ```bash
   sudo cp renteasy-backend.service /etc/systemd/system/
   sudo systemctl daemon-reload
   sudo systemctl enable renteasy-backend
   ```

2. **Start service:**
   ```bash
   sudo systemctl start renteasy-backend
   sudo systemctl status renteasy-backend
   ```

## Monitoring

### Health Endpoints
- `/healthz` - Comprehensive health check with metrics
- `/health/ready` - Kubernetes readiness probe
- `/health/live` - Kubernetes liveness probe
- `/health/metrics` - Detailed metrics for monitoring

### Logs
```bash
# View application logs
docker-compose logs -f web

# View database logs
docker-compose logs -f postgres

# View Redis logs
docker-compose logs -f redis
```

## Troubleshooting

### Common Issues

1. **Database connection failed:**
   ```bash
   # Check if postgres is running
   docker-compose ps postgres
   
   # Check postgres logs
   docker-compose logs postgres
   ```

2. **Redis connection failed:**
   ```bash
   # Check if redis is running
   docker-compose ps redis
   
   # Check redis logs
   docker-compose logs redis
   ```

3. **Application won't start:**
   ```bash
   # Check application logs
   docker-compose logs web
   
   # Check environment variables
   docker-compose exec web env | grep -E "(SECRET_KEY|DATABASE_URL|REDIS_URL)"
   ```

### Debug Mode

To run in debug mode:
```bash
# Override environment
docker-compose run --rm -e FLASK_ENV=development web python app.py
```

## Security Considerations

1. **Change default passwords** in production
2. **Use strong secrets** for SECRET_KEY and JWT_SECRET_KEY
3. **Enable SSL/TLS** for production deployments
4. **Restrict network access** to database and Redis
5. **Regular security updates** for base images

## Scaling

### Horizontal Scaling
```bash
# Scale web service
docker-compose up -d --scale web=3

# Use load balancer (nginx, traefik, etc.)
```

### Resource Limits
Add resource limits to docker-compose.yml:
```yaml
services:
  web:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```
