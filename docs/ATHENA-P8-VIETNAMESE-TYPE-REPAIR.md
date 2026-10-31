# ATHENA-21 — P8 Vietnamese Typography and Layout Rescue (SORA/NORTH/MỘC)

Date: 2026-10-31. Scope: three standalone template projects only; no production merge/deploy or public tunnel authorized. User approved P0–P3 remediation in the conversation after providing five screenshots of typography, image/text collision, redundant close UI, and squeezed navigation.

## Root causes verified

- SORA contact label previously painted **Georgia 26 glyphs + Times New Roman 1 glyph** (Chromium CDP, Windows, 390 px), not just a declared font-stack issue. SORA title painted Times New Roman and Be Vietnam Pro Italic, also mixed. The issue is actual glyph fallback and font metric mismatch, distinct from encoding corruption.
- SORA authored `Georgia` / `Times New Roman` on serif labels and headlines, used very tight `line-height` and strong negative tracking for accented Vietnamese. Its first and third project cards used large positive/negative offsets, allowing media to encroach on other card text.
- MỘC had a fixed-height three-column header/secondary band despite longer localized labels. On a 390 px screenshot, a desktop `Hỗ trợ` link escaped its intended mobile breakpoint and was squeezed between the logo and bag icon.
- SORA, NORTH and MỘC all showed visible `Đóng` / `Khép lại` text alongside ×, and SORA had a redundant second close CTA, contrary to the user's X-only requirement.

## Implemented fixes (P0–P3)

1. Ban **Georgia** and **Times New Roman** from the *authored CSS of these three templates*, replacing legacy font-family and font shorthands with self-hosted `Noto Serif` (display) and `Be Vietnam Pro` (interface). The independent Next.js layouts import Unicode-capable fontsource CSS and their package/lockfiles pin both families to **5.3.0**. Existing unrelated website CSS/21-template library is outside this patch and may still contain migration debt.
2. Increase Vietnamese headline leading, reduce negative letter spacing, use robust wrap/balance rules and explicit label/form font; remove SORA third card's negative margin and preserve whitespace around all project images and text. Keep creative asymmetry without accidental content intersection.
3. Allow MỘC header and category strip to grow with localized copy instead of overlapping rows. On mobile, hide redundant desktop-only Help link while retaining support inside its distinct menu; shorten the announcement to one compact line.
4. Exactly one visible × close control in each opened mobile drawer, with appropriate accessible aria label and minimum 44px hit target. Preserve SORA/NORTH side panels and MỘC bottom sheet, backdrop/Escape behavior and exit transition.
5. Add `tests/sovereign-p8-type-layout.test.mjs` for forbidden fonts and X-only structure, `scripts/sovereign-p8-layout-qa.mjs` for browser-rendered geometry, real CDP font painting, 200% CSS zoom approximation, header/nav and mobile menu. Wire both layers into `.github/workflows/sovereign-boundary.yml` as source gate plus dedicated Chromium build/preview job. This CI change is configuration, **not** proof that its remote run has passed.

## Verified Windows/Chromium lab evidence

- `npm run typecheck`: PASS.
- Athena root `npm run build`: PASS on final P8 source.
- Main `npm run test:unit`: **172 PASS / 1 SKIP / 0 FAIL** in the P8 regression batch.
- Previous interaction/motion QA `node scripts/sovereign-three-rescue-qa.mjs`: **15/15 PASS**.
- P8 browser QA: **90/90 PASS** (3 templates × 6 routes [home, work, services, about, work/1, contact] × 5 viewport widths [320,390,428,768,1440]). Includes first-fold image/text rect collision, localized navigation bands, one close × on mobile, reduced motion, expected page content and 200% CSS-zoom check on 390 px.
- CDP painted fonts in affected SORA labels/headings: **Be Vietnam Pro Medium, Noto Serif Regular/Italic**; no Georgia or Times New Roman across 6 inspected font samples on 320/390/428.
- Visual screenshots and structured logs at local Windows `.qa/sovereign-p8/`; refreshed exactly three real screenshot-based `public/template-previews/{creative-studio,modern-corporate,commerce-standard}.jpg`.
- Each standalone Next.js template must separately pass `npm run build --prefix templates/<slug>` to preserve exported-font integrity; see logs at `.qa/athena-21-sovereign/p8-*-standalone.log`.

## Limits / release blockers

- 200% CSS zoom test is not equivalent to every browser's native accessibility font enlargement setting.
- Physical Safari/iPhone and WebKit-based glyph shaping/performance not independently verified in this run; don't call them PASS.
- Automated geometry targets known collision regions; human screenshots remain necessary to identify unintended visual awkwardness not captured by rectangle tests.
- No merge of `main`, no production deployment, no public tunnel. Broader 21-template release remains gated on protected BLACK VELOCITY export and independent visual acceptance.

## Local review

- `http://127.0.0.1:3182/template-demos/creative-studio`
- `http://127.0.0.1:3182/template-demos/modern-corporate`
- `http://127.0.0.1:3182/template-demos/commerce-standard`
