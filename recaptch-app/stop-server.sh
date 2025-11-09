#!/bin/bash

# Stop all Node processes and free up port 5000

echo "Stopping Node processes..."

# Kill processes on port 5000
lsof -ti:5000 | xargs kill -9 2>/dev/null

# Kill all node processes (be careful with this in production)
pkill -f "node.*server/index.js" 2>/dev/null
pkill -f "nodemon.*server/index.js" 2>/dev/null

sleep 1

# Check if port is free
if lsof -ti:5000 > /dev/null 2>&1; then
  echo "⚠️  Port 5000 is still in use. You may need to manually stop the process."
  echo "Run: lsof -ti:5000 | xargs kill -9"
else
  echo "✅ Port 5000 is now free"
fi



