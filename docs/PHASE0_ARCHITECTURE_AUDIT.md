# ATHENA STUDIO — Phase 0 / Baseline architecture & security audit
Date: 2026-10-19 | Branch: feat/athena-phase0-foundation-20261019
Based on approved: [ATHENA_MASTER_ROADMAP.md](./ATHENA_MASTER_ROADMAP.md).

## Observed baseline (before remediation)
- Clean HEAD: `3468535`, rebuilt website in Draft PR #1, `main` at `cc3be13`.
- Baseline backup: `backup/athena-phase0-start-20261019`; prior rebuild backup remains `backup/athena-before-rebuild-20261019`.
- 69 tracked files. Next.js App Router 15.5.25, React 19, TypeScript, one `POST /api/inquiry` route, no database or auth.
- Domain content: four service landing pages in `lib/offerings.ts`; `data/projects.ts` is empty, `/work` redirects to `/products`; legacy `/work/[slug]` is still implemented but has no published projects.
- Branding assets include official owl SVGs but header renders an ornamental A; content is mixed English/Vietnamese and visual theme is dark. These issues belong to Phases 1–2.
- No committed GitHub Actions, reproducible automated tests or versioned baseline architecture audit existed before Phase 0.
- Contact form is disabled if mail provider settings are missing (correct fail-closed behavior); the route sends through Resend only after configuration.

## Critical design reuse decisions
| Area | Keep | Improve later |
|---|---|---|
| App structure | Next.js App Router, React, TypeScript, server-rendered/static marketing pages | Split large presentation files into typed, accessible UI components in Phase 1 |
| Metadata | `lib/metadata.ts`, sitemap, robots | Vietnamese metadata, canonical URLs and richer project metadata in Phase 2 |
| Catalog | `lib/offerings.ts`, service slugs | Vietnamese copy and richer product/service schemas |
| Contact API | Server-side email sending, HTML escape, input checks, contact-disabled state | Trustworthy distributed rate limiting, origin/CSRF model, durable inquiry lifecycle, external email delivery checks in Phase 3 |
| Portfolio | Slug-based route + typed project interface | Strict provenance/status/permission fields; actual work only |
| Visual | Existing responsive rules and prefers-reduced-motion support | Full new monochrome owl design system in Phase 1 |

## Threat inventory and deferred security work
1. **Untrusted IP attribution**: current `x-forwarded-for` input is used for an in-memory per-IP throttle; application code cannot trust arbitrary upstream headers. Phase 3 must use trusted ingress/edge identity and distributed rate limiting.
2. **Per-process throttle**: bypassable across multiple containers or process restarts. Production-ready intake requires centrally enforced limits and bot mitigation before it is enabled.
3. **Request parsing**: JSON is parsed only after `request.text()`, then byte length is checked. Prefer rejecting large payloads based on trusted gateway limits and streaming bounded reads at scale.
4. **Cross-site form submission**: current Origin is checked only when supplied. Must define trusted origin rules for deployed hosts and include defense-in-depth for mutations.
5. **No authentication/authorization/database**: no private user records exist in current public site; adopt explicit RLS and server-side membership checks in Phase 5, not placeholder authentication.
6. **No verified production email delivery**: contact remains disabled until the owner provides and validates the provider credentials.
7. **Security headers/CSP**: `X-Powered-By` is already disabled; add CSP, permissions and transport policy appropriate to actual hosting in Phase 4 without breaking Next.js runtime.
8. **Legal/privacy**: legal entity, data retention, privacy notices and contracts must be confirmed before taking commercial inquiries.

## Dependency security baseline and remediation
Before:
- Next.js locked at 15.5.25.
- `npm audit --omit=dev`: 3 High, 1 Moderate in the production dependency tree.
- Affected packages: next, postcss, sharp, source-map-js.

After:
- Next.js and ESLint config pinned to 15.5.28 (compatible version within 15.x).
- `sharp` 0.35.5, `source-map-js` 1.2.2 and npm override `postcss` 8.5.31.
- `npm audit --omit=dev --audit-level=high`: **0 vulnerabilities** (as observed 2026-10-19).
- Lockfile updated and Next.js production build/route tests passed.
- **Outstanding**: full devDependency audit reports 5 High items in the ESLint toolchain via `@next/eslint-plugin-next -> fast-glob -> micromatch -> braces@3.0.3`. The npm registry reported braces 3.0.3 as latest; `npm audit fix --force` offered a major/downgrade that would break the pinned toolchain. These are NOT production runtime dependencies. Avoid processing untrusted pattern inputs in CI, continue monitoring upstream fixes, and reassess in Phase 4. This is a documented unresolved dev-toolchain risk, **not** a zero-risk certificate.

## Delivery architecture ADRs
- **ADR-001**: Remain on Next.js 15.x while patches and compatibility are validated. Do not force a major upgrade as an automatic reaction to audit output.
- **ADR-002**: Modular monolith and one app; no database or microservices until a real customer workflow needs them.
- **ADR-003**: Save approved scope in Git as a long-lived source of truth, independent of asynchronous personal Memory.
- **ADR-004**: No plaintext secrets or external-service provisioning by default. `.env.example` documents names only; local `.env*` files ignored except example.
- **ADR-005**: Native Node test runner + reproducible HTTP smoke runner + GitHub Actions form the minimum Phase 0 CI. Broader browser tests and accessibility belong to Phase 4.
- **ADR-006**: Retain project URLs and migration strategy while fixing the portfolio in Phase 2.

## Preserved functionality and checks
- Home, services, four service details, products, studio, contact, robots and sitemap all retain their routes.
- Contact must return HTTP 503 and display a clear unconfigured state when delivery is unavailable.
- No fake login, fictitious clients, checkout or SaaS product is introduced.
- Git branch and PR workflow preserves `main`; PHAM repository is not edited.

## Before Phase 1 / outstanding
- Approve detailed owl motion and final typography; verify all official asset file names/variants.
- Confirm ownership and publication rights for PHAM, Qrio and ECONITH.
- Investigate and patch additional devDependency advisories when viable.
- Select hosting and security provider only after explicit separate approval.
