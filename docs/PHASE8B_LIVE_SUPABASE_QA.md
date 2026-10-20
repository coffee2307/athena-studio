# ATHENA — Phase 8B: Staging hardening, Supabase real project

Date: 2026-10-20 (Asia/Ho_Chi_Minh)
Project organization: Athena Studio (separate from PHAM)
Supabase project ref: `vsykqdlfmtndjwnfmfph`
Supabase region: `ap-south-1` (Mumbai, as actually created)
Environment classification: **isolated research/staging by owner intent**, while Supabase project default branch is marked `main`. It is NOT Athena production, and NO public web clients or customer users have been connected.
Scope: **no auth signups, no real customer records, no file upload, no enabled public product features**.

## Verified Supabase changes

Initial staging status: no public application tables, no auth users, no storage buckets. Four original migrations applied successfully (Phase 3 inquiries, Phase 5 identity, Phase 6 operations, Phase 6 storage). All **11 Athena application tables have RLS enabled**, with no `anon` SELECT privilege, and `athena-project-files` is private.

Migration **`athena_phase8b_security_hardening`** applied after successful PGlite tests:
- `public.athena_discard_failed_document(uuid)` changed from `SECURITY DEFINER` to **`SECURITY INVOKER`**, with existing SQL guards and authenticated admin document-delete RLS retained. This removes a privileged public RPC exposure warned about by Security Advisor.
- Unified two `athena_workspaces` permissive SELECT policies into **one** with the same member-or-studio-admin predicate.
- Added **six covering FK indexes** for columns identified by the Supabase Performance Advisor.

### Read-back evidence from real PostgreSQL 17
- 5 migrations in Supabase history.
- `cleanup_is_security_definer = false`.
- `workspace_select_policies = 1`.
- `new_indexes = 6`.
- Auth users = **0**, Storage objects = **0**.
- Security Advisor: **no WARN** after change; **one INFO** on `athena_inquiries` with RLS and no browser policy. This is an intentional fail-closed service-role-only intake design. See [RLS Enabled No Policy](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy).
- Performance Advisor's earlier **6 unindexed FKs and 1 duplicate permissive policy** are resolved. Remaining unused-index INFO notices reflect empty tables: don't remove needed indexes based on a never-used counter with zero data.

### Testing
- PGlite regression suite confirms A/B tenant isolation, studio-admin scope, restricted writes and file cleanup with `SECURITY INVOKER` SQL; no real users created.
- Local build/lint/TS and full browser tests remain separate QA gates.
- **Real user A/B JWT isolation is NOT YET TESTED**. Do not confuse role simulation using PGlite with real Supabase Auth identities, confirmation email, PostgREST session verification or signed links. No account has been created to run these tests.
- Re-test cleanup RPC through legitimate JWT admin and unauthorized clients before public activation, including error handling. Supabase Storage real upload/download remains untested.
- Live connection/identity is verified only for authenticated Supabase management tools; no OAuth provider or SMTP configuration has been changed.

## Next guarded work
1. Stage project metadata, publishable URL/key in a private runtime (not committed into `.env.example`), **no service-role secrets in client**.
2. Prepare two real verified test accounts and one studio admin **after the account owner approves which addresses to use**, plus an operator-confirmed internal studio workspace. Avoid direct manual inserts to Supabase-managed `auth.users`.
3. Run authenticated A/B read, write, spoofing, Storage file access and session refresh tests with PostgREST/SDK, then record scrubbed evidence.
4. Configure verified SMTP/email sender and Google OAuth callback only on a trusted staging domain. Continue to keep Auth and Operations feature flags OFF until actual UI flow is verified.
5. Backups: Free project automatic downloadable backups are limited; design restore rehearsal before connecting customer data or claiming disaster recovery.

## Safety / migration discipline
This migration does not seed any users/customers, remove records or alter public website hosting. Source file: `docs/db/phase8b_security_hardening.sql`. The migration is recorded in Supabase history, not manually executed SQL without tracking. The prior four historical migrations are left unchanged.

**NO-GO** for production, customer sign-up, migration to a different project or billed provider activation until separate operational validation.
