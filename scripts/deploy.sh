#!/usr/bin/env bash
set -e

# Default values if not provided by GitHub
APP_NAME="${APP_NAME:-app}"
APP_PORT="${PORT:-3000}"
REPO_LOWER=$(echo "${GITHUB_REPOSITORY}" | tr '[A-Z]' '[a-z]')
IMAGE_URL="ghcr.io/${REPO_LOWER}:latest"

echo "📥 Pulling: $IMAGE_URL"
docker pull "$IMAGE_URL"

echo "🛑 Cleaning: $APP_NAME"
docker stop "$APP_NAME" || true
docker rm "$APP_NAME" || true

echo "🚢 Running $APP_NAME on $APP_PORT"
docker run -d --name "$APP_NAME" -p "$APP_PORT:$APP_PORT" "$IMAGE_URL"