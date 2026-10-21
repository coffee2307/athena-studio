#!/usr/bin/env bash
# Recovery rehearsal ONLY. Decryption streams into isolated PostgreSQL;
# no plaintext database dump or key is ever written to disk by this script.
set -Eeuo pipefail
umask 077
if [[ "$#" -ne 2 || "$1" != "--drill" ]];then
 echo "Usage: restore-drill.sh --drill /path/to/archive.age" >&2;exit 2
fi
: "$ATHENA_BACKUP_AGE_IDENTITY"
: "$ATHENA_COMPOSE_CONFIG"
for bin in docker age sha256sum;do command -v "$bin" >/dev/null || exit 2;done
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
encrypted="$2"
[[ -f "$encrypted" && ! -L "$encrypted" ]] || exit 2
manifest="$encrypted.sha256"
[[ -f "$manifest" ]] || { echo "Missing encrypted archive integrity manifest" >&2;exit 2; }
(cd "$(dirname "$encrypted")" && sha256sum -c "$(basename "$manifest")") >/dev/null || {
 echo "Encrypted archive SHA256 mismatch" >&2;exit 2
}
[[ -f "$ATHENA_BACKUP_AGE_IDENTITY" ]] || { echo "Missing decryption identity" >&2;exit 2; }
[[ -f "$ATHENA_COMPOSE_CONFIG" ]] || { echo "Missing private Compose environment" >&2;exit 2; }
drill="athena_restore_drill_$(date -u +%Y%m%d%H%M%S)_$RANDOM"
created=false
cleanup(){
 if [[ "$created" == true ]];then
  docker compose --env-file "$ATHENA_COMPOSE_CONFIG" -f compose.yaml exec -T postgres \
   dropdb --username postgres --if-exists "$drill" >/dev/null 2>&1 || \
   echo "WARNING: manual cleanup required for temporary restore database" >&2
 fi
}
trap cleanup EXIT
# Verify archive and decrypt a second time only for the temporary restore DB.
age --decrypt --identity "$ATHENA_BACKUP_AGE_IDENTITY" "$encrypted" |
 docker compose --env-file "$ATHENA_COMPOSE_CONFIG" -f compose.yaml exec -T postgres \
  pg_restore --list >/dev/null
docker compose --env-file "$ATHENA_COMPOSE_CONFIG" -f compose.yaml exec -T postgres \
 createdb --username postgres "$drill"
created=true
age --decrypt --identity "$ATHENA_BACKUP_AGE_IDENTITY" "$encrypted" |
 docker compose --env-file "$ATHENA_COMPOSE_CONFIG" -f compose.yaml exec -T postgres \
 pg_restore --exit-on-error --no-owner --no-acl --username postgres --dbname "$drill"
docker compose --env-file "$ATHENA_COMPOSE_CONFIG" -f compose.yaml exec -T postgres \
 psql -X --username postgres --dbname "$drill" -v ON_ERROR_STOP=1 \
 -c 'SELECT count(*) AS restored_users FROM "user"; SELECT count(*) AS restored_workspaces FROM athena_workspace;'
echo "Isolated restore drill succeeded; disposable database will be removed."
