import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {PGlite} from "@electric-sql/pglite";
const A="11111111-1111-4111-8111-111111111111";
const B="22222222-2222-4222-8222-222222222222";
const W1="aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const W2="bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

test("Actual PostgreSQL RLS: two independent workspace tenants cannot access each other",async()=>{
 const db=await PGlite.create();
 try{
  await db.exec(`
   create schema auth;
   create table auth.users(id uuid primary key,raw_user_meta_data jsonb);
   create role authenticated;
   create role anon;
   create function auth.uid() returns uuid language sql stable as $$
    select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid
   $$;
  `);
  const migration=await readFile(new URL("../docs/db/phase5_identity.sql",import.meta.url),"utf8");
  // PGlite has built-in gen_random_uuid() but doesn't bundle optional pgcrypto.
  // This one extension declaration is omitted; all real grants/triggers/RLS are executed.
  const executable=migration.replace("create extension if not exists pgcrypto;","");
  await db.exec(executable);
  await db.exec(`
   insert into auth.users(id,raw_user_meta_data) values
    ('${A}','{"full_name":"Khách A"}'::jsonb),
    ('${B}','{"full_name":"Khách B"}'::jsonb);
   insert into public.athena_workspaces(id,name,kind) values
    ('${W1}','Studio Athena','studio'),('${W2}','Bên thuê B','client');
   insert into public.athena_memberships(workspace_id,user_id,role) values
    ('${W1}','${A}','admin'),('${W2}','${B}','client');
  `);
  const asUser=async (id,operation)=>{
   await db.exec("set role authenticated");
   await db.query("select set_config('request.jwt.claim.sub',$1,false)",[id]);
   try{return await operation();}
   finally{await db.exec("reset role");}
  };
  // User A sees only their account, studio and admin membership, not B's tenant.
  await asUser(A,async()=>{
   const profiles=await db.query("select id,display_name from public.athena_profiles order by id");
   assert.deepEqual(profiles.rows.map(x=>x.id),[A]);
   assert.equal(profiles.rows[0].display_name,"Khách A");
   const workspaces=await db.query("select id from public.athena_workspaces");
   assert.deepEqual(workspaces.rows.map(x=>x.id),[W1]);
   const memberships=await db.query("select user_id,role from public.athena_memberships");
   assert.deepEqual(memberships.rows.map(x=>x.role),["admin"]);
   const attempted=await db.query("update public.athena_profiles set display_name='BỊ SỬA' where id=$1 returning id",[B]);
   assert.equal(attempted.rowCount,0);
   await assert.rejects(db.query("update public.athena_memberships set role='admin' where user_id=$1",[B]));
   await assert.rejects(db.query("insert into public.athena_workspaces(name,kind) values ('X','studio')"));
   await assert.rejects(db.query("update public.athena_profiles set id=$1 where id=$2",[B,A]));
  });
  // User B cannot read studio A or admin membership; can edit only own display_name.
  await asUser(B,async()=>{
   const profiles=await db.query("select id from public.athena_profiles");
   assert.deepEqual(profiles.rows.map(x=>x.id),[B]);
   const workspaces=await db.query("select id,kind from public.athena_workspaces");
   assert.deepEqual(workspaces.rows,[{id:W2,kind:"client"}]);
   const memberships=await db.query("select role from public.athena_memberships");
   assert.deepEqual(memberships.rows.map(x=>x.role),["client"]);
   const changed=await db.query("update public.athena_profiles set display_name='Khách B mới' where id=$1 returning id,display_name",[B]);
   assert.equal(changed.rowCount,1);
   assert.equal(changed.rows[0].display_name,"Khách B mới");
   await assert.rejects(db.query("update public.athena_memberships set role='admin' where user_id=$1",[B]));
  });
  await db.exec("set role anon");
  try{
   await assert.rejects(db.query("select * from public.athena_profiles"));
   await assert.rejects(db.query("select * from public.athena_memberships"));
  }finally{await db.exec("reset role");}
 }finally{await db.close();}
});
