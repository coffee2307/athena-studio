#!/usr/bin/env bash
# Explicit operator action only. NEVER executed by container startup.
set -Eeuo pipefail
[[ "$#" -eq 1 && "$1" == "--apply-reviewed-staging" ]] || {
 echo "Usage: migrate.sh --apply-reviewed-staging" >&2;exit 2
}
[[ "$ATHENA_VPS_MIGRATION_APPROVED" == "reviewed-staging-only" ]] || {
 echo "Migration gate OFF: review an isolated staging database first" >&2;exit 2
}
: "$ATHENA_COMPOSE_CONFIG"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
for migration in migrations/001_better_auth.sql migrations/002_workspace.sql;do
 [[ -s "$migration" ]] || { echo "Missing reviewed migration" >&2;exit 2; }
 echo "Applying reviewed migration: $(basename "$migration")"
 docker compose --env-file "$ATHENA_COMPOSE_CONFIG" -f compose.yaml exec -T postgres \
  psql -X --username postgres --dbname athena_identity -v ON_ERROR_STOP=1 < "$migration"
done
echo "Schema applied to explicitly approved staging database."
echo "Check grants, backup/restore and negative tenant tests before enabling any Auth flag."
