# ATHENA STUDIO — PHASE 4 LIGHTHOUSE LAB BASELINE
Date: 2026-10-20 (measured in local Windows environment)
Source: production build `next build`, `next start` on localhost `http://127.0.0.1:3199`, Lighthouse 13.5.0, installed Google Chrome (emulated device/network throttling).
**Not an external deployed staging system and not p75 real-user Core Web Vitals.**

## Measurement results

| Page / device emulation | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
|---|---:|---:|---:|---:|---:|---:|---:|
| Home / desktop | **100** | **100** | **100** | **66** | **460 ms** | **0** | **0 ms** |
| Home / mobile | **99** | **100** | **100** | **66** | **1,968 ms** | **0** | **32 ms** |
| Portfolio / mobile | **99** | **100** | **100** | **66** | **2,092 ms** | **0** | **66 ms** |

Lighthouse reported no opportunities in the report filter (diagnostic/opportunity with score below 0.9) for these samples.

## Important interpretation
- All three **lab** LCP samples fall below 2.5s and lab CLS is zero. This does not guarantee performance on real devices, slow hosting, geographic latency or heavy usage.
- Lighthouse **TBT is not INP**. No real-user INP, LCP or CLS p75 has been measured; production RUM is deferred until approved hosting and privacy controls exist.
- SEO **66** occurs in a non-production origin with intentional `robots.txt` disallow/non-indexable metadata. Do **not** disable this preview safeguard to inflate test scores. Repeat SEO on a verified HTTPS staging hostname only with owner authorization and correct canonical domain conditions.
- Lighthouse audits a rendered page but does not substitute full manual disability testing. 33 cross-browser Playwright/axe tests are tracked separately.
- Results vary by CPU load, Chrome revisions, caching and throttling. Repeat 3–5 runs for stronger lab trend baselines after staging exists.

## Reproduction
Run the approved production build and a local server:

```bash
npm ci
npm run build
npm run start -- -p 3199 -H 127.0.0.1
```

Then in another terminal:

```bash
node scripts/lighthouse-baseline.mjs http://127.0.0.1:3199
```

Detailed Lighthouse JSON reports are written to the ignored local `.lighthouse/` folder (`desktop-home.json`, `mobile-home.json`, `mobile-portfolio.json`, `summary.json`). The repository keeps this concise evidence report, not large machine-dependent raw reports.
