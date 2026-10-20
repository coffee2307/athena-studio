import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {PGlite} from "@electric-sql/pglite";
const OWNER="11111111-1111-4111-8111-111111111111",A="22222222-2222-4222-8222-222222222222",B="33333333-3333-4333-8333-333333333333";
const STUDIO="aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",WA="bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",WB="cccccccc-cccc-4ccc-8ccc-cccccccccccc";
const PA="dddddddd-dddd-4ddd-8ddd-dddddddddddd",PB="eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee";
const OBJECT_A=PA+"/a1cccb10-1010-4101-8101-101010101010-private.pdf";
const OBJECT_B=PB+"/a2cccb10-1010-4101-8101-101010101010-private.pdf";
test("Storage SQL: signed-link eligibility follows private metadata + project RLS",async()=>{
 const db=await PGlite.create();
 try{
  await db.exec(`create schema auth;
   create table auth.users(id uuid primary key,raw_user_meta_data jsonb);
   create role authenticated;create role anon;
   create function auth.uid() returns uuid language sql stable as $$
    select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
   grant usage on schema auth to authenticated;grant execute on function auth.uid() to authenticated;
   create schema storage;
   create table storage.buckets(id text primary key,name text not null,public boolean not null default false,file_size_limit bigint,allowed_mime_types text[]);
   create table storage.objects(id uuid primary key default gen_random_uuid(),bucket_id text not null references storage.buckets(id),name text not null unique);
   alter table storage.objects enable row level security;
   grant usage on schema storage to authenticated;
   grant select,insert on storage.objects to authenticated;`);
  await db.exec((await readFile(new URL("../docs/db/phase5_identity.sql",import.meta.url),"utf8")).replace("create extension if not exists pgcrypto;",""));
  await db.exec(await readFile(new URL("../docs/db/phase6_operations.sql",import.meta.url),"utf8"));
  await db.exec(await readFile(new URL("../docs/db/phase6_storage.sql",import.meta.url),"utf8"));
  const patch=await readFile(new URL("../docs/db/phase8b_security_hardening.sql",import.meta.url),"utf8");
  await db.exec(patch); // Apply once, as recorded in Supabase migration history.
  const invoker=await db.query("select prosecdef from pg_proc where proname=$1",["athena_discard_failed_document"]);
  assert.equal(invoker.rows[0].prosecdef,false);
  const workspacePolicies=await db.query("select count(*)::int as n from pg_policies where schemaname='public' and tablename='athena_workspaces' and cmd='SELECT'");
  assert.equal(workspacePolicies.rows[0].n,1);
  await db.exec(`insert into auth.users(id,raw_user_meta_data) values
   ('${OWNER}','{"full_name":"Operator"}'),('${A}','{"full_name":"Client A"}'),('${B}','{"full_name":"Client B"}');
   insert into public.athena_workspaces(id,name,kind) values ('${STUDIO}','Athena','studio'),('${WA}','A company','client'),('${WB}','B company','client');
   insert into public.athena_memberships(workspace_id,user_id,role) values ('${STUDIO}','${OWNER}','admin'),('${WA}','${A}','client'),('${WB}','${B}','client');
   insert into public.athena_projects(id,workspace_id,name,created_by) values ('${PA}','Alpha project','Alpha',null);`.replace("'Alpha project','Alpha'","'"+WA+"','Alpha project'"));
  await db.query("insert into public.athena_projects(id,workspace_id,name) values($1,$2,'Beta project')",[PB,WB]);
  const asUser=async(id,fn)=>{
   await db.exec("set role authenticated");await db.query("select set_config('request.jwt.claim.sub',$1,false)",[id]);
   try{return await fn();}finally{await db.exec("reset role");}
  };
  await asUser(OWNER,async()=>{
   assert.equal((await db.query("select count(*)::int as n from public.athena_workspaces")).rows[0].n,3);
   for(const [project,path] of [[PA,OBJECT_A],[PB,OBJECT_B]]){
    await db.query("insert into public.athena_documents(project_id,file_name,object_path,content_type,size_bytes) values ($1,'private.pdf',$2,'application/pdf',1024)",[project,path]);
    await db.query("insert into storage.objects(bucket_id,name) values('athena-project-files',$1)",[path]);
   }
  });
  await asUser(OWNER,async()=>{
   // A project's authorized reader must not gain access to another project's
   // storage object by a forged metadata-to-project association.
   await assert.rejects(db.query("insert into public.athena_documents(project_id,file_name,object_path,content_type,size_bytes) values ($1,'leak.pdf',$2,'application/pdf',1024)",[PB,PA+"/some-forged-path.pdf"]));
   // Failed upload cleanup is allowed only when the object has not been stored.
   const pending=PA+"/cccccccc-cccc-4ccc-8ccc-cccccccccccc-pending.pdf";
   const inserted=await db.query("insert into public.athena_documents(project_id,file_name,object_path,content_type,size_bytes,uploaded_by) values ($1,'pending.pdf',$2,'application/pdf',1024,$3) returning id",[PA,pending,OWNER]);
   const id=inserted.rows[0].id;
   assert.equal((await db.query("select public.athena_discard_failed_document($1) as cleaned",[id])).rows[0].cleaned,true);
   assert.equal((await db.query("select id from public.athena_documents where id=$1",[id])).rowCount,0);
   assert.equal((await db.query("select public.athena_discard_failed_document($1) as cleaned",[id])).rows[0].cleaned,false);
   // Existing storage objects may never lose metadata in the cleanup path.
   const existing=await db.query("select id from public.athena_documents where object_path=$1",[OBJECT_A]);
   assert.equal((await db.query("select public.athena_discard_failed_document($1) as cleaned",[existing.rows[0].id])).rows[0].cleaned,false);
  });
  await asUser(A,async()=>{
   const docs=await db.query("select object_path from public.athena_documents");
   assert.deepEqual(docs.rows.map(d=>d.object_path),[OBJECT_A]);
   assert.deepEqual((await db.query("select name from storage.objects")).rows.map(o=>o.name),[OBJECT_A]);
   await assert.rejects(db.query("insert into storage.objects(bucket_id,name) values('athena-project-files',$1)",[PA+"/unauthorized.pdf"]));
   await assert.rejects(db.query("insert into public.athena_documents(project_id,file_name,object_path,content_type,size_bytes) values ($1,'notallow.pdf',$2,'application/pdf',1024)",[PA,PA+"/notallowed.pdf"]));
  });
  await asUser(B,async()=>{
   assert.deepEqual((await db.query("select name from storage.objects")).rows.map(o=>o.name),[OBJECT_B]);
   assert.equal((await db.query("select object_path from public.athena_documents where object_path=$1",[OBJECT_A])).rowCount,0);
   assert.equal((await db.query("select name from storage.objects where name=$1",[OBJECT_A])).rowCount,0);
   await assert.rejects(db.query("insert into storage.objects(bucket_id,name) values('athena-project-files',$1)",[OBJECT_A+"-spoof"]));
  });
  await asUser(OWNER,async()=>{
   const bad=(await db.query("select private.athena_storage_project($1) as id",["../../invalid.pdf"])).rows[0].id;
   assert.equal(bad,null);
  });
 }finally{await db.close();}
});
