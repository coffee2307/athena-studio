# ATHENA — Phase 8B: Real-Provider Staging Preflight

Date: 2026-10-20
Branch: `feat/athena-phase8b-staging-preflight-20261020`
Base: integrated Phase 8A candidate `3e14aa3`.
Status: **local configuration inventory implemented; real staging integrations remain NO-GO**.

## What this phase increment delivers

- `npm run staging:inventory`: safe, read-only inventory of fourteen configuration checks; reports missing check **names only**, never keys, domain ownership tokens or credential values.
- `npm run staging:preflight`: strict read-only check; exits nonzero if prerequisites missing. A PASS means that **configuration appears sufficient to begin staging integration tests**, not that a provider is trusted, live or authorized for production.
- Reproducible SHA-256 inventory of these existing SQL migration files **in application order**:
  1. `phase3_inquiries.sql` — private lead intake
  2. `phase5_identity.sql` — Auth profiles, studio/customer workspace and RLS
  3. `phase6_operations.sql` — projects, tickets, audit and notifications
  4. `phase6_storage.sql` — private Storage bucket, policies, failed-upload cleanup
- `.env.example` adds `ATHENA_STAGING_APPROVED=false`, `ATHENA_STAGING_ORIGIN=`, `ATHENA_STAGING_PROJECT_REF=`, requiring separate confirmation of an isolated HTTPS origin/project.
- Rejects local or PHAM's live domain as a staging origin and refuses to mark readiness if Auth, Google, Operations or SitePulse are already enabled **before real staging acceptance**.
- Offline tests ensure unknown secret values are not echoed in the JSON output, validate staging host isolation and migration hashes.

## What this explicitly DOES NOT do

- Does **not** create a Supabase account/project, verify a connected project, execute SQL on a remote database or edit Auth provider settings.
- Does **not** send SMTP, Resend, Turnstile, Upstash, Google or Storage requests.
- Does **not** infer legal authorization or production readiness simply because environment variable strings exist.
- Does not bypass the disabled feature gates. It does not provision Google OAuth credentials or impersonate users for testing.
- The migration SHA list is a **change-control digest**, not proof that the DDL is safe to apply to a database with existing data.

## Provider and domain prerequisites

1. Project owner should connect their Supabase workspace in ChatGPT using the offered Supabase integration (explicit account action required) or grant an approved operator access; select an **isolated staging** project, never PHAM production or a reused customer database.
2. Approve a staging HTTPS domain/origin distinct from public PHAM and any production Athena domain; document separate staging hosting, region, and cost/usage limit. No DNS/hosting is configured merely by running this script.
3. Inside approved secret management, configure public Supabase URL/publishable key and the private service-role key **server-side only**. Never post service-role or SMTP passwords in the conversation, issue tracker, environment example or Git repository.
4. Configure verified sending address, Resend key/SMTP, Redis/Upstash and Cloudflare Turnstile only after the provider terms/costs and domain settings have been reviewed. Test at the staging origin and ensure authorized destination inboxes.
5. Provision Google Cloud OAuth app/consent screen if required; set callback in Supabase Auth settings exactly as documented in [Phase 5 architecture](PHASE5_AUTH_ARCHITECTURE.md). Keep Google flag OFF until a real consent and callback test passes.
6. Apply migrations only after **explicit project identity checks, reviewed SQL diff, staging backup strategy and rollback approval**. Never apply them to production as an automated side effect of preflight.
7. Create **two real test tenant users A/B plus one trusted studio admin**, verify cross-workspace SELECT/INSERT/UPDATE/Storage signed-link/author spoofing prevention using real Auth JWT and PostgREST; compare to existing PGlite isolation tests.
8. Validate real lead intake, spam controls, DB insert, mail delivery/failure/retry; test backup restore and document retention/deletion; log only synthetic test data. Review mandatory privacy/consent notices.
9. Require a separate GO/NO-GO to enable `NEXT_PUBLIC_ATHENA_AUTH_ENABLED`, `ATHENA_OPERATIONS_ENABLED` or real contact forms, then verify again in staging. This is **not** permission to deploy production.

## Verification

```powershell
cd 'F:\Athena Studio'
npm run staging:inventory
# Once separate provider access/configuration is approved:
npm run staging:preflight
npm run test:unit
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

The first command is safe with blank environment and is expected to return `readyForProviderIntegration=false`. The second must fail until credentials/configuration exist in a **private, authorized runtime**; it must never print their values.

**Owner action needed next:** Connect Supabase, select/approve isolated staging project/HTTPS host and cost ceiling, then decide which provider settings are available. There is no basis to assert real staging readiness or uptime until those steps are complete.
