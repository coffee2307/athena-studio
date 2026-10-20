# Athena Studio — Phase 8B, live HTTP Auth boundary QA

Date: 2026-10-20 (Asia/Ho_Chi_Minh)
Scope: owner-authorized **isolated Supabase staging** `vsykqdlfmtndjwnfmfph`.
Source: `feat/athena-phase8b-live-readonly-20261020` (stacked on live RLS hardening #16).
**No production deploy, no signup, no new users, no writes, no Storage objects, no paid resources.**

## Completed: live anonymous Data API negative checks
- Script: `scripts/phase8b-live-anon-readonly.mjs`.
- Local CLI invocation: use Node 24+ and approved private environment; set `ATHENA_STAGING_PROJECT_REF=vsykqdlfmtndjwnfmfph`. Never put credentials into the repository.
- The script enforces exact project URL, non-secret publishable key, disabled public feature flags and an explicit `--allow-live-readonly` switch.
- Only **GET** requests with `apikey` header; **no Authorization bearer publishable key**. Response bodies and credential values are never logged.
- 11/11 protected tables returned **HTTP 401** from the real project; test exit code **0**.
- First run was NO-GO (one 400 caused by the test selecting a nonexistent `id` column on the composite-key membership table; one transient network error). Corrected to `select=*` and implemented one bounded retry for network failures; re-run yielded **11/11 401**, no application changes.
- A `200` with an empty result is still treated as failure: empty tables cannot establish that anonymous access is properly denied.
- A `404` is only **not exposed**, not proof of an effective row-level policy. This is an endpoint boundary check, not RLS multi-tenant proof.

## Prepared, NOT executed on live Supabase: real JWT A/B read checks
- Script: `scripts/phase8b-live-jwt-ab.mjs`. Runs only after approved, independently verified A/B test accounts with different client workspaces exist.
- Requires A/B JWTs, real Supabase Auth user UUIDs, A/B workspace UUIDs and optionally A/B project UUIDs **in the operator's transient private environment**.
- Before querying tenant data, validates both identities via `GET /auth/v1/user`; checks exact expected subject UUIDs.
- For each workspace and (if both project IDs supplied) project: each authorized user must see its own row and not the other user's row.
- Rejects missing credentials, identical user/workspace/project IDs, wrong Supabase project and enabled public flags. All calls are GET; returns a secret-free summary.
- No A/B Auth accounts yet, so **no real JWT A/B proof**; local mocked tests only confirm harness behavior. No browser write, spoofing, Storage signed URL, Google OAuth, SMTP, backup/restore or consent testing has been accepted.

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
1. Owner approves two controlled testing inboxes and optional admin address; use Supabase Auth API, not manual inserts into `auth.users`.
2. Verify email confirmation and identity before an authorized operator creates two `kind='client'` workspaces with separate memberships; protect service keys server-side.
3. Run JWT read isolation; then extend separately to controlled write/author-spoofing and private Storage checks, cleaning synthetic data afterward.
4. Keep all public Auth, Google, Dashboard and Operations flags disabled until all mandatory provider/backup/legal gates pass.

A successful isolated HTTP probe must **not** be called Phase 8B completion, commercial readiness or production security acceptance.
