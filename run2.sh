#!/bin/bash

# Navigate to the project root directory
cd "$(dirname "$0")"

echo "====================================="
echo "  Starting DREAMACTIC Platform v2.0   "
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

echo "[1/1] Starting DREAMACTIC Development Suite..."
# Just run npm run dev which starts both via concurrently
npm run dev
