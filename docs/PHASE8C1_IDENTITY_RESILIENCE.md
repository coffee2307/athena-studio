# Phase 8C.1 — Athena Identity Resilience Foundation

Status: **STAGING / DRAFT, NO-GO for production**. Public Auth, Google, operations, and SitePulse flags remain OFF.
Branch: `feat/athena-phase8c-auth-resilience-20261020` stacked on Phase 8B typography PR #18.

## Why
Athena should own its customer experience and business-level identity workflow while keeping the existing verified provider adapter until a replacement is fully tested. A Supabase email `HTTP 429 over_email_send_rate_limit` must not become a vague request to try again repeatedly.

## Boundary and behavior
- Vendor-independent identity contract, workflow and safe error normalization: `lib/core/auth/core.ts`; actual Supabase calls isolated in `lib/auth/provider-adapter.ts`.
- Email quota: Vietnamese explanation, input preserved, 90-second local UX cooldown; this does **not** reset a provider's quota and is **not** server-side anti-abuse.
- General throttling, invalid login, unverified account, weak password, network failure, service outage and unknown errors have distinct safe messages. Provider exception strings/stacks/credentials never appear in UI.
- No silent retry, unsafe fallback to another provider, fake OTP/email, account auto-link, or login without a confirmed provider session.
- Google option appears only under the pre-existing explicit owner-controlled feature flag, never as an invented or automatic fallback. Unknown account linking behavior is not promised.
- Unexpected auto-confirmed sign-up sessions are locally signed out and treated as fail-closed; existing server-side `requireUser` guards are retained.
- The default staging/public flags remain OFF; no migration or live Supabase staging data mutation is part of this PR.

## Deliberately outside this PR
Real alternative SMTP/Gmail API provider, custom OTP issuance, production-grade distributed rate limiting, shared failover across identity providers, alternative JWT/session issuer, changing PostgreSQL RLS, production deploy or enabling any paid services. These require further architecture/security approval and separate acceptance.

## Verification
Run unit tests for mapping and fake provider rejection, lint, TypeScript, Next.js production build, Playwright on 3 browser profiles and runtime dependency audit; then GitHub Actions on the exact SHA. Phase 8B Studio Admin remains unverified due to the provider email-sending quota and **must not be provisioned until real email verification succeeds**.
