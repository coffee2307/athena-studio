import {chromium} from "@playwright/test";
import {readFileSync,mkdirSync} from "node:fs";
const templates=JSON.parse(readFileSync(new URL("../data/templates.json",import.meta.url),"utf8"));
const slugs=templates.map(item=>item.slug).filter(slug=>slug!=="digital-creators");
const origin=process.env.ATHENA_QA_ORIGIN||"http://127.0.0.1:3182";
const browser=await chromium.launch({headless:true,channel:process.platform==="win32"?"chrome":undefined});
const identities=new Set();
const failures=[];
mkdirSync(".qa/template-navigation",{recursive:true});
for(const slug of slugs){
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:"reduce"});
 const url=origin+"/template-demos/"+slug;
 try{
  const response=await page.goto(url,{waitUntil:"domcontentloaded",timeout:40000});
  if(response?.status()!==200)throw Error("HTTP "+response?.status());
  const root=page.locator(".world-site").first();
  await root.waitFor({timeout:10000});
  const variant=await root.getAttribute("data-nav-style");
  if(!variant||identities.has(variant))throw Error("navigation identity missing/duplicate: "+variant);
  identities.add(variant);
  const menu=page.locator(".world-menu-toggle");
  if(!await menu.isVisible())throw Error("menu opener not visible");
  if(await menu.locator(".world-toggle-glyph").count()!==1)throw Error("missing unique opener glyph");
  await menu.click();
  const nav=page.locator(".world-mobile-nav");
  await nav.waitFor({state:"visible",timeout:7000});
  if(await menu.getAttribute("aria-expanded")!=="true")throw Error("aria-expanded not set");
  if(await nav.locator(".world-mobile-nav-links>a").count()!==5)throw Error("not five routes");
  const m=await nav.boundingBox();
  if(!m||m.width<210||m.x+m.width<100||m.x>390||m.y>844)throw Error("panel outside screen: "+JSON.stringify(m));
  await page.screenshot({path:".qa/template-navigation/"+slug+"-mobile-open.png",animations:"disabled",timeout:25000});
  await page.keyboard.press("Escape");
  if(await menu.getAttribute("aria-expanded")!=="false")throw Error("Escape failed");
  if(await nav.getAttribute("aria-hidden")!=="true")throw Error("menu aria-hidden after Escape failed");
  await menu.click();
  await nav.locator('a[href$="/about"]').click({timeout:12000});
  await page.waitForURL("**/template-demos/"+slug+"/about",{timeout:12000});
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  if(overflow>2)throw Error("horizontal overflow "+overflow);
  console.log("PASS MOBILE",slug,variant);
 }catch(error){failures.push({slug,reason:String(error)});console.log("FAIL MOBILE",slug,String(error));}
 await page.close();
}
const desktop=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:"reduce"});
for(const slug of slugs){
 try{
  await desktop.goto(origin+"/template-demos/"+slug,{waitUntil:"domcontentloaded",timeout:40000});
  if(!await desktop.locator(".world-desktop-nav").isVisible())throw Error("desktop navigation hidden");
  if(await desktop.locator(".world-menu-toggle").isVisible())throw Error("mobile toggle present at desktop width");
  const overflow=await desktop.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  if(overflow>2)throw Error("desktop horizontal overflow "+overflow);
  console.log("PASS DESKTOP",slug);
 }catch(error){failures.push({slug,reason:String(error)});console.log("FAIL DESKTOP",slug,String(error));}
}
await desktop.close();
// The 21st site is a standalone Vite/React experience, not a WorldSite skin.
const digital=await browser.newPage({viewport:{width:390,height:844},reducedMotion:"reduce"});
try{
 const response=await digital.goto(origin+"/immersive/digital-creators/index.html#/",{waitUntil:"domcontentloaded",timeout:40000});
 if(response?.status()!==200)throw Error("Digital Creators HTTP "+response?.status());
 const toggle=digital.locator(".dc-constellation-toggle");
 await toggle.waitFor({state:"visible",timeout:10000});
 await toggle.click();
 const panel=digital.locator(".dc-constellation-nav");
 await panel.waitFor({state:"visible",timeout:6000});
 if(await panel.locator(".dc-orbit-card").count()!==3)throw Error("Creative atlas needs three orbit routes");
 await digital.screenshot({path:".qa/template-navigation/digital-creators-mobile-open.png",animations:"disabled"});
 await digital.keyboard.press("Escape");
 if(await toggle.getAttribute("aria-expanded")!=="false")throw Error("Digital Creators Escape failed");
 await toggle.click();
 await panel.locator(".dc-orbit-card").nth(1).click();
 await digital.waitForFunction(()=>location.hash==="#/gioi-thieu",null,{timeout:12000});
 if(!await digital.getByRole("heading",{level:1}).count())throw Error("Digital Creators route lacks heading");
 console.log("PASS MOBILE digital-creators digital-creators-native");
}catch(error){failures.push({slug:"digital-creators",reason:String(error)});console.log("FAIL DIGITAL",String(error));}
await digital.close();
await browser.close();
console.log("TEMPLATE_NAV_RESULT",JSON.stringify({unique:identities.size+1,checked:slugs.length+1,failures}));
if(failures.length||identities.size!==20)process.exitCode=1;
