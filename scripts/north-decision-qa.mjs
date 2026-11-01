import {chromium} from "@playwright/test";
import {mkdirSync,writeFileSync} from "node:fs";
import {execSync} from "node:child_process";
const output=".qa/north-decision-qa";
mkdirSync(output,{recursive:true});
const sha=execSync("git rev-parse HEAD",{encoding:"utf8"}).trim();
const origin="http://127.0.0.1:3182/template-demos/modern-corporate";
const browser=await chromium.launch({channel:process.platform==="win32"?"chrome":undefined,headless:true});
const errors=[],success=[];
const routes=["","/work","/services","/about","/contact","/work/1","/work/2","/work/3"];
const widths=[[320,680],[390,844],[428,926],[768,1024],[1440,900],[1920,1080]];
const assert=(condition,msg)=>{if(!condition)throw new Error(msg)};
for(const [width,height] of widths){
 const ctx=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,hasTouch:width<768,isMobile:false,reducedMotion:"no-preference"});
 const page=await ctx.newPage();const issues=[];
 page.on("pageerror",e=>issues.push(e.message));
 for(const route of routes){
  const label=width+"-"+(route.slice(1).replaceAll("/","-")||"home");
  try{
   const res=await page.goto(origin+route,{waitUntil:"load",timeout:38000});
   assert(res?.status()===200,"HTTP "+res?.status());
   await page.locator("h1").first().waitFor();
   await page.waitForTimeout(150);
   const data=await page.evaluate(()=>{
    const h=document.querySelector("h1");
    const img=[...document.images].filter(i=>{let a=i.getBoundingClientRect();return a.height>0&&a.top<innerHeight&&a.bottom>0});
    const buttons=[...document.querySelectorAll("button")].filter(b=>b.getBoundingClientRect().width>0);
    return {overflow:document.documentElement.scrollWidth-innerWidth,title:h?.innerText,headingBox:h?.getBoundingClientRect().toJSON(),visibleImageErrors:img.filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src),buttons:buttons.length,buttonTooSmall:buttons.filter(b=>{const r=b.getBoundingClientRect();return r.width<34||r.height<34}).map(b=>b.innerText?.slice(0,30)).slice(0,6),skeletonCount:document.querySelectorAll('[class*="Skeleton"],[class*="skeleton"]').length,html:document.documentElement.lang};
   });
   assert(data.overflow<=3,"horizontal overflow "+data.overflow);
   assert(data.headingBox.left>=-5&&data.headingBox.right<=width+5,"heading clipped "+JSON.stringify(data.headingBox));
   assert(data.visibleImageErrors.length===0,"broken images "+data.visibleImageErrors.join(","));
   assert(data.skeletonCount===0,"unexpected skeleton");
   assert(issues.length===0,"JS errors "+issues.join(";"));
   if((width===390||width===1440)&&["","/work","/about","/contact"].includes(route))await page.screenshot({path:output+"/"+label+"-first.png",animations:"disabled"});
   if(route===""&&(width===390||width===1440)){
    for(const [key,pct] of [["mid",.47],["footer",.98]]){
     await page.evaluate(p=>scrollTo({top:(document.documentElement.scrollHeight-innerHeight)*p,behavior:"instant"}),pct);
     await page.waitForTimeout(250);
     await page.screenshot({path:output+"/"+label+"-"+key+".png",animations:"disabled"});
    }
   }
   success.push({label,route,width,data});
  }catch(e){errors.push({label,error:String(e),jsErrors:issues.splice(0)});
   try{await page.screenshot({path:output+"/"+label+"-FAILED.png",timeout:10000})}catch{}
  }
 }
 await page.goto(origin,{waitUntil:"load"});
 try{
  const nodes=page.locator("button[class*='atlasNode']");
  assert(await nodes.count()===3,"node count");
  await nodes.nth(1).click();
  assert(await nodes.nth(1).getAttribute("aria-pressed")==="true","node 2 not selected");
  assert((await page.locator("#north-atlas-output").innerText()).includes("Thông tin đang mắc kẹt"),"node result incorrect");
  await nodes.nth(2).click();
  assert(await nodes.nth(2).getAttribute("aria-pressed")==="true","node 3 not selected");
  await page.locator("#north-atlas-output a").click();
  await page.waitForURL("**/modern-corporate/work/3");
  success.push({label:width+"-map-interactive",result:"pass"});
 }catch(e){errors.push({label:width+"-map-interactive",error:String(e)})}
 await page.goto(origin+"/services",{waitUntil:"load"});
 try{
  const stage=page.locator("button[class*='pipelineSteps']");
  const steps=page.locator('[class*="pipelineSteps"] button');
  assert(await steps.count()===4,"pipeline step count");
  await steps.nth(2).click();
  assert(await steps.nth(2).getAttribute("aria-pressed")==="true","step 3 not selected");
  assert((await page.locator("#north-pipeline-result").innerText()).includes("Mọi bước đều có một lý do."),"step 3 content not updated");
  success.push({label:width+"-pipeline-interactive",result:"pass"});
 }catch(e){errors.push({label:width+"-pipeline-interactive",error:String(e)})}
 await page.goto(origin+"/contact",{waitUntil:"load"});
 try{
  await page.locator("#north-name").fill("North QA");
  await page.locator("#north-email").fill("qa@example.com");
  const picker=page.locator("#north-issue");
  await picker.click();
  const options=page.locator('[role="listbox"] [role="option"]');
  assert(await options.count()===3,"custom dropdown should display three options");
  await options.nth(1).click();
  assert((await picker.innerText()).includes("Phát triển nền tảng số"),"custom dropdown choice not applied");
  assert(await page.locator("select").count()===0,"unexpected native dropdown");
  await page.locator("#north-detail").fill("Đây là phần mô tả vấn đề đủ dài để nghiệm thu biểu mẫu NORTH.");
  assert(await page.locator("#north-detail").inputValue()!=="","textarea lost value");
  const ratios=await page.evaluate(()=>{
   const candidates=[document.querySelector('button[type="submit"]'),document.querySelector('[class*="consult"]')].filter(Boolean);
   const parse=value=>(value.match(/[0-9.]+/g)||[]).slice(0,3).map(Number);
   const light=color=>{
    const channels=parse(color).map(v=>{const c=v/255;return c<=.04045?c/12.92:Math.pow((c+.055)/1.055,2.4)});
    return channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;
   };
   return candidates.map(el=>{
    const style=getComputedStyle(el);
    const a=light(style.color),b=light(style.backgroundColor);
    return {element:el.tagName,ratio:(Math.max(a,b)+.05)/(Math.min(a,b)+.05),fg:style.color,bg:style.backgroundColor};
   });
  });
  for(const ratio of ratios)assert(ratio.ratio>=4.5,"text contrast below WCAG AA "+JSON.stringify(ratio));
  success.push({label:width+"-contact-form",result:"pass",ratios});
 }catch(e){errors.push({label:width+"-contact-form",error:String(e)})}
 if(width<768){
  await page.goto(origin,{waitUntil:"load"});
  try{
   const trigger=page.getByRole("button",{name:"Mở điều hướng"});
   assert(await trigger.isVisible(),"mobile menu trigger invisible");
   await trigger.click();
   assert(await page.getByRole("link",{name:/Tư duy NORTH/}).last().isVisible(),"mobile menu did not open");
   await page.keyboard.press("Escape");
   assert(await page.getByRole("button",{name:"Mở điều hướng"}).getAttribute("aria-expanded")==="false","menu Escape failed");
   success.push({label:width+"-mobile-menu",result:"pass"});
  }catch(e){errors.push({label:width+"-mobile-menu",error:String(e)})}
 }
 await ctx.close();
}
await browser.close();
const report={sha,browser:"Chrome",environment:"LAB_DESKTOP_AND_MOBILE_EMULATED",successCount:success.length,errorCount:errors.length,errors,success};
writeFileSync(output+"/report.json",JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify({sha,successCount:success.length,errorCount:errors.length,errors},null,2));
if(errors.length)process.exitCode=1;
