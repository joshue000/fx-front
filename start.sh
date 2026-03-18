#!/usr/bin/env bash
set -euo pipefail

IMAGE="fx-front"
CONTAINER="fx-front"
PORT="${PORT:-4200}"

echo "Building Docker image: $IMAGE"
docker build -t "$IMAGE" .

echo "Starting container: $CONTAINER on port $PORT"
docker run -d \
  --name "$CONTAINER" \
  -p "$PORT:80" \
  "$IMAGE"

echo "fx-front is running at http://localhost:$PORT"
