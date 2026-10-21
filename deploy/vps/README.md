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
4. Generate three independent high-entropy credentials in gitignored deploy/vps/secrets/ (athena_auth_secret, athena_pg_admin_password, athena_pg_password). **Docker Compose local-file secrets are bind mounts:** file-level uid/gid/mode remapping may be ignored; a root:root 0600 file is unreadable by the non-root Next.js process. On an audited Linux host, protect the secret **parent directory** as root:root 0700 and place the three bind-mounted secret files with mode 0444 (read-only inside their specific containers). Only the root-owned Docker Compose operator should access the host parent directory; audit with docker compose exec -T web node /app/healthcheck.cjs and re-check secret accessibility after upgrades. Alternative orchestrators with true 0400 per-container secret ownership are preferable where available. Never log or commit secret values.
5. Start the reviewed staging stack with docker compose --env-file config.local -f compose.yaml up -d. On an empty DB volume, Postgres bootstrap creates the athena_app account without superuser privileges. Explicitly review migrations and run scripts/migrate.sh --apply-reviewed-staging with ATHENA_VPS_MIGRATION_APPROVED=reviewed-staging-only and ATHENA_COMPOSE_CONFIG=config.local. The operator script records SHA256 checksums in athena_schema_migrations, skips identical replays and aborts if a previously applied file changed. Each unapplied SQL file runs as a single PostgreSQL transaction. Database migrations NEVER run at app startup.
6. To test Google/GitHub login, register exact HTTPS callback URLs, place secrets in the corresponding private files, and add -f compose.google.yaml or -f compose.github.yaml. Never request GitHub repo contents permission merely to log in.
7. To test email OTP, add -f compose.gmail.yaml, approve Gmail API with only gmail.send scope and confirm real message delivery, limits, recovery and spam handling.
8. Validate tenant A/B sessions, session revocation, CSRF, role isolation, controlled backup/restore and load against actual VPS RAM/CPU.
9. Enable both identity release flags only after owner approval and staged acceptance. The current Client Portal stays separate until verified migration.

## Backup and disaster recovery

Backup requires age (an open-source encryption tool), an age PUBLIC recipient key and an independently verified **off-VPS mountpoint**. Keep the DECRYPTION PRIVATE KEY outside the VPS. The backup streams pg_dump through age directly: **no plaintext database archive is written to disk**. An atomic encrypted .age archive and its SHA256 manifest are created on the independent mount; the script refuses an absent/offline mountpoint rather than falling back to VPS storage. It does NOT schedule automatic backups. Verify with scripts/restore-drill.sh --drill /path/to/archive.age from an isolated admin/staging environment using a temporarily supplied decryption identity. That script verifies the SHA256 manifest and streams the decrypted bytes into a new disposable database, never over the production DB. Both delivery availability and backup independence must be tested on a real host.

No single-VPS layout provides guaranteed uptime. For higher availability, a second host and failover would eventually cost more.

## NO-GO

No actual VPS or cloud DB provisioned. No live Linux Docker stack or full backup/restore rehearsal yet. No real Google/GitHub/Gmail credentials, client account migrations or portfolio permissions. Never merge or deploy until staging, provider, security and cost approval.


## Phase 8C.5 reliability improvements (development candidate)

- Docker's healthcheck now verifies **both** the public Next.js HTTP listener and a real restricted PostgreSQL query. A failed healthcheck marks the container unhealthy; Docker restart policies do **not** automatically restart a container solely because it is unhealthy. Monitor this status externally after VPS provisioning.
- GitHub CI now has two **separate Linux acceptance jobs**: PostgreSQL 17 with ephemeral auth and multi-tenant test records, plus a non-root Next.js standalone image running next to PostgreSQL with local bind-mounted secrets. Both work without paid managed providers. Container smoke tests apply reviewed SQL migrations twice and require checksum-safe replay.
- The migration script uses PostgreSQL transactions, a SHA256 schema-migration ledger and an operator file lock. Changes to previously applied migrations cause an explicit refusal rather than a silent reapply.
- The backup encrypts the PostgreSQL dump **while streaming**, requires a distinct offsite mountpoint and writes only a final encrypted archive and its SHA256 manifest. The restore drill verifies integrity and decrypts directly into a disposable database. The private age identity should only be used from an isolated administrative/staging machine. A mountpoint is not proof of physical independence—inspect the actual target provider/device.
- Optional systemd templates in systemd/athena-backup.service and systemd/athena-backup.timer describe daily unattended encrypted backups, but are NOT installed, enabled or scheduled by this PR. Their example paths must be reviewed on your VPS and only activated after real encrypted backup and restore acceptance. Never store a decryption private key in the timer's environment.
- A conservative local-only HTTP benchmark is available at npm run perf:local -- --run-local --origin http://127.0.0.1:3182 --path / --requests 80 --concurrency 4. It refuses all external hostnames, never hits Auth/email endpoints and writes no customer data. CI captures p50/p95/p99 and one-time Docker resource snapshots; they are sample data, not production capacity guarantees.
- For a Linux host using Docker Compose file-backed secrets, note that ownership/mode remapping may be ignored. Secure the **host directory** containing secrets with root-only permissions (0700), keep the three files read-only inside containers (typically mode 0444 under that root-protected directory), and verify readability as the non-root application user. The previous recommendation for 0600 root-owned files was not generally compatible with such bind mounts.

Full acceptance checklist: ../../docs/PHASE8C5_VPS_RELIABILITY.md.


## Phase 8C.6 — optional SMTP relay and mail-delivery resilience

- SMTP is an **optional** transport, not a mandatory paid service. Leave the main Compose file untouched; after obtaining explicit approval, add the overlay named compose.smtp.yaml with ATHENA_SMTP_HOST (approved FQDN), ATHENA_SMTP_PORT (587 or 465), ATHENA_SMTP_SENDER (verified From address), ATHENA_SMTP_USERNAME and a private secret file secrets/athena_smtp_password. Do not commit the secret; keep the host secrets directory inaccessible to ordinary users.
- Gmail can remain the primary method while SMTP is a fallback, or SMTP can be used **without any Google API app**. If both are configured, the From address must match to prevent identity confusion.
- Athena falls back **only** for definite rejection before acceptance (Gmail OAuth refresh failure, Gmail 401 or explicit quota 429). No automatic retry or second provider is used after an uncertain SMTP/Gmail send, avoiding double codes and out-of-order emails.
- Gmail short-lived access tokens are cached in process memory and concurrent token refreshes are coalesced; no refresh token is persisted in a separate cache.
- The localhost-only Identity Lab adds a 60-second resend countdown; this is merely a UX convenience. Backend OTP attempt and request rate limits remain enforced in Better Auth's database tables.
- Real OAuth callbacks and transactional inbox deliverability have **not** been checked. Do not activate public signup until the customer-facing portal, verified mail sender, recovery behavior and real TLS cookies have all passed separate acceptance.
- The standalone Next.js runtime continues to host the API, so SMTP introduces no Redis, background job server or extra public service.
