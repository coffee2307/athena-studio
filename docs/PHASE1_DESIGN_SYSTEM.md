# ATHENA STUDIO — PHASE 1 / DESIGN SYSTEM & MOTION
Date: 2026-10-19
Approved source of truth: [Master Roadmap](./ATHENA_MASTER_ROADMAP.md)
Branch: `feat/athena-phase1-brand-motion-20261019`

## Direction
**White Edition** — independent monochrome, design/editorial quality benchmarked against PHAM without reusing PHAM assets or layout motifs.

- Primary background `#ffffff`; soft page canvas `#f6f6f4`; support canvas `#ececea`.
- Text `#111213` with neutral greys `#62656a` and lighter labels. No lime palette in the current public UI.
- Typography uses a system UI sans stack (e.g. Segoe UI / Arial / Helvetica) plus Georgia italic to avoid relying on external Google Fonts and maintain Vietnamese diacritics.
- Spacing `--gutter:clamp(20px,4.8vw,78px)`, `--content:1480px`, consistent `--easing:cubic-bezier(.22,1,.36,1)`.
- Reusable interactive patterns: pill CTAs, fine-line dividers, editorial service directory, structured cards, responsive mobile navigation, form field styles.
- Vietnamese labels, headings, notifications and form copy on active public routes, with necessary brand/technical terms retained.

## Official identity
- Real source of truth: `public/branding/logo-symbol-black.svg` (official black owl artwork).
- Header, footer and Hero use the exact asset as a vector.
- `scripts/generate-brand-icons.mjs` derives `favicon.svg`, `favicon.ico`, 16/32 PNGs, 180px touch icon and 192/512 PWA PNGs from the exact official SVG paths. The script does **not** redraw the owl paths.
- `app/manifest.ts` sets Vietnamese language, white theme and correct generated icons. No residual A-letter favicon is used by current metadata.
- Existing supplied wordmark and negative SVG variants remain in `public/branding/` for future use.

## Signature motion: Athena Intelligence Field
- Geometry inspired by owl eyes, symmetry and converging vector trajectories; visually and technically different from PHAM Orbit.
- Vector components are authored as SVG curves with fine monochrome strokes. The official owl mark occupies the central circular focus.
- `HeroField.tsx` responds to fine-pointer movements via CSS variables `--field-x/y` updated through `requestAnimationFrame`. Movement remains bounded, with easing and no React state loop.
- SVG arcs draw on first load. Small guide lines and markers create depth using CSS; no Three.js, canvas runtime, remote image fetch or unnecessary GPU shaders.
- `ExperienceEffects.tsx` adds one-shot IntersectionObserver reveals, a low-contrast decorative custom pointer only for fine mouse devices and route-aware cleanup.
- `PageTransition.tsx` applies a brief lightweight entrance; no delayed navigation, route interception or focus trap.

## Accessibility & motion budget
- Proper heading hierarchy and language metadata.
- Skip link, clearly labelled mobile menu (Escape + outside click), visible keyboard focus.
- `prefers-reduced-motion:reduce` disables field animations, reveals, route entrances and decorative cursor while preserving content.
- Mobile uses native tap interactions and touch pan-y; custom cursor is hidden on coarse/touch pointers.
- Animations primarily change opacity/transform; avoid scroll-synchronous expensive geometry or heavy 3D.
- The image on Hero is decorative inside a labelled illustration; navigation includes descriptive text.

## Current boundary (Phase 1 is visual, not a product launch)
- Portfolio case studies are Phase 2; do not fabricate founder/client results.
- Zalo and WhatsApp links have been added as outbound entry points, but existence of those accounts has not yet been confirmed by owner; validate in Phase 3.
- Contact API remains fail-closed until mail credentials are supplied. Dedicated CRM, auth, database, legal policies and Micro-SaaS are not production ready.
- App uses a mix of English technical identifiers in source code; user-facing copy has been localized. Dynamic old project templates are still reserved for the Phase 2 portfolio rebuild.

## Checklist for Phase 1 acceptance
- SVG owl used in header, footer and Hero.
- White/black design consistent on all active pages.
- Core user-facing copy in Vietnamese.
- Signature field animation works on desktop and degrades on mobile / reduced motion.
- No sideways overflow at tested viewports.
- Escape/outside-click menu interactions, links, contact state and icons test.
- Lint, typecheck, production build, unit tests, smoke tests, independent CI after push.
- Draft PR only; no merge, hosting changes, DNS or paid services.
