# Athena Immersive Worlds — Implementation checkpoint 1

Date: 2026-10-24. **Feature branch only. Draft / not approved for publication.**

## Intended experience

21 distinctly art-directed websites. Every entry in data/immersive-blueprints.json has its own theme, spatial story and meaningful interaction. This registry is the explicit scope; **planned does not mean implemented**.

### Implemented in this initial checkpoint

- Creative Studio: original procedural 3D sculpture featuring moving metal toroidal forms and a pedestal.
- Architecture Studio: original floor, columns, roof and cantilever architecture study rendered in 3D.
- Auto Showroom: generic and original aerodynamic vehicle **concept** model with geometry-based wheels and controllable views. This is not a licensed manufacturer vehicle.
- The existing Digital Creators site stays vendored from the reviewed upstream revision without replacement.
- All three new scenes render in a **WebGL2 canvas**, using camera ray marching and lighting in GLSL (not rotated 2D pictures).
- Existing real-photo frames remain as fallback if shaders fail, WebGL2 is unavailable, visitors disable 3D, or the platform requests reduced motion.
- Pointer and page scroll interpolate into camera / scene orientation; three preset selectors retain data-preset, aria-pressed, and keyboard interaction.
- User-facing toggle 3D ON / OFF avoids forcing GPU work on battery-constrained devices.
- IntersectionObserver pauses rendering offscreen, document visibility suspends animation, and the mobile render buffer is capped at ~130k pixels per frame (desktop ~320k). Frame-rate targets are capped at 24/40 respectively. These limits are performance safeguards, **not measured achieved frame rates**.
- Scene assets require no third-party CDN; the new proof-of-concept uses native WebGL2 and ships the shader source in the repository without introducing unreviewed dependencies. It does **not** yet use Three.js / React Three Fiber.
- No visitor accounts, booking, payment, or lead submission behavior is changed.

## Why native WebGL2 first?

This step proves that Athena can ship a real GPU pipeline without changing the Next/React dependency lock or deploying a server. Next checkpoint should migrate selected scenes to Three.js/R3F/Drei **only after** an audited and reproducible lockfile update. More complex GLB models and physically based materials will be needed to reach flagship showcase quality.

## 3D design system contracts

1. Every scene has a unique art direction, 3D asset specification, story beats and interaction.
2. Content and navigation are normal HTML; the 3D layer is decorative but responsive to intentional input.
3. Body scroll remains browser-native. Neither wheel events nor scroll position are hijacked; scroll cannot lag behind a brush/subject.
4. No frame loops execute for offscreen stages or background tabs; motion preferences and toggles are respected.
5. Mobile uses independent GPU pixel budgets and native touch scrolling, no fake desktop pointer on touch.
6. Respect asset licences and avoid real brand marks in fictional demo businesses.
7. Render with browser screenshot + interaction capture on 360/390/768/1440 widths before selecting a thumbnail.
8. Keep the library page light: no live GPU scene inside each of the 21 cards. Use real screenshots and load a scene only when opened.

## Required quality gates

- npm ci, npm run typecheck, npm run lint, npm run test:unit, npm run build, npm run test:e2e:chromium.
- Verify no horizontal overflow or inaccessible controls on 360px/390px devices.
- WebGL2 supported browsers: check shader compile, rendering and context-loss behavior.
- WebGL2 unsupported or reduced-motion browsers: photo and functional navigation remain usable.
- Profile real devices: FPS, thermal throttling, GPU memory, scroll jank, load times and interaction latency.
- Check marketing-safe labels, rights to source photographs and content accuracy.
- Browser screenshot evidence for three scenes after GPU QA. Do not reuse the previous static-photo thumbnail as proof of the new render.
- Confirm full Digital Creators painting, Lego and Rubik experience remains intact after staging merge.

## Next implementation cycles

1. Run CI in a PR targeting the Phase 0 branch, rectify shader/browser regressions, verify screenshot evidence.
2. Replace baseline procedural geometry with reviewed artist-quality GLB models and an asset manifest:
   - Studio: curated visual-identity sculptures and an art gallery environment.
   - Architecture: actual modeled interiors, materials, lighting/time of day and floor plan.
   - Auto: independently licensed original automotive model, paint/lights/camera configurator.
3. Introduce scene sequence editor, camera-path tracks, loading-state handoff and purposeful page-to-page transitions.
4. Expand by blueprint phase 2→4 until all 21 are live, with each completed scene separately tested.
5. Owner reviews the actual mobile and desktop views before merge / external preview. The public tunnel stays disabled.

**Status**: First three are playable **proofs of concept**, not yet PeachWeb-level production showcases. Remaining 17 non-original worlds are still planned. Digital Creators is retained as original source.
