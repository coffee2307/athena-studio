-- Athena Phase 5. Apply only in the user's authorized Supabase project.
-- NO seed admin credentials or automatically promoted first user.
create extension if not exists pgcrypto;
create schema if not exists private;
revoke all on schema private from public;

create table if not exists public.athena_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Khách hàng' check (char_length(display_name) between 2 and 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.athena_workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null check(char_length(name) between 2 and 120),
  kind text not null check(kind in ('studio','client')),
  created_at timestamptz not null default now()
);

create table if not exists public.athena_memberships (
  workspace_id uuid not null references public.athena_workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('admin','client')),
  created_at timestamptz not null default now(),
  primary key (workspace_id,user_id)
);
create index if not exists idx_athena_memberships_user on public.athena_memberships(user_id,workspace_id);

alter table public.athena_profiles enable row level security;
alter table public.athena_workspaces enable row level security;
alter table public.athena_memberships enable row level security;
revoke all on public.athena_profiles from anon,authenticated;
revoke all on public.athena_workspaces from anon,authenticated;
revoke all on public.athena_memberships from anon,authenticated;
grant select on public.athena_profiles to authenticated;
grant update (display_name) on public.athena_profiles to authenticated;
grant select on public.athena_memberships to authenticated;
grant select on public.athena_workspaces to authenticated;
-- Never grant INSERT/UPDATE/DELETE on memberships or workspaces to browser clients.

create policy "profile owner reads" on public.athena_profiles for select to authenticated
 using ((select auth.uid())=id);
create policy "profile owner updates safe field" on public.athena_profiles for update to authenticated
 using ((select auth.uid())=id) with check ((select auth.uid())=id);

-- Members see their OWN membership row, not the directory of other users.
create policy "read own membership" on public.athena_memberships for select to authenticated
 using ((select auth.uid())=user_id);

-- Tenant isolation. This policy only reads memberships, whose SELECT policy checks
-- auth.uid() directly. No membership->workspace policy recursion.
create policy "read own workspaces" on public.athena_workspaces for select to authenticated
 using (exists (
  select 1 from public.athena_memberships member
  where member.workspace_id=athena_workspaces.id and member.user_id=(select auth.uid())
 ));

create or replace function private.athena_on_user_created()
returns trigger language plpgsql security definer set search_path='' as $$
begin
  insert into public.athena_profiles (id,display_name)
  values (new.id,coalesce(nullif(left(trim(new.raw_user_meta_data->>'full_name'),80),''),'Khách hàng'));
  return new;
end;
$$;
revoke all on function private.athena_on_user_created() from public,anon,authenticated;
drop trigger if exists athena_auth_user_created on auth.users;
create trigger athena_auth_user_created after insert on auth.users
for each row execute function private.athena_on_user_created();

create or replace function private.athena_profile_touched()
returns trigger language plpgsql security definer set search_path='' as $$
begin
 new.updated_at=now();
 return new;
end;
$$;
revoke all on function private.athena_profile_touched() from public,anon,authenticated;
drop trigger if exists athena_profile_updated on public.athena_profiles;
create trigger athena_profile_updated before update on public.athena_profiles
for each row execute function private.athena_profile_touched();

comment on table public.athena_memberships is 'Server-managed roles; never infer authority from user_metadata.';
comment on table public.athena_workspaces is 'Workspace tenancy foundation; membership grants are managed only by trusted operators.';

-- OPERATOR STEPS (manual after owner approval):
-- 1) create one studio workspace through secure SQL editor / service role.
-- 2) confirm authenticated/verified owner UUID through Supabase Auth dashboard.
-- 3) insert membership of role admin ONLY after independently verifying owner.
-- 4) run the real RLS isolation test suite before allowing non-test users.
-- DO NOT use an open sign-up trigger to auto-grant admin or workspace membership.
