# Athena Studio — Phase 8B live Supabase Auth and tenant-isolation QA

Date: 2026-10-20 (Asia/Ho_Chi_Minh)
Project: Athena Studio isolated Supabase staging `vsykqdlfmtndjwnfmfph` (Mumbai, `ap-south-1`).
Git: stacked Draft PR #17 on Draft PR #16. **No production deployment, DNS changes, public web Auth, paid service or real customer data.**

## Scope and observed results

| Gate | Live observation | Assessment |
| --- | --- | --- |
| Anonymous REST boundary | 11/11 Athena tables returned HTTP 401 | PASS, endpoint boundary only |
| Owner-approved test Auth | 2 independently confirmed email identities, 2 profiles | PASS |
| JWT sign-in | 2/2 successful Supabase email+password sessions with real JWTs | PASS |
| Workspace A/B RLS | A sees only A, B sees only B: 4/4 read assertions | PASS |
| Project A/B RLS | A sees only A, B sees only B: 4/4 read assertions | PASS |
| Cross-project write | A cannot insert ticket into B project | PASS |
| Author spoof | A cannot insert ticket using B's author UUID | PASS |
| Privilege escalation | Client A cannot create a studio/admin membership | PASS |
| Profile privacy | A cannot read B profile | PASS |
| Authorized client write | A and B each successfully created one own ticket | PASS |
| Ticket/message isolation | B cannot read A ticket, post into it, or read A's message; A can add its own message | PASS |
| Document metadata privilege | Client cannot register project document metadata | PASS |
| Storage client upload denial | HTTP 400 with provider status 403, code `AccessDenied`; no object created | PASS, denial only |
| Admin upload / signed URLs | No authorized studio-admin fixture or real files | NOT TESTED |
| Browser OAuth, custom SMTP, restore rehearsal | No live acceptance evidence | NOT TESTED |

## Controlled test data (read back from PostgreSQL)

- Auth users: **2**, both verified; automatic profiles: **2**.
- Isolated client workspaces: **2**; role `client` memberships: **2**; studio-admin memberships: **0**.
- Synthetic projects: **2**; tickets: **2**; ticket messages: **1**.
- Document metadata: **0**; bucket `athena-project-files` objects: **0**.
- No real customer data. Synthetic fixtures are retained temporarily for the remaining Phase 8B validation and must be deleted at the final staging cleanup gate.

## Execution and evidence boundaries

- Real A/B test addresses were explicitly provided by the owner, but exact email addresses, user UUIDs, private passwords and JWTs must never be recorded in public Git documentation.
- Standard Supabase Auth `signUp` used the publishable API key. Both signups later had `email_confirmed_at` set by Supabase; real password sign-in with separate JWTs then succeeded.
- Each randomly generated high-entropy testing password is encrypted at rest with Windows DPAPI under gitignored `.qa/`. Tokens are obtained transiently by `signInWithPassword` and are not persisted or printed.
- Shared, tracked `scripts/phase8b-live-jwt-ab.mjs` uses read-only REST requests, validates both subjects through `/auth/v1/user`, and explicitly requires `email_confirmed_at`. The private per-machine harness obtained both valid JWTs and returned `pass=true`, `verifiedWorkspaceReads=4`, `verifiedProjectReads=4`.
- A separate gitignored private QA harness performed controlled positive/negative tenant writes. The initial all-in-one assertion at Storage expected only HTTP 401/403 and thus exited nonzero when Storage returned HTTP 400. PostgreSQL confirmed 0 stored objects and 0 document rows. A focused follow-up tested the documented denial payload, yielding `HTTP 400 / provider status 403 / AccessDenied` and exit 0, consistent with Supabase Storage logs. Do **not** mistake the outer HTTP code for successful authorization.
- No `service_role` key was used by the sign-in or JWT tests. Management SQL was used only for explicitly scoped, synthetic QA fixtures and read-back. No historical migrations were modified.
- GitHub CI and local QA remain separate from authenticated provider acceptance; recheck GitHub Actions for each newly pushed commit.

## Remaining security and release holds

1. **Studio administrator:** Set up one independently verified admin identity and controlled studio workspace. Never elevate an unverified test account or grant admin automatically. Only after approval, exercise privileged document registration, real Storage upload, download, signed URL isolation and controlled deletion.
2. **Provider integration:** Validate real browser login sessions, Google OAuth callbacks, custom SMTP/transactional email, spam controls and failure handling on isolated HTTPS staging.
3. **Recovery/compliance:** Perform backup/restore rehearsal, retention/deletion cleanup, human accessibility/security QA, privacy notice and consent acceptance.
4. **Security advisor:** Supabase currently also reports WARN `auth_leaked_password_protection`. The leaked-password protection option requires Pro plan or above; no paid upgrade is authorized. Staging uses random high-entropy passwords but cannot claim full production security acceptance. [Supabase password security guidance](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).
5. **Public signup:** `disable_signup=false` was observed on the Supabase Auth API, although the Athena web Auth feature flag remains OFF. Before production, explicitly manage provider-level signup eligibility, abuse protection and deployment gates; a disabled website UI is not a complete provider-level signup block.
6. **Change control:** Keep PR #17 as Draft, do not merge into `main`, do not connect production customers, and do not turn on Client Dashboard yet.

**Current result:** Phase 8B *real JWT A/B read, controlled write authorization and negative Storage-upload scope* have live evidence, but **Phase 8B overall remains NO-GO** until privileged Storage, mail/OAuth, operational recovery and production controls pass.
