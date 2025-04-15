# Docker Documentation for SACCO Application

This documentation provides instructions for setting up, running, and deploying the SACCO application using Docker. The application consists of a Django backend, React Router frontend, and supporting services including PostgreSQL, Redis, RabbitMQ, and Celery.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Development Setup](#development-setup)
- [Production Deployment](#production-deployment)
- [Common Commands](#common-commands)
- [Troubleshooting](#troubleshooting)
- [GitHub Actions Workflow](#github-actions-workflow)

## Prerequisites

- Docker (20.10.x or newer)
- Docker Compose (v2.x or newer)
- Git

## Project Structure

The application is structured as follows:

```
project-root/
├── .github/workflows/           # GitHub Actions workflows
├── docker/                      # Docker configuration files
│   ├── backend/                 # Backend Docker files
│   ├── celery/                  # Celery Docker files
│   ├── frontend/                # Frontend Docker files
│   └── nginx/                   # Nginx Docker files
├── sacco_backend/               # Django application
├── sacco_frontend/              # React application
├── .env.backend                 # Backend environment variables
├── .env.db                      # Database environment variables
├── .env.frontend                # Frontend environment variables
├── .env.rabbitmq                # RabbitMQ environment variables
├── .dockerignore                # Files to exclude from Docker builds
└── docker-compose.yml           # Development Docker Compose configuration
└── docker-compose.prod.yml      # Production Docker Compose configuration
```

## Environment Variables

Create the following environment files in your project root:

### `.env.backend`

```
DEBUG=False
SECRET_KEY=change_this_to_a_secure_key
ALLOWED_HOSTS=localhost,127.0.0.1
DJANGO_SETTINGS_MODULE=core.settings.production

# Database settings
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_DB=sacco_db
POSTGRES_USER=sacco_user
POSTGRES_PASSWORD=sacco_password

# Redis settings
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_URL=redis://redis:6379/0

# RabbitMQ settings
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672
CELERY_BROKER_URL=amqp://guest:guest@rabbitmq:5672//

# Superuser credentials (optional)
DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_EMAIL=admin@example.com
DJANGO_SUPERUSER_PASSWORD=admin_password
```

### `.env.db`

```
POSTGRES_DB=sacco_db
POSTGRES_USER=sacco_user
POSTGRES_PASSWORD=sacco_password
```

### `.env.frontend`

```
API_URL=http://backend:8000/api
PUBLIC_API_URL=/api
NODE_ENV=production
```

### `.env.rabbitmq`

```
RABBITMQ_DEFAULT_USER=guest
RABBITMQ_DEFAULT_PASS=guest
```

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/sacco-app.git
   cd sacco-app
   ```

2. Create the environment files as described in the [Environment Variables](#environment-variables) section.

3. Build and start the containers:
   ```bash
   docker-compose build
   docker-compose up -d
   ```

4. Check the status of the containers:
   ```bash
   docker-compose ps
   ```

5. Access the application:
   - Frontend: http://localhost:80
   - Backend API: http://localhost:80/api
   - Django Admin: http://localhost:80/admin
   - RabbitMQ Management: http://localhost:15672 (username: guest, password: guest)

## Production Deployment

For production deployment, use the production Docker Compose file:

1. Set up environment variables for production (stronger passwords, proper hostnames, etc.)

2. Deploy using the production compose file:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. To use images from GitHub Container Registry:
   ```bash
   export REGISTRY=ghcr.io
   export GITHUB_REPOSITORY=your-username/sacco-app
   export TAG=latest  # or a specific tag
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Common Commands

### View Container Logs

```bash
# View logs for all containers
docker-compose logs

# View logs for a specific service
docker-compose logs backend

# Follow logs (stream in real-time)
docker-compose logs -f
```

### Execute Commands Inside Containers

```bash
# Django management commands
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser

# Check frontend dependencies
docker-compose exec frontend yarn list

# Check database
docker-compose exec db psql -U sacco_user -d sacco_db
```

### Restart Services

```bash
# Restart a specific service
docker-compose restart backend

# Restart all services
docker-compose restart
```

### Update Containers After Code Changes

```bash
# Rebuild and restart containers
docker-compose up -d --build
```

### Stop and Remove Containers

```bash
# Stop containers
docker-compose down

# Stop containers and remove volumes (caution: this will delete database data)
docker-compose down -v
```

## Troubleshooting

### Container Fails to Start

1. Check the logs for the failing container:
   ```bash
   docker-compose logs [service_name]
   ```

2. Verify environment variables are set correctly:
   ```bash
   docker-compose config
   ```

3. Check if ports are already in use:
   ```bash
   sudo lsof -i :[port_number]
   ```

### Database Connection Issues

1. Ensure the database container is running:
   ```bash
   docker-compose ps db
   ```

2. Check database logs:
   ```bash
   docker-compose logs db
   ```

3. Verify the database credentials match between `.env.backend` and `.env.db`.

### Frontend Build Errors

1. Check frontend container logs:
   ```bash
   docker-compose logs frontend
   ```

2. Access the container and check for issues:
   ```bash
   docker-compose exec frontend sh
   yarn --version
   node --version
   ```

### Nginx Routing Issues

1. Check Nginx logs:
   ```bash
   docker-compose logs nginx
   ```

2. Verify Nginx configuration:
   ```bash
   docker-compose exec nginx nginx -t
   ```

## GitHub Actions Workflow

The repository includes a GitHub Actions workflow that:

1. Builds Docker images when you push to the main/master branch or create a tag
2. Pushes the images to GitHub Container Registry (ghcr.io)

To use this workflow:

1. Ensure you have the `.github/workflows/docker-publish.yml` file in your repository
2. Set up any necessary secrets in your GitHub repository settings
3. Push changes to trigger the workflow

To pull the published images:

```bash
docker pull ghcr.io/your-username/sacco-app/sacco-backend:latest
docker pull ghcr.io/your-username/sacco-app/sacco-frontend:latest
docker pull ghcr.io/your-username/sacco-app/sacco-celery:latest
docker pull ghcr.io/your-username/sacco-app/sacco-nginx:latest
```