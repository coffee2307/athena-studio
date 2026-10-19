# ATHENA STUDIO — PHASE 4 / RELEASE & OPERATIONS RUNBOOK
Date: 2026-10-20
Approved [master roadmap](ATHENA_MASTER_ROADMAP.md)
Branch: feat/athena-phase4-readiness-20261020

**Release decision: NO-GO for public production until the owner authorizes and verifies the explicit gates below.**
Phase 4 is an engineering readiness candidate, not an instruction to deploy it.

## Architecture and release prerequisites

- Next.js 15.5.28 App Router on Node.js 24, React 19, TypeScript.
- Public marketing pages are static where possible; contact page, inquiry handler and liveness/readiness handlers are server-rendered/dynamic.
- One modular application. Do not add microservices or a live CMS/auth/payment without validated need.
- Main branch has **not** been changed by the Phase 0–4 Draft PR chain. The restoration point is `backup/athena-phase4-start-20261020`.
- Git review chain: Phase 0 PR #2 → Phase 1 PR #3 → Phase 2 PR #4 → Phase 3 PR #5 → Phase 4 PR #6. Each Phase PR targets its predecessor; `main` is not the base for a release until a separately approved integration sequence.
- Staging deployment must use a separately approved domain, hosting environment and spending limit. No current external staging has been commissioned.

## Monitoring model

| Endpoint | Meaning | Expected when contact providers are absent | Limitations |
|---|---|---|---|
| `GET /api/health` | Liveness of the web application process | HTTP 200, `status=ok` | Does not prove database, email or third-party availability |
| `GET /api/readiness` | Whether required intake provider configuration is present | HTTP 503, `status=blocked` | **Configuration-only**, not a real connectivity/transactional check |
| `POST /api/inquiry` | Real lead intake if all services are verified | HTTP 503, explanatory Vietnamese message | Real delivery cannot be certified without the owner-provided providers |

Operational plan: owner selects an external uptime provider only after hosting approval and configures availability checks for `/api/health`. Intentionally do NOT use `/api/readiness` as a global availability alarm before provider activation; its failure currently reflects an acknowledged deployment gate. Server error and mail/delivery alerts require a logging/monitoring service or private provider dashboard; none is currently connected. Do not log secrets or customer inquiry contents.

## Security posture

- Production runtime dependencies checked with `npm audit --omit=dev --audit-level=high`. Preserve lockfile and pin critical runtime updates.
- HTTP headers include `Content-Security-Policy` with `default-src 'self'`, `object-src 'none'`, `frame-ancestors 'none'`, `base-uri 'self'` and restrictive Turnstile allowances; X-Frame-Options DENY; nosniff; strict-origin-when-cross-origin; restrictive Permissions Policy; COOP same-origin.
- HSTS max-age one year applies **only** when `NEXT_PUBLIC_SITE_URL` is configured with HTTPS (not preview HTTP). Avoid HSTS includeSubDomains/preload before verifying full domain estate.
- **Known CSP trade-off**: because Next.js static hydration and some styles use inline code, policy currently permits `'unsafe-inline'` for script/style. This is **not** a strict nonce/hash CSP. Moving to a nonce-based policy requires careful App Router/server-rendering and trusted Turnstile review; never claim comprehensive XSS prevention from these headers alone.
- Intake requires Origin match, bounded input, explicit consent, Turnstile verification, global + per-hashed-email distributed limits, private Supabase table with RLS/denied browser roles, then database-first insertion before email notification.
- DB and external email/anti-spam providers are **not configured or transaction-tested**. Keep fail-closed configuration. Emergency disable: remove one mandatory intake credential from the hosting secret store and redeploy/restart; the fallback link remains available.
- Retention, privacy terms, legal identity, mail domain and database backup/restore are not signed off. Sensitive data must not enter Git, local screenshots, logs or public status endpoints.
- Keep environment credentials outside version control and test blast radius of service-role key. Rotate on suspected exposure.

## Automated verification runbook

```bash
npm ci
npm run lint
npm run typecheck
npm run test:unit
npm run build
npm run test:smoke
npx playwright install chromium firefox
npm run test:e2e
npm run audit:runtime
```

Playwright tests are against `next start` production output on `http://127.0.0.1:3189`, automatically managed by the suite. The tests cover Chrome/Chromium desktop, Chromium touch mobile, Firefox desktop, routes, mobile keyboard/menu, no-overflow, reduced-motion, no fake inquiry success, liveness/readiness, and automated axe-core checks for WCAG A/AA on major pages.

**Automated axe-core success is not a WCAG certification.** Manual checks still required: Windows keyboard Tab/Shift+Tab/Enter/Escape, touch 200–400% zoom, screen reader NVDA or VoiceOver with headings and landmarks, real phone network conditions, live consent workflow, and visual focus/no overlay traps.

## Performance thresholds and measurement

See [Phase 4 lab baseline](PHASE4_PERFORMANCE_BASELINE.md). Lab measurements use local Chrome, Lighthouse mobile or desktop throttling, localhost on Windows; not globally deployed infrastructure. Treat Core Web Vitals p75 targets (LCP ≤2.5s, INP ≤200ms, CLS ≤0.1) as **pending real-user telemetry**. TBT in Lighthouse is not equivalent to INP. Proposed opt-in RUM requires privacy policy review and a real origin before enabling. Do not add third-party analytics trackers until approved.

## Backup and rollback

Before first real inquiry:
1. Select verified database region and database backup/restore plan, encryption, retention interval and privileged access, with the owner/legal adviser. Document who can request erasure.
2. Prove recovery with a backup restored to an **isolated staging database**, then validate RLS roles. Do not restore production PII into unprotected developer machines.
3. Tag a reviewed release candidate commit and retain previous immutable deployment.
4. Track schema migration IDs and their backward compatibility. Never drop a production table or run destructive migrations without new authorization.

Application rollback after a bad release:
1. Freeze new deployments and record failure evidence, avoiding PII.
2. If intake is unsafe, disable it via secret configuration and confirm website displays the direct-email fallback.
3. Redeploy the last proven immutable application artifact from an approved host, rather than rewriting Git history.
4. Check health endpoint, core public routes, contact fail-closed state, legal pages and analytics after rollback.
5. Database rollback is a **separate high-risk decision**: no blind revert or destructive SQL. Restore only from a validated encrypted backup after an explicit recovery approval.

## Incident response

- **Outage**: identify whether frontend, DNS, provider, contact/DB or mail is failing; distinguish liveness from readiness. Direct email remains a path only if its mailbox is working.
- **Suspected secret exposure**: revoke/rotate immediately with the provider, disable intake, check logs for abnormal usage and follow applicable breach notification rules.
- **Notification failures**: search secure DB for `notification_state=failed`, contact affected leads manually and repair provider configuration; avoid accidentally duplicating customer submissions.
- **Data request**: verify requester before searching, exporting or deleting their records; use agreed retention/privacy procedure.
- **Performance regression**: compare Lighthouse and real-user data by release SHA, test animation/reduced-motion, confirm header and asset changes.

## Unmet launch gates (owner action)

1. **Commercial/legal**: verify actual business/legal entity, privacy notice, retention/deletion rules, terms and contact publication; identify age/representative requirements where applicable.
2. **Portfolio**: confirm PHAM/ECONITH role claims and image publication permissions; Qrio stays unpublished without evidence.
3. **External providers**: create/authorize Supabase, Upstash Redis, Cloudflare Turnstile, Resend, domain-verified sender; provision keys via secure secret management, never chat logs or git.
4. **Real staging**: approve hosting, domain, DNS changes and spending cap. Apply SQL migration, test valid inquiry, failed notification, rejection, abuse limits and restoration on staging.
5. **Human QA**: accessibility/200% zoom, cross-device screenshots, actual mobile performance, legal and copy review.
6. **Ops**: assign an owner/operator for uptime, intake rows with failed notifications, credentials, incident response and backup restores.
7. **Explicit GO decision**: separately authorize release SHA, host, DNS, costs, and rollback contact. Do not merge or deploy in this Phase.

The owner must approve **every** production, DNS, paid, destructive or irreversible change. Mark a release as GO only when all gates have evidence and are signed off.
