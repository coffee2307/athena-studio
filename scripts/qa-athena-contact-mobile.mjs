import {chromium} from "playwright";
import assert from "node:assert/strict";
import {mkdirSync} from "node:fs";

const origin=process.env.ATHENA_QA_ORIGIN||"http://127.0.0.1:3182";
const mobileWidths=[320,390,428];
const browser=await chromium.launch({channel:process.platform==="win32"?"chrome":undefined,headless:true});
const results=[];
mkdirSync(".qa/contact-mobile",{recursive:true});
try{
 for(const width of [...mobileWidths,768,1440]){
  const page=await browser.newPage({viewport:{width,height:width<=428?844:900},reducedMotion:"reduce"});
  const pageErrors=[];
  page.on("pageerror",error=>pageErrors.push(error.message));
  try{
   const response=await page.goto(origin+"/contact?service=web-development&template=hospitality-booking",{waitUntil:"load",timeout:45000});
   assert.equal(response?.status(),200);
   await page.evaluate(()=>document.fonts.ready);
   if(width<=767)await page.locator(".athena-contact-page .contact-box form.inquiry-form input[name=name]").first().waitFor({state:"visible",timeout:12000});
   const info=await page.evaluate(()=>{
    const box=(selector)=>{
     const el=document.querySelector(selector);
     if(!el)return null;
     const r=el.getBoundingClientRect(),s=getComputedStyle(el);
     return{top:Math.round(r.top),height:Math.round(r.height),width:Math.round(r.width),display:s.display};
    };
    return{
     hero:box(".athena-contact-page>.page-hero"),
     mobile:box(".athena-mobile-contact-entry"),
     sidebar:box(".athena-contact-sidebar"),
     form:box(".athena-contact-form-column .contact-box"),
     firstInput:box(".athena-contact-page .contact-box form.inquiry-form input[name=name]"),
     quick:[...document.querySelectorAll(".athena-mobile-contact-channels a")].map(a=>({text:a.textContent?.trim(),href:a.getAttribute("href")})),
     overflow:document.documentElement.scrollWidth-innerWidth,
     details:document.querySelector(".athena-contact-page details.athena-email-brief-details")?.open??null
    };
   });
   assert(info.overflow<=3,"horizontal overflow: "+JSON.stringify(info));
   assert.equal(pageErrors.length,0,"JavaScript errors: "+pageErrors.join(";"));
   if(width<=767){
    assert.equal(info.hero?.display,"none");
    assert.equal(info.sidebar?.display,"none");
    assert(info.mobile&&info.mobile.display!=="none"&&info.mobile.top<140);
    assert(info.form&&info.form.top<450);
    assert(info.firstInput&&info.firstInput.top<760,"form is buried: "+JSON.stringify(info));
    assert(info.quick.length===3);
    assert(info.quick[0].href?.startsWith("https://zalo.me/"));
    assert(info.quick[1].href?.startsWith("https://wa.me/"));
    assert(info.quick[2].href?.startsWith("tel:+"));
    assert.equal(info.details,true,"email draft form must be expanded on mobile");
    assert.equal(await page.locator(".athena-contact-page .form-offline").isVisible(),false);
    assert.equal(await page.locator(".agency-footer-cta").isVisible(),false);
    assert.equal(await page.locator(".athena-contact-page .athena-mobile-contact-channels img").count(),2);
    const brands=await page.locator(".athena-contact-page .athena-mobile-contact-channels img").evaluateAll(els=>els.map(el=>el.complete&&el.naturalWidth>0));
    assert(brands.every(Boolean),"missing messenger icon");
    await page.screenshot({path:".qa/contact-mobile/contact-"+width+".png",fullPage:true,animations:"disabled"});
   }else{
    assert(info.hero&&info.hero.height>100&&info.hero.display!=="none");
    assert(info.sidebar&&info.sidebar.display!=="none");
    assert.equal(info.mobile?.display,"none");
   }
   console.log("PASS_CONTACT",width,JSON.stringify(info));
   results.push(width);
  }finally{await page.close();}
 }
 const formPage=await browser.newPage({viewport:{width:390,height:844},reducedMotion:"reduce"});
 try{
  await formPage.goto(origin+"/contact",{waitUntil:"load"});
  const form=formPage.locator(".athena-contact-page .athena-email-brief-form");
  await form.locator('input[name="name"]').fill("Người kiểm thử");
  await form.locator('input[name="email"]').fill("example@example.com");
  await form.locator('select[name="service"]').selectOption("web-development");
  await form.locator('textarea[name="message"]').fill("Tôi muốn hỏi về thiết kế website giới thiệu doanh nghiệp mới.");
  await form.locator('button[type="submit"]').click();
  await formPage.locator(".athena-email-brief-result").waitFor({state:"visible"});
  assert((await formPage.locator(".athena-email-brief-result").innerText()).includes("chưa gửi"));
  const href=await formPage.locator(".athena-email-brief-actions a").first().getAttribute("href");
  assert(href?.startsWith("mailto:"),"Email draft must not imply a server-side submission");
  console.log("PASS_CONTACT_DRAFT",href?.slice(0,7));
 }finally{await formPage.close();}
}finally{await browser.close();}
console.log("ATHENA_CONTACT_MOBILE_QA",JSON.stringify({passed:results.length,failed:0}));
