import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import {once} from "node:events";
import {publicIPv4,parseTargets,classifyStatus,checkTarget,summarize} from "../lib/sitepulse/core.mjs";
import {run} from "../scripts/sitepulse-check.mjs";

test("Public-IP validation rejects internal, mapped, reserved and loopback addresses",()=>{
 for(const ip of ["127.0.0.1","10.20.1.1","172.16.2.3","172.31.1.1","192.168.1.1","100.65.0.1","169.254.169.254","0.0.0.0","192.0.2.1","198.51.100.2","203.0.113.3","224.0.0.1","::ffff:127.0.0.1","::1"]){
  assert.equal(publicIPv4(ip),false,ip);
 }
 for(const ip of ["1.1.1.1","8.8.8.8","172.32.1.1","9.9.9.9"])assert.equal(publicIPv4(ip),true,ip);
});
test("SitePulse never accepts arbitrary user-supplied URLs, internal IP, redirects or credentials",()=>{
 const allow="example.com,pham.test";
 const pass=[{id:"homepage",label:"Trang chủ",url:"https://example.com/health"}];
 assert.deepEqual(parseTargets(JSON.stringify(pass),allow,true),pass);
 for(const url of ["http://example.com/","https://localhost/","https://127.0.0.1/","https://example.com:8443/","https://user:password@example.com/","https://example.com/?secret=yes","https://example.com/#token","https://evil.example.com/","https://example.com.evil.test/","file:///etc/passwd"]){
  assert.throws(()=>parseTargets(JSON.stringify([{id:"homepage",label:"Test service",url}]),allow,true),undefined,url);
 }
 assert.throws(()=>parseTargets(JSON.stringify([{id:"same",label:"Label A",url:"https://example.com"},{id:"same",label:"Label B",url:"https://example.com"}]),allow,true));
 for(const addr of ["127.0.0.1","10.0.0.1","localhost","router.local"]){
  assert.throws(()=>parseTargets(JSON.stringify([{id:"target",label:"Approved hostname",url:"https://"+addr+"/"}]),addr,true));
 }
 assert.deepEqual(parseTargets("{malformed}",allow,false),[]);
 assert.throws(()=>parseTargets("{malformed}",allow,true));
});
test("DNS refuses private address even if resolver mixes it with public IPv4",async()=>{
 const t={id:"example",label:"Example",url:"https://example.com/"};
 let called=0;
 const r=await checkTarget(t,{resolver:async()=>{called++;return [{address:"1.1.1.1",family:4},{address:"169.254.169.254",family:4}]}});
 assert.equal(r.detail,"blocked_private_address");assert.equal(r.state,"down");assert.equal(called,1);
 const hung=await checkTarget(t,{resolver:async()=>new Promise(()=>{}),timeoutMs:30});
 assert.equal(hung.detail,"dns_timeout");
});
test("Local real HTTP probe records status, TTFB, redirect refusal and timeout without following redirect",async()=>{
 let redirected=0;
 const server=http.createServer((req,res)=>{
  if(req.url==="/up"){res.writeHead(200,{"content-type":"text/plain"});res.end("ok");return;}
  if(req.url==="/bad"){res.writeHead(503);res.end("service unavailable");return;}
  if(req.url==="/redirect"){res.writeHead(302,{location:"http://127.0.0.1:1/redirect-target"});res.end();return;}
  if(req.url==="/redirect-target")redirected++;
  if(req.url==="/slow"){setTimeout(()=>{if(!res.destroyed){res.writeHead(200);res.end("late");}},200);return;}
  res.writeHead(404);res.end("missing");
 });
 server.listen(0,"127.0.0.1");
 await once(server,"listening");
 const port=server.address().port;
 try{
  const runPath=(p,timeoutMs=1000)=>checkTarget({id:"local",label:"Local test",url:"http://127.0.0.1:"+port+p},{allowLocalTest:true,timeoutMs});
  const success=await runPath("/up");assert.equal(success.state,"up");assert.equal(success.httpStatus,200);assert.ok(success.ttfbMs>=0);
  const fail=await runPath("/bad");assert.equal(fail.state,"down");assert.equal(fail.httpStatus,503);
  const redirect=await runPath("/redirect");assert.equal(redirect.state,"attention");assert.equal(redirect.httpStatus,302);assert.equal(redirect.detail,"redirect_not_followed");assert.equal(redirected,0);
  const slow=await runPath("/slow",35);assert.equal(slow.state,"down");assert.equal(slow.detail,"timeout");
  await assert.rejects(checkTarget({id:"nope",url:"http://example.com/"},{allowLocalTest:true}),/loopback/);
 }finally{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
});
test("Pilot requires explicit enable flag; never performs implicit network operations",async()=>{
 let n=0;
 const disabled=await run({env:{ATHENA_SITEPULSE_ENABLED:"false"},probe:async()=>{n++;throw Error("not expected");}});
 assert.deepEqual(disabled,{enabled:false,targets:0,checks:[],reason:"disabled"});
 assert.equal(n,0);
 const logs=[];
 const env={ATHENA_SITEPULSE_ENABLED:"true",ATHENA_SITEPULSE_APPROVED_HOSTS:"example.com",ATHENA_SITEPULSE_TARGETS_JSON:JSON.stringify([{id:"sample",label:"Example",url:"https://example.com/"}]),ATHENA_SITEPULSE_REPORT_FILE:".qa/sitepulse-test-not-written.jsonl"};
 const success=await run({env,probe:async t=>({id:t.id,label:t.label,state:"up",checkedAt:"2026-10-20T10:00:00.000Z",httpStatus:200,ttfbMs:100}),writer:async(file,body)=>{logs.push({file,body});},authorizationLoader:async()=>({schemaVersion:1,pilotId:"test-pilot",operatorAcknowledged:true,authorizationReference:"signed-sandbox-test",approvedAt:"2026-10-20T09:00:00Z",expiresAt:"2026-10-21T09:00:00Z",targets:[{id:"sample",url:"https://example.com/"}]}),clock:()=>new Date("2026-10-20T10:00:00Z"),historyLoader:async()=>[],lockEnabled:false});
 assert.equal(success.targets,1);assert.equal(logs.length,1);
 assert.equal(JSON.parse(logs[0].body).httpStatus,200);
});
test("Summaries distinguish observed sampled success ratio from full uptime SLA and confirm 2 failures",()=>{
 const states=["up","down","down","down","up","down","up"];
 const rows=states.map((state,i)=>({id:"site",state,checkedAt:"2026-10-20T10:0"+i+":00.000Z"}));
 const [s]=summarize(rows);
 assert.equal(s.checks,7);assert.equal(s.successfulChecks,3);assert.equal(s.confirmedIncidents,1);assert.equal(s.lastState,"up");
 assert.equal(s.observedSuccessRatio,0.4286);
 assert.deepEqual(summarize([]),[]);
 assert.equal(classifyStatus(301),"attention");assert.equal(classifyStatus(404),"down");
});
