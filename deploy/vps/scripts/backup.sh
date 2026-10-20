#!/usr/bin/env bash
# Operator-triggered encrypted PostgreSQL backup. No cron or live mutation by default.
set -Eeuo pipefail
umask 077
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
: "$ATHENA_BACKUP_DIR"
: "$ATHENA_BACKUP_AGE_RECIPIENT"
: "$ATHENA_BACKUP_OFFSITE_ACK"
: "$ATHENA_COMPOSE_CONFIG"
[[ "$ATHENA_BACKUP_OFFSITE_ACK" == "true" ]] || { echo "Offsite backup not acknowledged" >&2; exit 2; }
[[ -d "$ATHENA_BACKUP_DIR" ]] || { echo "Backup destination missing; refusing fallback onto VPS disk" >&2; exit 2; }
for bin in docker age sha256sum mktemp; do command -v "$bin" >/dev/null || { echo "$bin unavailable" >&2; exit 2; }; done
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
file="$ATHENA_BACKUP_DIR/athena-identity-$stamp.age"
tmp="$(mktemp "$ATHENA_BACKUP_DIR/.athena-pgdump-XXXXXXXX")"
cleanup(){ rm -f -- "$tmp" "$file.part"; }
trap cleanup EXIT
docker compose --env-file "$ATHENA_COMPOSE_CONFIG" -f compose.yaml exec -T postgres \
  pg_dump --username postgres --dbname athena_identity --format custom --no-owner --no-acl > "$tmp"
[[ -s "$tmp" ]] || { echo "Empty pg_dump; refusing publication" >&2; exit 2; }
docker compose --env-file "$ATHENA_COMPOSE_CONFIG" -f compose.yaml exec -T postgres \
  pg_restore --list < "$tmp" >/dev/null
age --encrypt --recipient "$ATHENA_BACKUP_AGE_RECIPIENT" --output "$file.part" "$tmp"
[[ -s "$file.part" ]] || { echo "Encrypted backup missing" >&2; exit 2; }
chmod 600 "$file.part"
mv -- "$file.part" "$file"
(cd "$ATHENA_BACKUP_DIR" && sha256sum "$(basename "$file")" > "$(basename "$file").sha256")
echo "Encrypted archive and SHA256 manifest created on the offsite destination."
echo "Recovery is NOT verified until an isolated restore drill succeeds."
