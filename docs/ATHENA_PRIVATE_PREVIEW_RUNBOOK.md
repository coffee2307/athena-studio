# Athena Studio — Private mobile preview (CSS and performance)

## Why the previous mobile preview broke
The team used `next dev` on `127.0.0.1:3182` and also ran `next build`/Playwright against the same `.next` directory. Next.js served a valid HTML page referencing development CSS/JS files while those files were gone or replaced. Both localhost and Cloudflare returned missing static assets; browsers fell back to Times New Roman, default blue links and raw HTML layout.

**Never share a Next.js development server as a client preview.** The private preview compiles `NEXT_PUBLIC_ATHENA_READ_ONLY_PREVIEW=true` and runs a fixed production build from `.next-preview`. Ordinary `npm run dev` and `npm run build` use the normal `.next` and cannot overwrite the files serving the preview.

## Commands on the authorized Windows machine
In `F:\Athena Studio`:

1. `npm run preview:build` — build the isolated production preview in `.next-preview` (requires sufficient free RAM).
2. `npm run preview:start` — launch the compiled site on `127.0.0.1:3182`. Keep this process running.
3. `npm run preview:proxy` — launch the read-only Basic Auth proxy on `127.0.0.1:3184`. Password is read from **ignored** `.qa/preview-password.txt`; never commit it.
4. Run the preinstalled `.qa/cloudflared.exe` using `tunnel --url http://127.0.0.1:3184 --no-autoupdate --protocol http2`. Use **only the URL printed by that instance**.
5. Check that the public URL returns 401 without a password, HTML/CSS/JS return 200 with credentials, `/api/identity/get-session` returns 404, POST returns 405, and client navigation retains the correct fonts/layout.

The old `npm run dev -- -H 127.0.0.1 -p 3182` can still be used for local-only Better Auth development after stopping the production preview on the same port. It is **not** suitable for the public tunnel. Standalone Better Auth remains gated by `NODE_ENV=development`, so real login/profile editing are not available through this production visual preview.

## Browser caching and security
- Authenticated HTML/RSC: `Cache-Control: private, no-store`; do not cache pages containing or potentially containing dynamic information.
- Content-addressed `/_next/static/` CSS, JS, fonts: `Cache-Control: private, max-age=31536000, immutable` (client-browser cache only, not shared CDN cache). When the build changes, filenames change.
- Dedicated HTTP keep-alive pool for efficient asset requests.
- Proxy blocks `/api/*`, Webpack HMR endpoints, POST/PUT and other mutating methods. Upstream cookies and public Set-Cookie headers are removed.
- `X-Robots-Tag: noindex, nofollow, noarchive`.
- Cloudflare quick tunnel is temporary and requires the host PC, local proxy and cloudflared process to remain running. This does not publish production DNS or enable public auth.

## Regression checks
- `npm run test:unit`, `npm run preview:build` and `npx playwright test tests/e2e/preview-assets.spec.ts`.
- After `preview:build`, Next.js may auto-rewrite tracked `next-env.d.ts` or `tsconfig.json` to refer to `.next-preview/types`. Reconcile these generated changes without deleting user edits. They need not be committed for production operation.
- Verify `.next-preview/BUILD_ID` exists before launching. Do not rebuild the active preview dist directory while it is serving requests: stop the preview first, rebuild, then restart.

## Scope of performance results
Chrome benchmarks are point measurements, not an SLA. Internet tunnel latency depends on regional routing and the user's mobile network. Prefer a real production hostname/CDN for a later public release.
