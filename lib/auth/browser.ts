"use client";
import {createBrowserClient} from "@supabase/ssr";
import {authSettings} from "./config";
export function browserAuthClient(){
 const settings=authSettings();
 if(!settings.enabled)throw Error("Xác thực chưa được cấu hình.");
 return createBrowserClient(settings.url,settings.key,{
  cookieOptions:{sameSite:"lax",secure:new URL(settings.origin).protocol==="https:",path:"/"}
 });
}
