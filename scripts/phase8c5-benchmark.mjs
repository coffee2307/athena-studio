#!/usr/bin/env node
import {performance} from "node:perf_hooks";
import {localBenchmarkOrigin,benchmarkSummary} from "./phase8c5-benchmark-core.mjs";
import {mkdir,writeFile} from "node:fs/promises";
const argv=process.argv.slice(2);
const index=key=>argv.indexOf(key);
function arg(key,fallback){
 const i=index(key);
 return i<0?fallback:argv[i+1];
}
function integer(value,min,max){
 const x=Number(value);
 return Number.isInteger(x)&&x>=min&&x<=max?x:null;
}
const origin=localBenchmarkOrigin(arg("--origin","http://127.0.0.1:3000"));
const count=integer(arg("--requests","60"),1,300);
const concurrency=integer(arg("--concurrency","4"),1,12);
const path=arg("--path","/api/health");
const output=arg("--json-out","");
if(!argv.includes("--run-local")||!origin||!count||!concurrency||
 !["/","/api/health","/dich-vu"].includes(path)||
 (output&&!/^\.qa\/benchmark-[a-z0-9-]+\.json$/.test(output))){
 process.stderr.write("Safe usage: node scripts/phase8c5-benchmark.mjs --run-local --origin http://127.0.0.1:3000 --path /api/health --requests 60 --concurrency 4\n");
 process.exit(2);
}
const entries=new Array(count);
let next=0;
const start=performance.now();
await Promise.all(Array.from({length:Math.min(concurrency,count)},async()=>{
 while(next<count){
  const id=next++;
  const t=performance.now();
  try{
   const r=await fetch(origin+path,{redirect:"manual",signal:AbortSignal.timeout(3500),
    headers:{"Cache-Control":"no-cache"}});
   await r.arrayBuffer();
   entries[id]={status:r.status,duration:performance.now()-t};
  }catch{
   entries[id]={status:0,duration:performance.now()-t};
  }
 }
}));
const report={
 kind:"offline-local-http-sample",
 origin,path,concurrency,
 note:"Not a VPS benchmark; no promise of production throughput/uptime.",
 ...benchmarkSummary(entries,(performance.now()-start)/1000)
};
process.stdout.write(JSON.stringify(report,null,2)+"\n");
if(output){
 await mkdir(".qa",{recursive:true});
 await writeFile(output,JSON.stringify(report,null,2)+"\n",{mode:0o600,flag:"wx"});
}
if(report.failed)process.exitCode=1;
