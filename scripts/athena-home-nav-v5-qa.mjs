import {chromium} from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const base="http://127.0.0.1:3182";
await fs.mkdir(".qa/athena-home-nav-v5",{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe"});
const errors=[];
for(const width of [1440,1200,1024,768,390]){
 const page=await browser.newPage({viewport:{width,height:900}});
 page.on("pageerror",e=>errors.push(width+" "+e.message));
 const response=await page.goto(base,{waitUntil:"load",timeout:45000});
 assert.equal(response?.status(),200);
 await page.locator("#home-demo-title").waitFor({timeout:12000});
 assert.equal(await page.locator(".home-demo-card").count(),4);
 assert.equal(await page.locator(".home-demo-filters button").count(),5);
 assert.equal(await page.locator(".portfolio-featured").count(),0);
 const sizes=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
 assert.ok(sizes.scroll<=sizes.client+2,"homepage overflow "+width+" "+JSON.stringify(sizes));
 if(width>=981){
  const nav=await page.locator(".agency-desktop-nav").boundingBox();
  assert.ok(nav, "nav missing");
  const off=Math.abs(nav.x+nav.width/2-width/2);
  console.log("NAV_CENTER",width,off.toFixed(1)+"px");
  assert.ok(off<=2,"nav center drift "+off);
 }
 if(width===1440 || width===390){
  await page.locator(".home-demo-filters button").nth(2).click();
  assert.equal(await page.locator(".home-demo-card").count(),4);
  const link=await page.locator(".home-demo-card").first().locator(".home-demo-picture").getAttribute("href");
  assert.equal(link,"/template-demos/commerce-standard");
  await page.locator(".home-demo-filters button").first().click();
  const n=await page.locator(".home-demo-picture img").count();
  assert.equal(n,4);
  await page.waitForFunction(()=>Array.from(document.querySelectorAll(".home-demo-picture img")).every(img=>img instanceof HTMLImageElement && img.complete && img.naturalWidth>0),{timeout:12000});
  const images=await page.locator(".home-demo-picture img").evaluateAll(els=>els.map(e=>({complete:e.complete,naturalWidth:e.naturalWidth})));
  console.log("HOME_IMAGES",width,images);
  assert.ok(images.every(x=>x.complete&&x.naturalWidth>0),"broken preview images");
  await page.locator(".home-demo-section").screenshot({path:".qa/athena-home-nav-v5/home-"+width+".png",animations:"disabled"});
 }
 for(const route of ["/login","/signup"]){
  const res=await page.goto(base+route,{waitUntil:"load",timeout:45000});
  assert.equal(res?.status(),200,route);
  assert.equal(await page.locator(".auth-navigation").count(),1,"auth nav missing");
  assert.equal(await page.locator(".agency-header").count(),0,"duplicate marketing nav");
  await page.locator(".athena-auth-card").waitFor();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  assert.ok(overflow<=2,"auth horizontal overflow "+width+" "+route);
  if(width>=901){
   assert.equal(await page.locator(".auth-navigation-links a").count(),5);
   assert.ok(await page.locator(".auth-navigation-links").isVisible());
  }else{
   await page.locator(".auth-navigation-mobile summary").click();
   assert.ok(await page.locator(".auth-navigation-mobile nav").isVisible());
   assert.equal(await page.locator(".auth-navigation-mobile nav a").count(),6);
  }
  if(width===1440||width===390)await page.screenshot({path:".qa/athena-home-nav-v5/auth-"+route.slice(1)+"-"+width+".png",fullPage:false,animations:"disabled"});
  console.log("AUTH",route,width,"PASS");
 }
 await page.close();
}
assert.deepEqual(errors,[],errors.join("\n"));
console.log("QA COMPLETE all sizes, homepage filters, previews, auth nav, errors=",errors.length);
await browser.close();
