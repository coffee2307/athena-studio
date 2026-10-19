# Athena Studio — Phase 3 lead intake operations
Date: 2026-10-19 · Branch: feat/athena-phase3-intake-motion-20261019
[Approved roadmap](ATHENA_MASTER_ROADMAP.md)

## User-visible changes
- Redesigned contact page: three-step intake flow, clear error and success messages, verified data consent, and working direct email fallback.
- CSS/SVG motion overhaul: view-triggered stagger reveals across sections and project cards, new content added after SPA navigation/filtering, pointer interactions and scroll progress line.
- No motion is required to see content: JavaScript unavailable, disabled, or `prefers-reduced-motion` surfaces all content.
- Current staging site keeps intake disabled until all providers are provisioned; no false delivery assertions.

## Configured intake architecture
1. HTTPS origin verification and strict application/json bounded stream parser (12kB maximum).
2. Server-side input validation with consent flag and hidden honeypot.
3. Cloudflare Turnstile server verification for action `inquiry` and configured hostname. Turnstile widget is rendered only when intake is enabled.
4. Two distributed Redis limits through Upstash REST Lua atomic operations: per-email 3 / 15min and global 120 / 15min. Email key is HMAC-SHA256 with private site salt; no untrusted X-Forwarded-For rate key.
5. Insert into private PostgreSQL table `athena_inquiries` through Supabase service role (server-side only), with RLS enabled and no SELECT rights for browser roles. Inquiries begin with `status=new`.
6. Send owner notification using Resend, reusing the DB record id as idempotency key. `notification_state=sent|failed` updated in DB. A mail failure after a successful record insert returns success with a clear "stored but notification delayed" message, not a request to resubmit.
7. Owner works from secured Supabase dashboard until client/admin management is developed in Phase 6. Never distribute service-role credentials to clients.

## Lifecycle and review process
- `new` → `contacted` → `qualified` → `in_progress` → `closed` or `declined`. Update lifecycle manually via secured Supabase database dashboard until the authenticated CRM exists.
- `notification_state=failed` signals owner to review inbound leads in the database and manually follow up. The DB is canonical; email is only a notice.
- Do not send automated customer confirmations until domain/email authentication, consent scope and test delivery have been verified.
- Each form response includes the first 8 characters of a UUID as a short reference; **not** an authentication token or full proof of identity.

## Required operator setup (no automatic provisioning)
1. Create a dedicated Supabase project for Athena. Review regional hosting, privacy, free tier, retention and backups.
2. Apply [the scoped SQL migration](db/phase3_inquiries.sql) using the authorized Supabase SQL Editor.
3. Create Redis database in Upstash; enter private REST URL and token. Confirm Redis EVAL support and rate budget in staging.
4. Set up Cloudflare Turnstile for the exact verified public domain. Obtain site and secret keys. Site key is public; secret key server-only.
5. Configure Resend with a verified sender domain, SPF/DKIM records if requested, and the recipient address. Confirm actual delivery (success + failure cases) from staging.
6. Generate random private `INQUIRY_RATE_SALT` (>= 24 chars) and enter credentials into secured host environment, not tracked `.env` files.
7. Set `NEXT_PUBLIC_SITE_URL` to the exact verified HTTPS origin; set the public Turnstile site key at **build time**.
8. Verify one real transaction in staging. Inspect DB row, notification state, Inbox, invalid Origin, forged challenge, oversized input, rate limit, and repeat submit.

## Security warnings
- The current implementation does **not** collect or trust X-Forwarded-For as a rate identity.
- Credentials must be rotated if exposed; service-role key bypasses RLS and remains server-only. RLS is defense-in-depth against browser account access, not against stolen service-role credentials.
- A lead is "received" only once the database confirms a row id. It is not assumed from HTTP 200 of a third-party notification.
- Form disabled whenever any required provider/setting is missing; shared protection failure returns 503, not an unprotected fallback.
- Cloudflare/Upstash/Supabase/Resend each carry operational and privacy requirements. Before activation, determine local laws, data retention, deletion workflow and legal entity details.
- A production monitoring/alert/automatic retry or dedicated admin dashboard is not yet deployed. Until then, manually inspect Supabase for rows with `notification_state=failed` and identify missing email messages.

## Verification gate
Build, lint, TS, unit tests, smoke tests, browser motion/mobile QA, GitHub Actions. Provider integration is **prepared but not claim-tested** until owner connects credentials. Do not merge to `main`, deploy to production, make DNS changes or buy any service without separate approval.
