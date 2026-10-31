# ATHENA-21-SOVEREIGN/v2.0 — P0+P1 migration boundary

Approved scope: P0 (audit and browser baseline) + P1 (technical route/migration infrastructure), in a single batch. **No public merge/deploy.**

## Design invariant
No shared **visual component** among the 21 owned website designs: never share header, footer, CTA, site shell, page templates, CSS selectors, authored motion, hero or UI state. Technical tooling and libraries may be shared: Next.js, React, Font Awesome, build scripts, accessibility test utilities and the Athena catalog/route dispatch. A semantic HTML `header` is not a shared React component.

## Actual baseline
Athena's 20 Next.js demos still render `components/templates/WorldSite.tsx`; that file also uses `WorldExperiencePages.tsx` and `WorldMotion.tsx`. All 21 exported projects are present under `templates/<slug>/`, but their `src/components/Site.tsx` is the same source file content across the sampled projects (the audit script produces a complete comparison). Standalone projects are currently not design-independent merely because they have separate directories. Digital Creators live preview is a native Vite static site at `/immersive/digital-creators/index.html`, distinct from its generic Next.js exported scaffold.

## Completed in P1
- Athena demo route entrypoints delegate to an *infrastructure-only* `SovereignDemoRoute`. This resolver owns no UI.
- A 21-entry migration registry declares exact stage `legacy`, `native-static` or `sovereign` and the intended visual archetype for each.
- A sole `LegacyWorldSiteAdapter` isolates existing UI and explicitly declares it transitional. No new independent template may import it.
- `sovereignRenderers` is intentionally empty and fails closed for falsely marked completed templates. P2/P3 must register real per-template implementations and only then mark each as sovereign.
- An audit/CI script checks route isolation, duplicate standalone source/styles, banned visual imports and required registry entries; `--strict` blocks release until all 21 implementations are independent.
- P0 screenshot baseline is stored locally under `.qa/athena-21-sovereign/baseline/`; evidence is not a production deployment and does not imply visual acceptance.

## Intentionally not yet done
P2 and P3 will write 21 original homes/subpages/styles/components and remove the old adapter once all migrate. P4 must verify parity between preview and exported standalone projects; P5 requires browser/accessibility/performance evidence. **Do not claim 21 sovereign templates complete based on this P1 infrastructure.** No McLaren GLB, camera, CC BY attribution, production theme or other unrelated templates should be changed during P0/P1.

## No disguised similarity
The CI gate fingerprints independent source trees and surfaces duplicate hashes. At P1, duplicates are recorded as existing debt, never silently relabeled PASS. In release/strict mode any legacy site, duplicate UI source, or forbidden dependency blocks the build.
