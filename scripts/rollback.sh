#!/usr/bin/env bash
set -e

APP_NAME="S74_So_called_Tech_Jokes_test"
PORT="3000"

echo "🔁 Rolling back $APP_NAME to previous version..."

# Stop and remove current container
docker stop "$APP_NAME" || true
docker rm "$APP_NAME" || true

# Start previous image
docker run -d \
  --name "$APP_NAME" \
  -p "$PORT:$PORT" \
  s74_so_called_tech_jokes_test:previous

echo "✅ Rollback complete for $APP_NAME"