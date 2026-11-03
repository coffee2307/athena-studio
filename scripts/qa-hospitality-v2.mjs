import {chromium} from "@playwright/test";
import assert from "node:assert/strict";
import {mkdirSync} from "node:fs";
const origin=process.env.ATHENA_QA_ORIGIN||"http://127.0.0.1:3182";
const root=origin+"/template-demos/hospitality-booking";
const routes=["","work","work/1","services","about","contact","booking"];
const widths=[320,390,428,768,1440];
const dir=".qa/hospitality-v2";
mkdirSync(dir,{recursive:true});
const browser=await chromium.launch({channel:process.platform==="win32"?"chrome":undefined,headless:true});
const errors=[],results=[];
async function check(label,fn){
 try{await fn();results.push(label);console.log("PASS",label)}
 catch(error){errors.push({label,error:String(error)});console.error("FAIL",label,String(error))}
}
for(const width of widths){
 for(const route of routes){
  await check("route "+width+" /"+route,async()=>{
   const page=await browser.newPage({viewport:{width,height:width===1440?900:844},reducedMotion:"reduce"});
   const pageErrors=[];page.on("pageerror",e=>pageErrors.push(e.message));
   try{
    const r=await page.goto(root+(route?"/"+route:""),{waitUntil:"load",timeout:50000});
    assert.equal(r?.status(),200);
    await page.evaluate(()=>document.fonts.ready);
    const info=await page.evaluate(()=>({
     h1:document.querySelectorAll("main h1").length,
     overflow:document.documentElement.scrollWidth-innerWidth,
     broken:[...document.images].filter(i=>{const b=i.getBoundingClientRect();return b.top<innerHeight&&i.complete&&!i.naturalWidth}).map(i=>i.src),
     heading:document.querySelector("main h1")?.textContent
    }));
    assert.equal(info.h1,1,JSON.stringify(info));
    assert(info.overflow<=3,JSON.stringify(info));
    assert.deepEqual(info.broken,[]);
    assert.deepEqual(pageErrors,[]);
    if((width===390||width===1440)&&["","work","booking","contact"].includes(route)){
     await page.screenshot({path:dir+"/"+(route||"home")+"-"+width+".png",fullPage:true,animations:"disabled",timeout:30000});
    }
    if(width<=428&&route===""){
     const toggle=page.locator('button[aria-controls="hospitality-mobile-menu"]');
     await toggle.click();assert.equal(await toggle.getAttribute("aria-expanded"),"true");
     await page.keyboard.press("Escape");assert.equal(await toggle.getAttribute("aria-expanded"),"false");
    }
   }finally{await page.close();}
  });
 }
}
for(const width of [390,1440]){
 await check("interactive menu "+width,async()=>{
  const page=await browser.newPage({viewport:{width,height:900}});
  try{
   await page.goto(root+"/work",{waitUntil:"load"});
   const filters=page.getByRole("group",{name:"Lọc danh mục thực đơn"});
   await filters.getByRole("button",{name:"Món chay"}).click();
   assert.equal(await filters.getByRole("button",{name:"Món chay"}).getAttribute("aria-pressed"),"true");
   assert.equal(await page.locator("button[aria-pressed][class*='menuEntry']").count(),1);
   assert((await page.locator("#hospitality-content").innerText()).includes("Đĩa rau củ áp chảo"));
   await filters.getByRole("button",{name:"Tất cả"}).click();
   await page.getByRole("button",{name:/Đĩa mùa của bếp/}).first().click();
   assert((await page.locator("aside h2").first().innerText()).includes("Đĩa mùa"));
  }finally{await page.close();}
 });
 await check("booking draft "+width,async()=>{
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:"reduce"});
  try{
   await page.goto(root+"/booking",{waitUntil:"load"});
   const date=page.locator('input[type="date"]');
   await date.waitFor({state:"visible"});
   await page.getByRole("button",{name:"Tăng số khách"}).click();
   assert.equal(await page.locator("output").innerText(),"03");
   await page.getByRole("group",{name:"Chọn giờ đến"}).getByRole("button",{name:"18:30"}).click();
   assert.equal(await page.getByRole("button",{name:"18:30"}).getAttribute("aria-pressed"),"true");
   await page.getByPlaceholder("Tên của bạn").fill("Người thử nghiệm");
   await page.getByPlaceholder("you@example.com").fill("test@example.com");
   await page.getByRole("button",{name:/TẠO BẢN NHÁP YÊU CẦU/}).click();
   await page.getByText("ĐÃ TẠO BẢN NHÁP — CHƯA XÁC NHẬN").waitFor();
   assert((await page.locator("#hospitality-content").innerText()).includes("Chưa gửi yêu cầu"));
   const ta=page.getByRole("textbox",{name:"Nội dung bản nháp yêu cầu đặt bàn"});
   assert((await ta.inputValue()).includes("3"));
  }finally{await page.close();}
 });
 await check("hero selector "+width,async()=>{
  const page=await browser.newPage({viewport:{width,height:900}});
  try{
   await page.goto(root,{waitUntil:"load"});
   const img=page.locator("main figure img").first();
   const before=await img.getAttribute("src");
   await page.getByRole("button",{name:"Hình tiếp theo"}).click();
   const after=await img.getAttribute("src");
   assert.notEqual(before,after);
  }finally{await page.close();}
 });
}
await check("FAQ expansion",async()=>{
 const page=await browser.newPage({viewport:{width:390,height:844}});
 try{
  await page.goto(root+"/contact");
  const details=page.locator("details").first();
  await details.locator("summary").click();
  assert.equal(await details.getAttribute("open"),"");
 }finally{await page.close();}
});
await browser.close();
console.log("HOSPITALITY_V2_QA",JSON.stringify({passed:results.length,failed:errors.length,errors}));
if(errors.length)process.exitCode=1;
