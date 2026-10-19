# Athena Studio — Phase 1 QA / White Edition
Date: 2026-10-19
Branch: `feat/athena-phase1-brand-motion-20261019`
Base: Phase 0 commit `807f256`
See [Design & Motion Specification](./PHASE1_DESIGN_SYSTEM.md).

## Implemented and verified
- Official owl vector in nav, Hero, footer, and derived favicon, touch/PWA icons.
- White-and-black responsive design with neutral grays and an independent editorial aesthetic.
- Vietnamese UI copy in actively linked public pages, contact form and outbound messages (proper nouns/technical terms retained).
- Signature owl-inspired vector convergence field, bounded pointer parallax, lightweight scroll appearance, route entrance and decorative mouse indicator.
- Keyboard-operable mobile menu; Escape and outside-click close; touch/pointer coarse fallback; reduced motion.
- Service/catalog, contact and product-not-ready disclosure remain accurate and accessible.

## Local quality gates (Windows workstation / Node 24)
| Check | Result |
|---|---|
| `npm run lint` | PASS |
| `npm run typecheck` | PASS |
| `npm run test:unit` | PASS, 6 of 6 |
| `npm run build` | PASS, 17 optimized Next.js routes/output entries |
| `npm run test:smoke` | PASS: 11 HTTP 200 routes, custom 404, contact API 503 without provider |
| `npm audit --omit=dev --audit-level=high` | PASS, 0 advisories |

## Browser QA (headless Chrome / Playwright, production mode)
| Viewport | Document width | Scroll width | Result |
|---|---:|---:|---|
| 1440×900 desktop | 1440 | 1440 | PASS |
| 1024×768 laptop | 1024 | 1024 | PASS |
| 768×1024 tablet | 768 | 768 | PASS |
| 390×844 mobile | 390 | 390 | PASS |
| 320×740 compact | 320 | 320 | PASS |

Other browser checks:
- `/services` and all four details, `/products`, `/studio`, `/contact`, manifest, PNG icon and favicon respond HTTP 200.
- No JavaScript page exceptions observed in the tested home viewports.
- Responsive navigation opened, closed using Escape and closed on click outside.
- Hero pointer movement updated CSS variable `--field-x` (~6.90px observed for test pointer).
- Reduced-motion testing reported field animation duration `0.00001s`; no animation depended on for core content.
- Email, phone, Zalo and WhatsApp hyperlinks exist. **Third-party messaging account reachability has not been verified.**
- Form is intentionally unavailable without email sender credentials; direct email is displayed instead.

## Visual evidence
- [Desktop Hero screenshot](./visual/athena-desktop-hero.jpg)
- [Mobile Hero screenshot](./visual/athena-mobile-hero.jpg)
- Full-size screenshots and raw browser report remain locally under ignored `.qa/`.

## Outstanding / not claimed
- Phase 1 is NOT a deployment or a public launch. Figma-native editable design screens have not been generated.
- Phase 2 portfolio/case studies, Vietnamese legal pages and canonical URL redesign are not implemented here.
- Auth, database, billing and Client Dashboard require later Phases 5–7.
- Production email delivery, distributed throttling, legal review and DNS/hosting changes remain gated by explicit approval.
- No Lighthouse lab measurements or real-user Core Web Vitals claim is made; performance profiling belongs to Phase 4.
- Dev-only npm audit advisories from Phase 0 remain documented in `PHASE0_ARCHITECTURE_AUDIT.md`.

## Release condition
Keep this as a Draft PR based on `feat/athena-phase0-foundation-20261019`. Confirm GitHub-hosted workflow green before marking the technical review ready. No merge to main or production deployment without separate authorization.
