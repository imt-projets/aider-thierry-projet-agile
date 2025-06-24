#!/bin/bash

CONTAINER_NAME="backend"

echo "🧹 Arrêt et suppression des conteneurs et volumes..."
docker compose down -v

echo "🗑️ Suppression des anciennes images inutilisées..."
docker image prune -a -f

echo "🔧 Reconstruction des images..."
docker compose build

echo "🚀 Démarrage des conteneurs en arrière-plan..."
docker compose up -d

sleep 5
echo "🌱 Exécution de la seed dans le conteneur $CONTAINER_NAME..."
docker exec $CONTAINER_NAME bash -c "cd projet && npm run seed-docker:run"