# ATHENA STUDIO — PHASE 2 QA REPORT
Date: 2026-10-19
Branch: `feat/athena-phase2-public-portfolio-20261019`
Base: Phase 1 commit `9345872`

## Implemented
Portfolio directory with type filters, two verified-source founder/research case studies and status/provenance labels. Correctly withheld Qrio. Canonical Vietnamese routes and redirects, legal disclosures (clearly draft), OG branding, sitemap/robots and expanded regression tests.

## Automated build and tests (Windows Node 24, localhost)
- ESLint: PASS
- TypeScript: PASS
- Unit tests: 10/10 PASS (6 existing + 4 portfolio provenance and publication-gating tests)
- Next.js 15.5.28 build: PASS, 28 optimized entries
- HTTP smoke: PASS for 19 public/document/image paths, 7 legacy redirects, unpublished Qrio/404, sitemap and preview robots disallow, fail-closed contact API (503).
- `npm audit --omit=dev --audit-level=high`: 0 findings on audit date.
- `git diff --check`: PASS aside from Windows LF/CRLF informational warnings.

## Browser tests
Headless Chrome and Playwright using the built production application:
- Responsive widths: 1440, 1024, 768, 390, 320px; no horizontal scrolling.
- Portfolio shows precisely 2 published entries.
- Button "Nghiên cứu" filters to ECONITH; button "Dự án founder" filters to PHAM; "Tất cả" restores both.
- Case-study routes, draft legal pages, localized services/products/about/contact respond 200.
- Invalid/unverified project slug returns 404; legacy URLs navigate to canonical equivalents.
- Source repository link visible in verified case study; no browser JS exceptions observed.

## Evidence images
- `docs/visual/athena-phase2-portfolio-desktop.jpg`
- `docs/visual/athena-phase2-portfolio-mobile.jpg`
- `docs/visual/athena-phase2-pham-case.jpg`
- Raw Playwright report and screenshots stay in ignored local `.qa/`, not in repository.

## Limitations and residual risk
- Screens are **editorial placeholder illustrations, not authenticated product screenshots**. A gallery schema exists, but no external images may be published without permission.
- Qrio is intentionally not published pending evidence. Neither PHAM nor ECONITH is claimed as a delivered Athena client.
- Legal texts require actual legal-entity and privacy-retention review. No consent manager is needed for deliberately absent nonessential trackers; this must be revisited when analytics/auth are added.
- No email sender secrets, CRM, live SaaS, subscription checkout, authenticated dashboard, real-user metrics or production deployment.
- Visual QA covers supported Chrome modes, not yet full cross-browser/device lab. Formal CWV/a11y audits follow in Phase 4.
- Earlier Phase 0 devDependency audit findings still remain outstanding unless upstream fixes are verified.

## Release gate
Keep Draft PR; no merge, production deployment, DNS update or paid service without explicit user authorization. GitHub-hosted CI must also pass before review closure.
