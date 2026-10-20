# Athena Studio — Phase 8B, live HTTP Auth boundary QA

Date: 2026-10-20 (Asia/Ho_Chi_Minh)
Scope: owner-authorized **isolated Supabase staging** `vsykqdlfmtndjwnfmfph`.
Source: `feat/athena-phase8b-live-readonly-20261020` (stacked on live RLS hardening #16).
**No production deploy, no public signup UI, no application document writes, no Storage objects and no paid resources.** Two owner-approved controlled Auth signups were subsequently performed for A/B testing; see below.

## Completed: live anonymous Data API negative checks
- Script: `scripts/phase8b-live-anon-readonly.mjs`.
- Local CLI invocation: use Node 24+ and approved private environment; set `ATHENA_STAGING_PROJECT_REF=vsykqdlfmtndjwnfmfph`. Never put credentials into the repository.
- The script enforces exact project URL, non-secret publishable key, disabled public feature flags and an explicit `--allow-live-readonly` switch.
- Only **GET** requests with `apikey` header; **no Authorization bearer publishable key**. Response bodies and credential values are never logged.
- 11/11 protected tables returned **HTTP 401** from the real project; test exit code **0**.
- First run was NO-GO (one 400 caused by the test selecting a nonexistent `id` column on the composite-key membership table; one transient network error). Corrected to `select=*` and implemented one bounded retry for network failures; re-run yielded **11/11 401**, no application changes.
- A `200` with an empty result is still treated as failure: empty tables cannot establish that anonymous access is properly denied.
- A `404` is only **not exposed**, not proof of an effective row-level policy. This is an endpoint boundary check, not RLS multi-tenant proof.

## Controlled A/B signup — verified on real Supabase
- Two specifically approved test email accounts were created with standard Supabase Auth `signUp` (publishable key, not service role). Both returned an Auth user with no immediate session, so email verification remains required. This action was owner-directed and is NOT public website signup.
- Read-back: **2 Auth users; 2 user profiles; 0 workspaces; 0 memberships; 0 Storage objects**. Both users had `email_confirmed_at IS NULL` and no sign-in session at the time of inspection.
- Strong random passwords were generated separately and stored under the local Windows user's DPAPI encryption in gitignored `.qa/` files; never committed, logged or placed in docs. Neither account has been granted a project or studio admin role.
- Auth signup API acceptance is not proof that confirmation mail reached both inboxes. The human inbox owner must verify delivery and click each confirmation link before the authenticated tenant access test proceeds.
- Supabase Security Advisor now also flags **WARN: leaked-password protection disabled**. This capability requires a paid Pro plan according to Supabase documentation; no paid upgrade is authorized. Random high-entropy passwords and no public Auth UI reduce staging risk but do not satisfy production acceptance. See https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection.

## Prepared, NOT executed on live Supabase: real JWT A/B read checks
- Script: `scripts/phase8b-live-jwt-ab.mjs`. Runs only after approved, independently verified A/B test accounts with different client workspaces exist.
- Requires A/B JWTs, real Supabase Auth user UUIDs, A/B workspace UUIDs and optionally A/B project UUIDs **in the operator's transient private environment**.
- Before querying tenant data, validates both identities via `GET /auth/v1/user`; checks exact expected subject UUIDs.
- For each workspace and (if both project IDs supplied) project: each authorized user must see its own row and not the other user's row.
- Rejects missing credentials, identical user/workspace/project IDs, wrong Supabase project and enabled public flags. All calls are GET; returns a secret-free summary.
- Two controlled owner-approved Auth accounts now exist and both remain **email unconfirmed** at last read-back. Consequently **no real JWT A/B proof**; local mocked tests only confirm harness behavior. No browser write, spoofing, Storage signed URL, Google OAuth, SMTP delivery, backup/restore or consent testing has been accepted.

## Local verification and commands
```powershell
cd 'F:\Athena Studio'
npm run test:unit
npm run lint
npm run typecheck

# Real staging boundary check (private env file is ignored by Git)
$env:ATHENA_STAGING_PROJECT_REF='vsykqdlfmtndjwnfmfph'
node --env-file=.env.local scripts/phase8b-live-anon-readonly.mjs --allow-live-readonly
Remove-Item Env:ATHENA_STAGING_PROJECT_REF

# Only AFTER verified A/B users and workspace IDs exist:
# Inject ATHENA_A_JWT, ATHENA_B_JWT, ATHENA_A_USER_ID, ATHENA_B_USER_ID,
# ATHENA_A_WORKSPACE_ID and ATHENA_B_WORKSPACE_ID securely; optional A/B project IDs.
# node --env-file=.env.local scripts/phase8b-live-jwt-ab.mjs --allow-live-readonly
```

## Gate / next step
1. **Completed:** The owner provided two test inboxes; standard Supabase Auth `signUp` succeeded for A and B. Each user has an automatically created profile and a separate locally Windows-DPAPI-protected random password. Credentials and identifiers remain in gitignored local tooling only, never in GitHub.
2. **Pending human email action:** Verify both signup emails. After the server confirms `email_confirmed_at` for both, an authorized operator may provision two isolated `kind='client'` workspaces with separate memberships. Never prematurely grant a studio admin role or expose service keys.
3. Run JWT read isolation; then extend separately to controlled write/author-spoofing and private Storage checks, cleaning synthetic data afterward.
4. Keep all public Auth, Google, Dashboard and Operations flags disabled until all mandatory provider/backup/legal gates pass.

A successful isolated HTTP probe must **not** be called Phase 8B completion, commercial readiness or production security acceptance.
