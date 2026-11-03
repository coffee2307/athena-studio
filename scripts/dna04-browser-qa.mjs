import {chromium} from "@playwright/test";
import {mkdirSync,writeFileSync} from "node:fs";
import {execSync} from "node:child_process";
const root="http://127.0.0.1:3182";
const out=".qa/dna04-browser";
mkdirSync(out,{recursive:true});
const sha=execSync("git rev-parse HEAD",{encoding:"utf8"}).trim();
const browser=await chromium.launch({channel:process.platform==="win32"?"chrome":undefined,headless:true});
const desktop=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1});
const mobile=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
const pages=[{ctx:desktop,name:"desktop"},{ctx:mobile,name:"mobile"}];
const results=[],failed=[];
function check(ok,message){if(!ok)throw new Error(message)}
async function audit({ctx,name},route,shot=false){
 const page=await ctx.newPage();const errs=[];page.on("pageerror",e=>errs.push(e.message));
 try{
  const res=await page.goto(root+route,{waitUntil:"domcontentloaded",timeout:45000});check(res?.status()===200,"HTTP="+res?.status());
  await page.locator("body").waitFor({state:"visible",timeout:12000});
  await page.waitForTimeout(180);
  const view=await page.evaluate(()=>{
   const body=document.body;
   const h=document.querySelector("h1");
   const imgs=[...document.querySelectorAll("img")].filter(el=>{const r=el.getBoundingClientRect();return r.top<innerHeight&&r.bottom>0});
   return {w:innerWidth,htmlWidth:document.documentElement.scrollWidth,bodyWidth:body.scrollWidth,title:h?.textContent?.replace(/\s+/g," ").slice(0,100),h1Bounds:h?{left:h.getBoundingClientRect().left,right:h.getBoundingClientRect().right}:null,brokenImage:imgs.filter(img=>img.complete&&img.naturalWidth===0).map(img=>img.getAttribute("src"))};
  });
  check(view.htmlWidth-view.w<=4,"overflow "+(view.htmlWidth-view.w));
  check(!!view.title,"missing h1");
  check(view.h1Bounds?.left>=-6&&view.h1Bounds.right<=view.w+6,"h1 exceeds viewport "+JSON.stringify(view.h1Bounds));
  if(shot)await page.screenshot({path:out+"/"+name+"-"+(route.replaceAll("/","_")||"home")+".png",animations:"disabled"});
  results.push({name,route,view,errors:errs});
  if(errs.length)throw new Error("JS "+errs.join(" | "));
  return {page,view};
 }catch(e){
  const item={name,route,error:String(e),pageErrors:errs};failed.push(item);
  console.log("DNA04_FAIL",JSON.stringify(item));
  try{await page.screenshot({path:out+"/"+name+"-"+route.replaceAll("/","_")+"-FAIL.png",timeout:9000})}catch{}
  await page.close();return {page:null,view:null};
 }
}
for(const cfg of pages){
 for(const route of ["/","/about","/process","/services/web-development/templates"]){
  const {page}=await audit(cfg,route,true);
  if(!page)continue;
  if(route==="/about"){
   try{
    const desk=page.locator(".dna04-desk");
    check(await desk.count()===1,"about interactive desk absent");
    const tabs=desk.locator(".dna04-desk-tabs button");
    await tabs.nth(1).click();
    check((await desk.locator(".dna04-desk-description h2").innerText()).includes("Không chỉ đẹp"),"about Engineering tab wrong");
    await tabs.nth(2).click();
    check((await desk.locator(".dna04-desk-description h2").innerText()).includes("Giải quyết"),"about AI tab wrong");
    results.push({name:cfg.name,route:"/about#desk-interactions",pass:true});
   }catch(e){failed.push({name:cfg.name,route:"about-interactions",error:String(e)})}
  }
  if(route==="/process"){
   try{
    const steps=page.locator(".dna04-blueprint-steps button");
    check(await steps.count()===6,"process stages missing");
    await steps.nth(3).click();
    await page.waitForTimeout(430);
    check(await steps.nth(3).getAttribute("aria-pressed")==="true","process stage click not reflected");
    check((await page.locator(".dna04-blueprint-current").innerText()).includes("Bản thiết kế"),"process preview not updated");
    results.push({name:cfg.name,route:"/process#six-step-input",pass:true});
   }catch(e){failed.push({name:cfg.name,route:"process-interactions",error:String(e)})}
  }
  if(route==="/services/web-development/templates"){
   try{
    const cards=page.locator(".template-card-preview");
    check(await cards.count()===15,"gallery should list 15 demos");
    if(cfg.name==="desktop"){
     await cards.first().hover();
     const p=await cards.first().evaluate(el=>({transform:getComputedStyle(el).transform,focus:getComputedStyle(el).outline}));
     results.push({name:cfg.name,route:"gallery#hover",p});
    }
   }catch(e){failed.push({name:cfg.name,route:"gallery-input",error:String(e)})}
  }
  await page.close();
 }
}
const slugs=["creative-studio","modern-corporate","commerce-standard","fashion-archive","saas-product","campaign-landing","hospitality-booking","architecture-studio","wellness-clinic","property-showcase","education-platform","pet-store","auto-showroom","construction-firm"];
for(const slug of slugs){
 for(const suffix of ["","/work","/services","/about","/contact","/work/1"]){
  const route="/template-demos/"+slug+suffix;
  const {page}=await audit({ctx:desktop,name:"desktop"},route,suffix===""&&["creative-studio","fashion-archive","pet-store"].includes(slug));
  if(page){
   if(suffix===""&&slug!=="auto-showroom"){
    if(slug==="modern-corporate"){
     // NORTH intentionally removed decorative pointer artifacts. Prove its real decision widget instead.
     try{
      const choices=page.locator("[data-north-page=home] button[aria-pressed]");
      check(await choices.count()===3,"NORTH requires three actionable decisions");
      await choices.nth(2).click();
      check(await choices.nth(2).getAttribute("aria-pressed")==="true","NORTH choice did not update");
      check((await page.locator("#north-decision-result h3").innerText()).includes("Lập kế hoạch triển khai"),"NORTH result did not update");
      results.push({name:"desktop",route:route+"#live-decision",pass:true});
     }catch(e){failed.push({name:"desktop",route,error:String(e)})}
    }else{
     const bound=await page.locator("[data-dna04-artifact]").count();
     if(bound===0)failed.push({name:"desktop",route,error:"no local interactive artifact"});
     else results.push({name:"desktop",route:route+"#local-motion",count:bound});
    }
   }
   await page.close();
  }
 }
}
for(const slug of slugs){
 const route="/template-demos/"+slug;
 const {page}=await audit({ctx:mobile,name:"mobile"},route,["creative-studio","modern-corporate","commerce-standard","fashion-archive","pet-store"].includes(slug));
 if(page)await page.close();
}
const counts={checks:results.length,failed:failed.length,chrome:"LAB_CHROME_WINDOWS/MOBILE_EMULATED",sourceSha:sha};
writeFileSync(out+"/report.json",JSON.stringify({counts,results,failed},null,2)+"\n");
console.log("DNA04_BROWSER_QA_SUMMARY",JSON.stringify(counts));
await desktop.close();await mobile.close();await browser.close();
if(failed.length)process.exitCode=1;
