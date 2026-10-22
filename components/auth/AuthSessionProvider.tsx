"use client";
import {createContext,useContext,useEffect,useRef,useState,type ReactNode} from "react";

export type AuthSessionState={status:"loading"|"anonymous"|"authenticated";name:string};
// The public read-only preview has no server-side identity endpoint.
const identityEndpointEnabled=process.env.NEXT_PUBLIC_ATHENA_READ_ONLY_PREVIEW!=="true";
const initialState:AuthSessionState={status:identityEndpointEnabled?"loading":"anonymous",name:""};
const Context=createContext<AuthSessionState>(initialState);
export function useAuthSession(){return useContext(Context);}
export function AuthSessionProvider({children}:{children:ReactNode}){
 const [state,setState]=useState<AuthSessionState>(initialState);
 const lastFetch=useRef(0);
 const activeRequest=useRef<Promise<void>|null>(null);
 useEffect(()=>{
  if(!identityEndpointEnabled)return;
  let alive=true;
  const refresh=(force=false)=>{
   if(activeRequest.current)return activeRequest.current;
   if(!force&&Date.now()-lastFetch.current<2500)return Promise.resolve();
   lastFetch.current=Date.now();
   const promise=(async()=>{
    try{
     const response=await fetch("/api/identity/get-session",{cache:"no-store",credentials:"same-origin",headers:{Accept:"application/json"}});
     if(!alive)return;
     if(!response.ok){
      // Retain a previously verified account on transient failures (e.g. 429).
      if(response.status===503||response.status===401)setState({status:"anonymous",name:""});
      else setState(old=>old.status==="loading"?{status:"anonymous",name:""}:old);
      return;
     }
     const data=await response.json() as {user?:{id?:string;name?:string};session?:{id?:string}}|null;
     setState(data?.session?.id&&data?.user?.id
      ?{status:"authenticated",name:(data.user.name||"").trim()}
      :{status:"anonymous",name:""});
    }catch{if(alive)setState(old=>old.status==="loading"?{status:"anonymous",name:""}:old);}
   })().finally(()=>{activeRequest.current=null;});
   activeRequest.current=promise;
   return promise;
  };
  void refresh();
  const visibility=()=>{if(document.visibilityState==="visible")void refresh();};
  const force=()=>{lastFetch.current=0;void refresh(true);};
  window.addEventListener("focus",visibility);
  window.addEventListener("pageshow",visibility);
  window.addEventListener("athena:session-changed",force);
  document.addEventListener("visibilitychange",visibility);
  return()=>{alive=false;activeRequest.current=null;lastFetch.current=0;window.removeEventListener("focus",visibility);window.removeEventListener("pageshow",visibility);window.removeEventListener("athena:session-changed",force);document.removeEventListener("visibilitychange",visibility);};
 },[]);
 return <Context.Provider value={state}>{children}</Context.Provider>;
}
