import {chromium} from "playwright";
import assert from "node:assert/strict";
import {mkdirSync} from "node:fs";

const site=process.env.ATHENA_QA_ORIGIN||"http://127.0.0.1:3182";
const browser=await chromium.launch({channel:process.platform==="win32"?"chrome":undefined,headless:true});
const widths=[320,390,428,768,1024,1440];
const paths=["/","/services","/services/web-development","/services/website-care","/services/ai-integration","/services/micro-saas","/services/web-development/templates","/projects","/projects/pham","/projects/econith","/projects/digital-creators","/process","/about","/pricing","/start","/contact","/products","/products/sitepulse","/legal","/legal/privacy","/legal/terms","/legal/cookies","/legal/service-policy","/login","/signup","/forgot-password"];
mkdirSync(".qa/athena-i18n",{recursive:true});
const reports=[];
try{
 for(const width of widths){
  const page=await browser.newPage({viewport:{width,height:width<500?844:900},reducedMotion:"reduce"});
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  try{
   const resp=await page.goto(site+"/",{waitUntil:"load",timeout:45000});
   assert.equal(resp?.status(),200);
   const vi=page.locator(".athena-language-switch button[lang=vi]"),en=page.locator(".athena-language-switch button[lang=en]");
   assert.equal(await vi.count(),1);
   assert.equal(await vi.getAttribute("aria-pressed"),"true");
   await en.click();
   await page.waitForFunction(()=>document.documentElement.lang==="en");
   assert.equal(await en.getAttribute("aria-pressed"),"true");
   await page.waitForFunction(()=>document.querySelector("h1")?.textContent?.includes("Your idea."));
   assert((await page.locator("nav.agency-desktop-nav").innerText()).includes("Services"));
   assert((await page.locator("footer").innerText()).includes("Privacy"));
   assert.equal(await page.evaluate(()=>localStorage.getItem("athena-studio-language")),"en");
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
   assert(overflow<=3,"header horizontal overflow at "+width+": "+overflow);
   await page.reload({waitUntil:"load"});
   await page.waitForFunction(()=>document.documentElement.lang==="en");
   await page.waitForFunction(()=>document.querySelector("h1")?.textContent?.includes("Your idea."));
   if(width<=980){
    const toggle=page.locator("header .agency-menu-toggle");
    await toggle.click();
    assert.equal(await toggle.getAttribute("aria-expanded"),"true");
    await page.waitForFunction(()=>document.querySelector(".agency-mobile-panel")?.textContent?.includes("Solutions")||document.querySelector(".agency-mobile-panel")?.textContent?.includes("Services"));
    await page.keyboard.press("Escape");
    assert.equal(await toggle.getAttribute("aria-expanded"),"false");
   }
   if(width===390||width===1440)await page.screenshot({path:".qa/athena-i18n/home-en-"+width+".png",animations:"disabled",fullPage:false});
   await vi.click();await page.waitForFunction(()=>document.documentElement.lang==="vi");
   assert((await page.locator("h1").innerText()).includes("Ý tưởng"));
   assert.equal(errors.length,0,"JS errors "+errors.join(" | "));
   reports.push({type:"viewport",width,overflow});
   console.log("PASS_ATHENA_I18N_VIEWPORT",width);
  }finally{await page.close();}
 }
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:"reduce"});
 const errors=[];page.on("pageerror",e=>errors.push(e.message));
 try{
  await page.goto(site+"/",{waitUntil:"load"});
  await page.locator(".athena-language-switch button[lang=en]").click();
  for(const path of paths){
   const r=await page.goto(site+path,{waitUntil:"load",timeout:45000});
   assert.equal(r?.status(),200,path);
   await page.waitForFunction(()=>document.documentElement.lang==="en");
   await page.waitForTimeout(75);
   const result=await page.evaluate(()=>{
    const root=document.querySelector("#main-content");
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    let n,out=[];
    while(n=walker.nextNode()){
     const s=n.textContent?.trim()||"";
     const el=n.parentElement;
     if(el&&!el.closest("script,style,code,pre,svg")&&/[\u00c0-\u1ef9]/.test(s))out.push(s.slice(0,130));
    }
    return{overflow:document.documentElement.scrollWidth-innerWidth,untranslated:out,lang:document.documentElement.lang,header:!!document.querySelector(".athena-language-switch")};
   });
   assert(result.header,"switch missing "+path);
   assert(result.overflow<=3,"horizontal overflow "+path+": "+result.overflow);
   if(result.untranslated.length)console.log("ATHENA_REMAINING_VI",path,JSON.stringify(result.untranslated.slice(0,6)));
   assert(result.untranslated.length===0,path+" has untranslated content: "+JSON.stringify(result.untranslated.slice(0,7)));
   console.log("PASS_ATHENA_I18N_ROUTE",path,"untranslated",result.untranslated.length);
   reports.push({type:"route",path,remaining:result.untranslated.length});
  }
  assert.equal(errors.length,0,"page errors "+errors.join("; "));
 }finally{await page.close();}
 const demo=await browser.newPage({viewport:{width:390,height:844}});
 try{
  await demo.goto(site+"/template-demos/architecture-studio",{waitUntil:"load"});
  assert.equal(await demo.locator(".athena-language-switch").count(),0,"The independent FORMA demo must not inherit Athena switch");
  assert.equal(await demo.locator("#architecture-studio-top [class*='languageSwitch']").count(),0,"FORMA-specific switch was not removed");
  assert((await demo.locator("h1").first().innerText()).includes("Space"));
  console.log("PASS_INDEPENDENT_FORMA_UNCHANGED");
 }finally{await demo.close()}
}finally{await browser.close()}
console.log("ATHENA_LANGUAGE_QA_PASS",reports.length);
