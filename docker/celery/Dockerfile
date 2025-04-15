FROM python:3.10-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    netcat-traditional \
    libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements files
COPY sacco_backend/config/requirements/base.txt ./requirements/base.txt
COPY sacco_backend/config/requirements/production.txt ./requirements/production.txt

# Install dependencies
RUN pip install --no-cache-dir -r requirements/production.txt

# Copy project code
COPY sacco_backend/ .

# Create a non-root user
RUN addgroup --system django \
    && adduser --system --ingroup django django

# Change ownership of the application directory
RUN chown -R django:django /app

# Switch to non-root user
USER django

# Copy the entrypoint script
COPY ./docker/celery/entrypoint.sh /entrypoint.sh
RUN sed -i 's/\r$//g' /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]