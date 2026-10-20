#!/bin/sh
# Runs only when PostgreSQL creates a NEW empty data directory.
# Application never sees the PostgreSQL administrator's credentials.
set -eu
app_password="$(cat /run/secrets/athena_pg_password)"
test "$(printf %s "$app_password" | wc -c)" -ge 20 ||
  { echo "App database credential too short" >&2; exit 1; }
psql -X -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" \
  -v app_password="$app_password" <<'SQL'
CREATE ROLE athena_app LOGIN PASSWORD :'app_password'
  NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION;
GRANT CONNECT ON DATABASE athena_identity TO athena_app;
GRANT USAGE ON SCHEMA public TO athena_app;
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
SQL
unset app_password
