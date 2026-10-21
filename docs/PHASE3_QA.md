# ATHENA STUDIO — PHASE 3 QA: secure intake foundation and motion
Date: 2026-10-19
Branch: `feat/athena-phase3-intake-motion-20261019`
Base: Phase 2 commit `752a4ff`

## Delivered
- New scroll-motion engine in `components/experience/ExperienceEffects.tsx`:
  - Auto-discovers reveal candidates across public pages, not just manually marked blocks.
  - Watches newly injected DOM nodes with MutationObserver, preventing filtered Portfolio cards from remaining hidden.
  - IntersectionObserver reveal with stagger and controlled 0→1 opacity, transform and mild blur.
  - Hero and page editorial title entrance, CSS interactions and 2px reading progress.
  - Keyboard and touch remain native, reduced-motion disables decorative movement; no-JS keeps content visible.
- Server-side Phase 3 inquiry pipeline:
  - Strict Origin/Content-Type and bounded body reading; server validation and explicit user data consent.
  - Cloudflare Turnstile challenge verification; Upstash Redis shared throttling with salted email hash and global cap.
  - Supabase private lead table (SQL migration, RLS, no anon/authenticated permissions); Resend email notification after database insert.
  - Mail outage after DB insert returns accepted-with-notification-delay, with notification state stored; database write failure returns 503.
  - Form remains visibly disabled without all service credentials. Direct email fallback has no fake acceptance.
- Vietnamese consent/privacy and three-step intake UX; documentation and migration.

## Local automated tests
| Gate | Result |
|---|---|
| ESLint | PASS |
| TypeScript | PASS |
| Node unit test | PASS **15/15** (includes validation, consent, injection escaping) |
| Next.js production build | PASS, Next.js 15.5.28; contact page verified **dynamic** at runtime |
| HTTP smoke | PASS, including 19 public resources, 7 redirects, unpublished Qrio 404, robots/sitemap, disabled intake 503 |
| `npm audit --omit=dev --audit-level=high` | PASS, 0 production findings as of audit date |
| Browser JavaScript exceptions in tested flows | None detected |

## Browser motion validation
Real Chrome via Playwright in the running production application, five viewports:
- 1440×900: PASS, no overflow, directory row opacity 0→1, reading progress at test scroll ~0.4634, filtered Portfolio visible
- 1024×800: PASS, opacity 0→1, scroll progress ~0.4563
- 768×1024: PASS, opacity 0→1, progress ~0.4397
- 390×844: PASS, opacity 0→1, progress ~0.4606
- 320×740: PASS, opacity 0→1, progress ~0.4597
- 22 auto-discovered reveal candidates on homepage in tested runtime.
- `prefers-reduced-motion:reduce`: reveal observer not activated; computed Hero animation 0 seconds.
- Filter to research after page navigation: ECONITH card visible at computed opacity 1.
- Contact unconfigured: direct email fallback displayed and `POST /api/inquiry` returns 503.

Evidence captured:
- `docs/visual/athena-phase3-motion-desktop.jpg`
- `docs/visual/athena-phase3-motion-mobile.jpg`
- Raw Playwright tests, screenshots and JSON report under locally ignored `.qa/`.

## Limitations and pending checks
- **No third-party real integration has been exercised:** API keys and Supabase project are absent. Cannot claim live storage, notification, mail delivery, rate-limit functioning or Turnstile verification on actual provider endpoints.
- RLS SQL is authored but **not applied** to any database.
- Source code does not deploy a dashboard or automatic delivery retry. Private Supabase dashboard + manual inspection is the planned operational path pending later phases.
- Supabase, Redis, Turnstile and Resend each require owner authorization and configuration; privacy, retention and legal texts remain drafts.
- Chrome automation does not constitute full cross-browser accessibility/performance certification; Phase 4 includes broader Lighthouse and security audit.
- Historical dev-only npm audit warnings remain tracked in Phase 0 documentation.

## Change-control
Draft PR only, based on Phase 2. No changes to `main`, DNS, production, paid services or PHAM. Next phase is Phase 4 operational readiness after external-service gates are approved.
