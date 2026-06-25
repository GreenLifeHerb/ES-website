#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INFRA_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
BACKUP_DIR="${INFRA_DIR}/backups"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"

mkdir -p "${BACKUP_DIR}"
cd "${INFRA_DIR}"

docker compose exec -T postgres pg_dump \
  -U "${POSTGRES_USER:-essence_source}" \
  -d "${POSTGRES_DB:-essence_source}" \
  --clean --if-exists \
  > "${BACKUP_DIR}/essence-source-${TIMESTAMP}.sql"

echo "Backup written to ${BACKUP_DIR}/essence-source-${TIMESTAMP}.sql"
