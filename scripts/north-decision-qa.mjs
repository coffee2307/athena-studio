import {chromium} from "@playwright/test";
import {mkdirSync,writeFileSync} from "node:fs";
import {execSync} from "node:child_process";
const origin="http://127.0.0.1:3182/template-demos/modern-corporate";
const folder=".qa/north-decision-qa";mkdirSync(folder,{recursive:true});
const head=execSync("git rev-parse HEAD",{encoding:"utf8"}).trim();
const browser=await chromium.launch({channel:process.platform==="win32"?"chrome":undefined,headless:true});
const viewports=[[320,680],[390,760],[390,844],[428,926],[768,1024],[1440,900],[1920,1080]];
const routes=["","/work","/work/1","/work/2","/work/3","/services","/about","/contact"];
const results=[],failures=[];
function assert(condition,msg){if(!condition)throw Error(msg)}
for(const [width,height] of viewports){
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,hasTouch:width<=428,reducedMotion:"no-preference"});
 const page=await context.newPage();
 let jsErrors=[];page.on("pageerror",error=>jsErrors.push(error.message));
 for(const suffix of routes){
  const id=width+"x"+height+"-"+(suffix.replaceAll("/","-")||"home");
  try{
   jsErrors=[];
   const response=await page.goto(origin+suffix,{waitUntil:"load",timeout:35000});
   assert(response?.status()===200,"HTTP "+response?.status());
   const data=await page.evaluate(()=>{
    const heading=document.querySelector("h1");const rect=heading?.getBoundingClientRect();
    const images=[...document.querySelectorAll("img")].filter(i=>{const r=i.getBoundingClientRect();return r.height>0&&r.top<innerHeight&&r.bottom>0});
    return {overflow:document.documentElement.scrollWidth-innerWidth,heading:heading?.innerText||"",bounds:rect?{x:rect.x,right:rect.right}:null,
     broken:images.filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src),
     skeletons:document.querySelectorAll("[class*='Skeleton'],[class*='skeleton']").length,
     animations:[...document.querySelectorAll("main *")].filter(el=>{const st=getComputedStyle(el);return st.animationName!=="none"&&st.animationIterationCount==="infinite"}).length};
   });
   assert(data.heading.trim().length>8,"missing useful heading");
   assert(data.overflow<=3,"horizontal overflow "+data.overflow);
   assert(data.bounds?.x>=-5&&data.bounds.right<=width+5,"heading clipped");
   assert(data.broken.length===0,"broken image "+data.broken);
   assert(data.skeletons===0,"unexpected skeleton");
   assert(data.animations===0,"unnecessary infinite animation");
   assert(jsErrors.length===0,"JavaScript: "+jsErrors.join(";"));
   if([390,1440].includes(width)&&["","/work","/about","/contact"].includes(suffix))
    await page.screenshot({path:folder+"/"+id+".png",animations:"disabled"});
   if(suffix===""&&[390,1440].includes(width)){
    await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight*.58));
    await page.waitForTimeout(130);
    await page.screenshot({path:folder+"/"+id+"-middle.png",animations:"disabled"});
   }
   results.push({id,pass:true,data});
  }catch(error){
   failures.push({id,error:String(error),jsErrors});
   try{await page.screenshot({path:folder+"/"+id+"-failed.png",timeout:6000})}catch{}
  }
 }
 // Essential interactions.
 await page.goto(origin,{waitUntil:"load"});
 try{
  const choices=page.locator('[aria-controls="north-decision-result"]');
  assert(await choices.count()===3,"expected exactly three problem choices");
  await choices.nth(1).click();
  assert(await choices.nth(1).getAttribute("aria-pressed")==="true","second choice not selected");
  assert((await page.locator("#north-decision-result").innerText()).includes("Kết nối quy trình"),"result did not update");
  await choices.nth(2).click();
  assert(await choices.nth(2).getAttribute("aria-pressed")==="true","third choice not selected");
  await page.locator("#north-decision-result a").click();
  await page.waitForURL("**/modern-corporate/work/3");
  results.push({id:width+"-choices-and-detail",pass:true});
 }catch(error){failures.push({id:width+"-choices-and-detail",error:String(error)})}
 if(width<768){
  await page.goto(origin,{waitUntil:"load"});
  try{
   const button=page.locator('button[aria-controls="north-mobile-menu"]');
   assert(await button.isVisible(),"mobile menu button not visible");
   await button.click();
   assert(await button.getAttribute("aria-expanded")==="true","menu not open");
   await page.keyboard.press("Escape");
   assert(await button.getAttribute("aria-expanded")==="false","Escape does not dismiss menu");
   results.push({id:width+"-mobile-menu",pass:true});
  }catch(error){failures.push({id:width+"-mobile-menu",error:String(error)})}
 }
 await page.goto(origin+"/contact",{waitUntil:"load"});
 try{
  await page.locator("#north-name").fill("North QA");
  await page.locator("#north-email").fill("qa@example.com");
  await page.locator("#north-issue").click();
  const options=page.locator('[role="listbox"] [role="option"]');
  assert(await options.count()===3,"dropdown options unavailable");
  await options.nth(1).click();
  assert((await page.locator("#north-issue").innerText()).includes("Kết nối quy trình và công cụ"),"dropdown option did not update");
  assert(await page.locator("select").count()===0,"browser native select not expected");
  await page.locator("#north-detail").fill("Công việc phải nhập lại nhiều lần; muốn rút ngắn thời gian xử lý.");
  const values=await page.locator("#north-detail").inputValue();
  assert(values.length>10,"textarea content missing");
  results.push({id:width+"-contact-form",pass:true});
 }catch(error){failures.push({id:width+"-contact-form",error:String(error)})}
 await context.close();
}
const report={baseSha:head,browser:"Chrome",mobileClass:"EMULATED",passes:results.length,failures:failures.length,errors:failures,results};
writeFileSync(folder+"/simplified-report.json",JSON.stringify(report,null,2)+"\n");
console.log("NORTH_SIMPLIFIED_QA",JSON.stringify({passes:results.length,failures:failures.length,errors:failures},null,2));
await browser.close();
if(failures.length)process.exitCode=1;
