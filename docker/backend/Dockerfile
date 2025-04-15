FROM python:3.10-slim as production

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    POETRY_VERSION=1.4.2 \
    POETRY_HOME="/opt/poetry" \
    POETRY_VIRTUALENVS_IN_PROJECT=true \
    POETRY_NO_INTERACTION=1 \
    PYSETUP_PATH="/opt/pysetup" \
    VENV_PATH="/opt/pysetup/.venv"

# Add Poetry to PATH
ENV PATH="$POETRY_HOME/bin:$VENV_PATH/bin:$PATH"

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    netcat-traditional \
    libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | python3 -

# Copy requirements files
COPY sacco_backend/config/requirements/base.txt ./requirements/base.txt
COPY sacco_backend/config/requirements/production.txt ./requirements/production.txt

# Install dependencies
RUN pip install --no-cache-dir -r requirements/production.txt

# Copy Gunicorn configuration
COPY sacco_backend/config/gunicorn/gunicorn.conf.py ./gunicorn.conf.py

# Copy project code
COPY sacco_backend/ .

# Create a non-root user
RUN addgroup --system django \
    && adduser --system --ingroup django django

# Change ownership of the application directory
RUN chown -R django:django /app

# Switch to non-root user
USER django

# Run the entrypoint script
COPY ./docker/backend/entrypoint.sh /entrypoint.sh
RUN sed -i 's/\r$//g' /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

# Run Gunicorn by default
CMD ["gunicorn", "--config", "gunicorn.conf.py", "config.wsgi:application"]