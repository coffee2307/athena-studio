# Athena Studio — Phase 1 QA evidence (2026-10-19)

## Build gate
- `git diff --check` — PASS (line-ending warnings only)
- `npm run lint` — PASS
- `npx tsc --noEmit` — PASS
- `npm run build` — PASS, Next.js 15.5.25, 16 generated outputs

## Production HTTP smoke tests
`/`, `/services`, the four `/services/*` detail pages, `/products`, `/studio`, `/contact`, `/robots.txt`, and `/sitemap.xml`: HTTP 200.

Contact endpoint: POST `/api/inquiry` with no delivery credentials: HTTP 503 as designed, so inquiries cannot silently disappear.

## Browser checks (Chrome headless / Playwright)
- 1440×900: document scroll width 1440; no horizontal overflow.
- 768×1024: document scroll width 768; menu opens and closes via Escape.
- 390×844: document scroll width 390; no horizontal overflow; menu opens and closes via Escape.
- 320×740: document scroll width 320; no horizontal overflow; menu opens and closes via Escape.
- No client JavaScript exceptions.
- Product Lab visual at 320px: bounding width 284px within the 284px content column (repaired from 388.5px).

Screenshots and raw Playwright report were generated locally in `.qa/` and intentionally excluded from Git.

## Known launch prerequisites
- Configure a verified domain and deploy the site.
- Configure `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CONTACT_EMAIL`, `RESEND_API_KEY`, `CONTACT_EMAIL`, `CONTACT_FROM_EMAIL`.
- Verify actual email delivery in staging before enabling public inquiries.
- Add distributed rate limiting, spam protection and monitoring prior to accepting production leads.
- Verify legal disclosures, privacy policy and contracts.
- No SitePulse product, billing system or client projects are claimed to be in production.

The above is technical QA, not a claim that the site is commercially live.
