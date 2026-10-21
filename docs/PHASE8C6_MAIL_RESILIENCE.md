# Phase 8C.6 — Athena Independent Email OTP Delivery

Status: engineering candidate, **NO-GO for public sign-in**. Based on Phase 8C.5 PR #23.

## Purpose

Athena now owns Better Auth login, OTP validation, sessions and tenant authorization on PostgreSQL. Email delivery must remain a replaceable transport, rather than a hidden dependency on Supabase Auth's bundled sending quota. Email delivery itself always requires a reachable mail network, a verified sender and operational limits; self-hosting does not guarantee inbox delivery.

## Shipped

- A server-only Nodemailer SMTP transport supporting TLS port 465 or required STARTTLS on port 587, one validated recipient, a 6-digit OTP, Vietnamese plain-text email, no attachment/file/URL access and no hidden retries.
- A Gmail API primary + optional SMTP secondary, with **failover only after a definitive rejected send**: Gmail token exchange failure, invalid token, Gmail HTTP 401 or explicit HTTP 429. Gmail 5xx, network timeout, ambiguous acceptance and SMTP failures **never** trigger another automatic email.
- A small process-local backoff (30 seconds up to five minutes) for definitive Gmail failures. It is not a shared multi-node coordinator and intentionally does not persist raw OTPs.
- Gmail OAuth access token cache with an early-expiry safety margin. Refresh-token credentials remain server-side only.
- Optional SMTP-only mode requiring no Google API app. The SMTP host must be an approved nonlocal FQDN, TLS port 465 or 587, with a verified sender and password secret file. Both Gmail and SMTP must share the same sender address when used for failover.
- A separate optional Docker Compose overlay at deploy/vps/compose.smtp.yaml; main VPS identity and SMTP remain **OFF by default**.
- The localhost-only Identity Lab provides a 60-second resend timer, a change-email option and Google/GitHub login buttons when configured. Server-side Better Auth OTP rate limits and code-attempt checks still control abuse independently of UI timers.
- Local integration verifies fallback OTP against a real PGlite/PostgreSQL-compatible schema and persisted Better Auth session. Mocked transports are used; no actual Gmail or SMTP credential has been set up.

## Independent sender setup (future approval)

Choose an owner-approved SMTP service or a self-managed MTA with outbound email delivery permitted. Configure an actual verified From address, SMTP hostname and authentication password as a Docker secret. Add the optional SMTP Compose file only after external inbox acceptance tests.

A fully self-hosted Postfix relay may avoid third-party API subscriptions but requires reverse DNS, SPF, DKIM, DMARC, IP reputation, bounce handling, abuse mitigation and may be prohibited by some VPS vendors. SMTP port 25 delivery to recipient networks is not equivalent to authenticated submission over 587/465; this release installs no Postfix or MTA.

An external SMTP relay is replaceable but retains its own service quotas and may cost money. Gmail API also retains its own quotas. When both providers are unavailable, do not fake a delivered OTP or bypass verification.

## Release blockers

- Actual email deliverability to separate inboxes and verified OAuth callback credentials.
- Real fault injection for Gmail failure then SMTP backup without duplicate messages.
- Customer preview of OTP cooldown and sign-in with HTTPS cookies, verified session revocation and complete tenant isolation.
- Linux container and real PostgreSQL QA, verified encrypted backup/restore, real VPS resource measurements.
- Account migration and legacy Client Portal authorization; no matching-by-email privilege elevation.

No production deployment, public registration, DNS change, paid service or customer migration was authorized in this phase.
