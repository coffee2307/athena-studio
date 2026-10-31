import {chromium} from "@playwright/test";
import {mkdirSync,writeFileSync} from "node:fs";
const base="http://127.0.0.1:3182/template-demos/auto-showroom";
const out=".qa/showroom-zoom-credit";mkdirSync(out,{recursive:true});
const browser=await chromium.launch({channel:"chrome",headless:true});
const results=[];
for(const width of [390,768,1440]){
 const p=await browser.newPage({viewport:{width,height:900},reducedMotion:"no-preference"});
 const errors=[];p.on("pageerror",e=>errors.push(e.message));
 try{
  await p.goto(base,{waitUntil:"load",timeout:40000});
  const credits=await p.locator('p.ix-glb-credit').count();
  if(credits!==1)throw Error("duplicated model attribution count="+credits);
  if(!(await p.locator("#world-main").innerText()).includes("không phải trang bán xe"))throw Error("homepage transparent demo copy missing");
  const scene=p.locator(".ix-auto-3d-canvas").first();
  const res={width,credits};
  if(width>760){
   const zoom=p.locator(".bv-zoom-controls button");
   if(await zoom.count()!==2)throw Error("missing zoom pair");

   await p.waitForTimeout(1200);
   const read=async()=>Number(await scene.getAttribute("data-camera-radius"));
   const initial=await read();
   await zoom.nth(0).click();
   await p.waitForTimeout(200);
   const plus=await read();
   await zoom.nth(0).click();
   await p.waitForTimeout(200);
   const plus2=await read();
   await zoom.nth(1).click();
   await p.waitForTimeout(200);
   const minus=await read();
   if(![initial,plus,plus2,minus].every(Number.isFinite))throw Error("camera radius not available");
   if(!(plus<initial*.85&&plus2<initial*.70&&minus>plus2*1.18))throw Error("zoom change insufficient "+JSON.stringify({initial,plus,plus2,minus}));
   const renderer=await scene.getAttribute("data-renderer");
   res.zoom={initial,plus,plus2,minus,renderer};
   await p.screenshot({path:out+"/showroom-"+width+".jpg",type:"jpeg",quality:78});
  }
  if(errors.length)throw Error("runtime "+errors.join(";"));
  results.push({...res,status:"PASS"});
  console.log("SHOWROOM_QA_PASS",JSON.stringify(res));
 }catch(e){results.push({width,status:"FAIL",message:String(e),errors});console.error("SHOWROOM_QA_FAIL",String(e))}
 await p.close();
}
await browser.close();
writeFileSync(out+"/results.json",JSON.stringify(results,null,2));
if(results.some(x=>x.status==="FAIL"))process.exitCode=1;
