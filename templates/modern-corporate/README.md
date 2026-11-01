# NORTH — Decision Architecture

NORTH is an independent Next.js 15 / React 19 template for a fictional B2B systems and operations advisory practice. Its creative direction was approved on 2026-11-01 as part of Athena DNA-04. This is a **demonstration website**, not an actual consulting company, verified client portfolio, or automated advisory service.

## Visual thesis

**From complexity to a clear next move.** NORTH uses paper-like surfaces, dark architectural blueprint fields, copper-orange active paths, large Vietnamese editorial type and an interactive systems map. All customer-facing visual components and styling belong to `templates/modern-corporate`. Nothing is borrowed from the UI of other templates.

The home page opens with a three-node operating atlas. Clicking a node changes the highlighted path, question, approach and destination in the capability index. Supporting sections use a three-step method diagram, an editorial capability index and a contrast-rich closing conversation prompt rather than repeating three equal cards. Movement is tied to the pointer or user action, is bounded, and disables animation under `prefers-reduced-motion: reduce`.

## Routes

- `/`: interactive systems map, methods, capability index and narrative.
- `/work`: three distinct decision studies. These are hypothetical scenarios, **not customer case studies**.
- `/work/1`, `/work/2`, `/work/3`: issue, approach and expected deliverables.
- `/services`: four-stage operating method with interactive project blueprint.
- `/about`: philosophy, principles and system thinking.
- `/contact`: locally completed brief; opens an email draft for the user to choose the recipient and send. **No server submission or data storage**.

The same independent component is rendered by Athena at `/template-demos/modern-corporate` and the corresponding nested routes. Preview: `public/template-previews/modern-corporate.jpg` is a **real 1440×900 Chrome capture** of the running demo.

## Run and verify

From `templates/modern-corporate`, run `npm ci`, `npm run dev` and `npm run build`. From the Athena repository root, run `npm run typecheck`, `npm run build`, `node --test tests/north-decision-architecture.test.mjs` and (with the root site listening at `127.0.0.1:3182`) `node scripts/north-decision-qa.mjs`.

Browser QA includes all eight routes on 320, 390, 428, 768, 1440 and 1920 CSS-pixel viewports, atlas navigation, four process stages, keyboard menu dismissal, dropdown and form entry, computed control text contrast, visual screenshots, runtime JS errors and overflow. Mobile dimensions tested in Chrome emulation are not a substitute for physical iOS Safari testing.

## Provenance and release boundary

Existing photos are illustrative only; inspect `public/ASSET-SOURCES.md` and the Athena registry for original provenance and usage rights. Do not invent customer evidence. No skeleton loaders are added. No merge to main, production deployment or public tunnel without separate approval.
