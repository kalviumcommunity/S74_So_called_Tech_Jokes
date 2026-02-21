#!/usr/bin/env bash
set -e

# Use the PORT passed from the environment, or default to 3000
CHECK_PORT="${PORT:-3000}"
HEALTH_URL="http://127.0.0.1:$CHECK_PORT/"

echo "🩺 Running dynamic health check at $HEALTH_URL ..."

for i in {1..10}; do
  # -f makes curl fail on 404/500 errors, -s is silent
  if curl -fsS "$HEALTH_URL" > /dev/null; then
    echo "✅ Health check passed on port $CHECK_PORT"
    exit 0
  fi
  echo "⏳ Attempt $i: App not responsive on $CHECK_PORT, retrying..."
  sleep 3
done

echo "❌ Health check failed after 30 seconds"
exit 1