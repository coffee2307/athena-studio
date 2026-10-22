/**
 * Public marketing release gate.
 * HTTPS by itself does NOT constitute approval for indexing.
 * This gate never enables accounts, email, billing or persistent data.
 */
export type PublicReleaseDecision = {
 approved:boolean;
 reason:"approved"|"not_approved"|"preview_mode"|"invalid_origin"|"insecure_origin";
 origin:string|null;
};
export function publicReleaseDecision(env:Readonly<Record<string,string|undefined>>=process.env):PublicReleaseDecision{
 if(env.ATHENA_PUBLIC_SITE_RELEASE_APPROVED!=="true")
  return {approved:false,reason:"not_approved",origin:null};
 if(env.NEXT_PUBLIC_ATHENA_READ_ONLY_PREVIEW==="true")
  return {approved:false,reason:"preview_mode",origin:null};
 const candidate=env.NEXT_PUBLIC_SITE_URL||"";
 let url:URL;
 try{url=new URL(candidate);}catch{return {approved:false,reason:"invalid_origin",origin:null};}
 if(url.protocol!=="https:"||url.username||url.password||url.search||url.hash||
    url.pathname!=="/"||url.origin!==candidate)
  return {approved:false,reason:"insecure_origin",origin:null};
 const host=url.hostname.toLowerCase();
 if(!host.includes(".")||host==="localhost"||host.endsWith(".localhost")||
    host.endsWith(".local")||host.endsWith(".invalid")||
    host.endsWith(".example")||host.endsWith(".test")||
    host.endsWith(".trycloudflare.com")||
    /^\d+(?:\.\d+){3}$/.test(host)||host.includes(":"))
  return {approved:false,reason:"insecure_origin",origin:null};
 return {approved:true,reason:"approved",origin:url.origin};
}
