# Phase 8C.2 — Independent Athena Identity (LOCAL-ONLY)

**Status:** engineering proof-of-concept, **NO-GO for staging/production**. No customer account migrations, hosting changes, Supabase SQL changes, email delivery, OAuth application authorization, GitHub App installation or paid services.

**Owner goal:** Athena owns account and session policies; Google and GitHub may attest identity; Gmail API delivers OTP; repo access requires separate explicit customer consent. Do not make the customer experience depend on one vendor's default Auth mail quota.

## Delivered

- `better-auth@1.7.12` pinned in `package-lock.json`. Provider-independent account/session/OTP engine, no import from Supabase in `lib/identity/**`.
- `lib/identity/factory.ts`: email OTP six digits, five-minute expiry, at most three attempts, **hashed OTP storage**, disable email/password while proof-of-concept is restricted, one-week sessions, database-backed rate limit and explicit opt-out of automatic provider account linking.
- Optional Google or GitHub login via OAuth, each configured with server-only client ID/secret. **GitHub login does not authorize repository access.** Auth sessions never inherit legacy Client Portal permissions.
- `lib/identity/gmail.ts`: server-only Gmail API transport, minimal `gmail.send` permission, UTF-8 Vietnamese MIME; no SMTP/extra VPS, no request retries after ambiguous acceptance. It has **mock-provider tests only** until credentials/consent are supplied.
- `lib/identity/gate.ts`: requires two explicit OFF-by-default flags and `NODE_ENV=development`, `CI!=true`, localhost HTTP site origin, strong secret, and DB file confined to ignored `.qa/`. There is no configuration capable of enabling the new engine on public hosting in this PR.
- `app/api/identity/[...all]/route.ts`: separate independent Auth API; returns generic HTTP 503 and `Cache-Control:no-store` while disabled. Existing Supabase integration remains unchanged and is still OFF on the public site.
- `app/identity-lab/page.tsx` and `components/auth/IndependentIdentityLab.tsx`: local-only Vietnamese login lab for email OTP, Google and GitHub; page returns HTTP 404 if the gate is disabled. Uses a genuine session check to display successful login, not a fake success state.
- `scripts/identity-local-init.mjs --initialize`: explicit offline-only Better Auth SQLite schema setup for `user`, `session`, `account`, `verification`, and `rateLimit` tables. Does not create or promote users, or send email.

## Verified security properties and limitations

An offline, real Better Auth/SQLite test establishes that a new email OTP request does not create a user prematurely; the six-digit OTP is stored only as a hash; a bad OTP fails; a correct OTP creates a real user with `emailVerified=true` and a persisted session; and OTP replay fails. A missing email transport disables the OTP plugin entirely. Production/staging flags remain OFF.

This local test does **not** demonstrate real Google/GitHub login, deliverability to real inboxes, live authorization against customer projects, tenant isolation, anti-bot resilience, durable cloud database, recovery from lost mail, production session security, or any actual GitHub repository reading/writing.

The current `node:sqlite` API is experimental and writes to a local disk; never deploy it to ephemeral serverless functions. A cloud database with migrations, backup/restore, session revoke, permission isolation and multi-instance concurrency must be selected and tested before any production enablement. A GitHub App with repository installation consent must be designed separately; initial permission should be read-only `contents:read`, restricted to customer-selected repositories. Write access must require explicit customer authorization and separate auditability.

**No GitHub OAuth token or GitHub App installation is captured/stored by this branch.** Connecting a GitHub identity does not itself grant access to code. Never clone/import customer repos until installation, scope, permissions, security scanning and retention policy are accepted.

## Explicit local setup (future manual exercise)

1. Create a local-only secret with a cryptographic random generator; keep it in untracked `.env.local`, not Git.
2. Set `NEXT_PUBLIC_SITE_URL=http://localhost:3000`, `ATHENA_INDEPENDENT_AUTH_ENABLED=true`, `ATHENA_IDENTITY_LOCAL_ONLY=true`, `ATHENA_IDENTITY_DB_PATH=.qa/athena-identity.sqlite`, and `BETTER_AUTH_SECRET` to the generated strong secret. Set exactly the chosen third-party login client IDs/secrets, or Gmail API sender settings for email OTP.
3. With `NODE_ENV=development` in the environment, run `node --env-file=.env.local scripts/identity-local-init.mjs --initialize`. This creates only local SQLite tables under ignored `.qa/`; **do not run in a production/staging shell**.
4. Start `npm run dev` and open `http://localhost:3000/identity-lab`. Real Google/GitHub/Gmail accounts and permission scopes require explicit setup and testing by the owner; no default test credentials exist.

## Required before commercial use

- Provider OAuth callbacks (Google/GitHub), secure access to `gmail.send`, verified domain/sending reputation and rate-limit abuse controls.
- Portable durable database not tied to the app server's filesystem; backups, transactional migrations, audit, session rotation/revocation, disaster recovery.
- Integrate new verified identity with Athena's own Client Portal authorization and re-verify cross-tenant access. Never treat an independent user ID as equivalent to an existing Supabase UUID.
- Separately build the customer-selected GitHub App installation flow, repo allowlist, read-only operations, opt-in write operations and permission revocation.
- Negative E2E tests with live identity providers, consent/privacy review, incident handling, and full release acceptance.

**Staging/production remain NO-GO.** This PR does not deploy, merge to main, enable public accounts, or alter Supabase test fixtures. No new hosting fee is incurred.
