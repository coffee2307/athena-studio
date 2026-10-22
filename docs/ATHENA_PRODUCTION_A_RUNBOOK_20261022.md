# ATHENA STUDIO — Production A release runbook (22/10/2026)

**Scope:** public Vietnamese-language agency website, service pages, portfolio, legal pages and working contact paths. **Not** production Identity, customer data portal, payments, marketing tracking, Supabase migration or repository access.

**Status:** Engineering candidate. **NO-GO** until real evidence and an owner-approved release SHA. All external services, DNS, VPS spend and production feature flags remain unchanged.

## Implemented safeguards on this branch

- PR #33 is merged into `main` as `7c12f54`, resolving the CSS/preview asset collision and mobile authentication buttons.
- Main global stylesheet `athena-monochrome.css` is imported **once**.
- Search indexing is **OFF by default**, including when `NEXT_PUBLIC_SITE_URL` points to an HTTPS staging site. Explicit, reviewed `ATHENA_PUBLIC_SITE_RELEASE_APPROVED=true` and an exact secure public URL are required to permit indexing. Quick tunnels, loopback IPs and preview builds are denied.
- `scripts/production-preflight.mjs` is a **read-only** go/no-go preparation tool, not a deployment command. Candidate mode runs in GitHub CI; production mode refuses unapproved domain/flags/branch, unbuilt code and missing manual signoffs.
- When `/api/inquiry` is unconfigured, /contact still offers the existing generic email composer and now an optional structured **email draft**. It does not POST, store, claim successful submission or request credentials. The visitor must send the email separately.
- No unverified Auth/Client Portal feature is automatically enabled.

## Commands — safe before purchase or deployment

```powershell
cd "F:\Athena Studio"
npm ci
npm run lint
npm run typecheck
npm run test:unit
npm run release:verify
npm run release:preflight
npm run build
npm run test:e2e
npm run test:smoke
npm run audit:runtime
```

`npm run release:preflight` must return `AUTOMATED_CHECKS_PASS_NOT_DEPLOYED` in candidate mode and demonstrate that unapproved content remains noindex.

`node scripts/production-preflight.mjs --production` is intentionally expected to exit nonzero in a local branch or without external proof. This should not be changed merely to make CI green.

**Post-update preview canary:** Run `npm run preview:canary` for nine public routes, hashed CSS and JS, noindex, Basic Auth and blocked mutations. Repeat using `ATHENA_PRIVATE_PREVIEW_ORIGIN` on the live verified quick tunnel. Samples do not prove a mobile 5G SLA. Runtime npm dependency audit allows at most three retries for explicit transient provider outages; a real High/Critical vulnerability, unknown error or permanently unavailable advisory service must fail the release.

## Production A — required independent, real-world evidence

| Gate | Owner/operator evidence to capture | Current status |
| --- | --- | --- |
| A0 — Release commit | Exact merged `main` SHA, clean tree, green CI, artifact checksum and rollback SHA | Pending final release |
| A1 — Domain and TLS | Owner-approved real HTTPS hostname, DNS propagation, valid certificate, correct proxy headers, no preview domain | Not verified |
| A2 — Functional intake | Test email to real inbox and reply received. If using the backend inquiry API: real spam challenge, limits, durable storage, notification and retention deletion | Only draft/email fallback verified in code |
| A3 — Portfolio rights | Explicit authorization for images and factual claims; PHAM/ECONITH never expose private source | Owner review needed |
| A4 — Legal | Confirm data controller/contact, collection and retention terms, applicable business/legal identity and consumer commitments | Owner/legal review needed |
| A5 — Mobile quality | Real-device 320–428px/Android, reload/back/navigation, cached and fresh CSS, Chrome/Firefox, accessibility and keyboard checks | Automated evidence; field acceptance needed |
| A6 — Performance | Real-host p50/p95 response/load, Lighthouse lab, field LCP/INP/CLS and network failure tests | VPS and field data absent |
| A7 — Security | No High/Critical unmitigated production findings; TLS/firewall/updates, secrets, hardening, logs and no customer data leak | Automated checks only |
| A8 — Recovery | Off-VPS encrypted archive, isolated PostgreSQL restore rehearsal, tested rollback and alerts | Not verified |
| A9 — Explicit GO | Owner approves release SHA, hostname, costs, live contact, SEO indexing and rollback window | NOT granted |

**No automated test constitutes A3, A4, A8 or A9.** The `ATHENA_OWNER_*` environment attestations used by production-mode preflight are declarations only; preserve the external evidence separately.

## Suggested staged deployment profile (not executed)

- Ubuntu LTS 2 vCPU / 4 GiB RAM starting test profile, reviewed after real resource measurements.
- Caddy on 80/443 with HTTPS and hashed static asset caching; Next.js standalone; PostgreSQL 17 on private Docker network only if a persistent feature truly requires it.
- Build immutable Docker images on CI, not on small VPS. Deploy reviewed SHA by digest, never `latest`.
- Optional Better Auth and mail providers stay **OFF**; do not reuse localhost OAuth apps, development cookies or credentials in production.
- No publicly accessible Node or database port. Runtime secrets through protected mounts. Store age decryption private key outside the VPS.
- Implement uptime and disk/RAM alerting, encrypted off-host backup and an isolated restore drill before activating persistent personal-data workflows.
- Default noindex until A0–A9 sign-off and verified public domain, then rebuild with explicit release flag. Rollback must restore the prior Docker image and match database schema compatibility.

## Production B — independently gated after public site launch

1. Verify production Google/GitHub authorization with HTTPS callbacks, OAuth state/CSRF/cookies, replay denials and session revocation.
2. Verify real Gmail/SMTP OTP delivery, resend/backoff/recovery and fallback behavior without fake delivery claims.
3. Prove tenant A/B workspace isolation, positive and negative access control, upload permissions, admin role isolation and logged audit trail on chosen persistent database.
4. Obtain owner authorization for Client Portal data migration and any GitHub App repository access. No privilege elevation by matching email addresses.
5. Only then enable relevant release flags with a separate rollback decision.

## Next phases

- **P0:** freeze main baseline and eliminate preview/CSS race conditions.
- **P1:** manual page-by-page UX sign-off (especially mobile nav/footer, forms and error states).
- **P2:** approve truthful portfolio, complete client email flow and contact delivery; finalize SEO and legal.
- **P3:** VPS staging, real TLS, domain and verified CI-built artifact.
- **P4:** operational security, backup/restore, external alerts, performance and rollback.
- **P5:** independently verified identity (Production B).
- **P6:** workspace/customer dashboard and only the needed project management features.

Never publish a live production environment from a Cloudflare quick tunnel or treat its basic-password preview as production hosting.
