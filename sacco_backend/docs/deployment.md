# SACCO System Deployment Guide

## Prerequisites
- Python 3.10+
- PostgreSQL 13+
- Redis 6+
- Nginx
- SSL Certificate

## Environment Setup
1. Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements/production.txt
```

2. Configure Environment Variables
```bash
export DJANGO_SETTINGS_MODULE=core.settings.production
export DJANGO_SECRET_KEY=your-secret-key
export DB_NAME=sacco_db
export DB_USER=sacco_user
export DB_PASSWORD=your-db-password
```

3. Database Setup
```sql
CREATE DATABASE sacco_db;
CREATE USER sacco_user WITH PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE sacco_db TO sacco_user;
```

## Deployment Steps
1. Clone Repository
```bash
git clone https://github.com/your-repo/sacco-system.git
cd sacco-system
```

2. Install Dependencies
```bash
pip install -r requirements/production.txt
```

3. Apply Migrations
```bash
python manage.py migrate
```

4. Configure Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

5. Configure Gunicorn
```bash
gunicorn core.wsgi:application --bind 127.0.0.1:8000 --workers 3
```

6. Setup Celery
```bash
celery -A core worker -l info
celery -A core beat -l info
```