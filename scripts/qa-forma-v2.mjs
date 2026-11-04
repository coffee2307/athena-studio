import {chromium} from "playwright";
import assert from "node:assert/strict";
import {mkdirSync} from "node:fs";
const origin=process.env.ATHENA_QA_ORIGIN||"http://127.0.0.1:3182";
const route="/template-demos/architecture-studio";
const browser=await chromium.launch({headless:true,channel:process.platform==="win32"?"chrome":undefined});
mkdirSync(".qa/forma-v2",{recursive:true});
let pass=0;
try{
 for(const width of [320,390,428,768,1440]){
  const page=await browser.newPage({viewport:{width,height:width<500?844:900},reducedMotion:"no-preference"});
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  try{
   const response=await page.goto(origin+route,{waitUntil:"load",timeout:45000});
   assert.equal(response?.status(),200);
   await page.evaluate(()=>document.fonts.ready);
   const scene=page.locator('[aria-label="The making of a plan"]');
   assert.equal(await scene.count(),1);
   const drawing=scene.locator('img[class*="planAsset"]');
   const photo=page.locator('img[class*="afterImage"]');
   const comparedDrawing=page.locator('[class*="beforeImage"] img');
   for(const [img,suffix,nw] of [[drawing,"forma-drawing-user.webp",1250],[photo,"forma-photo-user.webp",1200],[comparedDrawing,"forma-drawing-user.webp",1250]]){
    await img.scrollIntoViewIfNeeded();
    await img.evaluate(el=>el.decode());
    const info=await img.evaluate(el=>({src:el.getAttribute("src"),w:el.naturalWidth,h:el.naturalHeight}));
    assert(info.src.endsWith(suffix),"wrong user asset "+JSON.stringify(info));
    assert.equal(info.w,nw,"asset decode/dimension "+JSON.stringify(info));
   }
   const slider=page.getByRole("slider",{name:"Reveal architectural drawing versus interior photograph"});
   await slider.scrollIntoViewIfNeeded();
   await slider.fill("18");
   assert.equal(await slider.inputValue(),"18");
   await slider.fill("83");
   assert.equal(await slider.inputValue(),"83");
   await slider.press("ArrowLeft");
   assert.equal(await slider.inputValue(),"82");
   const clip=await page.locator('[class*="beforeImage"]').evaluate(el=>getComputedStyle(el).clipPath);
   assert(clip.includes("82%")||clip.includes("18%"),"clip mismatch "+clip);
   const progress=await scene.evaluate(el=>{
    const top=el.getBoundingClientRect().top+scrollY;
    const max=el.offsetHeight-innerHeight;
    scrollTo(0,top+Math.max(0,max*.65));
    return max;
   });
   await page.waitForTimeout(250);
   const reveal=await drawing.evaluate(el=>getComputedStyle(el).clipPath);
   assert(progress>0,"scene has no scrolling travel");
   assert(reveal.includes("inset("),"drawing reveal not active "+reveal);
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
   assert(overflow<=3,"horizontal overflow="+overflow);
   assert.equal(errors.length,0,"JS errors "+errors.join("; "));
   if(width===390||width===1440){
    await slider.scrollIntoViewIfNeeded();
    await page.screenshot({path:".qa/forma-v2/compare-"+width+".png",fullPage:false,animations:"disabled"});
    await scene.scrollIntoViewIfNeeded();
    await page.screenshot({path:".qa/forma-v2/plan-"+width+".png",fullPage:false,animations:"disabled"});
   }
   pass++;
   console.log("PASS_FORMA_V2",JSON.stringify({width,progress,clip,reveal,overflow}));
  }finally{await page.close();}
 }
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:"reduce"});
 await page.goto(origin+route,{waitUntil:"load",timeout:45000});
 const drawing=page.locator('img[class*="planAsset"]');
 await drawing.scrollIntoViewIfNeeded();
 const reduced=await drawing.evaluate(el=>getComputedStyle(el).clipPath);
 assert.equal(reduced,"inset(0px)","reduced-motion drawing not visible: "+reduced);
 console.log("PASS_REDUCED_MOTION",reduced);
 await page.close();
 console.log("FORMA_V2_QA_PASS",pass,"viewports + reduced motion");
}finally{await browser.close();}
