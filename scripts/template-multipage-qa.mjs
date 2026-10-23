import {chromium} from "@playwright/test";
import {strict as assert} from "node:assert";
import fs from "node:fs/promises";
const origin=process.env.ATHENA_TEST_ORIGIN||"http://127.0.0.1:3182";
const slugs=["creative-studio","modern-corporate","commerce-standard","fashion-archive","saas-product","campaign-landing","hospitality-booking","editorial-journal","architecture-studio","wellness-clinic","property-showcase","education-platform"];
const sections=["","work","services","about","contact","work/1","work/2","work/3"];
await fs.mkdir(".qa/template-worlds",{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.platform==="win32"?"C:/Program Files/Google/Chrome/Application/chrome.exe":undefined});
const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
const errors=[];
page.on("pageerror",e=>errors.push(e.message));
let paths=0;
for(const slug of slugs){
 for(const path of sections){
  const url=origin+"/template-demos/"+slug+(path?"/"+path:"");
  const res=await page.goto(url,{waitUntil:"domcontentloaded",timeout:35000});
  assert.equal(res?.status(),200,url);
  await page.locator(".world-site h1").first().waitFor({timeout:14000});
  assert.equal(await page.locator(".world-desktop-nav a").count(),5,url+" nav");
  assert.ok(await page.locator(".world-footer").count(),url+" footer");
  const dimensions=await page.evaluate(()=>({body:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth}));
  assert.ok(dimensions.body<=dimensions.viewport+2,url+" desktop overflow: "+JSON.stringify(dimensions));
  paths++;
 }
 await page.goto(origin+"/template-demos/"+slug,{waitUntil:"domcontentloaded"});
 await page.locator(".world-hero-visual img").waitFor({state:"visible"});
 await page.screenshot({path:".qa/template-worlds/"+slug+"-desktop.png",animations:"disabled"});
 console.log("WORLD PASS",slug,"sections="+sections.length);
}
for(const slug of slugs){
 await page.setViewportSize({width:390,height:844});
 await page.goto(origin+"/template-demos/"+slug,{waitUntil:"networkidle"});
 const dims=await page.evaluate(()=>({body:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth}));
 assert.ok(dims.body<=dims.viewport+2,slug+" mobile overflow: "+JSON.stringify(dims));
 const menu=page.getByRole("button",{name:"Mở menu"});
 await menu.click();
 await page.locator(".world-mobile-nav.is-open").waitFor({timeout:7000});
 assert.equal(await page.locator(".world-mobile-nav.is-open").count(),1,slug+" menu");
 await page.locator(".world-mobile-nav.is-open a").last().click();
 await page.waitForURL("**/template-demos/"+slug+"/contact");
 assert.ok(await page.locator(".world-contact-form").count());
 if(slug==="creative-studio"||slug==="fashion-archive"||slug==="education-platform"){
  await page.goto(origin+"/template-demos/"+slug,{waitUntil:"domcontentloaded"});
  await page.screenshot({path:".qa/template-worlds/"+slug+"-mobile.png",animations:"disabled"});
 }
 console.log("MOBILE PASS",slug);
}
await page.setViewportSize({width:1440,height:900});
await page.goto(origin+"/template-demos/commerce-standard/work",{waitUntil:"networkidle"});
await page.locator(".world-work-filter button").nth(1).click();
assert.ok((await page.locator(".world-work-card").count())>=1);
await page.locator(".world-work-card .world-text-link").first().click();
await page.locator(".world-cart-drawer").waitFor();
assert.match(await page.locator(".world-cart-drawer").innerText(),/1 sản phẩm/);
await page.getByRole("button",{name:"Xóa giỏ mô phỏng"}).click();
assert.match(await page.locator(".world-cart-drawer").innerText(),/trống/);
console.log("CART PASS");
await page.goto(origin+"/template-demos/hospitality-booking/contact",{waitUntil:"networkidle"});
await page.locator("input[name=name]").fill("Nguyen Van A");
await page.locator("input[name=email]").fill("demo@example.com");
await page.locator("select[id$='-interest']").selectOption({index:1});
await page.locator("input[name=date]").fill("2027-01-21");
await page.locator("textarea").fill("Tôi muốn đặt bàn để trải nghiệm dịch vụ vào một ngày thuận tiện.");
await page.locator(".world-contact-form button[type=submit]").click();
await page.locator(".world-form-success").waitFor();
console.log("CONTACT PASS");
await page.goto(origin+"/services/web-development/templates",{waitUntil:"networkidle"});
await page.locator(".template-card-preview").first().click();
const frame=page.frameLocator(".template-revamp-dialog iframe");
await frame.locator(".world-hero h1").waitFor();
await frame.locator(".world-desktop-nav").getByText("Dự án").click();
await frame.locator(".world-work-filter").waitFor();
console.log("GALLERY IFRAME PASS");
assert.equal(errors.length,0,errors.join("\n"));
console.log("TOTAL ROUTES PASSED",paths,"ERRORS",errors.length);
await browser.close();
