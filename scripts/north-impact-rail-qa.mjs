import {chromium} from "@playwright/test";
import {mkdirSync,writeFileSync} from "node:fs";
const base=process.env.ATHENA_QA_ORIGIN||"http://127.0.0.1:3182";
const root=".qa/north-impact-rail";mkdirSync(root,{recursive:true});
const browser=await chromium.launch({headless:true,channel:process.platform==="win32"?"chrome":undefined});
const sizes=[[320,680],[390,760],[390,844],[428,926],[768,1024],[1024,768],[1440,900]];
const results=[],failures=[];
function assert(cond,msg){if(!cond)throw Error(msg)}
for(const [w,h] of sizes){
 const page=await browser.newPage({viewport:{width:w,height:h},reducedMotion:"reduce"});
 try{
  const res=await page.goto(base+"/template-demos/modern-corporate",{waitUntil:"load",timeout:40000});
  assert(res?.status()===200,"HTTP "+res?.status());
  await page.evaluate(()=>document.fonts.ready);
  const initial=await page.evaluate(()=>({
    overflow:document.documentElement.scrollWidth-innerWidth,
    header:(()=>{const r=document.querySelector("header")?.getBoundingClientRect();return r?{top:r.top,bottom:r.bottom}:null})(),
    utility:(()=>{const r=document.querySelector('[class*="_utility__"]')?.getBoundingClientRect();return r?{top:r.top,bottom:r.bottom}:null})()
  }));
  assert(initial.overflow<=3,"initial horizontal overflow "+initial.overflow);
  if(w>=851){
    for(const distance of [0,150,410,860,1700]){
      await page.evaluate(n=>window.scrollTo(0,n),distance);
      await page.waitForTimeout(65);
      const g=await page.evaluate(()=>{
        const r=q=>{const e=document.querySelector(q);if(!e)return null;const b=e.getBoundingClientRect();return {top:b.top,bottom:b.bottom,left:b.left,width:b.width,background:getComputedStyle(e).backgroundColor}};
        return {utility:r('[class*="_utility__"]'),header:r('header'),rail:r('[class*="_rail__"]'),overflow:document.documentElement.scrollWidth-innerWidth};
      });
      assert(!!g.rail&&!!g.header&&!!g.utility,"rail/header missing");
      assert(Math.abs(g.utility.top)<=1,"utility not sticky at "+distance+" "+JSON.stringify(g));
      assert(Math.abs(g.header.top-g.utility.bottom)<=1,"utility/header gap "+distance+" "+JSON.stringify(g));
      assert(Math.abs(g.rail.top-g.header.bottom)<=1,"header/rail gap "+distance+" "+JSON.stringify(g));
      assert(g.rail.left===0&&g.rail.width>=40,"rail incorrect width "+JSON.stringify(g));
      assert(g.overflow<=3,"scroll horizontal overflow "+g.overflow);
      results.push({width:w,scroll:distance,railGap:Math.round(g.rail.top-g.header.bottom),pass:true});
    }
    await page.screenshot({path:root+"/north-scroll-"+w+".png",animations:"disabled"});
  }
  const impact=page.locator('[class*="_impact__"]').first();
  await impact.scrollIntoViewIfNeeded();
  const buttons=page.locator('[class*="_impactJourney__"] button');
  assert(await buttons.count()===3,"three steps missing");
  for(let i=0;i<3;i++){
    await buttons.nth(i).click();
    assert(await buttons.nth(i).getAttribute("aria-pressed")==="true","impact step "+i+" isn't selected");
    const text=await page.locator("#north-impact-result").innerText();
    const expected=["Xác định vấn đề","Thống nhất cách làm","Kiểm tra hiệu quả"][i];
    assert(text.includes(expected),"stage label mismatch "+i+" "+text.slice(0,100));
    const count=await page.locator('[class*="_impactJourney__"] button[aria-pressed="true"]').count();
    assert(count===1,"multiple selected steps "+count);
  }
  await buttons.first().focus();
  await page.keyboard.press("Tab");
  assert(await buttons.nth(1).evaluate(el=>el===document.activeElement),"keyboard tab lost in stage navigation");
  const colors=await page.evaluate(()=>{
    const buttons=[...document.querySelectorAll('[class*="_impactJourney__"] button')];
    const output={};
    for(const b of buttons){const c=getComputedStyle(b);output[b.getAttribute("aria-pressed")||"no"]={color:c.color,background:c.backgroundColor};}
    const rail=document.querySelector('[class*="_rail__"]');
    return {...output,railVisible:rail?getComputedStyle(rail).display!=="none":null,overflow:document.documentElement.scrollWidth-innerWidth};
  });
  assert(colors.overflow<=3,"impact horizontal overflow "+JSON.stringify(colors));
  if(w<850)assert(!colors.railVisible,"mobile rail unexpectedly visible");
  await impact.screenshot({path:root+"/north-impact-"+w+".png",animations:"disabled",timeout:25000});
  results.push({width:w,stageClicks:3,keyboard:true,colors,pass:true});
  console.log("NORTH_RAIL_IMPACT_PASS",w);
 }catch(e){const issue={width:w,error:String(e)};failures.push(issue);console.error("NORTH_RAIL_IMPACT_FAIL",JSON.stringify(issue));}
 finally{await page.close();}
}
await browser.close();
writeFileSync(root+"/results.json",JSON.stringify({results,failures,engine:"LAB_CHROME_DESKTOP_AND_EMULATED_MOBILE",realSafari:"UNVERIFIED"},null,2)+"\n");
console.log("NORTH_RAIL_IMPACT_RESULT",JSON.stringify({passed:results.length,failures:failures.length}));
if(failures.length)process.exitCode=1;
