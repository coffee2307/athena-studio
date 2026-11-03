import {chromium} from "@playwright/test";
import assert from "node:assert/strict";
import {mkdirSync,writeFileSync} from "node:fs";
import {execSync} from "node:child_process";

const origin=process.env.ATHENA_QA_ORIGIN||"http://127.0.0.1:3182";
const widths=[[320,680],[390,760],[390,844],[428,926],[768,1024],[1440,900]];
const brands=["campaign-landing","saas-product"];
const routes=["","work","services","about","contact","work/1","work/2","work/3"];
const out=".qa/campaign-luma-v3";
mkdirSync(out,{recursive:true});
const source=execSync("git rev-parse --short HEAD",{encoding:"utf8"}).trim();
const browser=await chromium.launch({channel:process.platform==="win32"?"chrome":undefined,headless:true});
const results=[],issues=[];
async function verify(label,fn){try{await fn();results.push(label);console.log("PASS",label)}catch(e){const error=String(e);issues.push({label,error});console.error("FAIL",label,error)}}
for(const slug of brands){
 for(const [w,h] of widths){
  await verify(slug+" layout "+w+"x"+h,async()=>{
   const page=await browser.newPage({viewport:{width:w,height:h},reducedMotion:"reduce"});
   const errors=[];page.on("pageerror",e=>errors.push(e.message));
   try{
    const r=await page.goto(origin+"/template-demos/"+slug,{waitUntil:"load",timeout:45000});
    assert.equal(r.status(),200);
    await page.evaluate(()=>document.fonts.ready);
    const a=await page.evaluate(()=>{
     const h=document.querySelector("main h1"),rect=h?.getBoundingClientRect();
     const broken=[...document.images].filter(img=>{const r=img.getBoundingClientRect();return r.top<innerHeight&&r.bottom>0&&img.complete&&!img.naturalWidth});
     const focusable=[...document.querySelectorAll("main a,main button")].filter(x=>x.getBoundingClientRect().width>0).length;
     return {overflow:document.documentElement.scrollWidth-innerWidth,h1:!!h,headingRect:rect?{left:rect.left,right:rect.right}:null,broken:broken.map(i=>i.src),focusable};
    });
    assert(a.overflow<=3,JSON.stringify(a));
    assert(a.h1&&a.headingRect?.left>=-3&&a.headingRect?.right<=w+3,JSON.stringify(a));
    assert.deepEqual(a.broken,[]);
    assert(a.focusable>=4,"Missing interactions");
    assert.deepEqual(errors,[]);
    if(w===390||w===1440){
     await page.screenshot({path:out+"/"+slug+"-"+w+"-home.png",fullPage:true,animations:"disabled",timeout:30000});
     await page.evaluate(()=>scrollTo(0,Math.floor(document.documentElement.scrollHeight/2)));
     await page.screenshot({path:out+"/"+slug+"-"+w+"-mid.png",animations:"disabled"});
     await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));
     await page.screenshot({path:out+"/"+slug+"-"+w+"-footer.png",animations:"disabled"});
    }
    if(w<=428){
     const toggle=page.locator(slug==="campaign-landing" ? 'button[aria-controls="mo-mobile-navigation"]' : 'button[aria-controls="luma-navigation"]');
     await toggle.click();assert.equal(await toggle.getAttribute("aria-expanded"),"true");
     const menu=page.locator(slug==="campaign-landing"?"#mo-mobile-navigation":"#luma-navigation");
     assert.equal(await menu.getAttribute("data-open"),"true");
     await page.keyboard.press("Escape");assert.equal(await toggle.getAttribute("aria-expanded"),"false");
    }
   }finally{await page.close();}
  });
 }
 for(const route of routes){
  for(const w of [390,1440]){
   await verify(slug+" route /"+route+" "+w,async()=>{
    const page=await browser.newPage({viewport:{width:w,height:844},reducedMotion:"reduce"});
    const errs=[];page.on("pageerror",e=>errs.push(e.message));
    try{
     const response=await page.goto(origin+"/template-demos/"+slug+(route?"/"+route:""),{waitUntil:"load",timeout:45000});
     assert.equal(response.status(),200);
     const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,h1:document.querySelectorAll("main h1").length}));
     assert(state.overflow<=3,JSON.stringify(state));assert.equal(state.h1,1);
     assert.deepEqual(errs,[]);
     if(w===390&&["services","contact"].includes(route))await page.screenshot({path:out+"/"+slug+"-"+route+"-"+w+".png",fullPage:true,animations:"disabled"});
    }finally{await page.close();}
   });
  }
 }
}
await verify("MỞ chapter changes image and detail destination",async()=>{
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:"reduce"});
 try{
  await page.goto(origin+"/template-demos/campaign-landing",{waitUntil:"load"});
  const btns=page.getByRole("group",{name:"Chọn chương trình"}).getByRole("button");
  assert.equal(await btns.count(),3);
  await btns.nth(1).click();
  assert.equal(await btns.nth(1).getAttribute("aria-pressed"),"true");
  assert((await page.locator('a[href$="/work/2"]').count())>=1);
  const img=page.locator("figure").first().locator("img");
  assert((await img.getAttribute("alt")).includes("THỊ GIÁC"));
 }finally{await page.close();}
});
await verify("LUMA creates task, advances state, filters and recalculates progress",async()=>{
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:"reduce"});
 try{
  await page.goto(origin+"/template-demos/saas-product",{waitUntil:"load"});
  const w=page.locator("[data-luma-workspace]");
  const progress=()=>w.getByRole("tab",{name:/Tiến độ/});
  await progress().click();
  assert.equal(await w.getByRole("progressbar").getAttribute("aria-valuenow"),"20");
  await w.getByRole("tab",{name:/Bảng việc/}).click();
  await w.getByRole("button",{name:/Thêm việc/}).click();
  await w.locator("#luma-new-task").fill("Viết mô tả tính năng mới");
  await w.getByRole("button",{name:"Thêm vào bảng"}).click();
  assert((await w.getByText("Viết mô tả tính năng mới").count())>=1);
  const next=w.getByRole("button",{name:"Chuyển trạng thái: Viết mô tả tính năng mới"});
  await next.click();await next.click();
  await progress().click();
  assert.equal(await w.getByRole("progressbar").getAttribute("aria-valuenow"),"33");
  await w.getByRole("tab",{name:/Bảng việc/}).click();
  await w.getByRole("group",{name:"Lọc trạng thái"}).getByRole("button",{name:"Hoàn tất"}).click();
  assert.equal(await w.getByRole("group",{name:"Lọc trạng thái"}).getByRole("button",{name:"Hoàn tất"}).getAttribute("aria-pressed"),"true");
  await w.getByRole("button",{name:"Đặt lại ↻"}).click();
  await progress().click();
  assert.equal(await w.getByRole("progressbar").getAttribute("aria-valuenow"),"20");
 }finally{await page.close();}
});
await verify("Both contact pages use honest draft-only flow",async()=>{
 for(const slug of brands){
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:"reduce"});
  try{
   await page.goto(origin+"/template-demos/"+slug+"/contact",{waitUntil:"load"});
   assert.equal(await page.locator("form").count(),1);
   assert.equal(await page.locator('a[href^="mailto:hello@example.com"]').count(),0);
   const text=(await page.locator("main").last().innerText()).toLocaleLowerCase("vi");
   assert(text.includes("không nhận hoặc lưu")||text.includes("không gửi hoặc lưu"),"Draft-only disclosure missing");
  }finally{await page.close();}
 }
});
await browser.close();
const report={source,origin,viewportClasses:"LAB_CHROME_DESKTOP_AND_MOBILE_EMULATED",passed:results.length,failed:issues.length,results,issues,realSafari:"UNVERIFIED"};
writeFileSync(out+"/report.json",JSON.stringify(report,null,2)+"\n");
console.log("CAMPAIGN_LUMA_V3_SUMMARY",JSON.stringify({passed:results.length,failed:issues.length,source}));
if(issues.length)process.exitCode=1;
