# ATHENA-REFINEMENT-02 — P0–P3 one-batch delivery

Date: 2026-10-31. Approved directly in user request: “gộp p0-p3 làm ngay nhé”. Scope: SORA, NORTH, MỘC, and BLACK VELOCITY only. Branch `feat/athena-dna03-living-creative-20261030`. No main merge, production deploy, public tunnel or change to Digital Creators.

## Design repairs

**SORA / creative-studio:** Added an independent editorial laboratory section to the home route: three human-selectable chapters (“Hình ảnh”, “Chất liệu”, “Nhịp điệu”) with corresponding real template image assets, keyed transitions, strong asymmetrical visual hierarchy and readable labels. Preserved existing collage, magazine section rhythm, mobile contents drawer and reduced-motion support. Removed a needless diagonal arrow in the new control decoration.

**NORTH / modern-corporate:** Removed the source `.impactBody::after` circle that physically occluded a paragraph (not merely its pointer events). Replaced it with a contained, interactive three-step operational map, step indicators, live narrative and clearly separated graphic safe zone. Corrected a malformed font-family shorthand that contained duplicate quotes. Preserved the navy/copper technical schematic identity.

**MỘC / commerce-standard:** Refactored the header wordmark into an explicit `brandName` and `brandDot` inside a stable two-line logo block, instead of placing the punctuation and subtitle in conflicting flex layout contexts. Reduced header min-height and vertical padding on desktop and mobile, separated the category navigation, and preserved the support link in mobile drawer. Added restrained product card entrance and cart-badge feedback with reduced-motion opt-out. Did not introduce generic styling shared with SORA/NORTH.

**BLACK VELOCITY / auto-showroom:** Suppressed the redundant `ix-scene-rail` only when `isAuto`, removing the three buttons, long “INTERACTIVE MACHINE” copy and 3D ON/OFF button from the showroom experience, without removing the real five-chapter cinematic HUD or its camera-scrolling behavior. Moved the compulsory author/model/license links into a compact, available section after the cinematic track; the existing in-stage compact credit remains. Replaced old visible numeric loading progress bar with an accessible animated ring, explicit text, retry action and static-scene fallback. Improved cockpit mobile navigation with a real 48px X close, safe-area padding, scroll bounds, readable Vietnamese labels and reversible drawer animation. All other template navigation patterns are unaffected.

### Attribution / protected model

Authorship **vecarz (@heynic)**, **McLaren P1** source URL and **CC BY 4.0** remain linked, and the UI makes clear that VELAR is not affiliated with the manufacturer. Source `components/immersive/McLarenShowroomScene.tsx`, Draco decoder, `public/models/mclaren.glb`, `lib/showroom-orbit.ts`, `lib/showroom-framing.ts` and cinematic camera keyframes were **not edited**. Updated `config/showroom-protection.json` to rebaseline **only three owner-approved protected UI files**; existing hashes protecting GLB/camera/core framing remain unchanged.

## Evidence

- **Unit tests: 176 pass / 0 fail / 1 skip** out of 177.
- TypeScript root: PASS; Next.js root `npm run build`: PASS.
- `scripts/refinement02-qa.mjs`: **20/20** four-site home viewport checks (320/390/428/768/1440 px), including SORA lab, NORTH map, MỘC header/logo geometry, mobile cockpit X and no text overlap/overflow. This suite uses reduced-motion, so the showroom tests its intentionally static fallback.
- `scripts/refinement02-webgl-qa.mjs`: with normal motion and Chromium SwiftShader, McLaren canvas **ready at both 390 and 1440 px**, no captured JS/console errors, actual vehicle photographed at 390 px. A deliberately delayed `mclaren.glb` fetch showed the **visible spinner** and correct loading text without a numeric progress track.
- Previous three-site browser interaction regression: **15/15 PASS**.
- `scripts/sovereign-p8-layout-qa.mjs`: **90/90 PASS** over six routes (home/work/services/about/work detail/contact) × five viewports for the three independent template sites, plus six actual font-paint evidence samples and 200% CSS-zoom approximation.
- Standalone SORA/NORTH/MỘC TypeScript: **3/3 PASS**.
- `scripts/sovereign-route-smoke.mjs`: **125/125 URLs PASS**.
- `scripts/sovereign-audit.mjs --check`: 20 independent sites, one protected automotive legacy integration, no source/CSS duplicate groups and zero audit structural failures. The **strict release audit remains blocked by automotive's legacy stage**; this is intentional.
- Refreshed **four** `public/template-previews/*.jpg` screenshots from actual tested pages, with auto-showroom preview captured using true rendered WebGL rather than reduced-motion fallback.
- Browser screenshots and logs on Windows: `.qa/refinement02/`, `.qa/refinement02/webgl/`, `.qa/athena-21-sovereign/refinement02-*.log`. Generated local evidence is not automatically uploaded to GitHub.
- GitHub Actions `.github/workflows/sovereign-boundary.yml` now covers these files and runs source lock contracts, typography/collision checks and the four-site Chromium QA on a matching PR. **Workflow configuration is not an assertion that a remote CI run passed.**

## What is not claimed

Physical iPhone/Safari touch/frame rate and WebKit 3D performance are **UNVERIFIED**. Existing screenshots certify the exercised positions only; full camera-space projected bounds at all keyframes were not remeasured in this narrow UI round, although camera/model files remain hash-locked. Legacy architecture and production release blockers remain. The website demo and Github branch are for review, not a live customer deployment.

## Review URLs (available only when owner's local Windows server is on)

- `http://127.0.0.1:3182/template-demos/creative-studio`
- `http://127.0.0.1:3182/template-demos/modern-corporate`
- `http://127.0.0.1:3182/template-demos/commerce-standard`
- `http://127.0.0.1:3182/template-demos/auto-showroom`

No merge or deploy performed.
