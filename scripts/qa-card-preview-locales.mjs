import {chromium} from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs";
const origin=process.env.ATHENA_URL||"http://127.0.0.1:3182";
const browser=await chromium.launch({channel:"chrome",headless:true,args:["--disable-dev-shm-usage"]});
const excluded=new Set(["wellness-clinic","property-showcase","education-platform","pet-store","construction-firm"]);
const passes=[];
async function go(page,path){
 const res=await page.goto(origin+path,{waitUntil:"domcontentloaded",timeout:55000});
 assert.equal(res?.status(),200,path);
 await page.locator(".athena-language-trigger").first().waitFor({timeout:30000});
 await page.waitForTimeout(650);
}
async function switchLang(page,lang){
 const globe=page.locator(".athena-language-trigger:visible").first();
 await globe.click();
 await page.locator('.athena-language-options button[lang="'+lang+'"]').first().click();
 await page.waitForFunction(l=>document.documentElement.lang===l,lang,{timeout:12000});
 await page.waitForTimeout(100);
}
async function cardSources(page,selector,lang){
 const items=await page.locator(selector).evaluateAll((els)=>{
  return els.map((el)=>{
   const img=el.matches("img")?el:el.querySelector("img");
   const href=el.closest("a")?.getAttribute("href")||"";
   return {src:decodeURIComponent(img?.getAttribute("src")||""),href};
  });
 });
 assert(items.length>0,"no images "+selector);
 for(const it of items){
  const match=it.src.match(/template-previews\/([a-z0-9-]+?)(?:-(vi|en))?\.jpg/);
  assert(match, "missing preview asset "+it.src);
  const slug=match[1].replace(/-(vi|en)$/,"");
  const expected=excluded.has(slug)?"":("-"+lang);
  assert(it.src.includes("/"+slug+expected+".jpg"),"wrong locale "+slug+" "+lang+" "+it.src);
 }
 passes.push(selector+" "+lang+" ("+items.length+")");
 return items;
}
const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:"reduce"});
const errors=[];page.on("pageerror",e=>errors.push(e.message));
try{
 await go(page,"/");
 await switchLang(page,"en");
 await cardSources(page,".dna-hero-window-picture img","en");
 await cardSources(page,".dna-browser-preview img","en");
 await cardSources(page,".home-demo-picture img","en");
 const cards=await page.locator(".home-demo-picture").all();
 assert((await cards[0].getAttribute("href"))?.includes("lang=en"),"home demo link lacks language");
 await page.locator(".home-demo-filters button").nth(3).click();
 await cardSources(page,".home-demo-picture img","en");
 await page.locator(".home-demo-filters button").nth(1).click();
 await cardSources(page,".home-demo-picture img","en");
 await switchLang(page,"vi");
 await cardSources(page,".dna-hero-window-picture img","vi");
 await cardSources(page,".dna-browser-preview img","vi");
 await cardSources(page,".home-demo-picture img","vi");
 await go(page,"/services");
 await switchLang(page,"en");
 await cardSources(page,".dna-browser-preview img","en");
 await go(page,"/services/web-development/templates");
 await page.waitForFunction(()=>document.documentElement.lang==="en",{},{timeout:20000});
 await cardSources(page,".dna-library-frame-main img","en");
 await cardSources(page,".template-card-preview img","en");
 await switchLang(page,"vi");
 await cardSources(page,".dna-library-frame-main img","vi");
 await cardSources(page,".template-card-preview img","vi");
 assert((await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth))<=3,"horizontal overflow");
 assert.equal(errors.length,0,errors.join(" | "));
 console.log("CARD_LOCALE_QA_PASS",passes.length);
}catch(e){console.error("CARD_LOCALE_QA_FAIL",e);process.exitCode=1;}
finally{fs.mkdirSync(".qa/athena-card-i18n",{recursive:true});fs.writeFileSync(".qa/athena-card-i18n/report.json",JSON.stringify({passes,errors},null,2));await page.close();await browser.close();}
