import "server-only";
import {createHmac} from "node:crypto";
import type {InquiryPayload} from "./validation";
import {formatMail} from "./validation";
import type {InquirySettings} from "./config";

async function safeJson(response:Response):Promise<Record<string,unknown>>{
 try { const data:unknown=await response.json();return data&&typeof data==="object"&&!Array.isArray(data)?data as Record<string,unknown>:{}; }
 catch{return {};}
}
export async function verifyChallenge(settings:InquirySettings,token:string):Promise<boolean>{
 if(!token)return false;
 const response=await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify",{
  method:"POST",headers:{"content-type":"application/x-www-form-urlencoded"},
  body:new URLSearchParams({secret:settings.turnstileSecret,response:token}),
  signal:AbortSignal.timeout(8000),cache:"no-store"
 });
 if(!response.ok)return false;
 const result=await safeJson(response);
 if(result.success!==true||result.action!=="inquiry")return false;
 const hostname=typeof result.hostname==="string"?result.hostname:"";
 return hostname===new URL(settings.origin).hostname;
}
export async function limitInquiry(settings:InquirySettings,email:string):Promise<boolean>{
 // No reliance on client-editable x-forwarded-for headers. Address hash is salted
 // so Redis never stores PII. A global quota limits abuse across many email values.
 const digest=createHmac("sha256",settings.rateSalt).update(email).digest("hex");
 const script="local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],900) end; return n";
 const key="athena:inquiry:email:"+digest;
 for(const [redisKey,limit] of [[key,3],["athena:inquiry:global",120]] as const){
  const r=await fetch(settings.redisUrl,{
   method:"POST",headers:{"Authorization":"Bearer "+settings.redisToken,"Content-Type":"application/json"},
   body:JSON.stringify(["EVAL",script,"1",redisKey]),cache:"no-store",signal:AbortSignal.timeout(7000)
  });
  if(!r.ok)throw Error("RATE_LIMIT_UNAVAILABLE");
  const body=await safeJson(r);
  if(body.error||typeof body.result!=="number")throw Error("RATE_LIMIT_UNAVAILABLE");
  if(body.result>limit)return false;
 }
 return true;
}
export async function recordInquiry(settings:InquirySettings,item:InquiryPayload):Promise<string>{
 const response=await fetch(new URL("/rest/v1/athena_inquiries?select=id",settings.databaseUrl),{
  method:"POST",headers:{"apikey":settings.databaseKey,"Authorization":"Bearer "+settings.databaseKey,
   "Content-Type":"application/json","Prefer":"return=representation"},
  body:JSON.stringify({full_name:item.name,email:item.email,company:item.company||null,service:item.service,
   message:item.message,consent_at:new Date().toISOString(),status:"new",notification_state:"pending"}),
  cache:"no-store",signal:AbortSignal.timeout(10000)
 });
 if(!response.ok)throw Error("DATABASE_UNAVAILABLE");
 const value:unknown=await response.json();
 const first=Array.isArray(value)?value[0]:null;
 const id=first&&typeof first==="object"&&(first as Record<string,unknown>).id;
 if(typeof id!=="string"||!/^[0-9a-f-]{36}$/i.test(id))throw Error("DATABASE_RESPONSE_INVALID");
 return id;
}
export async function setNotification(settings:InquirySettings,id:string,state:"sent"|"failed"){
 const response=await fetch(new URL("/rest/v1/athena_inquiries?id=eq."+encodeURIComponent(id),settings.databaseUrl),{
  method:"PATCH",headers:{"apikey":settings.databaseKey,"Authorization":"Bearer "+settings.databaseKey,
   "Content-Type":"application/json","Prefer":"return=minimal"},
  body:JSON.stringify({notification_state:state,notification_attempted_at:new Date().toISOString()}),
  cache:"no-store",signal:AbortSignal.timeout(7000)
 });
 if(!response.ok)throw Error("STATUS_UPDATE_UNAVAILABLE");
}
export async function notifyOwner(settings:InquirySettings,item:InquiryPayload,id:string):Promise<boolean>{
 const response=await fetch("https://api.resend.com/emails",{
  method:"POST",
  headers:{"Authorization":"Bearer "+settings.resendKey,"Content-Type":"application/json","Idempotency-Key":id},
  body:JSON.stringify({from:settings.sender,to:[settings.recipient],reply_to:item.email,
   subject:"Athena | Yêu cầu mới "+id.slice(0,8)+" | "+item.service,
   html:formatMail(item,id),
   headers:{"X-Athena-Inquiry":id}}),
  cache:"no-store",signal:AbortSignal.timeout(10000)
 });
 if(!response.ok)return false;
 const data=await safeJson(response);
 return typeof data.id==="string"&&data.id.length>0;
}
