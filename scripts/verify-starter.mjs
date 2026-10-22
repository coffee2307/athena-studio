import assert from "node:assert/strict";
import {mkdtemp,rm,readFile} from "node:fs/promises";
import {tmpdir} from "node:os";
import {resolve,join} from "node:path";
import {fileURLToPath} from "node:url";
import {spawn,spawnSync} from "node:child_process";
import {createServer} from "node:net";
const root=fileURLToPath(new URL("..",import.meta.url));
const registry=JSON.parse(await readFile(join(root,"data/templates.json"),"utf8"));
const selected=process.argv[2];
if(selected&&!registry.some(item=>item.slug===selected))throw Error("Unknown template");
const templates=selected?[selected]:["creative-studio","modern-corporate","commerce-standard"];
function run(command,args,cwd){const result=spawnSync(command,args,{cwd,stdio:"inherit",shell:false});if(result.status!==0)throw Error(command+" failed: "+result.status);}
async function freePort(){const server=createServer();await new Promise((ok,fail)=>{server.once("error",fail);server.listen(0,"127.0.0.1",ok);});const {port}=server.address();await new Promise(ok=>server.close(ok));return port;}
const workspace=await mkdtemp(join(tmpdir(),"athena-starter-verify-"));
try{
 for(const slug of templates){
  const output=resolve(workspace,slug);
  run(process.execPath,[join(root,"scripts/create-site.mjs"),"--template",slug,"--name",slug,"--brand","Studio Kiểm Thử","--out",output,"--email","hello@example.com"],root);
  run(process.platform==="win32"?"npm.cmd":"npm",["install","--ignore-scripts","--no-audit","--no-fund"],output);
  run(process.platform==="win32"?"npm.cmd":"npm",["run","typecheck"],output);
  run(process.platform==="win32"?"npm.cmd":"npm",["run","build"],output);
  const port=await freePort();
  const server=spawn(process.execPath,[join(output,"node_modules/next/dist/bin/next"),"start","-H","127.0.0.1","-p",String(port)],{cwd:output,stdio:"ignore"});
  try{
   let response;
   for(let attempt=0;attempt<50;attempt++){
    try{response=await fetch(`http://127.0.0.1:${port}`,{signal:AbortSignal.timeout(1000)});if(response.ok)break;}catch{}
    await new Promise(ok=>setTimeout(ok,200));
   }
   assert.equal(response?.status,200,slug+" HTTP");
   const html=await response.text();
   const preset=registry.find(item=>item.slug===slug);
   assert.ok(html.includes(`template-${preset.variant}`),slug+" renders selected variant");
   assert.ok(html.includes("Studio Kiểm Thử"),slug+" brand");
   for(const [,id] of html.matchAll(/href="#([^"]+)"/g))assert.ok(html.includes(`id="${id}"`),slug+" dead anchor "+id);
   assert.doesNotMatch(html,/__BRAND_NAME__|__TEMPLATE_SLUG__|<form/);
   assert.equal(response.headers.get("x-powered-by"),null);
   console.log("PASS isolated install/typecheck/build/HTTP/anchors:",slug);
  }finally{server.kill();}
 }
}finally{await rm(workspace,{recursive:true,force:true});}
