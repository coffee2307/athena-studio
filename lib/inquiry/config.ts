import "server-only";
export interface InquirySettings{
 databaseUrl:string;databaseKey:string;resendKey:string;recipient:string;sender:string;
 redisUrl:string;redisToken:string;rateSalt:string;turnstileSecret:string;turnstileSiteKey:string;origin:string;
}
const complete=(value:string|undefined)=>typeof value==="string"&&value.trim().length>0;
export function getInquirySettings():InquirySettings|null{
 const e=process.env;
 const data={
  databaseUrl:e.SUPABASE_URL||"",databaseKey:e.SUPABASE_SERVICE_ROLE_KEY||"",
  resendKey:e.RESEND_API_KEY||"",recipient:e.CONTACT_EMAIL||"",sender:e.CONTACT_FROM_EMAIL||"",
  redisUrl:e.UPSTASH_REDIS_REST_URL||"",redisToken:e.UPSTASH_REDIS_REST_TOKEN||"",
  rateSalt:e.INQUIRY_RATE_SALT||"",turnstileSecret:e.TURNSTILE_SECRET_KEY||"",
  turnstileSiteKey:e.NEXT_PUBLIC_TURNSTILE_SITE_KEY||"",origin:e.NEXT_PUBLIC_SITE_URL||""
 };
 if(!Object.values(data).every(complete))return null;
 try{
  const origin=new URL(data.origin),db=new URL(data.databaseUrl),redis=new URL(data.redisUrl);
  if(!["https:","http:"].includes(origin.protocol)||!/^https:$/.test(db.protocol)||!/^https:$/.test(redis.protocol))return null;
  // Local development can use HTTP for serving pages. Never allow non-HTTPS production.
  if(origin.protocol!=="https:"&&!["localhost","127.0.0.1"].includes(origin.hostname))return null;
  if(data.rateSalt.length<24)return null;
  if(!/^https:\/\//.test(data.databaseUrl)||!/^https:\/\//.test(data.redisUrl))return null;
 }catch{return null;}
 return data;
}
export function isInquiryEnabled():boolean{return getInquirySettings()!==null;}
