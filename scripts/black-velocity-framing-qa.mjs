import {chromium} from "@playwright/test";
import {mkdir} from "node:fs/promises";

// Read-only visual regression of the real local 3D render, not Box3 diagnostics.
const base=process.env.SHOWROOM_URL||"http://127.0.0.1:3182/template-demos/auto-showroom";
const cases=[[320,680],[375,812],[390,844],[428,926],[497,800],[500,760],[600,900],[768,900],[1440,900]];
const browser=await chromium.launch({channel:process.platform==="win32"?"chrome":undefined,headless:true});
await mkdir(".qa/showroom-visual-v2",{recursive:true});
let failures=0;
try{
 for(const [width,height] of cases){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:"no-preference",deviceScaleFactor:1});
  const errors=[];
  page.on("pageerror",error=>errors.push(error.message));
  await page.goto(base,{waitUntil:"domcontentloaded",timeout:45000});
  await page.waitForFunction(()=>{
   const canvas=document.querySelector(".ix-auto-3d-canvas");
   return canvas?.getAttribute("data-renderer")==="ready" && canvas?.getAttribute("data-model-support-count");
  },{timeout:45000});
  for(const chapter of [0,1,2,3,4]){
   await page.evaluate(index=>{
    const track=document.getElementById("bv-cinematic-track");
    if(!track)return;
    const rect=track.getBoundingClientRect();
    window.scrollTo({top:scrollY+rect.top+Math.max(1,rect.height-innerHeight)*(index/4),behavior:"instant"});
   },chapter);
   await page.waitForFunction(index=>{
    const c=document.querySelector(".ix-auto-3d-canvas");
    return c&&Math.abs(Number(c.getAttribute("data-scroll-progress"))-index/4)<.015;
   },chapter,{timeout:12000}).catch(()=>{});
   await page.waitForTimeout(380);
   const m=await page.evaluate(()=>{
    const c=document.querySelector(".ix-auto-3d-canvas");
    const hero=document.querySelector(".bv-cinematic-track > .ix-hero");
    const rail=document.querySelector(".bv-cinematic-nav");
    const rect=c.getBoundingClientRect(),h=hero.getBoundingClientRect(),n=rail?.getBoundingClientRect();
    const f=(c.getAttribute("data-model-frame")||"").split(",").map(Number);
    return {frame:f,rig:c.getAttribute("data-layout-rig"),supports:Number(c.getAttribute("data-model-support-count")),safe:c.getAttribute("data-model-safe"),center:Number(c.getAttribute("data-model-center-x")),box:{left:rect.left,right:rect.right,top:rect.top,bottom:rect.bottom,width:rect.width,height:rect.height},heroBottom:h.bottom,navTop:n?.top,overflow:document.documentElement.scrollWidth-innerWidth};
   });
   const isMobile=width<=760;
   const [l,r]=m.frame;
   const margin=isMobile?.84:.90;
   const visible=Number.isFinite(l)&&Number.isFinite(r)&&m.safe==="true"&&l>=-margin-.015&&r<=margin+.015;
   const positioning=!isMobile||m.box.left>=-1&&m.box.right<=width+1&&m.box.bottom<=m.heroBottom-95;
   const centering=!isMobile||Math.abs(m.center)<.05;
   const support=!isMobile||m.rig==="mobile-mesh-optical"&&m.supports>=20;
   const ok=visible&&positioning&&centering&&support&&m.overflow<=2;
   if(!ok){failures++;console.log("FAIL",JSON.stringify({width,height,chapter,m}));}
   else console.log("PASS",JSON.stringify({width,height,chapter,frame:m.frame,centering:m.center,supports:m.supports}));
   if([390,497,500].includes(width)){
    await page.screenshot({path:".qa/showroom-visual-v2/"+width+"-chapter-"+chapter+".png",animations:"disabled"});
   }
  }
  if(errors.length){failures+=errors.length;console.log("BROWSER_ERRORS",width,errors);}
  await page.close();
 }
}finally{await browser.close();}
console.log("BLACK_VELOCITY_VISUAL_FAILURES",failures);
if(failures)process.exitCode=1;
