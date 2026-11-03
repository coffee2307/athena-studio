import {chromium} from "playwright";
import assert from "node:assert/strict";
const origin=process.env.ATHENA_ORIGIN??"http://127.0.0.1:3182";
const browser=await chromium.launch({channel:"chrome",headless:true});
let passed=0,failed=0;
async function check(label,fn){
 try{await fn();++passed;console.log("PASS",label)}
 catch(err){++failed;console.error("FAIL",label,err?.message??err)}
}
for(const width of [320,390,428]){
 await check("mobile "+width+" SORA zoom controls and clean cover",async()=>{
  const page=await browser.newPage({viewport:{width,height:850},deviceScaleFactor:1});
  try{
   await page.goto(origin+"/template-demos/creative-studio",{waitUntil:"domcontentloaded",timeout:15000});
   const host=page.locator('[data-athena-demo-info="creative-studio"]');
   await host.locator(".athena-demo-float-panel").waitFor({state:"visible"});
   assert.equal(await page.getByText("KÉO ẢNH ĐỂ ĐỔI TRANG / HOẶC CHẠM NÚT").count(),0);
   assert.equal(await page.locator('[aria-label="Trang bìa trước"]').count(),0);
   assert.equal(await page.locator('[aria-label="Trang bìa tiếp theo"]').count(),0);
   assert.equal(await page.locator('[aria-label="Thay đổi trang bìa"] button').count(),3);
   assert.equal(await host.locator('.athena-demo-float-toggle svg').count(),1);
   await host.locator('.athena-demo-float-toggle').click();
   await host.locator('.athena-demo-float-handle').waitFor({state:"visible"});
   assert.equal(await host.getAttribute("class"),"athena-demo-float is-collapsed");
   assert.equal(await host.locator('.athena-demo-float-panel').getAttribute("aria-hidden"),"true");
   assert.equal(await host.locator('.athena-demo-float-handle svg path[d="M10.8 7.8v6"]').count(),1);
   await host.locator('.athena-demo-float-handle').click();
   await host.locator('.athena-demo-float-panel').waitFor({state:"visible"});
   assert.equal(await host.locator('.athena-demo-float-panel').getAttribute("aria-hidden"),"false");
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }finally{await page.close()}
 });
 await check("mobile "+width+" Poppy portrait preview fills frame",async()=>{
  const page=await browser.newPage({viewport:{width,height:850},deviceScaleFactor:1});
  try{
   const r=await page.goto(origin+"/services/web-development/templates",{waitUntil:"domcontentloaded",timeout:15000});assert.equal(r.status(),200);
   const img=page.locator(".dna-library-frame-side .dna-library-frame-media img");
   await img.waitFor({state:"visible"});
   await img.evaluate(async el=>{if(!el.complete)await new Promise(res=>el.addEventListener("load",res,{once:true}))});
   const info=await img.evaluate(el=>({src:el.currentSrc,naturalWidth:el.naturalWidth,objectFit:getComputedStyle(el).objectFit,rect:el.getBoundingClientRect().toJSON(),parent:el.closest(".dna-library-frame-media").getBoundingClientRect().toJSON()}));
   assert(info.src.includes("pet-store-hero-mobile.webp"),info.src);
   assert.equal(info.naturalWidth,390);
   assert.equal(info.objectFit,"cover");
   assert(info.rect.height>=info.parent.height-1);
   if(width===390)await page.locator(".dna-library-gallery").screenshot({path:"F:/Athena Studio/.qa/athena-poppy-hero-proof.png",animations:"disabled"});
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }finally{await page.close()}
 });
}
await check("desktop Poppy preview remains real desktop shot and fully filled",async()=>{
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 try{
  await page.goto(origin+"/services/web-development/templates",{waitUntil:"domcontentloaded"});
  const img=page.locator(".dna-library-frame-side .dna-library-frame-media img");
  await img.waitFor();
  const v=await img.evaluate(el=>({src:el.currentSrc,fit:getComputedStyle(el).objectFit}));
  assert(v.src.includes("pet-store.jpg"),v.src);assert.equal(v.fit,"cover");
 }finally{await page.close()}
});
await check("Digital Creators uses same smooth zoom icons",async()=>{
 const page=await browser.newPage({viewport:{width:390,height:850}});
 try{
  await page.goto(origin+"/immersive/digital-creators/index.html",{waitUntil:"domcontentloaded"});
  const host=page.locator('[data-athena-demo-info="digital-creators"]');
  await host.locator(".athena-demo-float-panel").waitFor({state:"visible"});
  await host.locator(".athena-demo-float-toggle").click();
  await host.locator(".athena-demo-float-handle").waitFor({state:"visible"});
  assert.equal(await host.locator(".athena-demo-float-panel").getAttribute("aria-hidden"),"true");
  await host.locator(".athena-demo-float-handle").click();
  await host.locator(".athena-demo-float-panel").waitFor({state:"visible"});
 }finally{await page.close()}
});
await browser.close();
console.log(JSON.stringify({origin,passed,failed,total:passed+failed}));
if(failed)process.exitCode=1;
