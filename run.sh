#!/bin/bash

# DMTC Fullstack Start Script
# This script launches both the FastAPI backend and Vite frontend simultaneously.

# ANSI color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${PURPLE}=======================================${NC}"
echo -e "${PURPLE}  🚀 DMTC WEBSITE - FULLSTACK START    ${NC}"
echo -e "${PURPLE}=======================================${NC}"

# Function to handle cleanup on exit
cleanup() {
    echo -e "\n${BLUE}🛑 Stopping all services...${NC}"
    kill $(jobs -p)
    exit
}

trap cleanup EXIT

# Check if port 8000 is already in use
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${GREEN}⚠️  Port 8000 is already in use. Assuming backend is running or needs restart.${NC}"
fi

# 1. Start Backend
echo -e "${BLUE}📡 [1/2] Starting Backend (FastAPI on port 8000)...${NC}"
cd backend
if [ -d "venv" ]; then
    source venv/bin/activate
fi
PYTHONPATH=. uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

# 2. Start Frontend
echo -e "${BLUE}💻 [2/2] Starting Frontend (Vite)...${NC}"
npm run dev &
FRONTEND_PID=$!

echo -e "${GREEN}✅ Both services are initializing...${NC}"
echo -e "${GREEN}👉 API: http://localhost:8000${NC}"
echo -e "${GREEN}👉 UI:  Check terminal output for Vite URL${NC}"
echo -e "${PURPLE}---------------------------------------${NC}"
echo -e "Press Ctrl+C to stop both services."

# Wait for background processes
wait
