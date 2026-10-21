#!/usr/bin/env bash
# Streaming encrypted dump: never creates a plaintext archive.
set -Eeuo pipefail
umask 077
: "$ATHENA_BACKUP_DIR"
: "$ATHENA_BACKUP_AGE_RECIPIENT"
: "$ATHENA_BACKUP_OFFSITE_ACK"
: "$ATHENA_COMPOSE_CONFIG"
if [[ "$ATHENA_BACKUP_OFFSITE_ACK" != "true" ]];then
 echo "Refusing backup without explicit offsite acknowledgment" >&2;exit 2
fi
for bin in docker age sha256sum mktemp mountpoint;do
 command -v "$bin" >/dev/null || { echo "Missing backup dependency: $bin" >&2;exit 2; }
done
[[ -d "$ATHENA_BACKUP_DIR" && ! -L "$ATHENA_BACKUP_DIR" ]] || {
 echo "Backup directory must exist and not be a symlink" >&2;exit 2;
}
mountpoint -q "$ATHENA_BACKUP_DIR" || {
 echo "Backup target is not an independent mountpoint; refusing VPS-local fallback" >&2;exit 2;
}
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
[[ -f "$ATHENA_COMPOSE_CONFIG" ]] || { echo "Missing private Compose environment" >&2;exit 2; }
file="$(mktemp "$ATHENA_BACKUP_DIR/athena-identity-$(date -u +%Y%m%dT%H%M%SZ)-XXXXXXXX.age.part")"
cleanup(){ rm -f -- "$file"; }
trap cleanup EXIT
# Pipefail catches pg_dump and age errors. Never publish a partial archive.
docker compose --env-file "$ATHENA_COMPOSE_CONFIG" -f compose.yaml exec -T postgres \
  pg_dump --username postgres --dbname athena_identity --format custom --no-owner --no-acl |
 age --encrypt --recipient "$ATHENA_BACKUP_AGE_RECIPIENT" --output "$file"
[[ -s "$file" ]] || { echo "Encrypted output empty; refusing to publish" >&2;exit 2; }
chmod 600 "$file"
final="$(printf %s "$file" | sed 's/\.part$//')"
mv -- "$file" "$final"
trap - EXIT
(cd "$ATHENA_BACKUP_DIR" && sha256sum "$(basename "$final")" > "$(basename "$final").sha256")
echo "Encrypted archive saved on independently mounted destination."
echo "Recovery remains unverified until an isolated restore drill succeeds."
