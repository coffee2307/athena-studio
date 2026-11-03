import {chromium} from "@playwright/test";
import {mkdirSync,writeFileSync} from "node:fs";

const origin=process.env.ATHENA_QA_ORIGIN||"http://127.0.0.1:3182";
const dir=".qa/north-upgrade";
const viewports=[[320,680],[390,760],[390,844],[428,926],[768,1024],[1440,900]];
mkdirSync(dir,{recursive:true});
const browser=await chromium.launch({headless:true,channel:process.platform==="win32"?"chrome":undefined});
const results=[],failures=[];
const routes=["","work","services","about","work/1","contact"];
const expected=["Xác định ưu tiên","Kết nối quy trình","Lập kế hoạch triển khai"];
function check(condition,message){if(!condition)throw Error(message);}
for(const [w,h] of viewports){
 const page=await browser.newPage({viewport:{width:w,height:h},reducedMotion:"reduce"});
 try{
  for(const route of routes){
   const url=origin+"/template-demos/modern-corporate"+(route?"/"+route:"");
   const response=await page.goto(url,{waitUntil:"load",timeout:45000});
   check(response?.status()===200,route+" HTTP "+response?.status());
   await page.evaluate(()=>document.fonts.ready);
   const metrics=await page.evaluate(()=>({
    overflow:document.documentElement.scrollWidth-innerWidth,
    heading:document.querySelector("main h1")?.textContent?.trim(),
    bodyWidth:document.body.getBoundingClientRect().width
   }));
   check(Boolean(metrics.heading)&&metrics.overflow<=3,route+" layout "+JSON.stringify(metrics));
   if(!route){
    const controls=page.locator('[data-north-page="home"] button[aria-controls="north-decision-result"]');
    check(await controls.count()===3,"NORTH requires exactly three choices");
    for(let i=0;i<3;i++){
     await controls.nth(i).click();
     check(await controls.nth(i).getAttribute("aria-pressed")==="true","Choice not selected "+i);
     const pressed=await page.locator('[data-north-page="home"] button[aria-controls="north-decision-result"][aria-pressed="true"]').count();
     check(pressed===1,"Multiple selected choices "+pressed);
     const result=page.locator("#north-decision-result");
     check((await result.innerText()).includes(expected[i]),"Wrong decision outcome "+expected[i]);
     check(await result.locator("a").getAttribute("href")==="/template-demos/modern-corporate/work/"+(i+1),"Broken detail link "+i);
     const visual=await controls.nth(i).evaluate(el=>({color:getComputedStyle(el).color,background:getComputedStyle(el).backgroundColor,width:el.getBoundingClientRect().width}));
     check(visual.width>0&&visual.color!==visual.background,"Invisible decision control "+JSON.stringify(visual));
    }
    if(w===390||w===1440){
     await page.evaluate(()=>scrollTo(0,0));
     await page.screenshot({path:dir+"/north-home-"+w+".jpg",type:"jpeg",quality:85,animations:"disabled"});
    }
    if(w<=428){
     const toggle=page.locator('header button[aria-controls="north-mobile-menu"]');
     await toggle.click();
     check(await toggle.getAttribute("aria-expanded")==="true","Mobile menu not opened");
     const close=page.getByRole("button",{name:"Đóng điều hướng"});
     check(await close.isVisible(),"Mobile X not visible");
     const bounds=await close.boundingBox();
     check(Boolean(bounds)&&bounds.width>=44&&bounds.height>=44,"X hit area under 44px");
     await close.click();
     check(await toggle.getAttribute("aria-expanded")==="false","Mobile menu not closed");
     const size=await page.locator('[data-north-page="home"] [class*="_decisionPanel__"]').evaluate(el=>el.getBoundingClientRect().width);
     check(size<=w+2,"Mobile decision panel wider than viewport");
    }
   }
   if(route==="services"){
    const steps=page.locator('[class*="_processList__"] > li');
    check(await steps.count()===4,"Expected four process steps");
    for(let i=0;i<4;i++){
     check((await steps.nth(i).locator("h3").innerText()).trim().length>5,"Missing step title "+i);
     check((await steps.nth(i).locator('[class*="_processOutput__"]').innerText()).trim().length>8,"Missing step outcome "+i);
    }
   }
   if(route==="contact"){
    check(await page.locator("form").count()===1,"Contact draft form absent");
    check((await page.locator("form").innerText()).includes("Tạo bản nháp email"),"Contact draft not described");
    if(w===390)await page.screenshot({path:dir+"/north-contact-390.jpg",type:"jpeg",quality:84,animations:"disabled"});
   }
   results.push({width:w,height:h,route:route||"home",pass:true});
  }
 }catch(e){const f={width:w,height:h,error:String(e)};failures.push(f);console.error("NORTH_QA_FAILED",JSON.stringify(f));}
 finally{await page.close();}
}
await browser.close();
writeFileSync(dir+"/north-qa.json",JSON.stringify({results,failures,engine:"Chrome desktop and emulated mobile",sourceSha:process.env.GITHUB_SHA||"local working tree"},null,2)+"\n");
console.log("NORTH_QA",JSON.stringify({passed:results.length,failed:failures.length}));
if(failures.length||results.length!==viewports.length*routes.length)process.exitCode=1;
