#!/usr/bin/env node
// Fail-closed npm production-dependency audit.
// Retry only explicitly transient npm registry/advisory-service outages.
// Any genuine vulnerability or unknown audit failure fails immediately.
import {spawnSync} from "node:child_process";
import {existsSync} from "node:fs";
import {dirname,join,resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {setTimeout as sleep} from "node:timers/promises";

export function classifyAudit(exitCode, output=""){
 if(exitCode===0)return "pass";
 const transient=/(?:\b(?:429 Too Many Requests|502 Bad Gateway|503 Service Unavailable|504 Gateway Timeout)\b|npm (?:warn|error) audit (?:429|502|503|504)\b|npm error audit endpoint returned an error|\b(?:ETIMEDOUT|ECONNRESET|EAI_AGAIN)\b)/i.test(output);
 // Never treat a partial vulnerability report as successful/merely transient.
 const hasVulnerabilityReport=/\b\d+\s+vulnerabilit(?:y|ies)\b/i.test(output);
 return transient&&!hasVulnerabilityReport?"transient":"failure";
}
export function auditCommand(){
 const cli=process.env.npm_execpath||
  join(dirname(process.execPath),"node_modules","npm","bin","npm-cli.js");
 if(!existsSync(cli))throw Error("npm CLI unavailable; cannot perform security audit");
 return [process.execPath,[
  cli,"audit","--omit=dev","--audit-level=high",
  "--fetch-retries=0","--fetch-timeout=20000"
 ]];
}
async function run(){
 const [program,args]=auditCommand();
 for(let attempt=1;attempt<=3;attempt++){
  console.log("Production dependency audit "+attempt+"/3 (high and critical vulnerabilities block release)");
  const result=spawnSync(program,args,{
   encoding:"utf8",timeout:45000,maxBuffer:4*1024*1024,
   env:{...process.env,CI:process.env.CI||"true"}
  });
  const output=[result.stdout||"",result.stderr||""].join("\n");
  // Retain npm findings/errors in CI log; no secrets are supplied to audit.
  if(output.trim())process.stdout.write(output.trim()+"\n");
  const outcome=classifyAudit(result.status,output);
  if(outcome==="pass"){
   console.log("AUDIT_PASS: npm advisory service responded; production audit completed.");
   return;
  }
  if(outcome!=="transient"||attempt===3){
   console.error(outcome==="transient"
    ?"AUDIT_NO_GO: npm advisory service remained unavailable after 3 attempts."
    :"AUDIT_NO_GO: vulnerabilities, unknown error or missing audit result.");
   process.exitCode=1;return;
  }
  console.error("Transient npm audit outage; retrying without bypassing security checks.");
  await sleep(attempt*3000);
 }
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{await run();}
 catch(err){console.error("AUDIT_NO_GO:",err instanceof Error?err.message:String(err));process.exitCode=1;}
}
