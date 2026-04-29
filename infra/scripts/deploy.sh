#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INFRA_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
PROJECT_DIR="$(cd "${INFRA_DIR}/.." && pwd)"

cd "${PROJECT_DIR}"

echo "Generating SEO files"
node infra/scripts/generate-sitemap.js
node infra/scripts/generate-robots.js
node infra/scripts/validate-structured-data.js

echo "Building and starting services"
cd "${INFRA_DIR}"
docker compose pull postgres || true
docker compose build
docker compose up -d

echo "Waiting for health checks"
for attempt in {1..30}; do
  if curl -fsS "http://127.0.0.1/healthz" >/dev/null; then
    echo "Web health check passed"
    exit 0
  fi
  sleep 3
done

echo "Deployment did not become healthy in time"
docker compose ps
exit 1
