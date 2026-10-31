import {chromium} from "@playwright/test";
import {mkdirSync,writeFileSync} from "node:fs";
const base=process.env.ATHENA_QA_ORIGIN||"http://127.0.0.1:3182";
const dir=".qa/refinement02";mkdirSync(dir,{recursive:true});
const browser=await chromium.launch({channel:process.platform==="win32"?"chrome":undefined,headless:true});
const sites=[
 {slug:"creative-studio",root:"[data-sora-surface]"},
 {slug:"modern-corporate",root:"[data-north-surface]"},
 {slug:"commerce-standard",root:"[data-moc-surface]"},
 {slug:"auto-showroom",root:'.world-site[data-world="auto-showroom"]'}
];
const sizes=[{name:"320",w:320,h:680},{name:"390",w:390,h:844},{name:"428",w:428,h:926},{name:"768",w:768,h:1024},{name:"1440",w:1440,h:900}];
const failures=[],passes=[],renderers=[];
const collide=(a,b)=>Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
for(const item of sites)for(const vp of sizes){
 const page=await browser.newPage({viewport:{width:vp.w,height:vp.h},reducedMotion:"reduce"});
 const errors=[];page.on("pageerror",e=>errors.push(e.message));
 try{
  const url=base+"/template-demos/"+item.slug;
  const response=await page.goto(url,{waitUntil:"domcontentloaded",timeout:40000});
  if(response?.status()!==200)throw Error("HTTP "+response?.status());
  await page.locator(item.root).waitFor({timeout:18000});
  await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:dir+"/"+item.slug+"-"+vp.name+".png",animations:"disabled",timeout:20000});
  const geom=await page.evaluate(({slug,root})=>{
   const doc=document.documentElement,el=document.querySelector(root);
   const rect=e=>e?.getBoundingClientRect();
   const hit=(a,b)=>a&&b?Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)):0;
   const r={overflow:doc.scrollWidth-innerWidth,headline:document.querySelector("main h1")?.textContent?.trim().slice(0,90),issues:[]};
   if(slug==="modern-corporate"){
    const body=el.querySelector('[class*="_impactBody__"]'),para=body?.querySelector("p"),pseudo=body&&getComputedStyle(body,"::after").content;
    if(pseudo&&pseudo!=="none"&&pseudo!=="normal")r.issues.push("NORTH overlap pseudo still exists: "+pseudo);
    const map=el.querySelector('[class*="_impactMap__"]');
    if(!map)r.issues.push("NORTH missing interactive map");
    if(hit(rect(para),rect(map))>24)r.issues.push("NORTH diagram overlaps paragraph");
   }
   if(slug==="commerce-standard"){
    const header=el.querySelector("header"),mark=el.querySelector('[class*="_brandName__"]'),sub=el.querySelector('[class*="_wordmark__"] small'),nav=el.querySelector('[class*="_secondary__"]');
    if(!mark||!sub)r.issues.push("MOC brand broken");
    if(hit(rect(mark),rect(sub))>12)r.issues.push("MOC logo overlaps tagline");
    if(hit(rect(header),rect(nav))>36)r.issues.push("MOC header overlaps category bar");
    if(rect(header)?.height>125&&innerWidth>=900)r.issues.push("MOC excessive header height "+rect(header).height);
   }
   if(slug==="auto-showroom"){
    const rail=el.querySelector(".ix-scene-rail"),menu=el.querySelector(".world-mobile-nav");
    if(rail)r.issues.push("Old 3D rail still shown");
    if(!menu)r.issues.push("Missing cockpit menu");
    if(!el.querySelector(".bv-after-cinematic .ix-glb-credit"))r.issues.push("CC BY credit missing");
   }
   if(slug==="creative-studio"&&!el.querySelector('[class*="_editorialLab__"]'))r.issues.push("SORA laboratory missing");
   return r;
  },{slug:item.slug,root:item.root});
  if(geom.issues.length||geom.overflow>3||!geom.headline)throw Error("layout: "+JSON.stringify(geom));
  if(vp.w<=428){
   const toggle=page.locator(item.slug==="auto-showroom"?".world-menu-toggle":'header button[aria-expanded]').first();
   await toggle.click();
   if(await toggle.getAttribute("aria-expanded")!=="true")throw Error("menu state didn't open");
   if(item.slug==="auto-showroom"){
    const panel=page.locator('.world-site[data-world="auto-showroom"] .world-mobile-nav');
    const close=panel.getByRole("button",{name:"Đóng menu showroom"});
    if(!await close.isVisible())throw Error("X-only close invisible");
    const rect=await close.boundingBox();if(!rect||rect.width<44||rect.height<44)throw Error("X hitbox too small");
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
    if(overflow>3)throw Error("cockpit drawer width overflow "+overflow);
    await page.screenshot({path:dir+"/auto-showroom-"+vp.name+"-menu.png",animations:"disabled"});
    await close.click();
   }else{
    await page.keyboard.press("Escape");
   }
   if(await toggle.getAttribute("aria-expanded")!=="false")throw Error("menu didn't close");
  }
  if(item.slug==="creative-studio"&&vp.w===390){
   const x=page.locator('[class*="_labControls__"] button');
   await x.nth(2).click();
   if(await x.nth(2).getAttribute("aria-pressed")!=="true")throw Error("SORA layer selection");
  }
  if(item.slug==="modern-corporate"&&vp.w===390){
   const x=page.locator('[class*="_impactJourney__"] button');
   await x.nth(2).click();
   if(await x.nth(2).getAttribute("aria-pressed")!=="true")throw Error("NORTH journey selection");
  }
  if(item.slug==="auto-showroom"){
   const state=await page.locator('.ix-auto-3d-canvas').first().getAttribute("data-renderer").catch(()=>null);
   renderers.push({width:vp.w,state});
  }
  if(errors.length)throw Error("Page exceptions: "+errors.slice(0,2).join(" | "));
  passes.push({slug:item.slug,viewport:vp.w});
  console.log("REFINE_PASS",item.slug,vp.name);
 }catch(e){const f={slug:item.slug,viewport:vp.w,error:String(e)};failures.push(f);console.log("REFINE_FAIL",JSON.stringify(f))}
 await page.close();
}
await browser.close();
writeFileSync(dir+"/results.json",JSON.stringify({passes,failures,renderers,engine:"Chromium Windows; mobile emulation, not physical Safari"},null,2)+"\n");
console.log("REFINEMENT_02_RESULTS",JSON.stringify({passed:passes.length,failed:failures.length,renderers}));
if(failures.length||passes.length!==sites.length*sizes.length)process.exitCode=1;
