"use server";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {serverAuthClient} from "./server";
export async function signOut(){
 const client=await serverAuthClient();
 if(client)await client.auth.signOut({scope:"local"});
 redirect("/login?notice=signedout");
}
export async function signOutEverywhere(){
 const client=await serverAuthClient();
 if(client)await client.auth.signOut({scope:"global"});
 redirect("/login?notice=signedout");
}
export async function saveProfile(form:FormData){
 const client=await serverAuthClient();
 if(!client)redirect("/login");
 const {data:{user},error}=await client.auth.getUser();
 if(error||!user||!user.email_confirmed_at)redirect("/login");
 const candidate=form.get("display_name");
 if(typeof candidate!=="string"||candidate.trim().length<2||candidate.trim().length>80||/[\u0000-\u001F]/.test(candidate)){
  redirect("/account?notice=invalid");
 }
 // Never accept user_id, organization_id or role from the browser.
 const {error:dbError}=await client.from("athena_profiles")
  .update({display_name:candidate.trim()}).eq("id",user.id);
 if(dbError)redirect("/account?notice=error");
 revalidatePath("/account");
 redirect("/account?notice=saved");
}
