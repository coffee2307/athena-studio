import {chromium} from "playwright";
import assert from "node:assert/strict";
import {readFileSync,mkdirSync,writeFileSync} from "node:fs";

const items=JSON.parse(readFileSync(new URL("../data/templates.json",import.meta.url),"utf8"));
const slugs=items.map(x=>x.slug).filter(x=>!["auto-showroom","digital-creators","modern-corporate"].includes(x));
const browser=await chromium.launch({headless:true,channel:process.platform==="win32"?"chrome":undefined});
const origin=process.env.ATHENA_QA_ORIGIN||"http://127.0.0.1:3182";
const results=[],failures=[];
for(const slug of slugs){
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:"reduce"});
 try{
  const response=await page.goto(origin+"/template-demos/"+slug+"?embed=1",{waitUntil:"domcontentloaded",timeout:45000});
  assert.equal(response?.status(),200,slug+" HTTP");
  await page.locator("[data-dna04-artifact]").first().waitFor({timeout:12000});
  const count=await page.locator("[data-dna04-artifact]").count();
  assert(count>0,slug+" no interactive artifact");
  const sampleCount=Math.min(2,count);
  for(let i=0;i<sampleCount;i++){
   const target=page.locator("[data-dna04-artifact]").nth(i);
   await target.scrollIntoViewIfNeeded({timeout:15000});
   const r=await target.boundingBox();
   assert(r&&r.width>=70&&r.height>=50,slug+" collapsed interactive content "+i);
   await page.mouse.move(r.x+r.width*.35,r.y+r.height*.35);
   await page.waitForTimeout(380);
   const a=await target.evaluate(el=>({transform:getComputedStyle(el).transform,tilt:el.style.getPropertyValue("--dna04-tilt-x"),shift:el.style.getPropertyValue("--dna04-shift-x")}));
   await page.mouse.move(r.x+r.width*.65,r.y+r.height*.65);
   await page.waitForTimeout(170);
   const b=await target.evaluate(el=>({transform:getComputedStyle(el).transform,tilt:el.style.getPropertyValue("--dna04-tilt-x"),shift:el.style.getPropertyValue("--dna04-shift-x")}));
   assert.deepEqual(b,a,slug+" artifact "+i+" still reacts to pointer movement: "+JSON.stringify({a,b}));
  }
  results.push({slug,samples:sampleCount,pass:true});
  console.log("NO_PANEL_TILT_PASS",slug,sampleCount);
 }catch(e){failures.push({slug,error:String(e)});console.error("NO_PANEL_TILT_FAIL",slug,String(e));}
 finally{await page.close();}
}
await browser.close();
mkdirSync(".qa/template-pointer-stability",{recursive:true});
writeFileSync(".qa/template-pointer-stability/results.json",JSON.stringify({slugs,results,failures,chromeOnly:true},null,2)+"\n");
console.log("NO_PANEL_TILT_SUMMARY",JSON.stringify({passed:results.length,failed:failures.length,expected:slugs.length}));
if(failures.length||results.length!==slugs.length)process.exitCode=1;
