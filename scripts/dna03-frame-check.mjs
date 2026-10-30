import {chromium} from "@playwright/test";
const browser=await chromium.launch({channel:"chrome",headless:true});
let failures=0;
for(const width of [320,390,428,768,1440]){
 const context=await browser.newContext({viewport:{width,height:width===390?844:900},reducedMotion:"no-preference"});
 const page=await context.newPage();page.setDefaultTimeout(25000);
 const errors=[];page.on("pageerror",e=>errors.push(e.message));
 await page.goto("http://127.0.0.1:3182/template-demos/auto-showroom",{waitUntil:"domcontentloaded",timeout:45000});
 const data=await page.waitForFunction(()=>{const c=document.querySelector(".ix-auto-3d-canvas");return c?.getAttribute("data-model-frame")||null;},undefined,{timeout:45000});
 if(!data)throw Error("Model projection never initialized");
 for(const progress of [0,.25,.5,.75,1]){
  await page.evaluate(p=>{const track=document.querySelector("#bv-cinematic-track");if(!track)return;const r=track.getBoundingClientRect();const extent=Math.max(1,r.height-innerHeight);window.scrollTo({top:r.top+scrollY+extent*p,behavior:"instant"});},progress);
  try{await page.waitForFunction(p=>{const c=document.querySelector(".ix-auto-3d-canvas");return c&&Math.abs(Number(c.getAttribute("data-scroll-progress"))-p)<.055;},progress,{timeout:30000});}catch(e){failures++;console.log(JSON.stringify({width,progress,error:"SCROLL_PROGRESS_TIMEOUT"}));continue;}
  const state=await page.locator(".ix-auto-3d-canvas").evaluate(el=>({safe:el.getAttribute("data-model-safe"),frame:el.getAttribute("data-model-frame"),center:el.getAttribute("data-model-center-x"),pivot:el.getAttribute("data-model-pivot"),progress:el.getAttribute("data-scroll-progress")}));
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  console.log(JSON.stringify({width,progress,state,overflow}));
  if(state.safe!=="true"||overflow>2){failures++;console.log("FRAMING_FAIL");}
 }
 if(errors.length){failures+=errors.length;console.log(JSON.stringify({width,errors}));}
 await context.close();
}
await browser.close();
console.log(JSON.stringify({framingFailures:failures}));
if(failures)process.exitCode=1;
