# Athena Studio Phase 0 — 21 Immersive Websites

Source revision: 2026-10-24. Feature branch only, not a production deployment.

Digital Creators is built from https://github.com/coffee2307/digital-creators pinned to commit e25ebc04174f2ab576e85ce3a99421b6b00a9721.
The GitHub Actions workflow athena-digital-creators-import.yml checks out and builds the original Vite site under public/immersive/digital-creators using a subpath base.
Original artwork attribution is shipped with the static site. The source represents a student-club proposal; forms are demo-only.

Phase 0 changes:
- 21 entries in the template gallery.
- The original interactive Three.js app under /template-demos/digital-creators.
- Three new lightweight CSS-perspective home experiences: creative-studio, architecture-studio, auto-showroom.
- Redesigned editorial /projects with Digital Creators as an owner-created concept.

QA:
- npm run typecheck
- npm run lint
- npm run test:unit
- npm run build
- npm run test:e2e:chromium

Validate on 390px mobile and 1440px desktop; check UI overflow, working navigation, modal preview, reduced-motion, CPU/RAM on low-end devices and the full Vite app interactions. CSS scene objects are conceptual geometry, not photorealistic products.
Do not merge to main or deploy until design review and soft-launch gates are completed.

## Original Digital Creators, NOT a reconstruction

- `vendor/digital-creators/` now contains the original editable source checked out at e25ebc0, including app, scenes, data, docs and artwork.
- GitHub Actions compiles this exact source unchanged to `public/immersive/digital-creators/`.
- The template gallery thumbnail is an actual Playwright screenshot of that running website, stored as `public/template-previews/digital-creators.png` — no simulated Rubik cards.
- The gallery modal opens `/immersive/digital-creators/index.html` directly (single iframe). Full-screen `/template-demos/digital-creators` redirects to the same original site with no Athena chrome.
- The original website must be embeddable in Athena's own origin; route-scoped X-Frame-Options/CSP preserve the security boundary.
- Updating upstream requires a reviewed commit pin and re-running the import workflow. Do not edit the vendored scenes to imitate a replacement design.
