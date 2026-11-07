# BLACK VELOCITY — PROTECTED SHOWROOM

Approved freeze after the 2026-10-30 repair of McLaren drag, scroll and mobile framing.

**Rule:** Do not modify the McLaren showroom's camera, gesture control, layout, assets, route copy, WebGL loader, UX, or animation for generic Athena work. Do not delete or repurpose the GLB, replace the model, remove its CC BY 4.0 attribution or regenerate its demo. Only a new explicit request from the repository owner authorizes changes.

The versioned source/asset blob hashes are pinned in `config/showroom-protection.json`. `tests/showroom-protection.test.mjs` runs in the unit suite and prevents unrelated PRs from silently changing any protected file. CODEOWNERS also designates `@coffee2307` for review when branch protection enforces ownership.

Protected surface: `/template-demos/auto-showroom`, including the BLACK VELOCITY homepage and cinematic chapters. It is separate from the unfinished `templates/auto-showroom` standalone extraction, which requires its own fidelity approval. Shared components are conservatively protected; refactor only after renewed permission.

Verified on Windows Chromium with mobile-stage and drag-then-scroll tests; real iPhone Safari performance remains unverified. Freezing protects the current behavior; it is not a guarantee against external browser/device changes.
