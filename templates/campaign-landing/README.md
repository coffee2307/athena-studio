# MỞ Festival — Cinematic Culture V4 (Athena Demo)

Independent campaign landing page with a photo-led interactive poster hero, a 3-chapter selector, a full-size native dialog poster viewer, Escape-key support, accessible navigation and mobile-first layouts. The original autonomous routes `/`, `/work`, `/work/1..3`, `/services`, `/about` and `/contact` remain available.

This is a **fictional** festival concept. The Pexels photographs are illustrative and do **not** document any actual MỞ event, lineup, venue or tickets. No payment is accepted, and the contact form opens an email draft without an intended recipient or backend data capture.

Optimizations: three local hero photographs are existing JPGs, no WebGL runtime; image transitions are CSS opacity-based, the initial hero image uses eager loading / fetch priority, and reduced-motion preferences are respected. Template CSS and components are independent of other Athena demos.

Standalone: `npm ci && npm run build && npm run start`. Integrated: `/template-demos/campaign-landing`. Rights notes: `public/ASSET-SOURCES.md` and `template.manifest.json`.
