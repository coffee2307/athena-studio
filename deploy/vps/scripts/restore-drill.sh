#!/usr/bin/env bash
# Restore a trusted Athena archive into a disposable, network-isolated container.
set -Eeuo pipefail
umask 077
if [[ "$#" -ne 2 || "$1" != "--drill" ]]; then
 echo "Usage: restore-drill.sh --drill /path/to/archive.age" >&2; exit 2
fi
[[ -n "$ATHENA_BACKUP_AGE_IDENTITY" ]] || exit 2
for bin in docker age sha256sum timeout; do command -v "$bin" >/dev/null || exit 2; done
encrypted="$2"
[[ -f "$encrypted" && ! -L "$encrypted" ]] || exit 2
encrypted="$(cd "$(dirname "$encrypted")" && pwd)/$(basename "$encrypted")"
manifest="$encrypted.sha256"
[[ -f "$manifest" && ! -L "$manifest" && $(wc -c < "$manifest") -lt 512 ]] || {
 echo "Missing or invalid archive integrity manifest" >&2; exit 2;
}
base="$(basename "$encrypted")"
[[ "$base" =~ ^athena-identity-[0-9]{8}T[0-9]{6}Z-[A-Za-z0-9]+\.age$ ]] || exit 2
record="$(cat "$manifest")"
digest="$(printf '%s' "$record" | cut -c1-64)"
[[ "$digest" =~ ^[a-f0-9]{64}$ && "$record" == "$digest  $base" ]] || {
 echo "Integrity manifest must name exactly the requested archive" >&2; exit 2;
}
(cd "$(dirname "$encrypted")" && sha256sum -c "$(basename "$manifest")") >/dev/null || {
 echo "Encrypted archive SHA256 mismatch" >&2; exit 2;
}
[[ -f "$ATHENA_BACKUP_AGE_IDENTITY" && ! -L "$ATHENA_BACKUP_AGE_IDENTITY" ]] || exit 2

drill="athena_restore_drill_$(date -u +%Y%m%d%H%M%S)_$RANDOM"
created=false
restore_debug=false
if [[ -v ATHENA_RESTORE_DEBUG ]]; then restore_debug="$ATHENA_RESTORE_DEBUG"; fi
restore_stderr=/dev/null
if [[ "$restore_debug" == true ]]; then restore_stderr=/dev/stderr; fi
cleanup(){
 result=$?
 trap - EXIT
 if [[ "$created" == true ]] && ! docker rm -fv "$drill" >/dev/null 2>&1; then
  echo "Restore container cleanup failed; operator action required" >&2
  result=1
 fi
 exit "$result"
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
# Never pull during recovery. No Compose config, production mounts, network or ports.
docker image inspect postgres:17-alpine >/dev/null 2>&1 || {
 echo "Preload the reviewed PostgreSQL 17 image before the drill" >&2; exit 2;
}
docker create --name "$drill" --network none --memory 512m --cpus 1 --pids-limit 100 \
 --security-opt no-new-privileges --read-only \
 --tmpfs /tmp:rw,noexec,nosuid,size=32m \
 --tmpfs /var/run/postgresql:rw,nosuid,size=16m \
 --tmpfs /var/lib/postgresql/data:rw,nosuid,size=256m \
 -e POSTGRES_HOST_AUTH_METHOD=trust -e POSTGRES_DB=athena_recovery \
 postgres:17-alpine >/dev/null
created=true
docker start "$drill" >/dev/null
for attempt in $(seq 1 30); do
 if docker exec "$drill" pg_isready -U postgres -d athena_recovery >/dev/null 2>&1; then break; fi
 [[ "$attempt" -lt 30 ]] || { echo "Recovery container did not become ready" >&2; exit 1; }
 sleep 1
done
# Stream decrypt and restore; keep archive, key, and database off persistent disk.
if ! timeout 180 age --decrypt --identity "$ATHENA_BACKUP_AGE_IDENTITY" "$encrypted" 2>/dev/null |
 timeout 180 docker exec -i "$drill" pg_restore --exit-on-error --single-transaction \
 --no-owner --no-acl --username postgres --dbname athena_recovery >/dev/null 2>"$restore_stderr"; then
 echo "Isolated restore failed (details withheld)" >&2; exit 1
fi
# Confirm expected tables can be read without exposing customer rows.
if ! docker exec -i "$drill" psql -X -q --username postgres --dbname athena_recovery \
 -v ON_ERROR_STOP=1 >/dev/null 2>&1 <<'SQL'
BEGIN READ ONLY;
SELECT count(*) FROM "user";
SELECT count(*) FROM "session";
SELECT count(*) FROM "account";
SELECT count(*) FROM "verification";
SELECT count(*) FROM "rateLimit";
SELECT count(*) FROM athena_workspace;
SELECT count(*) FROM athena_membership;
SELECT count(*) FROM athena_schema_migrations;
COMMIT;
SQL
then
 echo "Restored schema verification failed" >&2; exit 1
fi
docker rm -fv "$drill" >/dev/null
created=false
echo '{"status":"passed","scope":"isolated-data-restore","productionRestored":false}'
