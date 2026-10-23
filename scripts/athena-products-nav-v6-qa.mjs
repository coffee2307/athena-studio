import assert from "node:assert/strict";
import fs from "node:fs/promises";
import {chromium} from "@playwright/test";
const base="http://127.0.0.1:3182";
const browser=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe"});
await fs.mkdir(".qa/athena-products-nav-v6",{recursive:true});
const errors=[];
for(const width of [1440,1200,1024,768,390,320]){
 const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
 page.on("pageerror",e=>errors.push(width+" "+e.message));
 for(const path of ["/","/products","/products/sitepulse","/login","/signup","/forgot-password"]){
  const res=await page.goto(base+path,{waitUntil:"load",timeout:45000});
  assert.equal(res?.status(),200,path+" status");
  await page.locator(".agency-header").waitFor({timeout:12000});
  assert.equal(await page.locator(".agency-header").count(),1,"shared header "+path);
  assert.equal(await page.locator(".auth-navigation").count(),0,"old header "+path);
  const over=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  assert.ok(over<=2,"horizontal overflow "+width+" "+path+" "+over);
  if(width>=981){
    const nav=await page.locator(".agency-desktop-nav").boundingBox();
    assert.ok(nav,"desktop nav "+path);
    const delta=Math.abs(nav.x+nav.width/2-width/2);
    assert.ok(delta<=2,"header drift "+width+" "+path+" "+delta);
  }
  if(path==="/products"){
    const intro=await page.locator(".athena-products-intro").boundingBox();
    const card=await page.locator(".athena-product-card").boundingBox();
    const child=await page.locator(".athena-product-copy").boundingBox();
    assert.ok(intro&&intro.height>270,"product hero not styled "+width);
    assert.ok(card&&card.height>450,"product card not styled "+width);
    assert.ok(child&&child.width<width,"product card full bleed "+width);
    await page.getByRole("link",{name:/Khám phá SitePulse/}).click();
    await page.waitForURL("**/products/sitepulse",{timeout:10000});
    assert.ok(await page.getByRole("heading",{level:1}).isVisible(),"SitePulse missing");
    await page.goBack({waitUntil:"load"});
    await page.locator(".athena-products-page").waitFor();
  }
  if(path==="/login"||path==="/signup"){
    assert.equal(await page.locator(".athena-auth-card").count(),1,"auth card "+path);
    if(width>=981){
      assert.ok(await page.locator(".agency-desktop-nav").isVisible(),"same desktop menu missing "+path);
    }else{
      await page.getByRole("button",{name:"Mở menu"}).click();
      await page.locator(".agency-mobile-panel.is-open").waitFor({timeout:7000});
      assert.ok(await page.locator(".agency-mobile-panel.is-open").isVisible(),"mobile nav not open "+path);
      await page.getByRole("button",{name:"Đóng menu",exact:true}).click();
    }
    const f=await page.locator(".athena-auth-card input").count();
    assert.ok(f>=2,"auth fields unavailable "+path);
  }
  if((path==="/products"||path==="/login"||path==="/signup")&&(width===1440||width===390)){
   await page.screenshot({path:".qa/athena-products-nav-v6/"+path.replaceAll("/","-").slice(1)+"-"+width+".png",animations:"disabled"});
  }
  console.log("OK",width,path);
 }
 await page.close();
}
assert.deepEqual(errors,[],errors.join("\n"));
console.log("PASS: 36 route-viewport combinations, consistent header, responsiveness, product layout, nav interactions. JS_ERRORS:",errors.length);
await browser.close();
