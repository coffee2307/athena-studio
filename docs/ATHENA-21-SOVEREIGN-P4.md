# ATHENA-21-SOVEREIGN/v2.0 — P4 export parity and gallery evidence

Date: 2026-10-31. Branch: `feat/athena-dna03-living-creative-20261030`. This is engineering evidence, **not** production approval.

## Implemented

- **20/21 independent exports:** 19 Next.js sites use their individual `templates/<slug>/src/components/Site.tsx`, a site-owned CSS Module and individual routes; the 20th, Digital Creators, now exports the actual native Vite/React/Three.js project rather than the generic Next.js shell. The `auto-showroom` / BLACK VELOCITY remains deliberately legacy until full McLaren 3D/scroll/camera protection can be demonstrated.
- **Digital Creators fidelity:** `scripts/sovereign-digital-creators-sync.mjs --check` compares all 24 native source files and 4 native public assets with `vendor/digital-creators`. Export's own `npm ci` and `npm run build` complete. Its manifest declares `runtime: vite`; Next.js scaffold and its old runtime are removed. Generated `dist` and `node_modules` are excluded from Git. The standalone site has its own package-lock. Its Vite visual identity and static/hash navigation are preserved.
- **Customer branding:** all 19 Next.js templates render the wordmark and/footer brand from site-owned `src/data/site.json`. Four trial scaffolded client websites passed name/data/source contract tests. The native Digital Creators UI intentionally remains an authored club experience; generic `--brand` customization of its visible title is **not yet implemented**.
- **Updated previews:** 19 `public/template-previews/*.jpg` thumbnails were captured from the actual Next.js demo routes with headless Chromium 156, 1440×900, no failed image load, overflow or shared `WorldSite`. The 19 image hashes are unique. Protected auto-showroom and Digital Creators preview imagery was left untouched. Evidence in `.qa/athena-21-sovereign/p4-preview-evidence/evidence.json`; saved only on the owner's Windows machine, not production.
- **CI integration:** `.github/workflows/sovereign-boundary.yml` checks the 21-template architecture, Vite fidelity, scaffold branding and compiles the real Digital Creators native source when the relevant PR files change.
- **Arrow policy:** three leftover diagonal northeast glyphs in the still-legacy auto-showroom standalone scaffold were replaced with ordinary right arrows. The protected live 3D model, original camera logic and CC BY asset were not modified.

## Evidence run (local Windows / Chrome lab)

- Root `npm run test:unit`: **165 PASS, 0 FAIL, 1 SKIPPED** out of 166.
- Root TypeScript check and production build: **PASS** after native export integration and new default brand bindings.
- `tests/sovereign-export-fidelity.test.mjs`: **3/3 PASS** (all nineteen individually configured Next.js exports, Digital Creators Vite parity, four sample customer exports).
- Native Vite standalone: `npm ci --prefix templates/digital-creators`, `npm run build --prefix templates/digital-creators`: **PASS**.
- `scripts/sovereign-p2-p3-qa.mjs`: **38/38** browser cases PASS for 19 migrated sites at 390×844 mobile and 1440×900 desktop. Checks mobile menu, overflow, media, header/footer, five subpages and P2-specific interactions.
- `scripts/sovereign-route-smoke.mjs`: **125/125** URL checks PASS.
- `scripts/sovereign-native-qa.mjs`: **2/2** Chromium mobile cases PASS for native Digital Creators Vite preview at localhost 5178 and its Athena demo redirect.
- `scripts/sovereign-audit.mjs --check`: 20 sovereign, 1 legacy, 0 duplicate UI source groups, 0 duplicate CSS groups, 0 structural failures. `--strict` intentionally FAILS for `auto-showroom`: release remains BLOCKED.

The browser results are from **LAB_DESKTOP** and **LAB_MOBILE_EMULATED**. Neither physical Safari/iPhone GPU metrics nor 200% text zoom/accessible contrast across all pages have been verified, so neither can be described as PASS.

## Remaining release blockers and next milestone

1. **BLACK VELOCITY:** implement an independent exported application using the canonical McLaren GLB, Draco decoder and legally required vecarz attribution. Reuse no `WorldSite` visual components in the replacement. Prove frame-safe camera bounds and 3D/keyframe behavior at 320, 390, 428, 768 and 1440px, drag/reverse/resize and reduced-motion/GL fallback **before** changing its demo route from `legacy`. Do not fake independence with an external iframe.
2. **Native custom branding:** either intentionally constrain native Digital Creators to its owner identity or implement and test correct visible branding/customization; never promise automatic logo substitution when only `site.json` changes.
3. **P5:** independent visual direction critique for all 21 full pages, font/glyph evidence for Vietnamese, AA contrast of rendered buttons, keyboard focus, Safari/mobile frame budgets and actual 3D camera review. Avoid calling screenshot existence equivalent to aesthetic acceptance.
4. No merge to `main`, no production deploy, no public tunnel without separate user approval. The local 127.0.0.1:3182 server is a developer preview only.

Commands: `node scripts/sovereign-audit.mjs --check`; `node scripts/sovereign-audit.mjs --strict`; `node --test tests/sovereign-export-fidelity.test.mjs`; `node scripts/sovereign-digital-creators-sync.mjs --check`; `node scripts/sovereign-p2-p3-qa.mjs`.
