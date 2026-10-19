import "server-only";
import {redirect} from "next/navigation";
import {serverAuthClient} from "./server";
import type {User} from "@supabase/supabase-js";
export type AthenaRole="admin"|"client";
export async function requireUser():Promise<User>{
 const supabase=await serverAuthClient();
 if(!supabase)redirect("/dang-nhap");
 const {data,error}=await supabase.auth.getUser();
 if(error||!data.user)redirect("/dang-nhap");
 if(!data.user.email_confirmed_at)redirect("/dang-nhap?notice=verify");
 return data.user;
}
export async function verifiedRole(userId:string):Promise<AthenaRole|null>{
 const supabase=await serverAuthClient();
 if(!supabase)return null;
 const {data:{user},error}=await supabase.auth.getUser();
 if(error||!user||user.id!==userId)return null;
 const {data:memberships,error:dbError}=await supabase.from("athena_memberships").select("role,athena_workspaces!inner(kind)").eq("user_id",user.id).eq("athena_workspaces.kind","studio");
 if(dbError||!memberships?.length)return null;
 return memberships.some(m=>m.role==="admin")?"admin":memberships.some(m=>m.role==="client")?"client":null;
}
export async function requireAdmin():Promise<User>{
 const user=await requireUser();
 if(await verifiedRole(user.id)!=="admin")redirect("/tai-khoan?notice=denied");
 return user;
}
