import assert from "node:assert/strict";
import {spawn} from "node:child_process";
import {createServer} from "node:net";
async function freePort(){const s=createServer();await new Promise((ok,err)=>{s.once("error",err);s.listen(0,"127.0.0.1",ok)});const a=s.address();const p=typeof a==="object"&&a?a.port:0;await new Promise(r=>s.close(r));assert.ok(p);return p;}
const port=await freePort(),root="http://127.0.0.1:"+port;
const app=spawn(process.execPath,["node_modules/next/dist/bin/next","start","-p",String(port),"-H","127.0.0.1"],{cwd:process.cwd(),stdio:["ignore","pipe","pipe"],env:{...process.env,NEXT_PUBLIC_SITE_URL:root,RESEND_API_KEY:"",CONTACT_EMAIL:"",CONTACT_FROM_EMAIL:""}});
let stderr="",exited=false;app.stderr.on("data",s=>stderr+=s.toString());app.on("exit",()=>exited=true);
const publicRoutes=["/","/dich-vu","/dich-vu/web-development","/dich-vu/website-care","/dich-vu/ai-integration","/dich-vu/micro-saas","/du-an","/du-an/pham","/du-an/econith","/san-pham","/ve-athena","/lien-he","/phap-ly","/phap-ly/quyen-rieng-tu","/phap-ly/dieu-khoan","/phap-ly/cookie","/robots.txt","/sitemap.xml","/og-athena.png","/api/health"];
const oldPaths={"/services":"/dich-vu","/services/web-development":"/dich-vu/web-development","/products":"/san-pham","/studio":"/ve-athena","/contact":"/lien-he","/work":"/du-an","/work/pham":"/du-an/pham"};
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
 const qrio=await fetch(root+"/du-an/qrio");
 assert.equal(qrio.status,404,"unverified Qrio must not be published");
 const sitemap=await (await fetch(root+"/sitemap.xml")).text();
 assert.match(sitemap,/\/du-an\/pham/);
 assert.match(sitemap,/\/du-an\/econith/);
 assert.doesNotMatch(sitemap,/\/du-an\/qrio|\/work\//);
 const robots=await (await fetch(root+"/robots.txt")).text();
 assert.match(robots,/Disallow: \/|Disallow:\//,"unconfigured non-HTTPS preview must not be indexed");
 const contact=await (await fetch(root+"/lien-he")).text();assert.match(contact,/Biểu mẫu đang được cấu hình/);
 const response=await fetch(root+"/api/inquiry",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({name:"A",email:"a@example.com",service:"website-care",message:"Please ignore this local smoke test."})});
 assert.equal(response.status,503,"form must fail closed without email provider");
 console.log("PASS unpublished project 404, sitemap, preview noindex, disabled contact");
 console.log("SMOKE TEST COMPLETE");
}finally{app.kill()}
