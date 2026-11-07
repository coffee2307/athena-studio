import {chromium} from "@playwright/test";
import {mkdirSync,writeFileSync} from "node:fs";
import {execSync} from "node:child_process";
const root="http://127.0.0.1:3182/template-demos/auto-showroom";
const output=".qa/showroom-camera-integrated";mkdirSync(output,{recursive:true});
const revision=execSync("git rev-parse HEAD",{encoding:"utf8"}).trim();
const browser=await chromium.launch({channel:process.platform==="win32"?"chrome":undefined,headless:true});
const sizes=[[320,680],[390,760],[390,844],[428,926],[768,1024],[1440,900],[1920,1080]];
const results=[],failures=[];
const near=(a,b,e=.07)=>Math.abs(a-b)<e;
const assert=(ok,message)=>{if(!ok)throw new Error(message)};
async function ready(page){await page.waitForFunction(()=>document.querySelector(".ix-auto-3d-canvas")?.dataset.renderer==="ready",null,{timeout:70000})}
async function camera(page){return page.locator(".ix-auto-3d-canvas").first().evaluate(el=>{const d=el.dataset;return {display:Number(d.cameraRadius),base:Number(d.cameraBaseRadius),factor:Number(d.zoomFactor),level:Number(d.zoomLevel),yaw:Number(d.cameraYaw),mode:d.cameraMode,frame:d.modelFrame,safe:d.modelSafe,progress:Number(d.scrollProgress),renderer:d.renderer}})}
async function drag(page,dx){
 const box=await page.locator(".ix-auto-3d-canvas").first().boundingBox();assert(box&&box.width>100,"canvas unavailable for drag");
 const sx=box.x+box.width*.74,sy=box.y+box.height*.56;
 await page.mouse.move(sx,sy);await page.mouse.down();
 await page.mouse.move(sx+dx,sy,{steps:8});await page.mouse.up();await page.waitForTimeout(280);
}
async function setProgress(page,progress){
 await page.evaluate(p=>{const el=document.getElementById("bv-cinematic-track");if(!el)return;const rect=el.getBoundingClientRect();const extent=Math.max(1,rect.height-innerHeight);scrollTo({top:rect.top+scrollY+extent*p,behavior:"instant"})},progress);
 await page.waitForTimeout(750);
}
for(const [width,height] of sizes.filter(([w])=>!process.env.SHOWROOM_QA_WIDTHS||process.env.SHOWROOM_QA_WIDTHS.split(",").includes(String(w)))){
 const context=await browser.newContext({viewport:{width,height},reducedMotion:"no-preference",deviceScaleFactor:1});
 const page=await context.newPage();const errors=[];
 page.on("pageerror",e=>errors.push(e.message));
 try{
  const response=await page.goto(root,{waitUntil:"load",timeout:45000});assert(response?.status()===200,"HTTP "+response?.status());
  await ready(page);
  const floatingInfo=page.locator('[data-athena-demo-info="auto-showroom"]');
  const floatingHandle=floatingInfo.locator(".athena-demo-float-handle");
  await floatingHandle.waitFor({state:"visible",timeout:12000});
  assert((await floatingInfo.getAttribute("class"))?.includes("is-collapsed"),"Immersive info must start collapsed");
  // The five camera controls are never covered by a non-dismissed info panel.
  if(width<=760){
   const sceneButtons=page.locator('button[aria-label^="Đến cảnh "]');
   assert(await sceneButtons.count()===5,"Five mobile chapter buttons absent");
   for(let i=0;i<5;i++){
    const exposed=await sceneButtons.nth(i).evaluate(el=>{const r=el.getBoundingClientRect();const target=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);return target===el||el.contains(target)});
    assert(exposed,"Floating information obscures mobile scene "+(i+1));
   }
  }
  const start=await camera(page);assert(start.renderer==="ready","model never ready");
  assert(near(start.display,start.base*start.factor,.025),"initial zoom invariant");
  const body=await page.locator("#world-main").innerText();
  assert(body.includes("ONE CAR. FIVE PERSPECTIVES."),"manifesto missing");
  assert(body.includes("THREE DESIGN"),"editorial missing");
  assert(!body.includes("VELAR"),"mixed VELAR public identity");
  assert(await page.locator("p.ix-glb-credit").count()===1,"duplicated attribution");
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);assert(overflow<=3,"horizontal overflow "+overflow);
  const entry={width,height,status:"PASS",start,interactions:[],chapters:[],sourceSha:revision};
  if(width>=768){
   const zoom=page.locator(".bv-zoom-controls button");assert(await zoom.count()===2,"zoom controls missing");
   for(const [label,index] of [["plus1",0],["plus2",0],["minus1",1],["minus2",1]]){
    await zoom.nth(index).click();await page.waitForTimeout(280);const s=await camera(page);
    assert(near(s.base,start.base,.06),label+" base drift "+JSON.stringify(s));
    assert(near(s.display,s.base*s.factor,.05),label+" display radius incorrect");
    entry.interactions.push({label,...s});
   }
   await zoom.first().click();await zoom.first().click();await page.waitForTimeout(200);
   const before=await camera(page);await drag(page,135);const after=await camera(page);
   assert(near(after.base,before.base,.09),"drag changes base after zoom "+JSON.stringify({before,after}));
   assert(near(after.display,before.display,.09),"drag adds unintended magnification "+JSON.stringify({before,after}));
   assert(Math.abs(after.yaw-before.yaw)>.1,"drag yaw failed");
   entry.interactions.push({label:"drag-after-zoom2",before,after});
   await zoom.last().click();await page.waitForTimeout(280);
   const minus=await camera(page);
   assert(near(minus.base,start.base,.09),"minus after drag double counted");
   assert(near(minus.display,start.base*.82,.09),"minus after drag wrong distance");
   await drag(page,-105);const reversed=await camera(page);
   assert(near(reversed.display,minus.display,.10),"reverse drag affects zoom");
   entry.interactions.push({label:"minus-then-drag",minus,reversed});
   await setProgress(page,.34);const scrolled=await camera(page);
   assert(scrolled.progress>.27&&scrolled.progress<.43,"p34 missed "+scrolled.progress);
   assert(scrolled.level===1,"scroll loses zoom");
   assert(near(scrolled.display,scrolled.base*.82,.12),"scroll zoom compounding");
   await drag(page,112);const midDrag=await camera(page);
   assert(near(midDrag.display,scrolled.display,.15),"drag at chapter changed zoom "+JSON.stringify({scrolled,midDrag}));
   entry.interactions.push({label:"chapter-drag",scrolled,midDrag});
   await setProgress(page,0);const reverseScroll=await camera(page);
   assert(reverseScroll.level===1,"reverse scroll lost zoom");
   assert(near(reverseScroll.display,reverseScroll.base*.82,.15),"reverse scroll double zoom");
   entry.interactions.push({label:"reverse-scroll",...reverseScroll});
   await page.screenshot({path:output+"/"+width+"-camera-controls.png",type:"png",animations:"disabled"});
  }
  for(const pct of [0,.01,.15,.24,.26,.34,.49,.51,.74,.76,.99,1]){
   await setProgress(page,pct);const state=await camera(page);
   assert(Number.isFinite(state.base)&&state.base>0,"nonfinite base");
   assert(near(state.display,state.base*state.factor,.2),"camera invariant at "+pct);
   entry.chapters.push({p:pct,...state});
   if([0,.34,.51,1].includes(pct)&&[390,1440].includes(width)){
    await page.screenshot({path:output+"/"+width+"-chapter-"+String(pct).replace(".","-")+".png",type:"png",animations:"disabled"});
   }
  }
  await page.evaluate(()=>window.scrollTo({top:0,behavior:"instant"}));
  await page.waitForFunction(()=>document.getElementById("bv-cinematic-track")?.dataset.chapter==="0",null,{timeout:12000});const cta=page.locator("button.ix-hero-primary");await cta.waitFor({state:"visible",timeout:12000});assert(await cta.count()===1,"CTA missing");
  const ctaExposed=await cta.evaluate(el=>{const r=el.getBoundingClientRect();const target=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);return target===el||el.contains(target)});
  assert(ctaExposed,"Floating information obscures primary CTA");
  await cta.click();await page.waitForTimeout(1000);
  await floatingHandle.click();
  await floatingInfo.locator(".athena-demo-float-panel").waitFor({state:"visible",timeout:8000});
  await floatingInfo.locator(".athena-demo-float-toggle").click();
  await floatingHandle.waitFor({state:"visible",timeout:8000});
  const afterCTA=await camera(page);assert(afterCTA.progress>.10,"CTA does not advance "+afterCTA.progress);
  assert(errors.length===0,"runtime errors "+errors.join(" | "));
  entry.interactions.push({label:"CTA",progress:afterCTA.progress});
  results.push(entry);
  console.log("SHOWROOM_CANONICAL_QA_PASS",width,JSON.stringify({interactions:entry.interactions.length,chapters:entry.chapters.length,progress:afterCTA.progress}));
 }catch(e){
  const failure={width,height,error:String(e),errors,sourceSha:revision};failures.push(failure);console.error("SHOWROOM_CANONICAL_QA_FAIL",JSON.stringify(failure));
  try{await page.screenshot({path:output+"/"+width+"-failure.png",timeout:10000})}catch{}
 }
 await context.close();
}
await browser.close();
writeFileSync(output+"/results.json",JSON.stringify({revision,browser:"Chrome",class:"LAB_DESKTOP/LAB_MOBILE_EMULATED",results,failures},null,2)+"\n");
console.log("SHOWROOM_CANONICAL_SUMMARY",JSON.stringify({passed:results.length,failed:failures.length,sha:revision}));
if(failures.length)process.exitCode=1;
