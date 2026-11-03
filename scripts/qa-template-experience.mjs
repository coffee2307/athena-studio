import {chromium} from "playwright";
import assert from "node:assert/strict";
const origin=process.env.ATHENA_ORIGIN??"http://127.0.0.1:3182";
const exe=process.env.CHROME_PATH??"C:/Program Files/Google/Chrome/Application/chrome.exe";
const browser=await chromium.launch({headless:true,executablePath:exe,args:["--disable-gpu-sandbox"]});
const checks=[];
async function check(name,run){try{await run();checks.push({name,status:"PASS"});console.log("PASS",name)}catch(e){checks.push({name,status:"FAIL",error:String(e)});console.error("FAIL",name,e.message)}}
try{
 for(const width of [320,390,428]){
  await check("mobile "+width+": direct navigation and widget",async()=>{
   const page=await browser.newPage({viewport:{width,height:844},isMobile:true,hasTouch:true});
   try{
    await page.goto(origin+"/services/web-development/templates",{waitUntil:"domcontentloaded"});
    await page.locator(".template-card-preview").first().click();
    await page.waitForURL("**/template-demos/creative-studio",{timeout:15000});
    await page.locator('[data-athena-demo-info="creative-studio"] .athena-demo-float-panel').waitFor({state:"visible",timeout:12000});
    const widget=page.locator('[data-athena-demo-info="creative-studio"]');
    assert.equal(await page.locator(".template-demo-modal[open]").count(),0);
    const size=await widget.boundingBox();
    assert(size&&size.x>=0&&size.x+size.width<=width+2);
    await widget.locator(".athena-demo-float-toggle").click();
    assert.equal(await widget.locator(".athena-demo-float-handle").count(),1);
    await page.goto(origin+"/template-demos/creative-studio/work",{waitUntil:"domcontentloaded"});
    await widget.locator(".athena-demo-float-handle").waitFor({state:"visible",timeout:10000});
    await widget.locator(".athena-demo-float-handle").click();
    assert.equal(await widget.locator(".athena-demo-float-panel").count(),1);
   }finally{await page.close()}
  });
 }
 await check("desktop gallery modal retained",async()=>{
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  try{
   await page.goto(origin+"/services/web-development/templates",{waitUntil:"domcontentloaded"});
   await page.locator(".template-card-preview").first().click();
   const dialog=page.locator("dialog.template-demo-modal");
   await dialog.waitFor({state:"visible"});
   assert.equal(await dialog.locator('button:has-text("Desktop")').count(),1);
   assert.equal(await dialog.locator('button:has-text("Mobile")').count(),1);
   assert.equal(await dialog.locator(".template-demo-info").count(),1);
   await dialog.locator(".template-demo-close").click();
   assert.equal(await dialog.isVisible(),false);
  }finally{await page.close()}
 });
 await check("desktop standalone widget",async()=>{
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  try{
   await page.goto(origin+"/template-demos/modern-corporate",{waitUntil:"domcontentloaded"});
   await page.locator('[data-athena-demo-info="modern-corporate"] .athena-demo-float-panel').waitFor({state:"visible"});
   await page.locator(".athena-demo-float-toggle").click();
   assert.equal(await page.locator(".athena-demo-float-handle").count(),1);
  }finally{await page.close()}
 });
 await check("embedded demo has no widget",async()=>{
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  try{
   await page.goto(origin+"/template-demos/creative-studio?embed=1",{waitUntil:"domcontentloaded"});
   await page.waitForTimeout(500);
   assert.equal(await page.locator("[data-athena-demo-info]").count(),0);
  }finally{await page.close()}
 });
 await check("Digital Creators direct standalone widget",async()=>{
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  try{
   const r=await page.goto(origin+"/immersive/digital-creators/index.html",{waitUntil:"domcontentloaded",timeout:20000});
   assert.equal(r?.status(),200);
   await page.locator('[data-athena-demo-info="digital-creators"] .athena-demo-float-panel').waitFor({state:"visible",timeout:12000});
   await page.locator(".athena-demo-float-toggle").click();
   assert.equal(await page.locator('[data-athena-demo-info="digital-creators"] .athena-demo-float-handle').count(),1);
  }finally{await page.close()}
 });
 await check("all 15 demos respond",async()=>{
  const {default:templates}=await import("../data/templates.json",{with:{type:"json"}});
  for(const item of templates){
   const url= item.slug==="digital-creators"?"/immersive/digital-creators/index.html":item.demoPath;
   const r=await fetch(origin+url,{signal:AbortSignal.timeout(10000)});
   assert.equal(r.status,200,item.slug);
  }
 });
}finally{await browser.close()}
const failures=checks.filter(x=>x.status!=="PASS");
console.log(JSON.stringify({passed:checks.length-failures.length,total:checks.length,failed:failures},null,2));
if(failures.length)process.exitCode=1;
