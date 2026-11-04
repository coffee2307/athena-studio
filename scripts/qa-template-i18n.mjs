import {chromium} from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs";
const origin="http://127.0.0.1:3182";
const registry=JSON.parse(fs.readFileSync("data/templates.json","utf8"));
const omitted=new Set(["wellness-clinic","property-showcase","education-platform","pet-store","construction-firm"]);
const browser=await chromium.launch({channel:"chrome",headless:true,args:["--disable-dev-shm-usage"]});
let passed=0;const failures=[];
async function check(name,fn){
 try{await fn();passed++;console.log("PASS",name);}catch(e){failures.push({name,error:String(e).slice(0,420)});console.log("FAIL",name,String(e).slice(0,420));}
}
try{
 for(const width of [390,1440]){
  await check("Athena gallery language & covers "+width,async()=>{
   const page=await browser.newPage({viewport:{width,height:900},reducedMotion:"reduce"});
   try{
    const response=await page.goto(origin+"/services/web-development/templates",{waitUntil:"domcontentloaded",timeout:45000});
    assert.equal(response?.status(),200);
    await page.waitForTimeout(1200); // Allow React hydration before exercising the control.
    await page.locator(".athena-language-trigger").click();
    await page.locator('.athena-language-options button[lang="en"]').click();
    await page.waitForFunction(()=>document.documentElement.lang==="en");
    await page.waitForTimeout(150);
    const covers=await page.locator(".template-card-preview img").evaluateAll(xs=>xs.map(x=>x.getAttribute("src")??""));
    assert.equal(covers.length,registry.length);
    for(let index=0;index<registry.length;index++){
     const t=registry[index];
     assert(covers[index].includes(t.slug+(omitted.has(t.slug)?"":"-en")),t.slug+" cover did not update "+covers[index]);
    }
    if(width===1440){
     await page.locator(".template-card-preview").first().click();
     const iframe=page.locator(".template-demo-modal iframe");
     await iframe.waitFor({timeout:15000});
     assert((await iframe.getAttribute("src"))?.includes("lang=en"),"iframe locale");
     await page.locator(".template-demo-close").click();
    }
    await page.locator(".athena-language-trigger").click();
    await page.locator('.athena-language-options button[lang="vi"]').click();
    await page.waitForFunction(()=>document.documentElement.lang==="vi");
    const updated=await page.locator(".template-card-preview img").evaluateAll(xs=>xs.map(x=>x.getAttribute("src")??""));
    for(let index=0;index<registry.length;index++){
     const t=registry[index];
     assert(updated[index].includes(t.slug+(omitted.has(t.slug)?"":"-vi")),t.slug+" VI cover mismatch");
    }
    assert((await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth))<=3,"gallery overflow");
   }finally{await page.close();}
  });
 }
 for(const t of registry){
  await check("demo "+t.slug,async()=>{
   const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:"reduce"});
   const errors=[];page.on("pageerror",e=>errors.push(e.message));
   try{
    for(const lang of ["vi","en"]){
     const isStatic=t.slug==="digital-creators";
     const url=origin+(isStatic?"/immersive/digital-creators/index.html?lang=":"/template-demos/"+t.slug+"?embed=1&lang=")+lang;
     const r=await page.goto(url,{waitUntil:"domcontentloaded",timeout:45000});
     assert.equal(r?.status(),200);
     if(!omitted.has(t.slug)){
      await page.waitForFunction(({isStatic,lang})=>(isStatic?document.documentElement.dataset.templateLanguage:document.querySelector(".template-demo-main")?.dataset.templateLanguage)===lang,{isStatic,lang},{timeout:16000});
     }else{
      assert.equal(await page.locator(".template-demo-main[data-template-language]").count(),0,"excluded template touched");
     }
     await page.waitForTimeout(160);
     const state=await page.evaluate(()=>({
      title:document.querySelector("h1")?.innerText.slice(0,90)??"",
      overflow:document.documentElement.scrollWidth-innerWidth,
      styles:document.styleSheets.length
     }));
     assert(state.styles>=3,"no style sheets");
     assert(state.overflow<=4,"horizontal overflow "+lang+" "+state.overflow);
     assert(state.title.length>0,"missing title");
     if(t.slug==="digital-creators"&&lang==="en")assert(state.title.toLowerCase().includes("soar"),"digital hero EN");
     if(t.slug==="auto-showroom"&&lang==="vi")assert(state.title.includes("BỨT PHÁ"),"auto showroom VI");
     console.log("STATE",t.slug,lang,JSON.stringify(state));
    }
    if(!omitted.has(t.slug)&&t.slug!=="digital-creators"){
     const r=await page.goto(origin+"/template-demos/"+t.slug+"/contact?lang=en",{waitUntil:"domcontentloaded",timeout:45000});
     assert.equal(r?.status(),200);
     await page.waitForFunction(()=>document.querySelector(".template-demo-main")?.dataset.templateLanguage==="en",{},{timeout:16000});
    }
    assert.equal(errors.length,0,errors.join(" | "));
   }finally{await page.close();}
  });
 }
}finally{await browser.close();}
fs.mkdirSync(".qa/athena-locale-qa",{recursive:true});
fs.writeFileSync(".qa/athena-locale-qa/final.json",JSON.stringify({passed,failures},null,2));
console.log("RESULT",JSON.stringify({passed,failed:failures.length,failures}));
if(failures.length)process.exitCode=1;