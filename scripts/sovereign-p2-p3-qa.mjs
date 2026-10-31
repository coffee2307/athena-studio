import {chromium} from "@playwright/test";
import {readFileSync,mkdirSync,writeFileSync} from "node:fs";
const origin=process.env.ATHENA_QA_ORIGIN||"http://127.0.0.1:3182";
const slugs=JSON.parse(readFileSync(new URL("../data/templates.json",import.meta.url),"utf8")).map(x=>x.slug).filter(x=>!["auto-showroom","digital-creators"].includes(x));
const browser=await chromium.launch({headless:true,channel:process.platform==="win32"?"chrome":undefined});
const results=[],failures=[];
mkdirSync(".qa/athena-21-sovereign/p2-p3",{recursive:true});
for(const size of [{name:"mobile",width:390,height:844},{name:"desktop",width:1440,height:900}]){
 const page=await browser.newPage({viewport:{width:size.width,height:size.height},reducedMotion:"reduce"});
 const errors=[];
 page.on("pageerror",e=>errors.push(String(e)));
 for(const slug of slugs){
  const base=origin+"/template-demos/"+slug;
  try{
   errors.length=0;
   const response=await page.goto(base,{waitUntil:"domcontentloaded",timeout:60000});
   if(response?.status()!==200)throw Error("HTTP "+response?.status());
   await page.locator("main").first().waitFor({timeout:15000});
   await page.waitForTimeout(160);
   const meta=await page.evaluate(()=>{
    const site=document.querySelector("main")?.closest("div");
    const nav=document.querySelector("header");
    return {title:document.title,scrollWidth:document.documentElement.scrollWidth,viewport:innerWidth,legacy:!!document.querySelector(".world-site"),h1:document.querySelector("main h1")?.textContent?.trim(),headerText:nav?.textContent?.trim().slice(0,110),images:[...document.querySelectorAll("main img")].slice(0,8).map(x=>({src:x.getAttribute("src"),loaded:(x).naturalWidth>0})),footer:!!document.querySelector("footer")};
   });
   if(meta.legacy)throw Error("Still rendering shared WorldSite");
   if(meta.scrollWidth-meta.viewport>3)throw Error("Horizontal overflow "+(meta.scrollWidth-meta.viewport));
   if(!meta.h1||!meta.footer)throw Error("Missing home headline/footer");
   if(meta.images.length===0||meta.images.some(x=>!x.loaded))throw Error("Missing media "+JSON.stringify(meta.images));
   await page.screenshot({path:".qa/athena-21-sovereign/p2-p3/"+slug+"-"+size.name+"-home.png",animations:"disabled",timeout:25000});
   if(size.name==="mobile"){
    const button=page.locator("header button[aria-expanded]").first();
    await button.click({timeout:10000});
    if(await button.getAttribute("aria-expanded")!=="true")throw Error("Mobile menu did not open");
    await page.keyboard.press("Escape");
    if(await button.getAttribute("aria-expanded")!=="false")throw Error("Mobile menu did not close");
    for(const section of ["work","services","about","contact","work/1"]){
     const resp=await page.goto(base+"/"+section,{waitUntil:"domcontentloaded",timeout:45000});
     if(resp?.status()!==200)throw Error("Route "+section+" returned "+resp?.status());
     if(!await page.locator("main h1").count())throw Error("Missing heading at "+section);
     if(await page.locator(".world-site").count())throw Error("Shared UI at "+section);
    }
   }
   if(errors.length)throw Error("Runtime page errors "+errors.join("; ").slice(0,550));
   results.push({slug,viewport:size.name,...meta});
   console.log("PASS SOVEREIGN",size.name,slug);
  }catch(e){failures.push({slug,viewport:size.name,error:String(e)});console.log("FAIL SOVEREIGN",size.name,slug,String(e));}
 }
 await page.close();
}
await browser.close();
writeFileSync(".qa/athena-21-sovereign/p2-p3/qa.json",JSON.stringify({plan:"ATHENA-21-SOVEREIGN/v2.0",results,failures},null,2)+"\n");
console.log("SOVEREIGN_P2_P3_QA",JSON.stringify({passed:results.length,failed:failures.length,required:slugs.length*2}));
if(failures.length||results.length!==slugs.length*2)process.exitCode=1;
