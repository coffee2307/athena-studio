import {chromium} from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const base=process.env.ATHENA_TEST_ORIGIN||"http://127.0.0.1:3182";
const browser=await chromium.launch({headless:true,executablePath:process.platform==="win32"?"C:/Program Files/Google/Chrome/Application/chrome.exe":undefined});
const failures=[],results=[];
await fs.mkdir(".qa/soft-launch-review",{recursive:true});
const routes=["/","/services","/services/web-development","/services/website-care","/services/ai-integration","/services/web-development/templates","/pricing","/process","/about","/contact","/start","/projects","/products","/legal","/legal/privacy","/legal/terms","/legal/cookies","/legal/service-policy","/login","/signup"];
for(const width of [1440,390]){
 const page=await browser.newPage({viewport:{width,height:880}});
 page.on("pageerror",e=>failures.push("JS "+width+": "+e.message));
 for(const route of routes){
  const response=await page.goto(base+route,{waitUntil:"load",timeout:45000});
  try{
   assert.equal(response?.status(),200,"HTTP "+route);
   assert.equal(await page.locator(".agency-header").count(),1,"header "+route);
   const over=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
   assert.ok(over<=2,"horizontal overflow "+route+"="+over);
   results.push(width+" "+route);
  }catch(e){failures.push(String(width)+" "+route+" "+(e?.message??e));}
  if((route==="/start"||route==="/pricing")&&![...failures].some(v=>v.includes(route)))await page.screenshot({path:".qa/soft-launch-review/"+(route==="/start"?"start":"pricing")+"-"+width+".png",animations:"disabled"});
 }
 await page.goto(base+"/start",{waitUntil:"load",timeout:45000});
 await page.locator(".launch-service-grid button").first().click();
 await page.getByRole("button",{name:"Tiếp tục"}).click();
 await page.locator(".launch-flow-fieldset textarea").fill("Tôi muốn thiết kế website bán hàng giới thiệu sản phẩm và có bản mobile hoàn chỉnh.");
 await page.locator(".launch-field-row select").first().selectOption("10-30m");
 await page.getByRole("button",{name:"Tiếp tục"}).click();
 await page.locator('input[autocomplete="name"]').fill("Khách hàng thử nghiệm");
 await page.locator('input[autocomplete="email"]').fill("demo@example.com");
 const writes=[];
 page.on("request",req=>{if(req.method()!=="GET"&&req.method()!=="HEAD")writes.push(req.method()+" "+req.url())});
 await page.getByRole("button",{name:"Chuẩn bị email yêu cầu"}).click();
 await page.locator(".launch-draft").waitFor({timeout:8000});
 const content=await page.locator("#launch-draft-preview").inputValue();
 assert.match(content,/Website mới|Thiết kế website/);
 assert.match(content,/10–30 triệu đồng/);
 assert.match(content,/chưa được gửi tự động/);
 assert.ok((await page.locator(".launch-draft a").getAttribute("href")).startsWith("mailto:"));
 assert.equal(writes.length,0,"Browser sent POST unexpectedly: "+writes.join(","));
 console.log("WIZARD",width,"PASS",content.length,"chars");
 await page.close();
}
const p=await browser.newPage({viewport:{width:1440,height:900}});
await p.goto(base,{waitUntil:"load"});
await p.locator(".agency-primary-cta").click();
await p.waitForURL("**/start",{timeout:12000});
assert.equal(await p.locator(".launch-flow-progress>div").count(),3);
const robots=await p.locator('head meta[name="robots"]').first().getAttribute("content");
assert.ok(robots?.includes("noindex"),"Soft launch candidate must stay noindex: "+robots);
console.log("NAV CTA + NOINDEX PASS",robots);
await p.close();
await browser.close();
console.log("SOFT_LAUNCH_SMOKE",results.length,"routes checked; errors",failures.length,failures.slice(0,15));
if(failures.length)process.exitCode=1;
