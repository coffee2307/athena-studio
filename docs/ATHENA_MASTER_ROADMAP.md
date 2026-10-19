# ATHENA STUDIO — MASTER ROADMAP / SOURCE OF TRUTH
Version: 2026-10-19 · Approved by project owner on 2026-10-19
Status: Approved for phased implementation. **Production changes, DNS changes, external service purchases and irreversible operations always require separate approval.**

## Purpose and scope
Build Athena Studio into an independent Vietnamese-language design and technology studio with four business pillars:
1. Thiết kế & phát triển website (Web Development)
2. Chăm sóc website định kỳ (Website Care)
3. Tích hợp trí tuệ nhân tạo vào quy trình doanh nghiệp (AI Integration)
4. Nghiên cứu và phát triển công cụ Micro-SaaS (Product Lab)

Athena's public site must directly demonstrate the craft of the studio. Support clients through an eventual secure portal, but do not implement infrastructure without verified need. Preserve truthful distinctions among Athena-delivered client work, personal founder projects and ongoing research.

## Decisions already approved
- Website UI, content, forms, legal pages, notifications and email templates **in Vietnamese**; proper nouns and necessary technical jargon may remain in English.
- Main visual palette: white / warm whites / black / neutral grayscale; black owl emblem and original official SVGs, not old stylized letter A.
- Approved official identity files from uploaded assets: logo-symbol-black.svg, logo-symbol-and-wordmark-black.svg, logo-wordmark-black.svg, reversed white variants and favicon/manifest raster assets. Verify exact identity and sizes during implementation; use SVG for scalable UI.
- Brand identity is independent of PHAM. PHAM is only a quality benchmark for UX and motion, not a source of brand assets or an implied Athena client.
- Hero motion research direction: "Athena Intelligence Field", using logo-derived converging geometries. Prefer lightweight SVG/CSS/Motion, WebGL only if a benchmark proves value; support prefers-reduced-motion and touch devices.
- Preserve Next.js App Router, React and TypeScript unless a demonstrable technical reason justifies change. Prefer modular monolith to premature microservices.
- Portfolio candidates: PHAM, Qrio, ECONITH plus future projects; obtain provenance, rights and current project state before publishing claims.
- Public official contact: coffee2307@gmail.com, telephone 0965747147. Add working and verified Zalo/WhatsApp links; do not assume an unverified link works.
- Auth architecture to support email/password, Google OAuth, email verification, password reset, session management, profile and strict admin/client authorization. No fake auth or hardcoded secrets.
- Supabase/PostgreSQL with RLS is an architectural candidate, **not yet commissioned**; auth and dashboard should only follow business readiness.
- Production restrictions: no deployment, DNS updates, paid services, data deletion or irreversible changes without explicit owner approval.
- Stable main and backup branches must remain intact; PR reviews and per-phase validation are required.

## Roadmap and gates
### Phase 0 — Security, architecture and delivery foundation (NOW)
Scope: evidence-backed repository audit, dependency vulnerability remediation, baseline performance and route map, component inventory and reuse decision, legal/operational gaps inventory, branch protection strategy, tests and CI foundations, configuration and secret hygiene, rollback plan.
Outputs: vulnerability inventory before/after, patched dependencies with lockfile, test scripts and Github Actions checks, architecture decision record, baseline audit and QA report, clean feature branch and draft PR.
Acceptance: lint, typecheck, production build, smoke/API tests; no unresolved known critical/high production dependencies without explicit documented risk exception; main and PHAM untouched. No deployment.

### Phase 1 — Vietnamese identity, design system and motion prototype
Scope: correct official owl artwork, favicon + manifest, black-on-white premium identity, Vietnamese editorial style, type scale, spacing, reusable UI primitives, header/footer/navigation, contact visual foundation; prototype a signature SVG/CSS/Motion hero, scroll reveals, responsive microinteractions and touch/reduced-motion alternatives.
Outputs: tokens, components, documented motion specs, representative desktop/tablet/mobile page, screenshot reviews.
Acceptance: no unintentional English UI; visual quality review; keyboard and touch parity; reduced motion; performance budgets.

### Phase 2 — Public site, services and verified portfolio
Scope: Vietnamese home, About, four services and details, real portfolio index and project case studies, Micro-SaaS Product Lab clearly marked by readiness, contact, privacy/terms/cookie disclosures, SEO/metadata, OG assets, responsive and redirects from existing URLs.
Portfolio model: title, slug, project ownership, contribution/role, category (Athena client / founder-owned / research), status, permission_to_publish, image provenance, problem, solution, technologies, dated verifiable outcomes and gallery. Do not invent claims.
Acceptance: no placeholder case studies masquerading as completed work; all public routes usable; metadata accurate; migration-safe URLs.

### Phase 3 — Lead intake and minimal operations
Scope: reliable Vietnamese contact form, links to email/phone/verified Zalo/WhatsApp, server-side validation, anti-spam with distributed rate limiting, email service, lead record/notification lifecycle, privacy/retention rules.
Acceptance: tested real email delivery in staging, duplicate/retry/failure handling, server confirms success only when accepted by provider, safe logs and no secrets in client bundle. External services/domain require user action.

### Phase 4 — Public launch readiness and release gate
Scope: staging, Lighthouse/Core Web Vitals lab baseline, Playwright cross-browser/mobile and accessibility tests, dependency scanning, security header review, monitoring, backup/rollback, CI/CD gates, incident response and legal/commercial readiness.
Acceptance: clean critical/high dependency posture or documented approved exceptions, no blocker a11y/security defects, p75 CWV targets LCP <=2.5s, INP <=200ms, CLS <=0.1 when enough RUM exists; practical keyboard/touch/prefers-reduced-motion checks; no DNS/production without separate sign-off.

### Phase 5 — Identity, authentication and access control (V2)
Scope: secure accounts with email, Google OAuth (credentials supplied later), verification, password reset, profile, session lifecycle, admin/client role boundaries; relational data model and migrations.
Candidate: Supabase Auth + PostgreSQL/RLS with server authorization, evaluated for cost/limits and licence.
Acceptance: automated cross-tenant isolation tests, secure cookie/session flow, authorization at database and server, no fake account UI.

### Phase 6 — Client dashboard and operations (V2)
Scope: customer projects, status, milestones, documents with scoped access, tickets/messages and basic notifications, project administration, audit events. Responsive functional dashboards without excessive animation.
Acceptance: customer A cannot access customer B's records or files by modifying IDs; lifecycle actions logged; error/empty/loading states and tests.

### Phase 7 — Product Lab and Micro-SaaS (long-term)
Scope: validate user problems and willingness to pay; prototype limited SitePulse monitoring concept or stronger validated opportunity; documentation/onboarding/observability, tenancy, pricing and billing only when legally and commercially ready.
Acceptance: working narrowly scoped MVP tested with real users, operating costs measured, no simulated SaaS status presented as production.

## Technical choices
- Keep Next.js + TypeScript as the application core.
- Shared tokens, accessible reusable components, SSR/SSG for public content.
- CSS/SVG/Motion for motion, WebGL/Remotion optional when proven necessary.
- PostgreSQL and managed authentication when V2 genuinely needs persistence.
- Vitest/node:test for units, Playwright for E2E, axe-core for a11y, Lighthouse for performance, GitHub Actions for CI.
- Production defense: server input schemas, origin/CSRF controls, output encoding, CSP/secure headers, audited dependencies, verified secret management, edge/shared rate limiting, privacy/retention, monitoring, backups.
- Content management begins with typed data and can migrate to CMS if editorial workflows justify it.

## Deliverable protocol per phase
1. Scope and current baseline with evidence.
2. Git branch & rollback reference.
3. Changed files, diff and architecture impact.
4. Working features and screenshots at representative viewports.
5. Lint, types, tests, production build and security checks.
6. Known limitations, blocked integrations and required owner actions.
7. Link to a reviewable Draft PR, never merge by assumption.

## Launch prioritization
Required V1: Phases 0–4 (brand, Vietnamese public site, truthful portfolio, contact and operational baseline).
Recommended V2: Phases 5–6 (accounts, Google OAuth, customer dashboard).
Long term: Phase 7 and advanced billing/CRM.

## Owner-only approvals and timing
- Before Phase 1: approve final white/black aesthetic and Hero interaction prototype.
- Phase 2: approve PHAM, Qrio, ECONITH provenance, images, rights, case study wording.
- Phase 3: confirm publication of official contact and validate Zalo/WhatsApp reachability; configure sender identity / owned domain as required.
- Before public launch: approve business/legal identity, privacy/terms, hosting, expense plan, DNS and production activation.
- Before Phase 5: provision Supabase and Google OAuth app, supply credentials through secure channels only.
- Before Phase 7: approve first SaaS business case and spending cap.

## Canonical review locations
Repository: https://github.com/coffee2307/athena-studio
Previous rebuild: https://github.com/coffee2307/athena-studio/pull/1
This document is versioned in Athena's Git repository so future ChatGPT sessions can locate the exact approved scope, regardless of whether personal Memory updates asynchronously.
