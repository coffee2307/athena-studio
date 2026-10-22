/**
 * Content-addressed asset and noindex check for private visual preview.
 * Contains no credentials; HTTP Basic credential is passed only in memory.
 */
export const previewRoutes=[
 "/", "/services", "/projects", "/process", "/pricing", "/contact",
 "/login", "/signup", "/legal/privacy"
];
export function safePreviewOrigin(raw){
 let url;
 try{url=new URL(raw);}catch{throw new Error("Invalid preview origin");}
 const h=url.hostname.toLowerCase();
 const local=h==="127.0.0.1"&&url.protocol==="http:"&&url.port==="3184";
 const tunnel=h.endsWith(".trycloudflare.com")&&url.protocol==="https:";
 if(!(local||tunnel)||url.pathname!=="/"||url.search||url.hash||url.username||url.password){
  throw new Error("Preview origin must be local port 3184 or a valid HTTPS trycloudflare tunnel");
 }
 return url.origin;
}
export function approvedPreviewOrigin(origin,pinned){
 if(origin==="http://127.0.0.1:3184")return true;
 try{return origin===safePreviewOrigin(pinned)&&pinned===origin;}catch{return false;}
}
export function extractStaticAssets(html){
 const css=[...html.matchAll(/href="([^"]*\/_next\/static\/css\/[^"]+\.css(?:\?[^"]*)?)"/g)].map(x=>x[1]);
 const js=[...html.matchAll(/src="([^"]*\/_next\/static\/chunks\/[^"]+\.js(?:\?[^"]*)?)"/g)].map(x=>x[1]);
 const fonts=[...html.matchAll(/href="([^"]*\/_next\/static\/media\/[^"]+\.woff2(?:\?[^"]*)?)"/g)].map(x=>x[1]);
 return {css:[...new Set(css)],js:[...new Set(js)],fonts:[...new Set(fonts)]};
}
export function latencySummary(samples){
 const nums=[...samples].filter(n=>Number.isFinite(n)&&n>=0).sort((a,b)=>a-b);
 if(!nums.length)return {count:0,p50:null,p95:null,max:null};
 const percentile=p=>nums[Math.max(0,Math.ceil(p*nums.length)-1)];
 return {count:nums.length,p50:percentile(.50),p95:percentile(.95),max:nums[nums.length-1]};
}
