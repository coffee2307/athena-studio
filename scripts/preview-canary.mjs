#!/usr/bin/env node
/**
 * Production-preview canary. Never deploys, writes records or exposes secrets.
 * Checks private HTTP auth, noindex, route health and hashed stylesheet/script
 * access (including fonts) after a deployment. Measurements are point samples.
 */
import {readFileSync} from "node:fs";
import {performance} from "node:perf_hooks";
import {previewRoutes,safePreviewOrigin,approvedPreviewOrigin,extractStaticAssets,latencySummary} from "../lib/preview-canary.mjs";

const raw=process.env.ATHENA_PRIVATE_PREVIEW_ORIGIN||"http://127.0.0.1:3184";
const origin=safePreviewOrigin(raw);
if(origin!=="http://127.0.0.1:3184"){
 let pinned="";
 try{pinned=readFileSync(new URL("../.qa/preview-approved-origin.txt",import.meta.url),"utf8").trim();}
 catch{throw new Error("External tunnel not approved: create ignored .qa/preview-approved-origin.txt with the verified exact HTTPS URL");}
 if(!approvedPreviewOrigin(origin,pinned))throw new Error("External tunnel mismatch: refusing to send Basic Auth credentials");
}
const password=readFileSync(new URL("../.qa/preview-password.txt",import.meta.url),"utf8").trim();
if(password.length<16)throw Error("Preview credential missing or too short");
const auth={"Authorization":"Basic "+Buffer.from("athena:"+password).toString("base64")};
const error=[];
const metric=[];
const checkedAssets=new Set();
const record=(name,ok,detail)=>{console.log((ok?"PASS":"FAIL")+" "+name+": "+detail);if(!ok)error.push(name);};
async function get(path,{authenticated=true,method="GET"}={}){
 const url=new URL(path,origin);
 if(url.origin!==origin)throw Error("Cross-origin asset URL rejected");
 const started=performance.now();
 const response=await fetch(url,{method,headers:authenticated?auth:{},redirect:"manual",cache:"no-store",signal:AbortSignal.timeout(15000)});
 metric.push({name:path,status:response.status,ms:Math.round(performance.now()-started)});
 return response;
}
async function run(){
 const anonymous=await get("/",{authenticated:false});
 record("unauthenticated request",anonymous.status===401,"HTTP "+anonymous.status);
 const bodyHtml=[];
 const routeTimings=[];
 for(const path of previewRoutes){
  const response=await get(path);
  routeTimings.push(metric[metric.length-1].ms);
  const cc=response.headers.get("cache-control")||"";
  const robots=response.headers.get("x-robots-tag")||"";
  const ok=response.status===200&&cc.includes("no-store")&&robots.includes("noindex");
  record(path,ok,"HTTP "+response.status+"; noindex="+robots.includes("noindex")+"; no-store="+cc.includes("no-store"));
  if(response.status===200)bodyHtml.push(await response.text());
 }
 const all=bodyHtml.map(extractStaticAssets);
 const css=[...new Set(all.flatMap(x=>x.css))];
 const js=[...new Set(all.flatMap(x=>x.js))];
 const fonts=[...new Set(all.flatMap(x=>x.fonts))];
 record("compiled CSS referenced",css.length>0,"stylesheets="+css.length);
 record("compiled JavaScript referenced",js.length>0,"chunks="+js.length);
 const samples=[...css.slice(0,4),...js.slice(0,3),...fonts.slice(0,2)];
 for(const asset of samples){
  if(checkedAssets.has(asset))continue;
  checkedAssets.add(asset);
  const response=await get(asset);
  const ct=response.headers.get("content-type")||"";
  const cc=response.headers.get("cache-control")||"";
  const expected=asset.includes("/css/")?"text/css":asset.endsWith(".woff2")?"font/":"javascript";
  const ok=response.status===200&&ct.includes(expected)&&cc.includes("immutable")&&cc.includes("private");
  record("hashed asset "+(asset.split("/").pop()||"").slice(0,25),ok,
   "HTTP "+response.status+" type="+ct+" cache="+cc.slice(0,80));
  await response.arrayBuffer();
 }
 const api=await get("/api/identity/get-session");
 record("identity API sealed",api.status===404,"HTTP "+api.status);
 const mutation=await get("/contact",{method:"POST"});
 record("mutations denied",mutation.status===405,"HTTP "+mutation.status);
 const stats=latencySummary(routeTimings);
 console.log("CANARY_SAMPLE",{origin:new URL(origin).hostname,route_count:previewRoutes.length,asset_count:checkedAssets.size,latency_ms:stats,failures:error});
 if(error.length)process.exitCode=1;
}
try{await run();}catch(e){console.error("CANARY_NO_GO:",e instanceof Error?e.message:String(e));process.exitCode=1;}
