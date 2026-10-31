import {chromium} from "@playwright/test";
import {readFileSync,mkdirSync} from "node:fs";
const templates=JSON.parse(readFileSync(new URL("../data/templates.json",import.meta.url),"utf8"));
const slugs=templates.map(x=>x.slug).filter(x=>x!=="digital-creators");
const base=process.env.ATHENA_QA_ORIGIN||"http://127.0.0.1:3182";
const browser=await chromium.launch({channel:process.platform==="win32"?"chrome":undefined,headless:true});
const failures=[],identities=new Set(),revealed=new Set();
mkdirSync(".qa/template-experience",{recursive:true});
try{
 for(const slug of slugs){
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:"no-preference"});
  try{
   await page.goto(base+"/template-demos/"+slug,{waitUntil:"domcontentloaded",timeout:45000});
   const root=page.locator(".world-site");
   await root.waitFor();
   await page.waitForFunction(()=>document.querySelectorAll("[data-world-reveal]").length>0,null,{timeout:16000});
   const initial=await page.evaluate(()=>{
    const header=document.querySelector(".world-header"),footer=document.querySelector(".world-footer");
    return {bodyOverflow:document.body.style.overflow,clientWidth:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,headerWidth:header.getBoundingClientRect().width,footerBg:getComputedStyle(footer).backgroundColor,displayFont:getComputedStyle(footer.querySelector(".world-footer-identity>a")).fontFamily,reveal:document.querySelectorAll("[data-world-reveal]").length};
   });
   if(initial.scrollWidth-initial.clientWidth>2)throw Error("pre-menu horizontal overflow");
   const button=page.locator(".world-menu-toggle");
   await button.click();
   const open=await page.evaluate(()=>({bodyOverflow:document.body.style.overflow,clientWidth:document.documentElement.clientWidth,headerWidth:document.querySelector(".world-header").getBoundingClientRect().width}));
   if(open.bodyOverflow!==initial.bodyOverflow)throw Error("body overflow changed while menu opened");
   if(open.clientWidth!==initial.clientWidth)throw Error("scrollbar caused viewport-width shift");
   if(Math.abs(open.headerWidth-initial.headerWidth)>1)throw Error("header reflow from menu toggle");
   await page.screenshot({path:".qa/template-experience/"+slug+"-open.png",animations:"disabled"});
   await page.keyboard.press("Escape");
   if(await button.getAttribute("aria-expanded")!=="false")throw Error("Escape close did not work");
   if(initial.reveal<1)throw Error("no observed scrolling sections");
   await page.locator(".world-footer").scrollIntoViewIfNeeded({timeout:10000});
   await page.waitForTimeout(800);
   const visible=await page.evaluate(()=>({
    footer:document.querySelector(".world-footer-identity")?.getAttribute("data-world-reveal"),
    dynamic:document.querySelectorAll('[data-world-reveal="seen"]').length,
    background:getComputedStyle(document.querySelector(".world-footer")).backgroundColor
   }));
   if(visible.footer!=="seen")throw Error("footer reveal was not triggered");
   const key=initial.displayFont+" "+initial.footerBg+" "+visible.background+" "+await root.getAttribute("data-nav-style");
   if(identities.has(key))throw Error("duplicated visual system");
   identities.add(key);revealed.add(slug);
   if(["commerce-standard","pet-store"].includes(slug)){
    if(await page.locator(".world-cart-button .svg-inline--fa").count()===0)throw Error("FontAwesome bag/cart icon missing");
   }
   if(["saas-product","team-intranet","education-platform"].includes(slug)){
    if(await page.locator(".world-account-link .svg-inline--fa").count()===0)throw Error("FontAwesome user icon missing");
   }
   if(["commerce-standard","fashion-archive","auto-showroom","wellness-clinic"].includes(slug))await page.screenshot({path:".qa/template-experience/"+slug+"-footer.png",animations:"disabled"});
   console.log("PASS EXPERIENCE",slug,initial.reveal,visible.dynamic);
  }catch(e){failures.push({slug,error:String(e)});console.log("FAIL EXPERIENCE",slug,String(e));}
  await page.close();
 }
 // Reduced motion: no hidden content and no scroll reveal transform.
 const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:"reduce"});
 await reduced.goto(base+"/template-demos/editorial-journal",{waitUntil:"domcontentloaded",timeout:45000});
 const pending=await reduced.evaluate(()=>document.querySelectorAll('[data-world-reveal="pending"]').length);
 if(pending)failures.push({slug:"reduced-motion",error:"pending sections while prefers-reduced-motion is enabled"});
 await reduced.close();
}finally{await browser.close();}
console.log("WORLD_UX_RESULT",JSON.stringify({checked:slugs.length,distinct:identities.size,reveal:revealed.size,failures}));
if(failures.length||identities.size!==20||revealed.size!==20)process.exitCode=1;
