-- ATHENA PHASE 6: Apply AFTER phase5_identity.sql in authorized Supabase staging.
-- Database role is always derived from auth.uid(), not email/user_metadata/client fields.
-- No sample clients, files, projects, secrets or financial data are seeded.
create table if not exists public.athena_projects(
 id uuid primary key default gen_random_uuid(),
 workspace_id uuid not null references public.athena_workspaces(id) on delete restrict,
 name text not null check(char_length(name) between 3 and 150),
 summary text not null default '' check(char_length(summary)<=3000),
 status text not null default 'proposed' check(status in ('proposed','planning','in_progress','review','completed','on_hold')),
 start_date date, due_date date,
 created_by uuid references auth.users(id),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 check (due_date is null or start_date is null or due_date >= start_date)
);
create index if not exists idx_athena_projects_workspace on public.athena_projects(workspace_id,created_at desc);

create table if not exists public.athena_milestones(
 id uuid primary key default gen_random_uuid(),
 project_id uuid not null references public.athena_projects(id) on delete cascade,
 title text not null check(char_length(title) between 3 and 150),
 description text not null default '' check(char_length(description)<=1500),
 status text not null default 'pending' check(status in ('pending','in_progress','done')),
 due_date date, position integer not null default 0 check(position >= 0),
 updated_at timestamptz not null default now()
);
create index if not exists idx_athena_milestones_project on public.athena_milestones(project_id,position);

create table if not exists public.athena_tickets(
 id uuid primary key default gen_random_uuid(),
 project_id uuid not null references public.athena_projects(id) on delete cascade,
 author_id uuid not null references auth.users(id),
 title text not null check(char_length(title) between 5 and 160),
 description text not null check(char_length(description) between 15 and 4000),
 status text not null default 'new' check(status in ('new','in_progress','waiting_client','closed')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists idx_athena_tickets_project on public.athena_tickets(project_id,created_at desc);

create table if not exists public.athena_ticket_messages(
 id uuid primary key default gen_random_uuid(),
 ticket_id uuid not null references public.athena_tickets(id) on delete cascade,
 author_id uuid not null references auth.users(id),
 body text not null check(char_length(body) between 1 and 4000),
 created_at timestamptz not null default now()
);
create index if not exists idx_athena_messages_ticket on public.athena_ticket_messages(ticket_id,created_at);

create table if not exists public.athena_documents(
 id uuid primary key default gen_random_uuid(),
 project_id uuid not null references public.athena_projects(id) on delete cascade,
 file_name text not null check(char_length(file_name) between 1 and 180),
 object_path text not null unique check(char_length(object_path) between 40 and 380),
 constraint athena_document_project_path check(left(object_path,37)=project_id::text||'/'),
 content_type text not null check(content_type in ('application/pdf','image/png','image/jpeg','image/webp')),
 size_bytes bigint not null check(size_bytes between 1 and 8388608),
 uploaded_by uuid references auth.users(id),
 created_at timestamptz not null default now()
);
create index if not exists idx_athena_documents_project on public.athena_documents(project_id,created_at desc);

create table if not exists public.athena_notifications(
 id uuid primary key default gen_random_uuid(),
 recipient_id uuid not null references auth.users(id) on delete cascade,
 project_id uuid not null references public.athena_projects(id) on delete cascade,
 kind text not null check(kind in ('project_status','milestone_status','ticket_update')),
 message text not null check(char_length(message) between 1 and 280),
 is_read boolean not null default false,
 created_at timestamptz not null default now()
);
create index if not exists idx_athena_notifications_user on public.athena_notifications(recipient_id,created_at desc);

create table if not exists public.athena_audit_events(
 id bigint generated always as identity primary key,
 project_id uuid not null references public.athena_projects(id) on delete cascade,
 actor_id uuid references auth.users(id),
 event_type text not null check(char_length(event_type) between 3 and 80),
 entity_id uuid not null, old_value text, new_value text,
 created_at timestamptz not null default now()
);
create index if not exists idx_athena_audit_project on public.athena_audit_events(project_id,created_at desc);

create or replace function private.athena_is_studio_admin()
returns boolean language sql stable security definer set search_path='' as $$
 select exists(
  select 1 from public.athena_memberships m
  join public.athena_workspaces w on w.id=m.workspace_id
  where m.user_id=(select auth.uid()) and m.role='admin' and w.kind='studio'
 );
$$;
create or replace function private.athena_can_workspace(target uuid)
returns boolean language sql stable security definer set search_path='' as $$
 select private.athena_is_studio_admin() or exists(
  select 1 from public.athena_memberships m
  where m.workspace_id=target and m.user_id=(select auth.uid())
 );
$$;
create or replace function private.athena_can_project(target uuid)
returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.athena_projects p
 where p.id=target and private.athena_can_workspace(p.workspace_id));
$$;
create or replace function private.athena_ticket_is_open(target uuid)
returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.athena_tickets t
 where t.id=target and t.status<>'closed');
$$;
create or replace function private.athena_is_client_workspace(target uuid)
returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.athena_workspaces w
 where w.id=target and w.kind='client');
$$;
create or replace function private.athena_can_ticket(target uuid)
returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.athena_tickets t
 where t.id=target and private.athena_can_project(t.project_id));
$$;
revoke all on function private.athena_is_studio_admin() from public,anon;
revoke all on function private.athena_can_workspace(uuid) from public,anon;
revoke all on function private.athena_can_project(uuid) from public,anon;
revoke all on function private.athena_can_ticket(uuid) from public,anon;
revoke all on function private.athena_is_client_workspace(uuid) from public,anon;
revoke all on function private.athena_ticket_is_open(uuid) from public,anon;
grant usage on schema private to authenticated;
grant execute on function private.athena_is_studio_admin() to authenticated;
grant execute on function private.athena_can_workspace(uuid) to authenticated;
grant execute on function private.athena_can_project(uuid) to authenticated;
grant execute on function private.athena_can_ticket(uuid) to authenticated;
grant execute on function private.athena_is_client_workspace(uuid) to authenticated;
grant execute on function private.athena_ticket_is_open(uuid) to authenticated;

-- Studio admins must discover client workspaces to assign projects.
-- This extends Phase 5 without weakening client-to-client isolation.
create policy "studio reads client workspaces" on public.athena_workspaces for select to authenticated
 using(private.athena_is_studio_admin());

-- Least privilege. No public/anonymous access; browser never writes privileged audit or notifications.
alter table public.athena_projects enable row level security;
alter table public.athena_milestones enable row level security;
alter table public.athena_tickets enable row level security;
alter table public.athena_ticket_messages enable row level security;
alter table public.athena_documents enable row level security;
alter table public.athena_notifications enable row level security;
alter table public.athena_audit_events enable row level security;
revoke all on public.athena_projects,public.athena_milestones,public.athena_tickets,
 public.athena_ticket_messages,public.athena_documents,public.athena_notifications,public.athena_audit_events from anon,authenticated;
grant select on public.athena_projects,public.athena_milestones,public.athena_tickets,
 public.athena_ticket_messages,public.athena_documents,public.athena_notifications,public.athena_audit_events to authenticated;
grant insert on public.athena_projects,public.athena_milestones,public.athena_tickets,
 public.athena_ticket_messages,public.athena_documents to authenticated;
grant update(name,summary,status,start_date,due_date) on public.athena_projects to authenticated;
grant update(title,description,status,due_date,position) on public.athena_milestones to authenticated;
grant update(status) on public.athena_tickets to authenticated;
grant update(is_read) on public.athena_notifications to authenticated;
grant delete on public.athena_documents to authenticated;

create policy "scoped projects read" on public.athena_projects for select to authenticated
 using(private.athena_can_workspace(workspace_id));
create policy "studio creates client projects" on public.athena_projects for insert to authenticated
 with check(private.athena_is_studio_admin() and private.athena_is_client_workspace(workspace_id));
create policy "studio updates projects" on public.athena_projects for update to authenticated
 using(private.athena_is_studio_admin()) with check(private.athena_is_studio_admin());
create policy "scoped milestones read" on public.athena_milestones for select to authenticated
 using(private.athena_can_project(project_id));
create policy "studio creates milestones" on public.athena_milestones for insert to authenticated
 with check(private.athena_is_studio_admin() and private.athena_can_project(project_id));
create policy "studio updates milestones" on public.athena_milestones for update to authenticated
 using(private.athena_is_studio_admin()) with check(private.athena_is_studio_admin());
create policy "scoped tickets read" on public.athena_tickets for select to authenticated
 using(private.athena_can_project(project_id));
create policy "member opens new ticket" on public.athena_tickets for insert to authenticated
 with check(private.athena_can_project(project_id) and author_id=(select auth.uid()) and status='new');
create policy "studio updates ticket status" on public.athena_tickets for update to authenticated
 using(private.athena_is_studio_admin()) with check(private.athena_is_studio_admin());
create policy "scoped messages read" on public.athena_ticket_messages for select to authenticated
 using(private.athena_can_ticket(ticket_id));
create policy "member posts ticket message" on public.athena_ticket_messages for insert to authenticated
 with check(private.athena_can_ticket(ticket_id) and private.athena_ticket_is_open(ticket_id) and author_id=(select auth.uid()));
create policy "scoped documents read" on public.athena_documents for select to authenticated
 using(private.athena_can_project(project_id));
create policy "studio adds documents" on public.athena_documents for insert to authenticated
 with check(private.athena_is_studio_admin() and private.athena_can_project(project_id));
create policy "studio removes document metadata" on public.athena_documents for delete to authenticated
 using(private.athena_is_studio_admin());
create policy "recipient reads alerts" on public.athena_notifications for select to authenticated
 using(recipient_id=(select auth.uid()));
create policy "recipient marks alerts" on public.athena_notifications for update to authenticated
 using(recipient_id=(select auth.uid())) with check(recipient_id=(select auth.uid()));
create policy "scoped immutable audit read" on public.athena_audit_events for select to authenticated
 using(private.athena_can_project(project_id));

-- Immutable audit events + per-workspace notifications, written only by DB triggers.
create or replace function private.athena_project_lifecycle()
returns trigger language plpgsql security definer set search_path='' as $$
begin
 new.updated_at=now();
 if old.status is distinct from new.status then
  insert into public.athena_audit_events(project_id,actor_id,event_type,entity_id,old_value,new_value)
  values(new.id,(select auth.uid()),'project_status',new.id,old.status,new.status);
  insert into public.athena_notifications(recipient_id,project_id,kind,message)
  select m.user_id,new.id,'project_status','Trạng thái dự án "'||left(new.name,90)||'" đã thay đổi.'
  from public.athena_memberships m where m.workspace_id=new.workspace_id
   and m.user_id is distinct from (select auth.uid());
 end if;
 return new;
end;$$;
create or replace function private.athena_milestone_lifecycle()
returns trigger language plpgsql security definer set search_path='' as $$
declare assigned_workspace uuid; project_name text;
begin
 new.updated_at=now();
 if old.status is distinct from new.status then
  select p.workspace_id,p.name into assigned_workspace,project_name from public.athena_projects p where p.id=new.project_id;
  insert into public.athena_audit_events(project_id,actor_id,event_type,entity_id,old_value,new_value)
  values(new.project_id,(select auth.uid()),'milestone_status',new.id,old.status,new.status);
  insert into public.athena_notifications(recipient_id,project_id,kind,message)
  select m.user_id,new.project_id,'milestone_status','Cột mốc "'||left(new.title,90)||'" đã thay đổi.'
  from public.athena_memberships m where m.workspace_id=assigned_workspace
   and m.user_id is distinct from (select auth.uid());
 end if;
 return new;
end;$$;
create or replace function private.athena_ticket_lifecycle()
returns trigger language plpgsql security definer set search_path='' as $$
begin
 new.updated_at=now();
 if old.status is distinct from new.status then
  insert into public.athena_audit_events(project_id,actor_id,event_type,entity_id,old_value,new_value)
  values(new.project_id,(select auth.uid()),'ticket_status',new.id,old.status,new.status);
  if new.author_id is distinct from (select auth.uid()) then
   insert into public.athena_notifications(recipient_id,project_id,kind,message)
   values(new.author_id,new.project_id,'ticket_update','Yêu cầu hỗ trợ "'||left(new.title,90)||'" đã cập nhật.');
  end if;
 end if;
 return new;
end;$$;
revoke all on function private.athena_project_lifecycle() from public,anon,authenticated;
revoke all on function private.athena_milestone_lifecycle() from public,anon,authenticated;
revoke all on function private.athena_ticket_lifecycle() from public,anon,authenticated;
drop trigger if exists athena_project_lifecycle on public.athena_projects;
create trigger athena_project_lifecycle before update on public.athena_projects
for each row execute function private.athena_project_lifecycle();
drop trigger if exists athena_milestone_lifecycle on public.athena_milestones;
create trigger athena_milestone_lifecycle before update on public.athena_milestones
for each row execute function private.athena_milestone_lifecycle();
drop trigger if exists athena_ticket_lifecycle on public.athena_tickets;
create trigger athena_ticket_lifecycle before update on public.athena_tickets
for each row execute function private.athena_ticket_lifecycle();

-- Creation audit must also be immutable, not just status transitions.
create or replace function private.athena_project_created()
returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into public.athena_audit_events(project_id,actor_id,event_type,entity_id,new_value)
 values(new.id,(select auth.uid()),'project_created',new.id,new.status);
 return new;
end;$$;
create or replace function private.athena_ticket_created()
returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into public.athena_audit_events(project_id,actor_id,event_type,entity_id,new_value)
 values(new.project_id,(select auth.uid()),'ticket_created',new.id,new.status);
 insert into public.athena_notifications(recipient_id,project_id,kind,message)
 select distinct m.user_id,new.project_id,'ticket_update','Có yêu cầu hỗ trợ mới: "'||left(new.title,90)||'".'
 from public.athena_memberships m join public.athena_workspaces w on w.id=m.workspace_id
 where m.role='admin' and w.kind='studio' and m.user_id is distinct from (select auth.uid());
 return new;
end;$$;
create or replace function private.athena_message_created()
returns trigger language plpgsql security definer set search_path='' as $$
declare project_ref uuid;
begin
 select t.project_id into project_ref from public.athena_tickets t where t.id=new.ticket_id;
 insert into public.athena_audit_events(project_id,actor_id,event_type,entity_id)
 values(project_ref,(select auth.uid()),'ticket_message',new.id);
 insert into public.athena_notifications(recipient_id,project_id,kind,message)
 select distinct receivers.user_id,project_ref,'ticket_update','Có phản hồi mới trong yêu cầu hỗ trợ.'
 from (
  select t.author_id as user_id from public.athena_tickets t where t.id=new.ticket_id
  union
  select m.user_id from public.athena_memberships m
    join public.athena_workspaces w on w.id=m.workspace_id
    where m.role='admin' and w.kind='studio'
 ) receivers
 where receivers.user_id is distinct from (select auth.uid());
 return new;
end;$$;
revoke all on function private.athena_project_created() from public,anon,authenticated;
revoke all on function private.athena_ticket_created() from public,anon,authenticated;
revoke all on function private.athena_message_created() from public,anon,authenticated;
drop trigger if exists athena_project_created on public.athena_projects;
create trigger athena_project_created after insert on public.athena_projects for each row execute function private.athena_project_created();
drop trigger if exists athena_ticket_created on public.athena_tickets;
create trigger athena_ticket_created after insert on public.athena_tickets for each row execute function private.athena_ticket_created();
drop trigger if exists athena_message_created on public.athena_ticket_messages;
create trigger athena_message_created after insert on public.athena_ticket_messages for each row execute function private.athena_message_created();

-- Project milestones and private document registrations also produce immutable audit entries.
create or replace function private.athena_milestone_created()
returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into public.athena_audit_events(project_id,actor_id,event_type,entity_id,new_value)
 values(new.project_id,(select auth.uid()),'milestone_created',new.id,new.status);
 return new;
end;$$;
create or replace function private.athena_document_registered()
returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into public.athena_audit_events(project_id,actor_id,event_type,entity_id)
 values(new.project_id,(select auth.uid()),'document_registered',new.id);
 return new;
end;$$;
revoke all on function private.athena_milestone_created() from public,anon,authenticated;
revoke all on function private.athena_document_registered() from public,anon,authenticated;
drop trigger if exists athena_milestone_created on public.athena_milestones;
create trigger athena_milestone_created after insert on public.athena_milestones
for each row execute function private.athena_milestone_created();
drop trigger if exists athena_document_registered on public.athena_documents;
create trigger athena_document_registered after insert on public.athena_documents
for each row execute function private.athena_document_registered();
