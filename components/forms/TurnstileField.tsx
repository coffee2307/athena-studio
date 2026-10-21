"use client";
import {useEffect,useRef,useState} from "react";
type TurnstileApi={
 render:(container:HTMLElement,options:Record<string,unknown>)=>string;
 remove:(id:string)=>void;
};
declare global{interface Window{turnstile?:TurnstileApi}}
export function TurnstileField({siteKey,onToken}:{siteKey:string;onToken:(token:string)=>void}){
 const element=useRef<HTMLDivElement>(null);
 const [error,setError]=useState(false);
 useEffect(()=>{
  if(!element.current)return;
  let widget:string|undefined;
  let active=true;
  const target=element.current;
  const render=()=>{
   if(!active||!window.turnstile||widget)return;
   widget=window.turnstile.render(target,{
    sitekey:siteKey,action:"inquiry",theme:"light",appearance:"interaction-only",
    callback:(token:string)=>{if(active){setError(false);onToken(token);}},
    "expired-callback":()=>{if(active)onToken("");},
    "error-callback":()=>{if(active){setError(true);onToken("");}}
   });
  };
  const existing=document.querySelector<HTMLScriptElement>('script[data-athena-turnstile]');
  const script=existing??document.createElement("script");
  if(!existing){
   script.src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
   script.async=true;script.defer=true;script.dataset.athenaTurnstile="true";
   document.head.append(script);
  }
  script.addEventListener("load",render);
  if(window.turnstile)render();
  script.addEventListener("error",()=>setError(true));
  return()=>{active=false;script.removeEventListener("load",render);if(widget)window.turnstile?.remove(widget);};
 },[siteKey,onToken]);
 return <div className="turnstile-slot" aria-label="Xác minh chống spam">
  <div ref={element}/>
  {error&&<p role="alert">Không tải được bước xác minh. Vui lòng gửi email trực tiếp hoặc thử lại sau.</p>}
 </div>;
}
