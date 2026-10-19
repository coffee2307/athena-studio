/** Public auth feature gate: missing provider or explicit approval => no live auth. */
export function authSettings(){
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL||"";
 const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||"";
 const origin=process.env.NEXT_PUBLIC_SITE_URL||"";
 let valid=false;
 try{
  const u=new URL(url),s=new URL(origin);
  valid=u.protocol==="https:"&&(s.protocol==="https:"||(s.hostname==="localhost"||s.hostname==="127.0.0.1"))&&key.length>20;
 }catch{valid=false;}
 return {url,key,origin,enabled:process.env.NEXT_PUBLIC_ATHENA_AUTH_ENABLED==="true"&&valid};
}
export function allowedDestination(candidate:string|null|undefined){
 if(candidate==="/tai-khoan/doi-mat-khau")return candidate;
 if(candidate==="/tai-khoan")return candidate;
 if(candidate==="/quan-tri")return candidate;
 return "/tai-khoan";
}
