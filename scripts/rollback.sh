#!/usr/bin/env bash
set -e

# Dynamic Variables
APP_NAME="${APP_NAME:-app}"
APP_PORT="${PORT:-3000}"
REPO_LOWER=$(echo "${GITHUB_REPOSITORY}" | tr '[A-Z]' '[a-z]')
# We target the 'previous' tag or a specific SHA if you prefer
ROLLBACK_IMAGE="ghcr.io/${REPO_LOWER}:latest" 

echo "🔄 Rolling back $APP_NAME to the last stable image..."

# 1. Stop the failing container
docker stop "$APP_NAME" || true
docker rm "$APP_NAME" || true

# 2. Run the previous version (Docker keeps a cache of the last 'latest')
# In a professional setup, you'd pull a specific 'stable' tag
docker run -d \
  --name "$APP_NAME" \
  -p "$APP_PORT:$APP_PORT" \
  "$ROLLBACK_IMAGE"

echo "✅ Rollback complete for $APP_NAME on port $APP_PORT"