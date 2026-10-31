import {chromium} from "@playwright/test";
import {mkdirSync,writeFileSync} from "node:fs";
const origin=process.env.ATHENA_QA_ORIGIN||"http://127.0.0.1:3182";
const dir=".qa/north-upgrade",viewports=[[320,680],[390,760],[390,844],[428,926],[768,1024],[1440,900]];
mkdirSync(dir,{recursive:true});
const browser=await chromium.launch({headless:true,channel:process.platform==="win32"?"chrome":undefined});
const results=[],failures=[];
for(const [w,h] of viewports){
 const page=await browser.newPage({viewport:{width:w,height:h},reducedMotion:"reduce"});
 try{
  for(const route of ["","work","services","about","work/1","contact"]){
   const url=origin+"/template-demos/modern-corporate"+(route?"/"+route:"");
   const resp=await page.goto(url,{waitUntil:"load",timeout:45000});
   if(resp?.status()!==200)throw Error(route+" HTTP "+resp?.status());
   await page.evaluate(()=>document.fonts.ready);
   const measured=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,heading:document.querySelector("main h1")?.textContent?.trim(),bodyWidth:document.body.getBoundingClientRect().width}));
   if(!measured.heading||measured.overflow>3)throw Error(route+" layout "+JSON.stringify(measured));
   if(!route){
    const controls=page.locator('[aria-controls="north-diagnostic-result"]');
    if(await controls.count()!==3)throw Error("Diagnostic needs three controls");
    for(let i=0;i<3;i++){
     const button=controls.nth(i);await button.click();
     if(await button.getAttribute("aria-pressed")!=="true")throw Error("Scenario did not select "+i);
     const result=page.locator("#north-diagnostic-result");
     const expected=["Chiến lược hệ thống","Vận hành số","Lộ trình chuyển đổi"][i];
     if(!(await result.innerText()).includes(expected))throw Error("Result mismatch "+expected);
     const dest=await result.locator("a").getAttribute("href");
     if(dest!=="/template-demos/modern-corporate/work/"+(i+1))throw Error("Broken detail link "+dest);
     const buttons=await page.evaluate(()=>[...document.querySelectorAll('[aria-controls="north-diagnostic-result"]')].map(x=>({text:getComputedStyle(x).color,bg:getComputedStyle(x).backgroundColor})));
     if(buttons.some(x=>x.bg==="rgba(0, 0, 0, 0)"))throw Error("Transparent diagnostic button "+JSON.stringify(buttons));
    }
    if(w===390||w===1440){await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(100);await page.screenshot({path:dir+"/north-home-"+w+".jpg",type:"jpeg",quality:85,animations:"disabled"});}
    if(w<=428){const toggle=page.getByRole("button",{name:"Mở điều hướng"});await toggle.click();const close=page.locator('[class*="panelTop"] button');await close.click();if(await toggle.getAttribute("aria-expanded")!=="false")throw Error("Mobile drawer did not close");}
    const diag=page.locator("#north-diagnostic-tool");
    if(w<=428){const width=await diag.evaluate(e=>e.getBoundingClientRect().width);if(width>w+2)throw Error("Mobile diagnostic overflow");}
   }
   if(route==="services"){
    const btns=page.locator('[class*="stepButtons"] button');
    await btns.nth(2).click();
    const text=await page.locator('[class*="stepOutput"]').innerText();
    if(!text.includes("Nguyên mẫu"))throw Error("Service output not updated");
   }
   if(route==="contact"&&w===390)await page.screenshot({path:dir+"/north-contact-390.jpg",type:"jpeg",quality:84,animations:"disabled"});
   results.push({width:w,height:h,route:route||"home",pass:true});
  }
 }catch(e){failures.push({width:w,height:h,error:String(e)});console.error("NORTH_QA_FAILED",JSON.stringify(failures.at(-1)));}
 finally{await page.close();}
}
await browser.close();
writeFileSync(dir+"/north-qa.json",JSON.stringify({results,failures,engine:"Chrome desktop and emulated mobile",sourceSha:process.env.GITHUB_SHA||"local working tree"},null,2)+"\n");
console.log("NORTH_QA",JSON.stringify({passed:results.length,failed:failures.length}));
if(failures.length)process.exitCode=1;
