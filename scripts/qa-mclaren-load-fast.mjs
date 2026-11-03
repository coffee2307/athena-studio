import {chromium} from "playwright";
import assert from "node:assert/strict";

const origin=process.env.ATHENA_ORIGIN||"http://127.0.0.1:3182";
const browser=await chromium.launch({channel:"chrome",headless:true,args:["--enable-unsafe-swiftshader"]});
let passed=0,failed=0;
async function check(label,fn){try{await fn();passed++;console.log("PASS",label)}catch(error){failed++;console.error("FAIL",label,error?.message||error)}}
for(const width of [390,1440]){
 await check("McLaren live render "+width+"px: first paint poster and full GLB",async()=>{
  const page=await browser.newPage({viewport:{width,height:850},reducedMotion:"no-preference"});
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  try{
   const response=await page.goto(origin+"/template-demos/auto-showroom",{waitUntil:"domcontentloaded",timeout:25000});
   assert.equal(response.status(),200);
   const hero=page.locator(".bv-cinematic-track .ix-hero-image.bv-studio-fallback");
   await hero.waitFor({state:"attached"});
   const poster=await hero.evaluate(el=>({css:getComputedStyle(el,"::before").backgroundImage,exists:!!document.querySelector('link[rel="preload"][href*="mclaren-poster.webp"]')}));
   assert(poster.css.includes("mclaren-poster.webp"),JSON.stringify(poster));
   assert(poster.exists);
   const canvas=page.locator('canvas[data-scene-type="auto-showroom"]');
   await canvas.locator("xpath=..").count();
   await page.locator('canvas[data-scene-type="auto-showroom"][data-renderer="ready"]').waitFor({timeout:35000});
   await page.waitForFunction(()=>{
    const el=document.querySelector(".bv-cinematic-track .ix-hero-image.bv-studio-fallback");
    return el&&Number(getComputedStyle(el).opacity)<.05;
   },null,{timeout:7000});
   const details=await canvas.evaluate(el=>({quality:el.dataset.renderQuality,safe:el.dataset.modelSafe,first:Number(el.dataset.firstFrameMs),fetch:Number(el.dataset.modelFetchStartMs),decoded:Number(el.dataset.modelDecodedMs),silhouette:Number(el.dataset.silhouetteReadyMs),dpr:el.dataset.renderDpr}));
   assert.equal(details.safe,"true",JSON.stringify(details));
   assert(details.first>=details.silhouette&&details.silhouette>=details.decoded&&details.decoded>=details.fetch);
   assert.equal(errors.length,0,errors.join("; "));
   console.log("CAR_TIMING",JSON.stringify({width,msToFirstFrame:Math.round(details.first),fromDecodeToFirst:Math.round(details.first-details.decoded),dpr:details.dpr}));
  }finally{await page.close()}
 });
}
await check("poster/model/Draco cache policies",async()=>{
 for(const [path,mime] of [["/models/mclaren.glb","model/gltf-binary"],["/models/mclaren-poster.webp","image/webp"],["/draco/draco_decoder.wasm","application/wasm"]]){
  const r=await fetch(origin+path,{method:"HEAD"});
  assert.equal(r.status,200,path);
  assert.match(r.headers.get("cache-control")||"",/max-age=31536000, immutable/,path);
  if(mime!=="application/wasm")assert.match(r.headers.get("content-type")||"",new RegExp(mime.split("/")[0]),path);
 }
});
await check("reducing motion retains poster fallback",async()=>{
 const page=await browser.newPage({viewport:{width:390,height:850},reducedMotion:"reduce"});
 try{
  await page.goto(origin+"/template-demos/auto-showroom",{waitUntil:"domcontentloaded"});
  const hero=page.locator(".bv-cinematic-track .ix-hero-image.bv-studio-fallback");
  await hero.waitFor();
  await page.waitForFunction(()=>{
   const el=document.querySelector(".bv-cinematic-track .ix-hero-image.bv-studio-fallback");
   return el&&Number(getComputedStyle(el).opacity)>.95;
  },null,{timeout:6000});
  assert((await hero.evaluate(el=>getComputedStyle(el,"::before").backgroundImage)).includes("mclaren-poster"));
 }finally{await page.close()}
});
await browser.close();
console.log(JSON.stringify({passed,failed,total:passed+failed}));
if(failed)process.exitCode=1;
