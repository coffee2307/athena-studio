import fs from "node:fs/promises";
import {chromium} from "@playwright/test";
import assert from "node:assert/strict";
const root=process.env.ATHENA_TEST_ORIGIN||"http://127.0.0.1:3182";
const data=JSON.parse(await fs.readFile("data/templates.json","utf8"));
const browser=await chromium.launch({headless:true,executablePath:process.platform==="win32"?"C:/Program Files/Google/Chrome/Application/chrome.exe":undefined});
await fs.mkdir(".qa/experience-v4",{recursive:true});
const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
const errors=[];page.on("pageerror",e=>errors.push(e.message));
const desktopRepresentatives=["pet-store","hospitality-booking","editorial-journal","live-concert","auto-showroom","finance-trust","saas-product","creative-studio"];
let routes=0;
for(const item of data){
 for(const suffix of ["/work","/work/1","/services"]){
  const res=await page.goto(root+item.demoPath+suffix,{waitUntil:"domcontentloaded",timeout:45000});
  assert.equal(res?.status(),200,item.slug+suffix);
  await page.locator(".experience-sub h1").first().waitFor({timeout:12000});
  assert.equal(await page.locator(".world-footer").count(),1,"footer "+item.slug+suffix);
  const sizes=await page.evaluate(()=>[document.documentElement.scrollWidth,document.documentElement.clientWidth]);
  assert.ok(sizes[0]<=sizes[1]+2,"desktop overflow "+item.slug+suffix+" "+sizes.join("/"));
  routes++;
 }
 console.log("ROUTES OK",item.slug);
}
for(const slug of desktopRepresentatives){
 await page.goto(root+"/template-demos/"+slug+"/work",{waitUntil:"load"});
 await page.screenshot({path:".qa/experience-v4/"+slug+"-work-desktop.png",animations:"disabled"});
}
await page.goto(root+"/template-demos/pet-store/work",{waitUntil:"load"});
await page.locator(".experience-chips button").nth(1).click();
assert.ok(await page.locator(".experience-catalog-card").count()>0);
await page.locator(".experience-catalog-card button").first().click();
await page.locator(".world-cart-drawer").waitFor({timeout:10000});
assert.match(await page.locator(".world-cart-drawer").innerText(),/1 sản phẩm/);
await page.locator(".world-drawer-head button").click();
await page.locator(".experience-catalog-card a").first().click();
await page.waitForURL("**/work/*",{timeout:10000});
await page.locator(".experience-detail-purchase select").selectOption("3");
await page.locator(".experience-detail-purchase button").click();
await page.locator(".world-cart-drawer").waitFor();
assert.match(await page.locator(".world-cart-drawer").innerText(),/4 sản phẩm/);
console.log("SHOP CART AND QUANTITY PASS");
await page.goto(root+"/template-demos/finance-trust/services",{waitUntil:"load"});
const disclosures=page.locator(".experience-service-panels details");
assert.equal(await disclosures.count(),3);
await disclosures.nth(1).locator("summary").click();
assert.ok(await disclosures.nth(1).evaluate(el=>el.open));
console.log("SERVICE DISCLOSURE PASS");
await page.goto(root+"/template-demos/team-intranet/work",{waitUntil:"load"});
await page.locator(".experience-platform-shell aside button").nth(2).click();
assert.equal(await page.locator(".experience-platform-shell aside button").nth(2).getAttribute("aria-pressed"),"true");
console.log("PRODUCT TAB PASS");
await page.setViewportSize({width:390,height:844});
for(const slug of desktopRepresentatives){
 await page.goto(root+"/template-demos/"+slug+"/work",{waitUntil:"load",timeout:45000});
 await page.waitForTimeout(300);
 const sizes=await page.evaluate(()=>[document.documentElement.scrollWidth,document.documentElement.clientWidth]);
 assert.ok(sizes[0]<=sizes[1]+2,"mobile overflow "+slug+" "+sizes.join("/"));
 await page.screenshot({path:".qa/experience-v4/"+slug+"-work-mobile.png",animations:"disabled"});
 console.log("MOBILE PASS",slug);
}
await page.setViewportSize({width:1440,height:900});
await page.goto(root+"/services/web-development/templates",{waitUntil:"load"});
await page.locator(".template-card-preview").first().click();
const frame=page.frameLocator(".template-revamp-dialog iframe");
await frame.locator(".world-desktop-nav a[href$='/work']").click();
await frame.locator(".experience-sub h1").waitFor({timeout:15000});
await frame.locator(".world-desktop-nav a[href$='/services']").click();
await frame.locator(".experience-service-panels").waitFor({timeout:15000});
await frame.locator(".world-footer").scrollIntoViewIfNeeded();
const start=await frame.locator("body").evaluate(()=>window.scrollY);
await page.waitForTimeout(8000);
const end=await frame.locator("body").evaluate(()=>window.scrollY);
assert.ok(start>500&&end>500,"popup scroll "+start+" => "+end);
assert.deepEqual(errors,[],errors.join("\n"));
console.log("V4 COMPLETE",routes,"routes, 8 desktop + 8 mobile screenshots, modal scroll",start,end,"jsErrors",errors.length);
await browser.close();
