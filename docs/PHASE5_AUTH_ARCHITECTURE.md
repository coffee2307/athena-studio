# ATHENA STUDIO — Phase 5: Identity, authentication and tenancy
Date: 2026-10-20
Base: `3918e4e` (Phase 4)
Branch: `feat/athena-phase5-auth-20261020`
Approved source of truth: [ATHENA_MASTER_ROADMAP.md](ATHENA_MASTER_ROADMAP.md)

## 1. Scope implemented in code

- Public auth routes: `/dang-nhap`, `/dang-ky`, `/quen-mat-khau`.
- Private routes: `/tai-khoan`, `/tai-khoan/doi-mat-khau`, `/quan-tri`.
- PKCE session exchange callback: `/auth/callback`; optional token_hash confirmation: `/auth/confirm`.
- Supabase Auth integration using `@supabase/ssr` and `@supabase/supabase-js` with Next.js 15 async cookie store and middleware refresh.
- Email/password sign-in, sign-up with confirmation, password reset and password update. OAuth login button is gated separately until Google provider has been configured.
- Current user's display_name edit only, and local/global sign-out options. Admin route uses live `auth.getUser()` verification and membership linked to a workspace of kind `studio`, NOT user-editable metadata or a client-supplied role.
- Vietnamese messages, form validation, no-index metadata, responsive monochrome interface.
- Complete provider OFF switch. If any public configuration or explicit feature flag is missing, the login/register/recovery pages clearly say **not active**; private routes redirect to login; OAuth/email code callbacks reject.

**Crucial distinction:** No live Supabase Auth project, Google OAuth keys, verified SMTP provider or production domain has been configured in this Phase. The code and offline database-isolation tests are ready; real registrations, email delivery, account recovery, OAuth and active-session behavior are **NOT tested end-to-end against external providers**.

## 2. Data model and authorization

Migration: [phase5_identity.sql](db/phase5_identity.sql)

- `athena_profiles`: one row per `auth.users.id`. Users may SELECT their own row and UPDATE **only** `display_name`. A security-definer trigger in non-exposed `private` schema creates profiles on sign-up and updates timestamps.
- `athena_workspaces`: studio or client tenant, readable only if the querying user has their own membership.
- `athena_memberships`: (workspace_id,user_id) primary key, role `admin|client`. Browser-authenticated users may read only their own membership rows, never INSERT, UPDATE or DELETE member roles.
- Membership and workspace records must be provisioned by explicitly authorized operations. No sign-up promotes the first user to admin; identity is not inferred from email address or `user_metadata`.
- Admin route checks for a server-verified user AND membership with role admin in a studio workspace. Cross-tenant membership in an ordinary client workspace does not grant studio admin access.

## 3. Offline RLS isolation evidence

`tests/rls-isolation.test.mjs` boots real PostgreSQL 18 via **PGlite WebAssembly**, creates Supabase's minimal local `auth.users`/`auth.uid()` test scaffolding and runs the actual Phase 5 DDL. The only skipped SQL line is `create extension if not exists pgcrypto` because PGlite lacks that optional extension; `gen_random_uuid()` is built into PostgreSQL 18.

With two synthetic test users belonging to separate studio/client workspaces, the test checks:
- A can read A's profile, workspace and admin membership, not B's;
- A's attempt to UPDATE B's profile affects zero rows;
- B can read only B's workspace and client membership, and can change only B's display_name;
- Browser role cannot INSERT a workspace, UPDATE membership role or UPDATE immutable profile ID;
- Anonymous role cannot SELECT account profiles/memberships.

Run offline:
```
npm run test:unit
```

This is a **real SQL RLS engine test**, not a mocked JavaScript permission checker. **Still required:** execute unmodified migration and RLS tests against an authorized Supabase staging environment; validate actual Auth JWT request claims, PostgREST grant behavior, cookie refresh and cross-tenant A/B users. A separate SQL privilege checklist is provided at `docs/db/phase5_rls_validation.sql`.

## 4. Owner configuration — when authorized

1. Create an isolated Athena Supabase project, choose region and plan (confirm cost/backup/retention before purchase). Do not use another project's production database.
2. Apply `docs/db/phase5_identity.sql` from Supabase SQL editor. **Do not apply to live users without a migration/rollback review.**
3. In Supabase Auth, enable email + email confirmation. Confirm custom SMTP provider limits, branding, Vietnamese templates and real delivery. Use the Auth URL Configuration to define the **exact** origin and allowlist callback:
   - Local example: `http://localhost:3000/auth/callback`, also `http://localhost:3000/auth/callback?next=/**` only if approved and supported by the allowlist. Prefer a narrow list of exact known callback URLs.
   - Approved HTTPS site: `https://YOUR_DOMAIN/auth/callback`, `https://YOUR_DOMAIN/auth/callback?next=/tai-khoan`, `https://YOUR_DOMAIN/auth/callback?next=/tai-khoan/doi-mat-khau`, `https://YOUR_DOMAIN/auth/confirm` for custom email templates.
   - **No open wildcard domains.** Match actual redirectTo URLs generated by the deployed app, including query paths.
4. To activate Google: configure a Google Cloud OAuth consent screen/client, then add **Supabase project's** `https://PROJECT_ID.supabase.co/auth/v1/callback` as the Google redirect URI (NOT Athena's `/auth/callback`). Put Google Client ID/secret into Supabase Dashboard > Authentication > Providers > Google, not a browser-side .env file.
5. Copy `.env.example` to ignored `.env.local` locally, or set provider secrets in approved hosting. Provide `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL` and set `NEXT_PUBLIC_ATHENA_AUTH_ENABLED=true` **only when readiness is verified**. `NEXT_PUBLIC_ATHENA_GOOGLE_ENABLED=true` only once the Google provider works. Since these variables are built into browser bundles, rebuild and redeploy after changes.
6. Operator must independently verify the owner UUID in the Auth admin dashboard and then create the studio workspace and grant admin using a privileged SQL session. Never let ordinary registration self-enroll as admin.
7. Test with real isolated users A and B: signup/verify, invalid credentials, password recovery, Google sign-in, cookie expiry/refresh, global sign-out, cross-workspace profile/member reads/writes, role escalation attempts and account deletion/retention. Fix any failing provider or RLS test **before** enabling public signups.
8. Update privacy/cookie terms (SSR client cookies, retention, email recipient, subprocessors), age/consent requirements if applicable, incident support and access revocation policy. Complete production host and DNS approval separately.

Do **not** put Supabase service_role/secret key in a `NEXT_PUBLIC_*` variable or expose it through admin screens. Phase 3 inquiry storage remains separately gated.

## 5. Security limitations and future work

- `getUser()` verifies the user with the Auth server on protected requests; server authorization rechecks studio membership in the database. RLS secures profile and tenant reads at the DB layer.
- OAuth redirects are constrained to a **fixed allowlist**, not arbitrary `next` URLs. Login/confirmation callbacks reject when service is disabled.
- Cookie settings use SameSite=Lax, Secure for HTTPS and SSR PKCE. Browser-side Supabase sessions require browser-readable cookies (not guaranteed HttpOnly). CSP from Phase 4 still contains `unsafe-inline`; a strict nonce/hash CSP and enhanced XSS testing remain an operational hardening gate.
- Role administration is not exposed in the client. Account deletion, MFA, device/session inventory, recovery codes and audit log workflow require product/security review before a high-sensitivity launch.
- Phase 6 will add client workspaces, documents, projects, messages and scoped access with explicit A/B database isolation tests. Current admin page states that management features are **not implemented**.
- No user credentials, tokens, customer data or live migrations have been created. No DNS, public production or paid service action was taken.
