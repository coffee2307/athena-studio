/** Strict offline proposal preview: never touch DNS, HTTP or live website. */
import {readFile} from "node:fs/promises";
import {fileURLToPath} from "node:url";
import path from "node:path";
import {parseTargets} from "../lib/sitepulse/core.mjs";
import {validatePilotAuthorization} from "../lib/sitepulse/consent.mjs";

export const PHAM_TARGETS=Object.freeze([Object.freeze({
 id:"pham-home",label:"PHAM Official - trang chu",url:"https://phamofficial.com/"
})]);
export function previewPhamPilot(manifest){
 const parsed=parseTargets(JSON.stringify(PHAM_TARGETS),"phamofficial.com",true);
 let authorized=false;
 try{
  validatePilotAuthorization(manifest,parsed);
  authorized=true;
 }catch{
  // An unapproved template is the expected state. Preview never authorizes it.
 }
 return {
  mode:"OFFLINE_ONLY_NO_NETWORK",
  target:parsed[0].url,
  scope:"Single HTTPS GET / after separate authorization",
  pilotId:manifest?.pilotId||"unknown",
  authorized,
  canProbe:false,
  manualOnly:true,
  minIntervalMinutes:15,
  maxDailyChecks:8,
  proposedDurationDays:7,
  nextStep:"Xác nhận quyền kiểm tra và phạm vi trước bất kỳ HTTP probe nào"
 };
}
export async function loadDraft(){
 const source=new URL("../docs/PHASE72_PHAM_CONSENT_DRAFT.json",import.meta.url);
 return JSON.parse(await readFile(source,"utf8"));
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const draft=await loadDraft();
 console.log(JSON.stringify(previewPhamPilot(draft),null,2));
}
