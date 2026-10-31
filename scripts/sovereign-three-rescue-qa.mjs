/**
 * Three independent Athena sovereign concept rescue routes:
 * visual screenshots, real Chromium menu exits, desktop navigation, scroll scenes.
 * This is an emulated-device lab, not physical Safari evidence.
 */
import {chromium} from "@playwright/test";
import {mkdirSync,writeFileSync} from "node:fs";
const browser=await chromium.launch({channel:process.platform==="win32"?"chrome":undefined,headless:true});
const origin=process.env.ATHENA_QA_ORIGIN||"http://127.0.0.1:3182";
const out=".qa/sovereign-3-rescue/after";
mkdirSync(out,{recursive:true});
const slugs=["creative-studio","modern-corporate","commerce-standard"];
const sizes=[{name:"small",width:320,height:680},{name:"mobile",width:390,height:844},{name:"large-mobile",width:428,height:926},{name:"tablet",width:768,height:920},{name:"desktop",width:1440,height:900}];
const results=[],failures=[];
for(const slug of slugs)for(const size of sizes){
 const page=await browser.newPage({viewport:{width:size.width,height:size.height},reducedMotion:"no-preference"});
 const errors=[];page.on("pageerror",e=>errors.push(String(e)));
 try{
  const url=origin+"/template-demos/"+slug;
  const response=await page.goto(url,{waitUntil:"load",timeout:45000});
  if(response?.status()!==200)throw Error("HTTP "+response?.status());
  await page.locator("main h1").waitFor({timeout:12000});
  await page.screenshot({path:out+"/"+slug+"-"+size.name+"-home.png",animations:"disabled",timeout:18000});
  const state=await page.evaluate(()=>({
   h1:document.querySelector("main h1")?.textContent,
   overflow:document.documentElement.scrollWidth-innerWidth,
   hasShared:!!document.querySelector(".world-site"),
   headingFont:getComputedStyle(document.querySelector("main h1")).fontFamily,
   headerLinks:[...document.querySelectorAll("header nav a")].filter(el=>getComputedStyle(el).display!=="none").length,
   toggles:[...document.querySelectorAll('header button[aria-expanded]')].filter(el=>getComputedStyle(el).display!=="none").length,
   motion:(getComputedStyle(document.querySelector("main h1")).animationName||"")
  }));
  if(!state.h1||state.overflow>3||state.hasShared)throw Error("Broken page geometry "+JSON.stringify(state));
  if(state.h1.includes("Clarity in")||state.h1.includes("A softer")||state.h1.includes("We make"))throw Error("Old English hero remains");
  if(size.name==="desktop"){
   if(state.toggles!==0)throw Error("Desktop still has redundant hamburger");
   if(state.headerLinks<(slug==="commerce-standard"?2:4))throw Error("Desktop navigation incomplete "+state.headerLinks);
  }
  if(size.width<=428&&slug==="creative-studio"){
   const intersection=await page.evaluate(()=>{
    const root=document.querySelector("[data-sora-surface]");
    const seal=[...root.querySelectorAll("div")].find(el=>(el.className||"").toString().includes("editorialSeal"));
    const copy=[...root.querySelectorAll("section p")].find(el=>el.textContent?.includes("Ý tưởng không chỉ cần đẹp"));
    if(!seal||!copy)return {missing:true};
    const a=seal.getBoundingClientRect(),b=copy.getBoundingClientRect();
    return {missing:false,overlap:Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)),copyArea:b.width*b.height};
   });
   if(intersection.missing||intersection.overlap>Math.max(60,intersection.copyArea*.03))throw Error("SORA seal obscures paragraph "+JSON.stringify(intersection));
  }
  if(size.width<=428&&slug==="commerce-standard"){
   const firstFold=await page.evaluate(()=>({y:document.querySelector("main h1")?.getBoundingClientRect().top,height:innerHeight}));
   if(!Number.isFinite(firstFold.y)||firstFold.y>=firstFold.height-25)throw Error("MOC first-fold headline is below screen "+JSON.stringify(firstFold));
  }
  if(size.width<=390){
   const toggle=page.locator("header button[aria-expanded]").first();
   if(await toggle.count()!==1||!(await toggle.isVisible()))throw Error("Missing standard hamburger");
   const before=await page.evaluate(()=>document.documentElement.scrollWidth);
   await toggle.click();if(await toggle.getAttribute("aria-expanded")!=="true")throw Error("Menu open state");
   await page.screenshot({path:out+"/"+slug+"-"+size.name+"-menu.png",animations:"disabled",timeout:18000});
   await page.keyboard.press("Escape");if(await toggle.getAttribute("aria-expanded")!=="false")throw Error("Menu Escape close");
   const after=await page.evaluate(()=>document.documentElement.scrollWidth);
   if(before!==after)throw Error("Menu causes scroll width jump "+before+"->"+after);
   await toggle.click();
   const close=slug==="creative-studio"?page.getByRole("button",{name:"Đóng mục lục"}).last():slug==="modern-corporate"?page.locator("aside button").first():page.getByRole("button",{name:"Đóng danh mục"}).last();
   await close.click();
   if(await toggle.getAttribute("aria-expanded")!=="false")throw Error("Explicit close button missing");
   const selector=slug==="creative-studio"?"[data-sora-reveal]":slug==="modern-corporate"?"[data-north-scene]":"[data-moc-reveal]";
   const target=page.locator(selector).first();
   if(await target.count()){
    await target.scrollIntoViewIfNeeded();
    await page.waitForTimeout(780);
    const key=slug==="creative-studio"?"data-sora-visible":slug==="modern-corporate"?"data-north-visible":"data-moc-visible";
    if(await target.getAttribute(key)!=="true")throw Error("IntersectionObserver scroll reveal failed");
   }
   if(slug==="modern-corporate"){
    await page.locator('button[aria-pressed]').nth(1).click();
    if(await page.locator('button[aria-pressed]').nth(1).getAttribute("aria-pressed")!=="true")throw Error("NORTH topology interaction");
   }
   if(slug==="commerce-standard"){
    await page.getByRole("button",{name:/Vải dệt/}).click();
    if(await page.getByRole("button",{name:/Vải dệt/}).getAttribute("aria-pressed")!=="true")throw Error("MOC material story interaction");
   }
  }
  for(const section of ["work","services","about","contact","work/1"]){
   if(size.name!=="mobile")break;
   const response=await page.goto(origin+"/template-demos/"+slug+"/"+section,{waitUntil:"domcontentloaded",timeout:45000});
   if(response?.status()!==200||await page.locator("main h1").count()===0)throw Error("Broken route "+section);
  }
  if(errors.length)throw Error("Runtime exceptions "+errors.join(" | ").slice(0,400));
  results.push({slug,size:size.name,...state});console.log("THREE_RESCUE_PASS",slug,size.name);
 }catch(err){const failure={slug,size:size.name,error:String(err)};failures.push(failure);console.log("THREE_RESCUE_FAIL",JSON.stringify(failure));}
 finally{await page.close();}
}
await browser.close();
writeFileSync(out+"/qa.json",JSON.stringify({results,failures,engine:"Chromium browser lab, not real iPhone Safari"},null,2)+"\n");
console.log("THREE_RESCUE_RESULT",JSON.stringify({passed:results.length,failed:failures.length,required:slugs.length*sizes.length}));
if(failures.length||results.length!==slugs.length*sizes.length)process.exitCode=1;
