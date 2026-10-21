-- Athena Studio Phase 8B, hardening existing migrated staging schema only.
-- Apply AFTER phase6_storage.sql; never run on a production project without review.
-- No application/customer records are inserted, updated or deleted.
-- Existing cleanup authorization still requires an admin, original uploader,
-- a 15-minute window, and no object stored at the recorded path.
alter function public.athena_discard_failed_document(uuid) security invoker;

-- Preserve the OR semantics of two public.athena_workspaces SELECT policies
-- while avoiding duplicate permissive policies and planner overhead.
drop policy if exists "read own workspaces" on public.athena_workspaces;
drop policy if exists "studio reads client workspaces" on public.athena_workspaces;
create policy "athena authorized workspaces read"
on public.athena_workspaces
for select to authenticated
using (
  exists (
    select 1 from public.athena_memberships member
    where member.workspace_id=athena_workspaces.id
    and member.user_id=(select auth.uid())
  )
  or (select private.athena_is_studio_admin())
);

-- Explicit covering indices for the six unindexed foreign keys found by
-- the Supabase Performance Advisor. No unique constraint semantics change.
create index if not exists idx_athena_audit_actor
  on public.athena_audit_events(actor_id);
create index if not exists idx_athena_documents_uploader
  on public.athena_documents(uploaded_by);
create index if not exists idx_athena_notifications_project
  on public.athena_notifications(project_id);
create index if not exists idx_athena_projects_creator
  on public.athena_projects(created_by);
create index if not exists idx_athena_messages_author
  on public.athena_ticket_messages(author_id);
create index if not exists idx_athena_tickets_author
  on public.athena_tickets(author_id);

comment on function public.athena_discard_failed_document(uuid)
is 'Invoker-rights, authenticated admin uploader only; empty-storage cleanup within 15 minutes. RLS and SQL grants apply.';
