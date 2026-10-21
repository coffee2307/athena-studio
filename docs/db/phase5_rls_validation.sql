-- Phase 5 reproducible pgTAP plan: RUN in isolated Supabase-local database only.
-- Requires: Supabase CLI, pgTAP + test helpers and applied phase5_identity.sql.
-- Do NOT run in production. TODO: use supabase test db after owner authorizes local daemon.
begin;
create extension if not exists pgtap;
select plan(15);
select has_table('public','athena_profiles','profiles created');
select has_table('public','athena_memberships','memberships created');
select has_table('public','athena_workspaces','workspaces created');
select rls_enabled('public','athena_profiles','profiles RLS enabled');
select rls_enabled('public','athena_memberships','membership RLS enabled');
select rls_enabled('public','athena_workspaces','workspace RLS enabled');
-- The next nine assertions test actual grants / database policies, not mock UI:
select ok(not has_table_privilege('anon','public.athena_profiles','SELECT'),'anon cannot read profiles');
select ok(not has_table_privilege('anon','public.athena_memberships','SELECT'),'anon cannot read memberships');
select ok(not has_table_privilege('anon','public.athena_workspaces','SELECT'),'anon cannot read workspaces');
select ok(not has_table_privilege('authenticated','public.athena_memberships','INSERT'),'member cannot insert privileges');
select ok(not has_table_privilege('authenticated','public.athena_memberships','UPDATE'),'member cannot change role');
select ok(not has_table_privilege('authenticated','public.athena_memberships','DELETE'),'member cannot revoke others');
select ok(not has_column_privilege('authenticated','public.athena_profiles','id','UPDATE'),'member cannot change profile owner');
select ok(has_column_privilege('authenticated','public.athena_profiles','display_name','UPDATE'),'member can edit display name');
select ok(not has_table_privilege('authenticated','public.athena_workspaces','UPDATE'),'member cannot change studio workspace');
select * from finish();
rollback;
-- IMPORTANT: Full per-user A/B cross-tenant RLS SELECT simulations (with real
-- auth.uid() context and authenticated fixture users) MUST run against a provisioned
-- Supabase-local instance before enabling multi-tenant client data. These tests only
-- check grants and RLS enablement; they do not prove policy-level isolation.
