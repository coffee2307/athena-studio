import assert from "node:assert/strict";
import {spawn} from "node:child_process";
import {createServer} from "node:net";
async function freePort(){const s=createServer();await new Promise((ok,err)=>{s.once("error",err);s.listen(0,"127.0.0.1",ok)});const a=s.address();const p=typeof a==="object"&&a?a.port:0;await new Promise(r=>s.close(r));assert.ok(p);return p;}
const port=await freePort(),root="http://127.0.0.1:"+port;
const app=spawn(process.execPath,["node_modules/next/dist/bin/next","start","-p",String(port),"-H","127.0.0.1"],{cwd:process.cwd(),stdio:["ignore","pipe","pipe"],env:{...process.env,NEXT_PUBLIC_SITE_URL:root,RESEND_API_KEY:"",CONTACT_EMAIL:"",CONTACT_FROM_EMAIL:""}});
let stderr="",exited=false;app.stderr.on("data",s=>stderr+=s.toString());app.on("exit",()=>exited=true);
const publicRoutes=["/","/services","/services/web-development","/services/web-development/templates","/templates/creative-studio","/templates/modern-corporate","/services/website-care","/services/ai-integration","/services/micro-saas","/projects","/projects/pham","/projects/econith","/products","/about","/process","/pricing","/contact","/legal","/legal/privacy","/legal/terms","/legal/cookies","/legal/service-policy","/robots.txt","/sitemap.xml","/og-athena.png","/api/health","/login","/signup","/forgot-password"];
const oldPaths={"/dich-vu":"/services","/dich-vu/web-development":"/services/web-development","/du-an":"/projects","/du-an/pham":"/projects/pham","/san-pham":"/products","/san-pham/sitepulse":"/products/sitepulse","/ve-athena":"/about","/quy-trinh":"/process","/bao-gia":"/pricing","/lien-he":"/contact","/phap-ly":"/legal","/phap-ly/quyen-rieng-tu":"/legal/privacy","/phap-ly/dieu-khoan":"/legal/terms","/phap-ly/cookie":"/legal/cookies","/dang-nhap":"/login","/dang-ky":"/signup","/tai-khoan":"/account","/quan-tri":"/admin","/work":"/projects","/work/pham":"/projects/pham","/studio":"/about"};
try{
 let ready=false;
 for(let i=0;i<90;i++){if(exited)throw Error("Server exited: "+stderr);try{let x=await fetch(root+"/",{signal:AbortSignal.timeout(1500)});if(x.ok){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,350))}
 assert.ok(ready,"App did not start: "+stderr);
 for(const path of publicRoutes){
  const res=await fetch(root+path,{signal:AbortSignal.timeout(10000)});assert.equal(res.status,200,path);
  assert.equal(res.headers.get("x-powered-by"),null,path+" leaks server header");
  assert.equal(res.headers.get("x-content-type-options"),"nosniff",path+" missing nosniff");
  assert.equal(res.headers.get("x-frame-options"),"DENY",path+" missing frame defense");
  assert.ok(res.headers.get("content-security-policy")?.includes("frame-ancestors"),path+" missing CSP");
  const body=await res.arrayBuffer();assert.ok(body.byteLength>(path==="/robots.txt"?10:30),path+" empty");
  console.log("PASS",path,res.status);
 }
 // Verify the actual build graph, not just that HTML routes return 200.
 // A missing Next CSS/JS chunk previously left mobile with unstyled browser-default HTML.
 const homeHtml=await (await fetch(root+"/",{signal:AbortSignal.timeout(10000)})).text();
 const staticRefs=[...new Set([...homeHtml.matchAll(/(?:href|src)="([^"]*\/_next\/static\/[^"]+\.(?:css|js)(?:\?[^"]*)?)"/g)].map(match=>match[1]))];
 assert.ok(staticRefs.some(ref=>/\.css(?:\?|$)/.test(ref)),"Home must reference at least one production CSS asset");
 assert.ok(staticRefs.some(ref=>/\.js(?:\?|$)/.test(ref)),"Home must reference at least one production JavaScript asset");
 for(const asset of staticRefs){
  const url=new URL(asset,root);
  assert.equal(url.origin,root,"Never follow cross-origin asset references in local smoke");
  const kind=/\.css(?:\?|$)/.test(asset)?"css":"js";
  const response=await fetch(url,{redirect:"manual",signal:AbortSignal.timeout(10000)});
  assert.equal(response.status,200,asset+" missing or unexpectedly redirected");
  const type=response.headers.get("content-type")||"";
  assert.match(type,kind==="css"?/text\/css/i:/(?:application|text)\/javascript/i,asset+" incorrect content type");
  assert.match(response.headers.get("cache-control")||"",/immutable/i,asset+" should be immutable and content-addressed");
  const body=await response.text();
  assert.ok(body.length>24,asset+" empty");
  assert.doesNotMatch(body.slice(0,200),/<!doctype html|<html\b/i,asset+" must not serve HTML as CSS/JS");
 }
 console.log("PASS",staticRefs.length,"production CSS/JS assets, valid types, immutable cache, no HTML fallback");
 for(const [oldPath,to] of Object.entries(oldPaths)){
  const result=await fetch(root+oldPath,{redirect:"manual"});
  assert.ok([307,308].includes(result.status),oldPath+" must redirect");
  assert.equal(new URL(result.headers.get("location"),root).pathname,to);
  console.log("PASS redirect",oldPath,"→",to);
 }
 const readiness=await fetch(root+"/api/readiness");
 assert.equal(readiness.status,503,"unconfigured staging must not report launch-ready");
 const readinessData=await readiness.json();
 assert.equal(readinessData.verification,"configuration-only");
 assert.equal(readiness.headers.get("cache-control"),"no-store");
 const account=await fetch(root+"/account",{redirect:"manual"});
 assert.ok([307,308].includes(account.status),"private account must redirect without Auth");
 assert.equal(new URL(account.headers.get("location"),root).pathname,"/login");
 const qrio=await fetch(root+"/projects/qrio");
 assert.equal(qrio.status,404,"unverified Qrio must not be published");
 const sitemap=await (await fetch(root+"/sitemap.xml")).text();
 assert.match(sitemap,/\/projects\/pham/);
 assert.match(sitemap,/\/projects\/econith/);
 assert.match(sitemap,/\/process/);
 assert.match(sitemap,/\/pricing/);
 assert.match(sitemap,/\/legal\/service-policy/);
 assert.match(sitemap,/\/services\/web-development\/templates/);
 assert.match(sitemap,/\/templates\/creative-studio/);
 assert.doesNotMatch(sitemap,/\/projects\/qrio|\/work\//);
 const robots=await (await fetch(root+"/robots.txt")).text();
 assert.match(robots,/Disallow: \/|Disallow:\//,"unconfigured non-HTTPS preview must not be indexed");
 const contact=await (await fetch(root+"/contact")).text();
 assert.match(contact,/Hiện nhận yêu cầu trực tiếp qua email\./,"contact must clearly disclose offline form");
 assert.match(contact,/Soạn email mô tả nhu cầu/,"contact must provide actionable fallback");
 assert.match(contact,/aria-label="Liên hệ nhanh"/,"contact fallback must expose direct contact options");
 assert.match(contact,/https:\/\/wa\.me\/84965747147/,"WhatsApp shortcut must have a real target");
 assert.match(contact,/https:\/\/zalo\.me\/0965747147/,"Zalo shortcut must have a real target");
 assert.doesNotMatch(contact,/<form[^>]*class="inquiry-form"/,"disabled form must not display a fake submission flow");
 const response=await fetch(root+"/api/inquiry",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({name:"A",email:"a@example.com",service:"website-care",message:"Please ignore this local smoke test."})});
 assert.equal(response.status,503,"form must fail closed without email provider");
 console.log("PASS unpublished project 404, sitemap, preview noindex, disabled contact");
 console.log("SMOKE TEST COMPLETE");
}finally{app.kill()}
