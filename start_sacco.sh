#!/bin/bash

# Colors for better output visibility
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== SACCO Application Startup Script ===${NC}"

# Define paths to backend and frontend
BACKEND_DIR="./sacco_backend"
FRONTEND_DIR="./sacco_frontend"

# Check if directories exist
if [ ! -d "$BACKEND_DIR" ]; then
    echo -e "${YELLOW}Backend directory not found at $BACKEND_DIR${NC}"
    exit 1
fi

if [ ! -d "$FRONTEND_DIR" ]; then
    echo -e "${YELLOW}Frontend directory not found at $FRONTEND_DIR${NC}"
    exit 1
fi

# Function to check if a port is already in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${YELLOW}Warning: Port $1 is already in use!${NC}"
        echo -e "You may need to kill the process using: ${BLUE}kill \$(lsof -ti:$1)${NC}"
        return 1
    fi
    return 0
}

# Start the Django backend
start_backend() {
    echo -e "${GREEN}Starting Django backend...${NC}"
    cd "$BACKEND_DIR" || exit 1
    
    # Check if venv exists
    if [ ! -d "venv" ]; then
        echo -e "${YELLOW}Virtual environment not found. Creating...${NC}"
        python3 -m venv venv
    fi
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Check if Django is installed
    if ! python -c "import django" &> /dev/null; then
        echo -e "${YELLOW}Django not found. Installing requirements...${NC}"
        pip install -r requirements.txt
    fi
    
    # Start the Django server
    echo -e "${BLUE}Starting Django server on http://127.0.0.1:8000${NC}"
    python manage.py runserver &
    BACKEND_PID=$!
    echo "Backend started with PID: $BACKEND_PID"
    
    # Return to original directory
    cd - > /dev/null
}

# Start the React frontend
start_frontend() {
    echo -e "${GREEN}Starting Vite React frontend...${NC}"
    cd "$FRONTEND_DIR" || exit 1
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}Node modules not found. Installing...${NC}"
        npm install
    fi
    
    # Start the Vite server on port 3000
    echo -e "${BLUE}Starting Vite server on http://localhost:3000${NC}"
    npm run dev -- --port 3000 &
    FRONTEND_PID=$!
    echo "Frontend started with PID: $FRONTEND_PID"
    
    # Return to original directory
    cd - > /dev/null
}

# Clean up function to kill processes on exit
cleanup() {
    echo -e "\n${GREEN}Shutting down services...${NC}"
    
    if [ -n "$BACKEND_PID" ]; then
        echo "Killing backend process ($BACKEND_PID)"
        kill $BACKEND_PID 2>/dev/null
    fi
    
    if [ -n "$FRONTEND_PID" ]; then
        echo "Killing frontend process ($FRONTEND_PID)"
        kill $FRONTEND_PID 2>/dev/null
    fi
    
    echo -e "${GREEN}All services stopped${NC}"
    exit 0
}

# Set up trap to clean up processes on script exit
trap cleanup SIGINT SIGTERM EXIT

# Check if required ports are available
check_port 8000 && check_port 3000

# Start services
start_backend
start_frontend

# Keep the script running to maintain background processes
echo -e "\n${GREEN}Both services are now running!${NC}"
echo -e "${BLUE}Backend:${NC} http://127.0.0.1:8000"
echo -e "${BLUE}Frontend:${NC} http://localhost:3000"
echo -e "\n${YELLOW}Press Ctrl+C to stop both services${NC}"

# Wait indefinitely
while true; do
    sleep 1
done

