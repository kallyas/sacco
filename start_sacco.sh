#!/bin/bash

# Constants for colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Default configurations
BACKEND_DIR=${BACKEND_DIR:-"./sacco_backend"}
FRONTEND_DIR=${FRONTEND_DIR:-"./sacco_frontend"}
BACKEND_PORT=${BACKEND_PORT:-8000}
FRONTEND_PORT=${FRONTEND_PORT:-3000}

# Format output logs
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}
warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}
error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Check dependencies
command -v lsof >/dev/null || error "lsof is required but not installed."
command -v python3 >/dev/null || error "python3 is required but not installed."
command -v npm >/dev/null || error "npm is required but not installed."

log "=== SACCO Application Startup Script ==="

# Check if directories exist
[ ! -d "$BACKEND_DIR" ] && error "Backend directory not found at $BACKEND_DIR"
[ ! -d "$FRONTEND_DIR" ] && error "Frontend directory not found at $FRONTEND_DIR"

# Function to check and assign a free port
assign_free_port() {
    local port=$1
    while lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; do
        warn "Port $port is in use. Trying next port..."
        port=$((port + 1))
    done
    echo $port
}

# Assign free ports if necessary
BACKEND_PORT=$(assign_free_port $BACKEND_PORT)
FRONTEND_PORT=$(assign_free_port $FRONTEND_PORT)

# Start the Django backend
start_backend() {
    log "Starting Django backend on port $BACKEND_PORT..."
    cd "$BACKEND_DIR" || exit 1
    
    # Check and create virtual environment
    if [ ! -d "venv" ]; then
        warn "Virtual environment not found. Creating..."
        python3 -m venv venv || error "Failed to create virtual environment."
    fi
    
    # Activate virtual environment
    source venv/bin/activate || error "Failed to activate virtual environment."
    
    # Install dependencies if requirements.txt exists
    if [ -f "requirements.txt" ]; then
        pip install -r requirements.txt || error "Failed to install Python dependencies."
    fi
    
    # Start the Django server
    python manage.py runserver 0.0.0.0:$BACKEND_PORT > backend.log 2>&1 &
    BACKEND_PID=$!
    log "Backend started with PID: $BACKEND_PID (logs: backend.log)"
    
    cd - > /dev/null
}

# Start the React frontend
start_frontend() {
    log "Starting React frontend on port $FRONTEND_PORT..."
    cd "$FRONTEND_DIR" || exit 1
    
    # Install Node.js dependencies if missing
    if [ ! -d "node_modules" ]; then
        warn "Node modules not found. Installing..."
        npm install || error "Failed to install Node.js dependencies."
    fi
    
    # Start the React development server
    yarn dev -- --port $FRONTEND_PORT > frontend.log 2>&1 &
    FRONTEND_PID=$!
    log "Frontend started with PID: $FRONTEND_PID (logs: frontend.log)"
    
    cd - > /dev/null
}

# Cleanup function to kill background processes
cleanup() {
    log "Shutting down services..."
    [ -n "$BACKEND_PID" ] && kill $BACKEND_PID 2>/dev/null && log "Backend process ($BACKEND_PID) stopped."
    [ -n "$FRONTEND_PID" ] && kill $FRONTEND_PID 2>/dev/null && log "Frontend process ($FRONTEND_PID) stopped."
    log "All services stopped."
    exit 0
}

# Set up trap to clean up on exit
trap cleanup SIGINT SIGTERM EXIT

# Start services
start_backend
start_frontend

log "Both services are now running!"
log "Backend: http://127.0.0.1:$BACKEND_PORT"
log "Frontend: http://localhost:$FRONTEND_PORT"
log "Press Ctrl+C to stop both services."

# Wait indefinitely to keep services running
wait
