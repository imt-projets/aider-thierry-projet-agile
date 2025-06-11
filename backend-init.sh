#!/bin/bash

CONTAINER_NAME="backend"

echo "🚀 Exécution de la seed dans le conteneur $CONTAINER_NAME..."

docker exec $CONTAINER_NAME bash -c "cd projet && npm run seed-docker:run"