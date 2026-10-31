# Digital Creators — Independent Vite source

This is the native Digital Creators interactive website (Rubik 3D, brush illustration, LEGO city), not a generic Next.js scaffold. Site interface belongs to this project only.

Run: `npm ci`, `npm run build`, then `npm run preview`. Default deployment base is `/`. Hash routes work with static hosting. External fonts may require a network connection. No production deployment is performed by this export.

The original owner project remains at `vendor/digital-creators` inside Athena. To update this exported project, run `node scripts/sovereign-digital-creators-sync.mjs --apply` from Athena root, then regenerate its package lock. `--check` blocks accidental drift. The project's design copy is authored and is not automatically replaced by a changed `site.brand` in the generic scaffolder.

See `public/ASSET-SOURCES.md` and upstream provenance.
