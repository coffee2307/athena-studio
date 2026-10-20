#!/usr/bin/env bash
# Never restore over the live Athena database.
set -Eeuo pipefail
umask 077
if [[ "$#" -ne 2 || "$1" != "--drill" ]];then
 echo "Usage: restore-drill.sh --drill /path/to/archive.age" >&2;exit 2
fi
: "$ATHENA_BACKUP_AGE_IDENTITY"
: "$ATHENA_COMPOSE_CONFIG"
for bin in docker age mktemp;do command -v "$bin" >/dev/null || exit 2;done
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
encrypted="$2"
[[ -f "$encrypted" ]] || exit 2
tmp="$(mktemp)"
drill="athena_restore_drill_$(date -u +%Y%m%d%H%M%S)"
created=false
cleanup(){
 rm -f -- "$tmp"
 if [[ "$created" == true ]];then
  docker compose --env-file "$ATHENA_COMPOSE_CONFIG" -f compose.yaml exec -T postgres \
   dropdb --username postgres --if-exists "$drill" >/dev/null 2>&1 || true
 fi
}
trap cleanup EXIT
age --decrypt --identity "$ATHENA_BACKUP_AGE_IDENTITY" --output "$tmp" "$encrypted"
docker compose --env-file "$ATHENA_COMPOSE_CONFIG" -f compose.yaml exec -T postgres \
 pg_restore --list < "$tmp" >/dev/null
docker compose --env-file "$ATHENA_COMPOSE_CONFIG" -f compose.yaml exec -T postgres \
 createdb --username postgres "$drill"
created=true
docker compose --env-file "$ATHENA_COMPOSE_CONFIG" -f compose.yaml exec -T postgres \
 pg_restore --exit-on-error --no-owner --no-acl --username postgres --dbname "$drill" < "$tmp"
docker compose --env-file "$ATHENA_COMPOSE_CONFIG" -f compose.yaml exec -T postgres \
 psql -X --username postgres --dbname "$drill" -v ON_ERROR_STOP=1 \
 -c 'SELECT count(*) AS restored_users FROM "user"; SELECT count(*) AS restored_workspaces FROM athena_workspace;'
echo "Restore drill succeeded in a temporary isolated database; dropping it."
