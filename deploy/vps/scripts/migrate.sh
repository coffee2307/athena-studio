#!/usr/bin/env bash
# Explicit, operator-approved staging migrations. NEVER run at application startup.
# Ledger + SHA256 detects drift; PostgreSQL transaction rolls back a failed file.
set -Eeuo pipefail
umask 077
if [[ "$#" -ne 1 || "$1" != "--apply-reviewed-staging" ]];then
 echo "Usage: migrate.sh --apply-reviewed-staging" >&2;exit 2
fi
if [[ "$ATHENA_VPS_MIGRATION_APPROVED" != "reviewed-staging-only" ]];then
 echo "Migration gate OFF: staging approval required" >&2;exit 2
fi
: "$ATHENA_COMPOSE_CONFIG"
for tool in docker sha256sum flock awk;do
 command -v "$tool" >/dev/null || { echo "Missing required tool: $tool" >&2;exit 2; }
done
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
[[ -f "$ATHENA_COMPOSE_CONFIG" ]] || { echo "Missing private Compose configuration" >&2;exit 2; }
exec 9> ".athena-migration.lock"
flock -n 9 || { echo "Another migration process is running" >&2;exit 2; }
query(){
 docker compose --env-file "$ATHENA_COMPOSE_CONFIG" -f compose.yaml exec -T postgres \
  psql -X -v ON_ERROR_STOP=1 --username postgres --dbname athena_identity "$@"
}
query -c "CREATE TABLE IF NOT EXISTS athena_schema_migrations (
 migration_name text PRIMARY KEY,
 checksum_sha256 char(64) NOT NULL,
 applied_at timestamptz NOT NULL DEFAULT now()
);" >/dev/null
for migration in migrations/001_better_auth.sql migrations/002_workspace.sql;do
 [[ -s "$migration" ]] || { echo "Missing reviewed migration: $migration" >&2;exit 2; }
 name="$(basename "$migration")"
 checksum="$(sha256sum "$migration" | awk '{print $1}')"
 [[ "$checksum" =~ ^[a-f0-9]{64}$ ]] || { echo "Invalid checksum" >&2;exit 2; }
 applied="$(query -At -c "SELECT checksum_sha256 FROM athena_schema_migrations WHERE migration_name='$name';")"
 if [[ -n "$applied" ]];then
  if [[ "$applied" != "$checksum" ]];then
   echo "Migration checksum drift detected; refusing unsafe reapplication: $name" >&2
   exit 2
  fi
  echo "Previously applied (checksum verified): $name"
  continue
 fi
 echo "Applying reviewed migration transactionally: $name"
 {
  printf 'BEGIN;\nSELECT pg_advisory_xact_lock(8340052026);\n'
  cat "$migration"
  printf "\nINSERT INTO athena_schema_migrations(migration_name,checksum_sha256) VALUES ('%s','%s');\nCOMMIT;\n" "$name" "$checksum"
 } | query >/dev/null
done
echo "All reviewed migrations validated/applied; release flag remains independently gated."
