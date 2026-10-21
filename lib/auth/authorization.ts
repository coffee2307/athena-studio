import "server-only";
import {redirect} from "next/navigation";
import {serverAuthClient} from "./server";
import type {User} from "@supabase/supabase-js";
export type AthenaRole="admin"|"client";
export async function requireUser():Promise<User>{
 const supabase=await serverAuthClient();
 if(!supabase)redirect("/login");
 const {data,error}=await supabase.auth.getUser();
 if(error||!data.user)redirect("/login");
 if(!data.user.email_confirmed_at)redirect("/login?notice=verify");
 return data.user;
}
export async function verifiedRole(userId:string):Promise<AthenaRole|null>{
 const supabase=await serverAuthClient();
 if(!supabase)return null;
 const {data:{user},error}=await supabase.auth.getUser();
 if(error||!user||user.id!==userId)return null;
 const {data:memberships,error:dbError}=await supabase.from("athena_memberships").select("role,athena_workspaces!inner(kind)").eq("user_id",user.id);
 if(dbError||!memberships?.length)return null;
 const studio=memberships.some(m=>{
  if(m.role!=="admin")return false;
  const workspace:unknown=m.athena_workspaces;
  if(Array.isArray(workspace))return workspace.some(w=>w&&typeof w==="object"&&w.kind==="studio");
  return !!workspace&&typeof workspace==="object"&&"kind" in workspace&&workspace.kind==="studio";
 });
 return studio?"admin":memberships.some(m=>m.role==="client")?"client":null;
}
export async function requireAdmin():Promise<User>{
 const user=await requireUser();
 if(await verifiedRole(user.id)!=="admin")redirect("/account?notice=denied");
 return user;
}
