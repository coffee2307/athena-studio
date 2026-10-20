import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {PGlite} from "@electric-sql/pglite";

const ADMIN="11111111-1111-4111-8111-111111111111";
const A="22222222-2222-4222-8222-222222222222";
const B="33333333-3333-4333-8333-333333333333";
const STUDIO="aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const WA="bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const WB="cccccccc-cccc-4ccc-8ccc-cccccccccccc";
const PA="dddddddd-dddd-4ddd-8ddd-dddddddddddd";
const PB="eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee";
const TA="ffffffff-ffff-4fff-8fff-ffffffffffff";

test("Phase6 actual SQL: tenant A/B isolation, restricted edits, audit and notifications",async()=>{
 const db=await PGlite.create();
 const sql1=await readFile(new URL("../docs/db/phase5_identity.sql",import.meta.url),"utf8");
 const sql2=await readFile(new URL("../docs/db/phase6_operations.sql",import.meta.url),"utf8");
 try{
  await db.exec(`create schema auth;
   create table auth.users(id uuid primary key,raw_user_meta_data jsonb);
   create role authenticated;
   create role anon;
   create function auth.uid() returns uuid language sql stable as $$
    select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
   grant usage on schema auth to authenticated;
   grant execute on function auth.uid() to authenticated;`);
  await db.exec(sql1.replace("create extension if not exists pgcrypto;",""));
  await db.exec(sql2);
  await db.exec(`insert into auth.users(id,raw_user_meta_data) values
  ('${ADMIN}','{"full_name":"Operator"}'),('${A}','{"full_name":"Client A"}'),('${B}','{"full_name":"Client B"}');
  insert into public.athena_workspaces(id,name,kind) values
  ('${STUDIO}','Athena Studio','studio'),('${WA}','Company A','client'),('${WB}','Company B','client');
  insert into public.athena_memberships(workspace_id,user_id,role) values
  ('${STUDIO}','${ADMIN}','admin'),('${WA}','${A}','client'),('${WB}','${B}','client');`);
  const asUser=async(id,callback)=>{
   await db.exec("set role authenticated");
   await db.query("select set_config('request.jwt.claim.sub',$1,false)",[id]);
   try{return await callback();}
   finally{await db.exec("reset role");}
  };
  await asUser(ADMIN,async()=>{
   const p1=await db.query("insert into public.athena_projects(id,workspace_id,name,summary,created_by) values($1,$2,'Project for A','Scoped work',$3) returning id",[PA,WA,ADMIN]);
   const p2=await db.query("insert into public.athena_projects(id,workspace_id,name,created_by) values($1,$2,'Project for B',$3) returning id",[PB,WB,ADMIN]);
   assert.equal(p1.rows[0].id,PA); assert.equal(p2.rows[0].id,PB);
   await db.query("insert into public.athena_milestones(project_id,title,position) values ($1,'Research and design',0)",[PA]);
  });
  await asUser(A,async()=>{
   const projects=await db.query("select id from public.athena_projects");
   assert.deepEqual(projects.rows.map(x=>x.id),[PA]);
   const ms=await db.query("select title from public.athena_milestones");
   assert.equal(ms.rows.length,1);
   assert.equal((await db.query("select id from public.athena_audit_events")).rows.length,2);
   await assert.rejects(db.query("insert into public.athena_projects(workspace_id,name) values($1,'Escalated project')",[WA]));
   assert.equal((await db.query("update public.athena_projects set status='completed' where id=$1 returning id",[PA])).rowCount,0);
   assert.equal((await db.query("update public.athena_milestones set status='done' where project_id=$1 returning id",[PA])).rowCount,0);
   await assert.rejects(db.query("insert into public.athena_ticket_messages(ticket_id,author_id,body) values($1,$2,'oops')",["99999999-9999-4999-8999-999999999999",A]));
   await assert.rejects(db.query("insert into public.athena_tickets(project_id,author_id,title,description) values($1,$2,'Wrong tenant','I am writing into B workspace')",[PB,A]));
   await db.query("insert into public.athena_tickets(id,project_id,author_id,title,description) values($1,$2,$3,'Please review page','The about page needs a correction')",[TA,PA,A]);
   await db.query("insert into public.athena_ticket_messages(ticket_id,author_id,body) values($1,$2,'Hi there, see page 3')",[TA,A]);
   await assert.rejects(db.query("insert into public.athena_ticket_messages(ticket_id,author_id,body) values($1,$2,'spoofed author')",[TA,B]));
   assert.equal((await db.query("select id from public.athena_tickets")).rows.length,1);
   assert.equal((await db.query("select id from public.athena_ticket_messages")).rows.length,1);
   assert.equal((await db.query("update public.athena_tickets set status='closed' where id=$1 returning id",[TA])).rowCount,0);
   await assert.rejects(db.query("insert into public.athena_documents(project_id,file_name,object_path,content_type,size_bytes) values($1,'oops.pdf',$2,'application/pdf',123)",[PA,PA+"/forbidden.pdf"]));
   await assert.rejects(db.query("insert into public.athena_audit_events(project_id,event_type,entity_id) values($1,'fake',$1)",[PA]));
   await assert.rejects(db.query("insert into public.athena_notifications(recipient_id,project_id,kind,message) values($1,$2,'ticket_update','fake')",[A,PA]));
  });
  await asUser(B,async()=>{
   assert.deepEqual((await db.query("select id from public.athena_projects")).rows.map(x=>x.id),[PB]);
   assert.equal((await db.query("select id from public.athena_tickets")).rows.length,0);
   assert.equal((await db.query("select id from public.athena_ticket_messages")).rows.length,0);
   assert.equal((await db.query("select id from public.athena_audit_events")).rows.length,1);
   await assert.rejects(db.query("insert into public.athena_ticket_messages(ticket_id,author_id,body) values($1,$2,'cross tenant')",[TA,B]));
  });
  await asUser(ADMIN,async()=>{
   await db.query("update public.athena_projects set status='in_progress' where id=$1",[PA]);
   await db.query("update public.athena_tickets set status='waiting_client' where id=$1",[TA]);
   assert.ok((await db.query("select id from public.athena_audit_events where project_id=$1",[PA])).rows.length>=4);
  });
  await asUser(A,async()=>{
   const ns=await db.query("select id,is_read from public.athena_notifications");
   assert.equal(ns.rows.length,2);
   await db.query("update public.athena_notifications set is_read=true where id=$1",[ns.rows[0].id]);
   assert.equal((await db.query("select count(*)::integer as count from public.athena_notifications where is_read")).rows[0].count,1);
  });
  await asUser(ADMIN,async()=>{
   await db.query("update public.athena_tickets set status='closed' where id=$1",[TA]);
  });
  await asUser(A,async()=>{
   await assert.rejects(db.query("insert into public.athena_ticket_messages(ticket_id,author_id,body) values($1,$2,'reopen without permissions')",[TA,A]));
  });
  await asUser(B,async()=>{
   assert.equal((await db.query("select id from public.athena_notifications")).rows.length,0);
  });
  await db.exec("set role anon");
  try{
   await assert.rejects(db.query("select * from public.athena_projects"));
   await assert.rejects(db.query("select * from public.athena_tickets"));
  }finally{await db.exec("reset role");}
 }finally{await db.close();}
});
