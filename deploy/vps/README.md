# Athena Studio — self-hosted VPS candidate (Phase 8C.4)

**No deployment has occurred.** Identity gates default OFF. The current live website and Supabase staging remain untouched.

## One VPS, three processes

- Caddy: internet-facing TLS termination, gzip/zstd and cached hashed Next.js assets.
- Next.js standalone: public site plus the **new** same-origin Better Auth/OTP/Google/GitHub identity API and read-only workspace API.
- PostgreSQL 17: private Docker network, persisted named volume, distinct bootstrap administrator and restricted athena_app web role.

No mandatory Redis, queue broker or managed Auth. Google/GitHub login and Gmail API delivery remain optional adapters. GitHub OAuth login does NOT authorize access to repositories: customer-selected GitHub App installation consent is separate. The legacy Supabase Client Portal is NOT migrated.

## Capacity and cost planning (not a performance guarantee)

Load-test a **2 vCPU / 2 GB RAM** VPS for light traffic; budget for **4 GB RAM** if SSR, uploads or spikes need headroom. Build Docker images in CI or on a separate development machine, not on a 2 GB production VPS. A single VPS has no automatic failover, regardless of Docker restart policy. Backups must survive loss of the VPS.

Declared container ceilings are: Next 896 MiB, PostgreSQL 448 MiB and Caddy 128 MiB, plus host OS and Docker overhead. These are budget guardrails, NOT measured peak memory figures.

## Files

- compose.yaml: fail-closed stack; only ports 80/443 published.
- compose.google.yaml, compose.github.yaml, compose.gmail.yaml: OPTIONAL providers and server-side secret mounts.
- config.example: example domain and flags OFF; never production credentials.
- Dockerfile: multi-stage Node 22 standalone build and non-root production process.
- migrations/001_better_auth.sql: generated Better Auth v1.7.12 baseline, immutable for this phase.
- migrations/002_workspace.sql: workspace authorization with FK, role constraints, unique membership and restricted grants.
- init/01-roles.sh: first-init PostgreSQL role creation, never automatically run again.
- scripts/migrate.sh: explicitly gated staging migrations only.
- scripts/backup.sh / restore-drill.sh: encrypted export and isolated restore rehearsal, NOT scheduled by default.

## Offline verification (no VPS, no Cloudflare account)

Run these commands from repository root:

    npm ci
    node --test tests/phase8c4-vps-core.test.mjs
    docker compose --env-file deploy/vps/config.example -f deploy/vps/compose.yaml config --quiet
    bash -n deploy/vps/init/01-roles.sh deploy/vps/scripts/*.sh
    ATHENA_VPS_STANDALONE_BUILD=true npm run build

Integration tests use PGlite in-memory PostgreSQL and a local wire-protocol socket. **This is NOT equivalent to a real PostgreSQL Docker/VPS load test.** Docker Engine was unavailable on the Windows development computer.

## Future owner-approved staging procedure ONLY (not executed)

1. Verify Ubuntu host OS, cloud firewall, RAM, SSD and SSH key access. Public ports 80/443 only; never expose PostgreSQL 5432 or Node 3000.
2. Build the reviewed image outside the VPS using: docker build -f deploy/vps/Dockerfile --build-arg SITE_ORIGIN=https://your-approved-domain -t athena-web:reviewed-sha .
   Rebuild when changing the public site origin; Next.js client-side environment variables are embedded at build time.
3. Copy config.example to gitignored config.local and replace the example hostname/email/image digest. Keep ATHENA_VPS_IDENTITY_ENABLED=false and ATHENA_VPS_RELEASE_APPROVED=false.
4. Generate distinct high-entropy credentials in gitignored deploy/vps/secrets/ named athena_auth_secret, athena_pg_admin_password and athena_pg_password. Use umask 077, openssl rand -base64 48, file mode 0600. Never print secrets or put them in source/config.example.
5. Start the reviewed staging stack with docker compose --env-file config.local -f compose.yaml up -d. On an empty DB volume, Postgres bootstrap creates the athena_app account without superuser privileges. Explicitly review migrations and run scripts/migrate.sh --apply-reviewed-staging with ATHENA_VPS_MIGRATION_APPROVED=reviewed-staging-only and ATHENA_COMPOSE_CONFIG=config.local. Database migrations NEVER run at app startup.
6. To test Google/GitHub login, register exact HTTPS callback URLs, place secrets in the corresponding private files, and add -f compose.google.yaml or -f compose.github.yaml. Never request GitHub repo contents permission merely to log in.
7. To test email OTP, add -f compose.gmail.yaml, approve Gmail API with only gmail.send scope and confirm real message delivery, limits, recovery and spam handling.
8. Validate tenant A/B sessions, session revocation, CSRF, role isolation, controlled backup/restore and load against actual VPS RAM/CPU.
9. Enable both identity release flags only after owner approval and staged acceptance. The current Client Portal stays separate until verified migration.

## Backup and disaster recovery

Backup requires age (an open-source encryption tool), an age PUBLIC recipient key and an independently verified off-VPS backup destination. Keep the DECRYPTION PRIVATE KEY outside the VPS. Storage can use an existing account or externally mounted volume, subject to its own quota/fees. scripts/backup.sh does NOT install cron or run itself. Verify an archive with scripts/restore-drill.sh --drill /path/to/archive.age using a temporarily supplied private key; it restores only to a new, disposable database.

No single-VPS layout provides guaranteed uptime. For higher availability, a second host and failover would eventually cost more.

## NO-GO

No actual VPS or cloud DB provisioned. No live Linux Docker stack or full backup/restore rehearsal yet. No real Google/GitHub/Gmail credentials, client account migrations or portfolio permissions. Never merge or deploy until staging, provider, security and cost approval.
