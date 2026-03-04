#!/bin/bash

# Navigate to the project root directory
cd "$(dirname "$0")"

echo "====================================="
echo "  Starting DREAMATIC Platform v2.0   "
echo "  Backend: Express.js (Node)         "
echo "  Frontend: Vue.js + Vite            "
echo "====================================="

# Function to handle cleanup on exit
cleanup() {
    echo ""
    echo "====================================="
    echo "  Shutting down services...          "
    echo "====================================="
    
    # Kill the background node process we started
    if [ -n "$BACKEND_PID" ]; then
        echo "Stopping Express.js backend (PID: $BACKEND_PID)..."
        kill $BACKEND_PID 2>/dev/null
    fi
    exit
}

# Trap SIGINT (Ctrl+C) and SIGTERM
trap cleanup SIGINT SIGTERM EXIT

echo "[1/2] Starting Express.js backend..."
# Run the node backend in the background
node server/src/index.js &
BACKEND_PID=$!

# Give the backend a second to initialize
sleep 2

echo "[2/2] Starting Vue.js frontend..."
# Run frontend in the foreground
npm run dev
