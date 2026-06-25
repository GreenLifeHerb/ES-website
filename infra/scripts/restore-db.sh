#!/usr/bin/env bash
set -euo pipefail

if [ "${1:-}" = "" ]; then
  echo "Usage: bash scripts/restore-db.sh ./backups/essence-source-YYYYMMDD-HHMMSS.sql"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INFRA_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
BACKUP_FILE="$1"

cd "${INFRA_DIR}"

docker compose exec -T postgres psql \
  -U "${POSTGRES_USER:-essence_source}" \
  -d "${POSTGRES_DB:-essence_source}" \
  < "${BACKUP_FILE}"

echo "Database restored from ${BACKUP_FILE}"
