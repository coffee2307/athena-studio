import {chromium} from "playwright";
import assert from "node:assert/strict";
import {mkdirSync} from "node:fs";
const base=process.env.ATHENA_QA_ORIGIN||"http://127.0.0.1:3182";
const url=base+"/template-demos/architecture-studio";
mkdirSync(".qa/architecture-datum-v1",{recursive:true});
const browser=await chromium.launch({headless:true,channel:process.platform==="win32"?"chrome":undefined});
const reports=[];
try{
 for(const width of [320,390,428,768,1024,1440]){
  const page=await browser.newPage({viewport:{width,height:width<=428?844:900},reducedMotion:"no-preference"});
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  try{
   const response=await page.goto(url,{waitUntil:"load",timeout:45000});
   assert.equal(response?.status(),200);
   await page.evaluate(()=>document.fonts.ready);
   await page.waitForTimeout(250);
   let measures=await page.evaluate(()=>({
    h1:document.querySelector("[data-forma-home] h1")?.textContent,
    scroll:document.documentElement.scrollWidth-innerWidth,
    storySections:document.querySelectorAll("[data-story-chapter]").length,
    planSections:document.querySelectorAll("[data-plan-chapter]").length,
    sticky:window.getComputedStyle(document.querySelector('[class*="storyVisual"]')).position,
    images:[...document.querySelectorAll("[data-forma-home] img")].filter(img=>{const r=img.getBoundingClientRect();return r.top<innerHeight&&img.complete&&!img.naturalWidth}).length
   }));
   assert(measures.h1?.includes("Space"));
   assert(measures.scroll<=3,"overflow "+JSON.stringify(measures));
   assert.equal(measures.storySections,4);
   assert.equal(measures.planSections,3);
   assert.equal(measures.sticky,"sticky");
   assert.equal(measures.images,0);
   if(width===390||width===1440)await page.screenshot({path:".qa/architecture-datum-v1/hero-"+width+".png",fullPage:false,animations:"disabled"});
   const chapters=page.locator("[data-story-chapter]");
   await chapters.nth(2).scrollIntoViewIfNeeded();
   await page.waitForTimeout(650);
   const story=await page.locator('[class*="storyPicture"] img').first().getAttribute("src");
   assert(story?.includes("image-3.jpg"),"chapter image mismatch "+story);
   if(width===390||width===1440)await page.screenshot({path:".qa/architecture-datum-v1/story-"+width+".png",fullPage:false,animations:"disabled"});
   await page.locator("[data-plan-chapter]").nth(2).scrollIntoViewIfNeeded();
   await page.waitForTimeout(700);
   assert.equal(await page.locator('[class*="planDrawing"]').getAttribute("data-plan"),"2");
   if(width===390||width===1440)await page.screenshot({path:".qa/architecture-datum-v1/plan-"+width+".png",fullPage:false,animations:"disabled"});
   const slider=page.getByRole("slider",{name:"Reveal architectural drawing versus interior photograph"});
   await slider.scrollIntoViewIfNeeded();
   await slider.fill("73");
   assert.equal(await slider.inputValue(),"73");
   if(width===390||width===1440)await page.screenshot({path:".qa/architecture-datum-v1/compare-"+width+".png",fullPage:false,animations:"disabled"});
   const material=page.getByRole("group",{name:"Explore architectural materials"});
   await material.getByRole("button",{name:/M03.*Timber/i}).click();
   assert.equal(await material.getByRole("button",{name:/M03.*Timber/i}).getAttribute("aria-pressed"),"true");
   assert((await page.locator('[class*="materialVisual"] figcaption').innerText()).includes("Timber"));
   await page.getByRole("button",{name:"Next archive image"}).click();
   assert((await page.locator('[class*="galleryLayout"] figcaption').innerText()).includes("02"));
   if(width<=768){const toggle=page.locator("#architecture-studio-top header button[aria-expanded]");await toggle.click();assert.equal(await toggle.getAttribute("aria-expanded"),"true");await page.keyboard.press("Escape");assert.equal(await toggle.getAttribute("aria-expanded"),"false");}
   assert.deepEqual(errors,[],"page JS errors");
   reports.push({width,status:"PASS",story,overflow:measures.scroll});
   console.log("PASS_FORMA",JSON.stringify(reports.at(-1)));
  }finally{await page.close();}
 }
 const contact=await browser.newPage({viewport:{width:390,height:844}});
 await contact.goto(url+"/contact",{waitUntil:"load"});
 const form=contact.locator("form");
 assert.equal(await form.count(),1);
 assert(!((await form.evaluate(el=>el.outerHTML)).includes("mailto:hello@example.com")),"fictional address");
 await contact.close();
 console.log("FORMA_DATUM_QA",JSON.stringify({passed:reports.length,failed:0}));
}finally{await browser.close();}
