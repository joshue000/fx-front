#!/usr/bin/env bash
set -euo pipefail

CONTAINER="fx-front"

echo "Stopping container: $CONTAINER"
docker stop "$CONTAINER"

echo "Removing container: $CONTAINER"
docker rm "$CONTAINER"

echo "fx-front stopped."
