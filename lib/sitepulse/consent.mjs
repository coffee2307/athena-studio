/**
 * Offline operator attestation for an explicitly authorized SitePulse pilot.
 * This verifies the syntax, scope, expiry and rate limits of a local record;
 * it does NOT independently prove domain ownership or legal authorization.
 */
import {readFile} from "node:fs/promises";
import {parseTargets} from "./core.mjs";

const idPattern=/^[a-z][a-z0-9-]{1,31}$/;
const utc=(s)=>{
 if(typeof s!=="string"||!/^20\d{2}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,3})?Z$/.test(s))return NaN;
 const t=Date.parse(s);return Number.isFinite(t)?t:NaN;
};
export function validatePilotAuthorization(raw,targets,now=new Date()){
 const m=typeof raw==="string"?JSON.parse(raw):raw;
 if(!m||typeof m!=="object"||Array.isArray(m)||m.schemaVersion!==1||
  !idPattern.test(m.pilotId||"")||m.operatorAcknowledged!==true)
  throw Error("Hồ sơ đồng ý pilot không hợp lệ hoặc chưa được xác nhận");
 if(typeof m.authorizationReference!=="string"||
  !/^[a-zA-Z0-9._:/-]{8,120}$/.test(m.authorizationReference))
  throw Error("Cần mã tham chiếu chứng từ ủy quyền bên ngoài (không đưa PII/secret vào Git)");
 const start=utc(m.approvedAt),end=utc(m.expiresAt),clock=now.getTime();
 if(!Number.isFinite(start)||!Number.isFinite(end)||end<=start||end-start>14*86400000||start>clock||clock>=end)
  throw Error("Hồ sơ pilot phải đang có hiệu lực, tối đa 14 ngày và chưa hết hạn");
 if(!Array.isArray(targets)||!targets.length||targets.length>3)
  throw Error("Chỉ thực hiện pilot có 1–3 đích giám sát được phép");
 if(!Array.isArray(m.targets)||m.targets.length!==targets.length)
  throw Error("Đích giám sát phải có trong hồ sơ ủy quyền");
 const approved=new Map();
 for(const t of m.targets){
  if(!t||!idPattern.test(t.id||"")||typeof t.url!=="string"||approved.has(t.id))
   throw Error("Mục giám sát ủy quyền trùng hoặc không hợp lệ");
  const [canonical]=parseTargets(JSON.stringify([{id:t.id,label:"Pilot target",url:t.url}]),new URL(t.url).hostname,true);
  if(canonical.url!==t.url)throw Error("URL phải trùng khớp tuyệt đối với phạm vi đã duyệt");
  approved.set(t.id,t.url);
 }
 for(const t of targets)if(approved.get(t.id)!==t.url)throw Error("Mục tiêu không khớp phạm vi ủy quyền");
 const interval=m.minimumIntervalMinutes??15,maxDaily=m.maxChecksPerTargetPerDay??8;
 if(!Number.isInteger(interval)||interval<10||interval>1440||
  !Number.isInteger(maxDaily)||maxDaily<1||maxDaily>16)
  throw Error("Giới hạn tần suất pilot không hợp lệ");
 return {pilotId:m.pilotId,approvedAt:m.approvedAt,expiresAt:m.expiresAt,
  authorizationReference:m.authorizationReference,targets:targets.map(x=>x.id),
  minimumIntervalMinutes:interval,maxChecksPerTargetPerDay:maxDaily};
}
export function eligibleForManualCheck({targetId,history,authorization,now=new Date()}){
 const current=now.getTime();
 const matching=(Array.isArray(history)?history:[]).filter(r=>r?.id===targetId&&r?.pilotId===authorization.pilotId&&
  Number.isFinite(Date.parse(r.checkedAt||""))&&Date.parse(r.checkedAt)<=current);
 const last=matching.reduce((m,r)=>Math.max(m,Date.parse(r.checkedAt)),Number.NEGATIVE_INFINITY);
 if(Number.isFinite(last)&&current-last<authorization.minimumIntervalMinutes*60000)
  return {allowed:false,reason:"minimum_interval"};
 const daily=matching.filter(r=>current-Date.parse(r.checkedAt)<24*3600*1000).length;
 if(daily>=authorization.maxChecksPerTargetPerDay)return {allowed:false,reason:"daily_limit"};
 return {allowed:true,reason:"approved_manual"};
}
export async function loadPilotAuthorization(file){
 if(typeof file!=="string"||file.trim()==="")throw Error("Chưa có tệp đồng ý dùng thử được phê duyệt");
 const content=await readFile(file,"utf8");
 if(content.length>16384)throw Error("Hồ sơ pilot quá lớn");
 return JSON.parse(content);
}
