# Athena Studio Phase 8C.5 — Reliability and low-resource acceptance

**Date:** 2026-10-21. **Status:** engineering/CI candidate only; NO-GO for public identity.
**Parent:** Phase 8C.4 self-hosted VPS core, Draft PR #22.

## Objectives and improvements

1. **Avoid fake availability.** The Docker web container readiness probe now checks both localhost Next.js /api/health and a real authenticated PostgreSQL SELECT 1. DB failure is reported only as a generic healthcheck failure, never with provider/credential details. Public marketing pages can remain functional even if protected identity is unavailable.
2. **Verify actual Linux behavior.** A separate GitHub Actions job launches PostgreSQL 17 in an isolated CI service, applies immutable reviewed migrations to an *empty* test database named athena_ci and verifies OTP, session, replay denial, user-scoped workspace reads and inability to update memberships as the restricted app role. It refuses to run against any nonloopback or differently named DB. A second CI job builds the actual standalone Next.js Docker image and starts the private web/PostgreSQL Compose containers with **fake ephemeral secrets**, tests fail-closed API and DB-backed healthcheck, then tears everything down. No VPS/cloud product is provisioned by these jobs.
3. **Avoid leaving plaintext backup archives on disk.** The operator's PostgreSQL backup now streams directly from pg_dump into age encryption, writing only a partially encrypted .part file. Publication uses atomic rename followed by a SHA256 manifest on the required independently mounted offsite target; a failed stream is removed. The restore drill checks SHA256 and streams age decryption into an isolated disposable DB, never the live database. This is code and CI validation, NOT proof a real offsite backup exists or has been restored yet.
4. **Make migration replay safe.** Explicit opt-in migrator records file SHA256 in athena_schema_migrations, refuses drift, skips identical migrations, runs unapplied files in a transaction, and serializes simultaneous operator invocations with flock. It is not invoked by application startup.
5. **Performance with guardrails.** A bounded HTTP sampler runs only against localhost (root/static/health), max 300 requests and 12 concurrent workers, 3.5-second request deadline, and reports p50/p95/p99/error counts. CI samples health and public page from *inside* the standalone container and records a one-off Docker CPU/RAM snapshot. These figures represent noisy CI runners, not a production 2 GB VPS benchmark.
6. **Cost and supervision.** No Redis, broker, hosted identity SaaS, background scheduler or third-party website API added. Template systemd backup service/timer is provided but NOT installed or enabled; owner must first approve the independently mounted backup destination, hold recovery private key externally and complete a real restore drill.

## Local tests

From the repository root:

    npm ci
    npm run test:unit
    node --test tests/phase8c5-reliability.test.mjs tests/phase8c4-vps-core.test.mjs
    npm run lint
    npm run typecheck
    npm run release:verify
    docker compose --env-file deploy/vps/config.example -f deploy/vps/compose.yaml config --quiet
    bash -n deploy/vps/init/01-roles.sh deploy/vps/scripts/*.sh

To measure an explicitly local production build:

    npm run build
    npm run start -- -H 127.0.0.1 -p 3182
    node scripts/phase8c5-benchmark.mjs --run-local --origin http://127.0.0.1:3182 --path / --requests 80 --concurrency 4

The benchmark explicitly rejects public IPs and nonlocal hostnames and NEVER touches login/OTP endpoints, real customers or external infrastructure.

## Key security/operations constraints

- Secrets: with Compose file-backed mounts, chmod 0600 root-owned host files can be unreadable by the app's non-root UID. Limit the **host secrets parent directory** to root:root 0700 and ensure the files are read-only but readable inside only the containers where explicitly mounted (for standard bind mounts, 0444 on files in that root-protected parent). CI Linux container smoke is the actual compatibility gate. Never expose the host secrets parent to unprivileged users.
- Build images off-VPS; keep one Next.js process (max five DB connections) and one PostgreSQL instance (private network), only publish Caddy 80/443. Existing memory limits are provisional; collect p95 and working-set under actual target load before buying VPS.
- A single VPS + restart policies cannot meet high availability during host outages; backups and a tested restore are required but cannot guarantee zero downtime.
- Optional Google/GitHub/Gmail providers still have their own availability/quota constraints. This phase does not promise transactional-email deliverability; do not allow email verification bypass when an email provider is down.
- Recovery scheduler templates must not be enabled automatically, and their path assumptions (/opt/athena/current, /mnt/athena-offsite, /etc/athena/backup.env) must be reviewed and adjusted on an actual host.
- The currently active Client Portal remains on its prior gated architecture. Independent Auth sessions do not inherit any Supabase UUID, tenant memberships, admin privileges or GitHub repository permissions.

## Release blockers

Still required before commercial publish:

- End-to-end real Google/GitHub/Gmail OAuth callback and email-delivery tests, plus a customer-friendly alternative for provider outages.
- Production-like identity API + workspace A/B tests with real TLS, cookie flags, CSRF, sign-out and session revocation on the chosen domain.
- Linux Docker image/Compose and migrations passing independent CI; operator has not deployed or run them on an owned VPS.
- Real encrypted off-host backup AND restore rehearsal, with documented retention/RPO/RTO.
- Measured throughput/latency/RAM and DB connection pressure on a chosen 2 GB or 4 GB VPS; review before publishing.
- Port firewall, SSH, patching, secret rotation, reverse-proxy header hardening and incident alerts.
- Account migration and UI Client Portal integration subject to explicit owner sign-off.

**No production site, DNS, Supabase staging, payment method, or customer database has been altered.**


## Measured local-only baseline, October 21, 2026

Next.js production build on the connected Windows development machine, bound to 127.0.0.1:3182, with a capped sampler (80 requests/target, concurrency 4). The two samples ran close together and can contend with each other.

| Endpoint | HTTP success | p50 | p95 | p99 |
| --- | --- | ---: | ---: | ---: |
| Public homepage | 80/80 | 9.9 ms | 16.2 ms | 88 ms |
| /api/health | 80/80 | 9.1 ms | 27.5 ms | 92.9 ms |

Raw evidence remains ignored in .qa/benchmark-home-20261021.json and .qa/benchmark-health-20261021.json. This is not a throughput SLA or a benchmark on a small Linux VPS; geography, TLS, storage contention, cache warmth and concurrency differ. No customer account or OTP endpoint was exercised.
