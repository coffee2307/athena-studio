-- Phase 6 private file bucket. Run AFTER phase6_operations.sql in Supabase staging ONLY.
-- Server actions use the authenticated admin session, not a service-role browser key.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('athena-project-files','athena-project-files',false,8388608,
 array['application/pdf','image/png','image/jpeg','image/webp'])
on conflict (id) do update set
  public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

-- Invalid or malicious path segments return NULL, never throw a uuid cast error.
create or replace function private.athena_storage_project(path text)
returns uuid language plpgsql stable security definer set search_path='' as $$
declare token text;
begin
 token:=split_part(path,'/',1);
 if token !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
 then return null; end if;
 return token::uuid;
exception when others then return null;
end;$$;
revoke all on function private.athena_storage_project(text) from public,anon;
grant execute on function private.athena_storage_project(text) to authenticated;

-- Public/anon cannot read, create, update or delete these objects.
-- SELECT requires *both* project authorization AND published document metadata.
create policy "athena private document read" on storage.objects for select to authenticated
 using(
  bucket_id='athena-project-files'
  and exists(select 1 from public.athena_documents d
   where d.object_path=name and private.athena_can_project(d.project_id))
 );
-- Admin uploads only into an existing project folder.
create policy "athena admin file upload" on storage.objects for insert to authenticated
 with check(
  bucket_id='athena-project-files'
  and private.athena_is_studio_admin()
  and private.athena_can_project(private.athena_storage_project(name))
 );
-- No UPDATE or DELETE policy: uploaded client documents are immutable through browser sessions.
-- Future audited deletion requires a separately authorized server-side retention workflow.

-- Controlled cleanup when storage upload definitively fails. Do not grant
-- arbitrary DELETE on document metadata, which could expose orphan objects.
-- If the object exists (e.g. network timed out after successful upload), retain
-- metadata so a protected operator can reconcile the file without data loss.
create or replace function public.athena_discard_failed_document(p_document_id uuid)
returns boolean
language plpgsql
security definer
set search_path=''
as $$
declare
 doc public.athena_documents%rowtype;
begin
 if (select auth.uid()) is null or not private.athena_is_studio_admin() then
  return false;
 end if;
 select * into doc from public.athena_documents
 where id=p_document_id and uploaded_by=(select auth.uid())
  and created_at > now()-interval '15 minutes';
 if not found then return false; end if;
 if exists (
  select 1 from storage.objects o
  where o.bucket_id='athena-project-files' and o.name=doc.object_path
 ) then
  return false;
 end if;
 delete from public.athena_documents d where d.id=doc.id;
 return found;
end;
$$;
revoke all on function public.athena_discard_failed_document(uuid) from public,anon;
grant execute on function public.athena_discard_failed_document(uuid) to authenticated;
