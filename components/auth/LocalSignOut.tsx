"use client";
import {createAuthClient} from "better-auth/react";
import {useState} from "react";
export function LocalSignOut(){
 const [busy,setBusy]=useState(false);
 return <button className="pill-link pill-dark auth-submit" disabled={busy} onClick={async()=>{
  setBusy(true);
  try{const c=createAuthClient({baseURL:window.location.origin,basePath:"/api/identity"});const result=await c.signOut();if(!result.error)window.location.assign("/login");else setBusy(false);}
  catch{setBusy(false);}
 }}>{busy?"Đang đăng xuất…":"Đăng xuất →"}</button>;
}
