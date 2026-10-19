import "server-only";
import {createServerClient} from "@supabase/ssr";
import {cookies} from "next/headers";
import {authSettings} from "./config";
export async function serverAuthClient(){
 const settings=authSettings();
 if(!settings.enabled)return null;
 const store=await cookies();
 return createServerClient(settings.url,settings.key,{
  cookieOptions:{sameSite:"lax",secure:new URL(settings.origin).protocol==="https:",path:"/"},
  cookies:{
   getAll(){return store.getAll();},
   setAll(items){
    try{items.forEach(({name,value,options})=>store.set(name,value,options));}
    catch{/* Server Components cannot write cookies; middleware owns refresh. */}
   }
  }
 });
}
