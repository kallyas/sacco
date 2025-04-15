#!/bin/bash

set -o errexit
set -o pipefail
set -o nounset

# Wait for PostgreSQL
postgres_ready() {
python << END
import sys
import psycopg2
try:
    psycopg2.connect(
        dbname="${POSTGRES_DB}",
        user="${POSTGRES_USER}",
        password="${POSTGRES_PASSWORD}",
        host="${POSTGRES_HOST}",
        port="${POSTGRES_PORT}",
    )
except psycopg2.OperationalError:
    sys.exit(1)
sys.exit(0)
END
}

# Wait for RabbitMQ
rabbitmq_ready() {
  nc -z ${RABBITMQ_HOST} ${RABBITMQ_PORT}
}

# Wait for Redis
redis_ready() {
  nc -z ${REDIS_HOST} ${REDIS_PORT}
}

until postgres_ready; do
  echo >&2 "PostgreSQL is unavailable - sleeping"
  sleep 1
done
echo >&2 "PostgreSQL is up - continuing..."

until rabbitmq_ready; do
  echo >&2 "RabbitMQ is unavailable - sleeping"
  sleep 1
done
echo >&2 "RabbitMQ is up - continuing..."

until redis_ready; do
  echo >&2 "Redis is unavailable - sleeping"
  sleep 1
done
echo >&2 "Redis is up - continuing..."

# Apply database migrations
echo >&2 "Applying database migrations..."
python manage.py migrate --noinput

# Collect static files
echo >&2 "Collecting static files..."
python manage.py collectstatic --noinput

# Create superuser if needed
if [ "${DJANGO_SUPERUSER_USERNAME:-}" ] && [ "${DJANGO_SUPERUSER_EMAIL:-}" ] && [ "${DJANGO_SUPERUSER_PASSWORD:-}" ]; then
    echo >&2 "Creating superuser..."
    python manage.py createsuperuser --noinput || true
fi

exec "$@"