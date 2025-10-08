#!/bin/bash

# 3Scope Development Server Manager
echo "🚀 Starting 3Scope Development Environment"

# Kill any existing processes on our ports
echo "🧹 Cleaning up existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || echo "Port 3000 is free"
lsof -ti:3001 | xargs kill -9 2>/dev/null || echo "Port 3001 is free"

# Check MongoDB
echo "🔍 Checking MongoDB..."
if docker ps | grep -q 3scope-mongodb; then
    echo "✅ MongoDB is running"
else
    echo "🔄 Starting MongoDB..."
    docker run --name 3scope-mongodb -p 27017:27017 -d mongo:latest
fi

# Start backend in background
echo "🖥️  Starting Backend Server (Port 3001)..."
cd backend
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
echo "🌐 Starting Frontend Server (Port 3000)..."
cd ..
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🎉 Development servers are starting..."
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🖥️  Backend:  http://localhost:3001"
echo "📊 API Docs: http://localhost:3001/api/docs"
echo "🗄️  Database: MongoDB running in Docker"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for user interrupt
trap 'echo "🛑 Stopping servers..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit' INT
wait