# Athena Studio — Phase 8C.4: Portable Self-Hosted Core

**Status:** Draft research build; NO-GO for commercial traffic or customer accounts.
**Design goal:** Own Athena's backend and data on one inexpensive VPS, with third parties as optional identity or email transports, not as hard business-logic dependencies.

## Decisions

1. Keep **Cloudflare Worker + D1 (Phase 8C.3)** as one valid deployment target, not a prerequisite. Add an independent, single-VPS alternative using **Next.js standalone + Better Auth + private PostgreSQL + Caddy**.
2. Reuse Next.js for both public website and Athena Identity endpoints; **no standalone Auth microservice** needed for low-volume traffic.
3. Auth accepts Google/GitHub OAuth or email OTP through a swappable delivery transport. Even a self-owned OTP issuer must use Gmail/SMTP/another delivery network to reach an inbox. Gmail quotas and OAuth provider availability cannot be erased by code.
4. Use ordinary PostgreSQL with parameterized tenant queries, a separate non-superuser runtime role, no publicly exposed database port, max-five connection pool and bounded timeouts. **No Redis** is necessary at current scope.
5. Keep all new features **OFF by default**. Existing Supabase Auth and Client Portal continue untouched in prior staged state. No automatic user-ID mapping or admin promotion; external GitHub App repo access is NOT implemented.
6. For customer UX, keep forms and clean Vietnamese errors from 8C.1; only offer provider alternatives already configured. When a service is down, never claim an OTP was delivered, never fake a session, and never enable a fallback that bypasses verification.

## Files and implementation

- lib/identity/vps/config.ts — exact HTTPS-origin, localhost-only dev override, double owner opt-in, provider secret file and DB host constraints.
- lib/identity/vps/runtime.ts — server-only secret loading and small PostgreSQL connection pool.
- lib/identity/vps/factory.ts — portable Better Auth session, OTP and optional OAuth provider configuration without Supabase.
- lib/identity/vps/workspace.ts — parameterized user-scoped read-only workspace query.
- app/api/identity/[...all]/route.ts — VPS adapter only when approved; strict POST Origin/JSON/size limit; otherwise local gated Auth or HTTP 503.
- app/api/athena/workspaces/route.ts — verified session required, no arbitrary user-ID input, cache disabled.
- deploy/vps/ — Compose, TLS proxy, multi-stage web image, immutable baseline migrations, dedicated restricted runtime role, optional provider overlays, backup and isolated restore tooling.
- tests/phase8c4-vps-core.test.mjs — provider-gate checks and REAL Better Auth/PostgreSQL wire-protocol integration backed by ephemeral PGlite, plus tenant A/B and runtime DB permission rejection.
- tests/e2e/vps-identity-disabled.spec.ts — the production-facing VPS endpoint is 503 until approved.
- CI — Compose validation and shell syntax checks with no runtime Docker deployment.

## Deployment profile and expected expense

**Provisional entry-class VPS:** test 2 vCPU/2 GB RAM for small traffic; 4 GB RAM preferred where uptime and SSR headroom matter. Do not claim benchmarks without measurements. Build Docker images outside the VPS to avoid memory spikes; deploy immutable digests. Container resource ceilings are defined but need host-level measurements.

Recurring cost can be limited to the VPS and domain, plus any chosen offsite backup capacity or transactional-email sending. HTTPS certificates (Caddy) and self-hosted PostgreSQL, Better Auth and Next.js require no additional managed SaaS subscription. Unpaid Gmail still has provider quotas, reputation policies and OAuth requirements. A single VPS has a single point of failure.

## Required before publish

- [ ] Build and run the full Linux Docker stack on staging (Windows Docker daemon was unavailable in this phase).
- [ ] Measure CPU, RSS, response-time percentiles and OOM behavior under controlled traffic; choose actual VPS RAM/CPU from data.
- [ ] Approve hostname/TLS, set secrets via file mounts, validate exact Google/GitHub OAuth callbacks and secure cookies.
- [ ] Set up and verify live Gmail API sending, OTP resend policy, abuse protection and non-delivery UX; measure quota behavior.
- [ ] Apply reviewed PostgreSQL migrations on isolated staging and audit runtime grants.
- [ ] Prove encrypted backup leaves the VPS; recover successfully on isolated PostgreSQL and document RPO/RTO.
- [ ] Revalidate A/B access, admin isolation, session revocation and token compromise scenarios against a real PostgreSQL container.
- [ ] Build independently authorized GitHub App installation and repo-scoped consent with audit trail before permitting source-code access.
- [ ] Integrate independent identity with the Client Portal and remove the legacy Supabase Auth UI only after reviewed migration and owner consent.
- [ ] Complete privacy/retention terms, basic host security patching, monitoring and incident-runbook drills.

**Nothing in this phase purchases services, enables an Auth flag, starts cron, changes DNS, merges main or deploys to production.**
Full operator playbook: deploy/vps/README.md.
