# ATHENA STUDIO — PHASE 4 QA REPORT
Date: 2026-10-20
Base: Phase 3 commit `1224e33`; branch `feat/athena-phase4-readiness-20261020`

## Change summary
- Pinned reproducible browser E2E tools: `@playwright/test@1.64.1`, `@axe-core/playwright@4.14.0`, `lighthouse@13.5.0`.
- New test suite for Chromium desktop, Chromium mobile/touch and Firefox desktop; CI job runs production build and browser tests separately from unit/build/static checks.
- Automated axe rules found legitimate low-contrast small text across the entire site and incorrect ARIA on the Hero. Updated design-system text tones for legibility, treated watermark as decorative pseudo-element, and corrected Hero landmark semantics.
- Added security headers with constrained resource policy and explicit CSP limitations. No HSTS on localhost HTTP; conditional HTTPS HSTS only.
- Added separated liveness and configuration-readiness endpoints; both return `Cache-Control: no-store`.
- Added Vietnamese route error boundary with retry/home controls and no stack traces/PII.
- Added Lighthouse reproducibility script and release/rollback checklist, without modifying DNS or deploying anything.

## Verified quality gates
| Test | Result |
|---|---|
| Local Node 24 ESLint | PASS |
| TypeScript `tsc --noEmit` | PASS |
| Unit tests | PASS 15/15 |
| Next.js production build | PASS; optimized public pages |
| HTTP smoke / security headers | PASS, 20 public/API resources, 7 redirects, Qrio 404, preview noindex, fail-closed intake |
| Automated Playwright E2E across three browser profiles | PASS **33/33** after contrast/ARIA fixes |
| Automated WCAG A/AA checks across six routes and three profiles | PASS **18/18 scenarios** (subset of 33), no axe violations in tested configurations |
| Production dependency `npm audit --omit=dev --audit-level=high` | PASS, 0 advisories |
| Full dependency audit including lint/dev tools | WARN, 5 High advisories in ESLint → fast-glob → micromatch → braces; reported separately |
| Local Lighthouse 13.5.0 | Home desktop 100/100/100/66, mobile 99/100/100/66, portfolio mobile 99/100/100/66 (Performance/Accessibility/Best Practices/SEO) |

### Lighthouse Core Web Vitals lab values
| Test case | LCP | CLS | TBT |
|---|---:|---:|---:|
| Home desktop | 460 ms | 0 | 0 ms |
| Home mobile | 1,968 ms | 0 | 32 ms |
| Portfolio mobile | 2,092 ms | 0 | 66 ms |

Notes: No observed production p75 INP/LCP/CLS (RUM not connected). Lighthouse TBT must not be interpreted as INP. SEO 66 is expected for preview deliberately disallowed from search indexing; repeat on verified public origin when approved.

## Accessibility finding and remediation evidence
The first full automated suite **failed** all 18 axe checks (mostly low contrast across small grey editorial labels and the very low-opacity decorative ATHENA watermark, plus an invalid ARIA label on a generic Hero div). We did not disable contrast rules or hide meaningful text. Increased text contrast, replaced watermark text by purely decorative pseudo-content, and added `role=img` to the labeled Hero. After a second contact-specific contrast pass, the full suite passed **33/33**.

Automated axe is a narrow gate, not a certificate of WCAG 2.2 conformance. Manual keyboard/screen-reader/zoom testing remains required before launch.

## Headers observed on localhost production server
- `Content-Security-Policy`: default-self, base-self, object-none, frame-ancestors-none, separate Cloudflare Turnstile script/connect/frame allowances.
- `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.
- `Permissions-Policy` denies camera, microphone, geolocation, payment and USB.
- `Cross-Origin-Opener-Policy: same-origin`.
- `Strict-Transport-Security` intentionally **absent** on HTTP localhost; configured for HTTPS origin builds only.
- CSP currently permits inline Next.js hydration scripts, not a strict nonce-based CSP. This remains a documented residual risk.

## Outstanding gates — not completed
- Real hosted staging with HTTPS, DNS/hosting approval and measured CWV/RUM across actual visitors.
- Supabase, Resend, Turnstile and Upstash live transactional tests, credentials, webhook/notice reliability, deletion/retention procedures and tested DB restore.
- Human accessibility inspection with screen readers, 200–400% zoom, motor/touch devices and full legal review.
- External monitoring/alerts and assigned on-call operator (health/readiness endpoint code exists; no uptime monitor provider is connected).
- Approvals for portfolio images, business/legal identity and paid service budget.
- Dev-only five High npm audit findings: no upstream compatible fix verified; monitor and upgrade when patch is available.
- GitHub-hosted Playwright CI must pass independently; do not infer cloud success from local results.

## Current release assessment
**Engineering QA candidate**: local tests passing, backed up in Git, reviewable Draft PR. **Operational release decision: NO-GO** until external dependencies and explicit owner go-live permission are met. No changes have been made to production or main.
