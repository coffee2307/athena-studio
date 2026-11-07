# ATHENA STUDIO — Local pre-publication hardening / 2026-11-07

**Status: Engineering verification in progress; PRODUCTION NO-GO.** Scope explicitly excludes hosting, domain, DNS, paid services, public tunnels, public indexing, production deploy and merging into `main`. This is not owner, legal, asset-rights, or launch approval.

## Intended limited first release (Production A)

Only public marketing content: homepage, services, founder/research portfolio with factual labels, 15 standalone template previews, process, pricing methodology, manual email/telephone/contact links and legal information. **No customer login/registration, local password auth, cloud identity, private client portal, persistent customer intake, email automation, payments, SitePulse or customer data storage.** The login/signup links can explain that these features are unavailable; visual presence is not activation.

## Code and QA work performed

- Fixed stale unit assertions for mobile demo navigation, default showroom information, actual CSS-module imports and multilingual, SHA-256-versioned screenshot assets.
- Added explicit production-only marketing feature gate covering 11 switches, including independent/local password identity, email sender, operations and SitePulse; violations return NO-GO without exposing secrets. This check does not automatically disable already running features; production configuration must be reviewed and isolated from local secrets.
- Changed ESLint to ignore generated isolated Next.js build folders (`.next-*/`), without ignoring source; local artifact patterns added to `.gitignore`.
- Added real-browser header language/menu regression at 320/390/428/768/980/1440px on Chrome desktop/mobile.
- Improved contrast of small text and action labels on About, Process and four independent demos (SORA, FASHION, LUMA and hospitality), preserving design/layout.
- Updated E2E contract assertions to match existing approved six-step process, three direct mobile contact actions, and the intentionally open mobile email-brief form. No behavior or backend acceptance is faked.

## Latest verified engineering baseline

- `npm run test:unit`: initially 222 passed / 5 failed / 1 skipped (228 tests); final suite 229 passed / 0 failed / 1 skipped (230 tests), including two new marketing safety guard tests.
- `npm run typecheck`: PASS.
- `npm run release:verify`: PASS; no deployment.
- `npm run lint`: PASS, 0 errors; 17 pre-existing/untracked-script warnings; DNA03 symbol gate PASS.
- `npm run test:soft-launch`: 40 route checks, 0 errors, email-draft wizard desktop/mobile PASS, noindex PASS.
- `npm run test:smoke`: PASS for routes, static CSS/JS, CSP and security headers, redirects, robots, anonymous protection and intentionally blocked /api/inquiry.
- `npm audit --omit=dev --audit-level=high`: 0 reported vulnerabilities at audit time, not a guarantee against future vulnerabilities.
- Browser header language/menu test: 4/4 PASS across two browser projects.
- Expanded baseline browser QA: 71 PASS / 16 FAIL / 1 SKIPPED before fixes; 12 were contrast failures across desktop/mobile and four stale user-journey assertions. After changes, the 20 browser tests for commercial/contact/candidate flows passed 20/20.
- Final axe-core WCAG 2.2 A/AA scan: all 12 desktop/mobile route checks (About, Process, SORA, FASHION, LUMA, hospitality) report **0 violations** after the contrast fixes. This is an automated audit, not a physical-device or screen-reader certification.
- `/api/health`: 200. `/api/readiness`: 503 by design while automated inquiry backend is deliberately disabled. **This is not evidence of a broken public brochure site, nor evidence that customer intake is operational.**
- `scripts/production-preflight.mjs --production`: intentionally NO-GO until separate owner sign-offs and clean, approved release on `main`.

## Owner and infrastructure-dependent items still open

1. **Contact ownership and delivery:** Verify real phone, Zalo, WhatsApp, email receipt and a real reply from an independent device/inbox. `mailto:` is an externally sent draft, not server-side lead capture.
2. **Rights and portfolio:** Verify all images, photographs, template assets, project references and case-study claims. Record user-approved evidence of vecarz / Sketchfab McLaren model CC BY attribution and exact redistribution rights; model creator copyright and car manufacturer's trademarks are distinct.
3. **Legal and operations:** Have the responsible service operator review privacy, retention, scope, commercial agreements, pricing, contracting and refund terms as applicable; do not invent a business entity or attest approval automatically.
4. **Physical device QA:** Test real Android Chrome, iOS Safari, smaller GPUs, reduced motion, keyboard/screen reader and cold-cache mobile network; automated emulation is not a substitute.
5. **Deferred by owner:** Hosting, domain and DNS, TLS/HTTPS staging with canonical origin, remote Linux build/CI verification, final GitHub branch review/merge, uptime monitoring, published production rollback run, off-host encrypted backup/restore where persistent data is enabled, release signature and final owner GO.
6. **Scope integrity:** Keep public indexing, production account/identity, automated inquiry and private portal disabled until their independent provider, security and data-retention gates pass.

## Release decision

Engineering work may be merged only after final green checks and owner review; do not publish, expose tunnel, change DNS or turn on account/data collection as part of this task. The preflight's deliberate NO-GO is the correct status while infrastructure and owner approvals remain outstanding.
