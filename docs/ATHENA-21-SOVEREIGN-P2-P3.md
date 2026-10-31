# ATHENA-21-SOVEREIGN/v2.0 — P2 + P3 implementation and evidence

Approved in conversation: implement P2 + P3 in one batch; no merge/deploy authorization.

## Implementation architecture (2026-10-31)

The Athena demo router renders the template-owned `templates/<slug>/src/components/Site.tsx` module for each of the 19 migrated sites. Each of those applications owns its own scoped CSS Module, header, footer, mobile navigation, interaction state, homepage, work listing, work detail, services, about and contact. No migrated renderer imports `WorldSite`, `WorldExperiencePages` or `WorldMotion`. The 19 stale generic `src/app/globals.css` files were removed. The common React/Next.js runtime and *technical* route dispatcher are not visual UI.

### P2 — first 3 handcrafted
- `creative-studio` / SORA: editorial magazine with magazine-masthead, asymmetric projects, category filter, five case studies, discipline pages, letter/form, book-end footer.
- `modern-corporate` / NORTH: strategic capability board, business directory, clickable process explorer, three solution cases, business inquiry, non-editorial header/footer.
- `commerce-standard` / MỘC: centered boutique brand, product catalog and filter, five product details, quantity, accessible quick-view and demo cart, care guide, customer form. Font Awesome cart dependency included in standalone package and lock. Replaced unrelated electronics hero with five verified 1400px-wide home-object Pexels photos; see `templates/commerce-standard/public/ASSET-SOURCES.md`.
- All first-three projects are independent Next.js applications under their own template directories, not solely a fresh Athena preview skin. The two with five items now expose `/work/4` and `/work/5` in both demo and standalone export.

### P3 — 16 other site-owned UX source trees
`fashion-archive` (fashion catalog), `saas-product` (app dashboard), `campaign-landing` (campaign poster), `hospitality-booking` (restaurant menu), `editorial-journal` (publication), `architecture-studio` (spatial portfolio), `wellness-clinic` (care pathway), `property-showcase` (residence brochure), `education-platform` (learning board), `pet-store` (friendly pet browsing), `engineering-industry` (technical spec), `finance-trust` (research/data literacy), `construction-firm` (build progression), `music-label` (record sleeve; **no copyrighted audio playback**), `live-concert` (stage poster), `team-intranet` (workspace).

These 16 use distinct author-time archetype configurations from `scripts/sovereign-p3-author.mjs`, generating *independent local source files*, not runtime shared components. Industry-specific visual treatments now also apply to work, service, about and contact surfaces and mobile hero order. This is substantial structural separation, but **final aesthetic sign-off is still required**: the repeated authored subpage vocabulary and individual brand/media choices need further review during P4/P5. Running `npm run build` is not aesthetic approval.

## Verified checks and evidence

- `scripts/sovereign-audit.mjs --check`: 19 `sovereign`, 1 `legacy`, 1 `native-static`; 0 architecture check failures; one duplicate exported `Site.tsx` SHA group containing `auto-showroom` and `digital-creators`. `--strict` intentionally FAILS and blocks release.
- Chromium mobile emulation 390×844 and desktop 1440×900: **38/38 initial visual and interaction checks PASS** across 19 migrated sites, before last CSS refinement. Includes loaded images, no horizontal overflow, hamburger toggle/Escape, 5 standard routes, three first-site interactions and extra case/product routes. Browser screenshot evidence in local `.qa/athena-21-sovereign/p2-p3/`; re-run after the last CSS/asset change for final SHA.
- Standalone `tsc --noEmit` for each of 19 migrated projects PASS.
- Production build in Athena PASS (after 19 migrated imports); targeted standalone `npm run build` passed for SORA, NORTH, MỘC and SaaS.
- Full unit suite on the prior integrated 19-site version: 163 tests, 162 PASS, 1 skip, 0 FAIL. Re-run for final SHA required.
- Pexels photographic source/usage references are preserved in each site's `public/ASSET-SOURCES.md`. Project case examples, product prices, inquiries, and event offerings must not be described as real transactions or customer outcomes.

## Not completed / explicit blockers

1. `auto-showroom` still invokes `LegacyWorldSiteAdapter` to preserve the protected McLaren 3D camera, CSS framing and vecarz CC BY attribution. The standalone exported `Site.tsx` remains generic; cannot be declared sovereign until a true no-regression migration.
2. `digital-creators` live demo already redirects to the native Vite/Three.js application, but its `templates/digital-creators/` standalone export remains a generic Next.js scaffold. P4 must package the actual authorized Vite application instead, maintaining correct licensing, Rubik/brush/LEGO interactions and performance.
3. Exported site brand personalization via `scripts/create-site.mjs --brand` is not yet guaranteed to rewrite every authored visual label; P4 must verify brand/config parity for all 21.
4. Physical iPhone Safari and independent mobile performance measurements, per-template WCAG contrast audit, keyboard/focus QA, visual human signoff for all routes and production deployment remain UNVERIFIED. These are not hidden by compilation/smoke PASS.

## Release policy

All 21 must have independent UI **and** matching standalone exports. Keep `node scripts/sovereign-audit.mjs --strict` blocking until real 21/21. No merge to `main` and no production deployment without separate explicit user authorization. Preserve local working tree backups and preexisting untracked content. The generated gallery thumbnail should only be replaced from actual live browser screenshots after P4/P5 review.
