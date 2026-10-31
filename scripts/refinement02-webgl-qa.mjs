import {chromium} from "@playwright/test";
import {mkdirSync,writeFileSync} from "node:fs";
const origin=process.env.ATHENA_QA_ORIGIN||"http://127.0.0.1:3182";
mkdirSync(".qa/refinement02/webgl",{recursive:true});
const browser=await chromium.launch({headless:true,channel:process.platform==="win32"?"chrome":undefined,args:["--enable-webgl","--use-angle=swiftshader","--enable-unsafe-swiftshader"]});
const results=[];
for(const width of [390,1440]){
 const page=await browser.newPage({viewport:{width,height:width===390?844:900},reducedMotion:"no-preference"});
 const errors=[];page.on("pageerror",e=>errors.push(e.message));page.on("console",m=>{if(m.type()==="error")errors.push(m.text().slice(0,190))});
 let state="unknown",status="";
 try{
  await page.goto(origin+"/template-demos/auto-showroom",{waitUntil:"domcontentloaded",timeout:45000});
  const canvas=page.locator(".ix-auto-3d-canvas").first();
  await canvas.waitFor({timeout:20000});
  await page.waitForFunction(()=>{let c=document.querySelector(".ix-auto-3d-canvas");return !!c&&["ready","fallback"].includes(c.dataset.renderer||"")},{timeout:45000}).catch(()=>{});
  state=await canvas.getAttribute("data-renderer")||"missing";
  const loading=page.locator(".bv-load-spinner");
  status=await loading.count()?await loading.locator("strong").first().textContent()||"":"none";
  await page.screenshot({path:".qa/refinement02/webgl/auto-showroom-"+width+".png",timeout:25000});
  console.log("WEBGL_PROBE",JSON.stringify({width,state,status,errors:errors.slice(0,3)}));
  results.push({width,state,status,errors});
 }catch(e){results.push({width,state,status,error:String(e)});console.log("WEBGL_PROBE_ERROR",String(e))}
 await page.close();
}
// Deterministic slow-network probe: a loaded spinner must appear before a single GLB byte resolves.
{
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:"no-preference"});
 await page.route("**/models/mclaren.glb*",async route=>{await new Promise(resolve=>setTimeout(resolve,5000));await route.continue().catch(()=>{});});
 try{
  await page.goto(origin+"/template-demos/auto-showroom",{waitUntil:"domcontentloaded",timeout:45000});
  const spinner=page.locator(".bv-spinner-ring");
  await spinner.waitFor({state:"visible",timeout:8000});
  const txt=await page.locator(".bv-load-spinner strong").textContent();
  if(!txt?.includes("Đang tải mô hình McLaren"))throw Error("Incorrect spinner copy: "+txt);
  if(await page.locator(".bv-load-spinner .ix-car-load-track").count())throw Error("Visual percent track remains");
  await page.screenshot({path:".qa/refinement02/webgl/spinner-390.png"});
  results.push({width:390,state:"spinner-visible",status:txt});
  console.log("WEBGL_LOADING_SPINNER_PASS",txt);
 }catch(e){results.push({width:390,state:"spinner-failed",error:String(e)});console.log("WEBGL_LOADING_SPINNER_FAIL",String(e))}
 await page.close();
}
await browser.close();
writeFileSync(".qa/refinement02/webgl/results.json",JSON.stringify(results,null,2));
if(results.some(x=>x.error))process.exitCode=1;
