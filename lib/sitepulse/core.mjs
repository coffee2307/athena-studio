/** SitePulse Phase 7 pilot. Operator-approved HTTPS origins only; NO public URL input. */
import dns from "node:dns/promises";
import https from "node:https";
import http from "node:http";
import net from "node:net";

const idPattern=/^[a-z][a-z0-9-]{1,31}$/;
const allowedRanges=[
 [0,0,8],[10,0,8],[100,64,10],[127,0,8],[169,254,16],
 [172,16,12],[192,0,24],[192,168,16],[198,18,15],[224,0,3]
];
export function publicIPv4(ip){
 if(net.isIP(ip)!==4)return false;
 const nums=ip.split(".").map(Number);
 const u=(nums[0]*2**24+nums[1]*2**16+nums[2]*256+nums[3])>>>0;
 const inRange=(base,prefix)=>{
  const mask=(0xffffffff << (32-prefix))>>>0;
  return (u&mask)===((base>>>0)&mask);
 };
 for(const [a,b,p] of allowedRanges){
  const base=(a*2**24+b*2**16)>>>0;
  if(inRange(base,p))return false;
 }
 // All 192.0.0.0/24, documentation nets, broadcast and IPv4 special blocks.
 if(nums[0]===192&&nums[1]===0&&nums[2]===0)return false;
 if(nums[0]===192&&nums[1]===0&&nums[2]===2)return false;
 if(nums[0]===198&&nums[1]===51&&nums[2]===100)return false;
 if(nums[0]===203&&nums[1]===0&&nums[2]===113)return false;
 if(nums[0]===255||nums[0]===192&&nums[1]===88&&nums[2]===99)return false;
 return true;
}
export function parseTargets(json,hosts,enabled=false){
 if(!enabled)return [];
 let list;
 try{list=JSON.parse(json||"[]");}catch{throw Error("Danh sách SitePulse không phải JSON hợp lệ");}
 if(!Array.isArray(list)||list.length<1||list.length>10)throw Error("Pilot chỉ chấp nhận 1–10 địa chỉ");
 const allow=new Set((hosts||"").split(",").map(s=>s.trim().toLowerCase()).filter(Boolean));
 if(!allow.size)throw Error("Cần danh sách tên miền được chủ sở hữu phê duyệt");
 const seen=new Set();
 return list.map(t=>{
  if(!t||typeof t!=="object"||!idPattern.test(t.id)||typeof t.label!=="string"||t.label.length<2||t.label.length>75||seen.has(t.id))throw Error("ID/nhãn giám sát trùng hoặc không hợp lệ");
  seen.add(t.id);
  let u;
  try{u=new URL(t.url);}catch{throw Error("URL giám sát không hợp lệ");}
  if(u.protocol!=="https:"||u.port||u.username||u.password||u.search||u.hash||!allow.has(u.hostname.toLowerCase())||u.hostname.endsWith(".")){
   throw Error("Chỉ chấp nhận URL HTTPS không query/credentials và thuộc domain đã được duyệt");
  }
  return {id:t.id,label:t.label,url:u.toString()};
 });
}
export function classifyStatus(code){
 if(code>=200&&code<300)return "up";
 if(code>=300&&code<400)return "attention"; // redirects not followed: prevent SSRF
 return "down";
}
export async function checkTarget(target,{resolver=dns.lookup,timeoutMs=8000,allowLocalTest=false,maxResponseBytes=16_384}={}){
 const u=new URL(target.url),start=performance.now(),at=new Date().toISOString();
 const make=(state,code=null,ttfbMs=null,detail="")=>({
  id:target.id,label:target.label,checkedAt:at,state,httpStatus:code,
  responseMs:Math.round(performance.now()-start),ttfbMs:ttfbMs===null?null:Math.round(ttfbMs),detail
 });
 if(allowLocalTest){
  if(u.protocol!=="http:"||u.hostname!=="127.0.0.1")throw Error("Test local chỉ dùng địa chỉ loopback");
 }else{
  if(u.protocol!=="https:"||u.port||u.username||u.password||u.search||u.hash)throw Error("Probe requires approved HTTPS URL");
 }
 let ip;
 if(!allowLocalTest){
  let found;
  try{found=await resolver(u.hostname,{all:true});}
  catch{return make("down",null,null,"dns_failed");}
  if(!Array.isArray(found)||!found.length)return make("down",null,null,"dns_empty");
  // Every IPv4 answer must be public. IPv6-only targets not supported in pilot.
  const v4=found.filter(x=>x.family===4);
  if(v4.length===0)return make("down",null,null,"no_ipv4");
  if(v4.some(x=>!publicIPv4(x.address)))return make("down",null,null,"blocked_private_address");
  ip=v4[0].address;
 }
 const proto=allowLocalTest?http:https;
 return await new Promise(resolve=>{
  let settled=false,req;
  const finish=result=>{if(settled)return;settled=true;clearTimeout(timer);resolve(result);};
  const timer=setTimeout(()=>{req?.destroy();finish(make("down",null,null,"timeout"));},timeoutMs);
  try{
   req=proto.request({
    protocol:u.protocol,hostname:u.hostname,port:u.port||undefined,
    path:u.pathname,method:"GET",agent:false,
    ...(ip?{lookup:(_host,_opts,cb)=>cb(null,ip,4)}:{}),
    headers:{"User-Agent":"Athena-SitePulse-Pilot/0.1 (+contact via Athena Studio)",
      Accept:"text/html,application/json;q=0.9,*/*;q=0.1",
      Connection:"close"},
    timeout:timeoutMs
   },res=>{
    const ttfb=performance.now()-start,code=res.statusCode||0;
    let received=0;
    const state=classifyStatus(code);
    const detail=state==="up"?"http_success":state==="attention"?"redirect_not_followed":"http_failure";
    // Read only a capped response prefix; the pilot checks HTTP availability, NOT page content.
    res.on("data",chunk=>{
     received+=chunk.length;
     if(received>=maxResponseBytes){
      finish(make(state,code,ttfb,detail));
      res.destroy();
     }
    });
    res.on("end",()=>finish(make(state,code,ttfb,detail)));
    res.on("error",()=>finish(make("down",code,ttfb,"response_error")));
   });
   req.on("timeout",()=>{req.destroy();finish(make("down",null,null,"timeout"));});
   req.on("error",()=>finish(make("down",null,null,"connection_or_tls_error")));
   req.end();
  }catch{finish(make("down",null,null,"request_failed"));}
 });
}
export function summarize(history){
 const grouped=new Map();
 for(const row of history){
  if(!row||!idPattern.test(row.id)||!["up","attention","down"].includes(row.state)||!Number.isFinite(Date.parse(row.checkedAt)))continue;
  const rows=grouped.get(row.id)||[];rows.push(row);grouped.set(row.id,rows);
 }
 return [...grouped].map(([id,rows])=>{
  rows.sort((a,b)=>Date.parse(a.checkedAt)-Date.parse(b.checkedAt));
  const up=rows.filter(x=>x.state==="up").length;
  let consecutiveFailures=0,confirmedIncidents=0,inIncident=false;
  for(const r of rows){
   if(r.state==="down"){
    consecutiveFailures++;
    if(consecutiveFailures===2&&!inIncident){confirmedIncidents++;inIncident=true;}
   }else{
    consecutiveFailures=0;inIncident=false;
   }
  }
  return {id,checks:rows.length,successfulChecks:up,observedSuccessRatio:rows.length?Number((up/rows.length).toFixed(4)):null,
   confirmedIncidents,lastState:rows.at(-1)?.state,latestCheck:rows.at(-1)?.checkedAt};
 });
}
