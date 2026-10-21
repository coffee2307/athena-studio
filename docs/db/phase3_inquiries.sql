-- Athena Studio Phase 3 - run ONLY in the owner's authorized Supabase project
-- Requires Supabase/PostgreSQL, no public user access.
create extension if not exists pgcrypto;
create table if not exists public.athena_inquiries(
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 2 and 100),
  email text not null check (char_length(email) between 3 and 200),
  company text check(company is null or char_length(company)<=120),
  service text not null check(service in ('web-development','website-care','ai-integration','micro-saas','other')),
  message text not null check(char_length(message) between 20 and 4000),
  consent_at timestamptz not null,
  status text not null default 'new' check(status in ('new','contacted','qualified','in_progress','closed','declined')),
  notification_state text not null default 'pending' check(notification_state in ('pending','sent','failed')),
  notification_attempted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists ix_athena_inquiries_created on public.athena_inquiries(created_at desc);
create index if not exists ix_athena_inquiries_status on public.athena_inquiries(status,created_at desc);
alter table public.athena_inquiries enable row level security;
revoke all on public.athena_inquiries from anon,authenticated;
-- Service-role bypasses RLS; key MUST remain strictly server-side.
-- No policies to expose inquiries through browser-facing roles.
comment on table public.athena_inquiries is 'Private Athena lead intake; retention policy and deletion workflow require owner approval before production.';
