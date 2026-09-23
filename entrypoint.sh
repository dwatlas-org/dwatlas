#!/bin/bash
set -e

echo "Starting FastAPI / Uvicorn..."
uv run --directory /app/server uvicorn api.main:app --host 127.0.0.1 --port 8000 &
UVICORN_PID=$!

echo "Starting Nginx..."
nginx -g "daemon off;" &
NGINX_PID=$!

shutdown() {
    echo "Received termination signal. Shutting down gracefully..."
    kill -TERM "$UVICORN_PID" "$NGINX_PID" 2>/dev/null || true
    wait "$UVICORN_PID" "$NGINX_PID" 2>/dev/null || true
    exit 0
}

trap shutdown TERM INT

wait -n "$UVICORN_PID" "$NGINX_PID"
EXIT_STATUS=$?
echo "A container process stopped with status $EXIT_STATUS. Exiting container..."
shutdown
