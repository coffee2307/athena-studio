/**
 * Browser baseline for P0. Captures *actual* current demo, not generated mockups.
 * The local .qa screenshots are never committed or deployed.
 */
import {chromium} from "@playwright/test";
import {readFileSync,mkdirSync,writeFileSync} from "node:fs";
const items=JSON.parse(readFileSync(new URL("../data/templates.json",import.meta.url),"utf8"));
const base=process.env.ATHENA_QA_ORIGIN||"http://127.0.0.1:3182";
const dir=".qa/athena-21-sovereign/baseline";
mkdirSync(dir,{recursive:true});
const browser=await chromium.launch({headless:true,channel:process.platform==="win32"?"chrome":undefined});
const results=[];
for(const size of [{name:"mobile",width:390,height:844},{name:"desktop",width:1440,height:900}]){
 const page=await browser.newPage({viewport:{width:size.width,height:size.height},reducedMotion:"reduce",deviceScaleFactor:1});
 for(const item of items){
  const slug=item.slug,uri=slug==="digital-creators"?"/immersive/digital-creators/index.html#/":"/template-demos/"+slug;
  try{
   const response=await page.goto(base+uri,{waitUntil:"domcontentloaded",timeout:45000});
   await page.waitForTimeout(180);
   const info=await page.evaluate(()=>{
    const nav=document.querySelector(".world-header,header,.site-header");
    const footer=document.querySelector(".world-footer,footer");
    const headings=[...document.querySelectorAll("h1,h2")].slice(0,8).map(x=>x.textContent?.trim().slice(0,140));
    return {title:document.title,headings,headerText:nav?.textContent?.trim().slice(0,220)||null,footerText:footer?.textContent?.trim().slice(0,150)||null,scrollWidth:document.documentElement.scrollWidth,viewportWidth:innerWidth,bodyHeight:document.body.scrollHeight,legacyShell:!!document.querySelector(".world-site")};
   });
   const path=dir+"/"+slug+"-"+size.name+"-first.png";
   await page.screenshot({path,animations:"disabled",timeout:30000});
   if(["creative-studio","modern-corporate","commerce-standard"].includes(slug)){
    await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
    await page.waitForTimeout(200);
    await page.screenshot({path:dir+"/"+slug+"-"+size.name+"-footer.png",animations:"disabled",timeout:30000});
   }
   const result={slug,viewport:size.name,httpStatus:response?.status()??null,screenshot:path,...info};
   results.push(result);
   console.log("BASELINE",size.name,slug,response?.status()??"NO-RESPONSE",info.legacyShell?"legacy":"native");
  }catch(error){results.push({slug,viewport:size.name,error:String(error)});console.log("BASELINE_FAIL",size.name,slug,String(error));}
 }
 await page.close();
}
await browser.close();
writeFileSync(dir+"/browser-baseline.json",JSON.stringify({plan:"ATHENA-21-SOVEREIGN/v2.0",origin:base,results},null,2)+"\n");
const fails=results.filter(x=>x.error||x.httpStatus!==200);
console.log("BASELINE_RESULT",JSON.stringify({screenshots:results.length,failures:fails.length,legacy:results.filter(x=>x.legacyShell).length,files:dir}));
if(fails.length)process.exitCode=1;
