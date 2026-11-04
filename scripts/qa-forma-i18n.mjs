import {chromium} from "playwright";
import assert from "node:assert/strict";
import {mkdirSync} from "node:fs";
const base=(process.env.ATHENA_QA_ORIGIN||"http://127.0.0.1:3182")+"/template-demos/architecture-studio";
const browser=await chromium.launch({headless:true,channel:process.platform==="win32"?"chrome":undefined});
mkdirSync(".qa/forma-i18n",{recursive:true});
let passes=0;
try{
 for(const width of [320,390,428,768,1440]){
  const p=await browser.newPage({viewport:{width,height:width<500?844:900},reducedMotion:"reduce"});
  const errors=[];p.on("pageerror",e=>errors.push(e.message));
  try{
   assert.equal((await p.goto(base,{waitUntil:"load",timeout:45000}))?.status(),200);
   const root=p.locator("#architecture-studio-top");
   const vi=root.getByRole("button",{name:"Tiếng Việt"}),en=root.getByRole("button",{name:"English"});
   assert.equal(await root.getAttribute("lang"),"en");
   await vi.click();
   assert.equal(await root.getAttribute("lang"),"vi");
   assert.equal(await vi.getAttribute("aria-pressed"),"true");
   assert((await root.locator("main h1").first().innerText()).includes("Không gian"));
   assert((await root.locator("main").innerText()).includes("Công trình tuyển chọn"));
   assert.equal(await p.evaluate(()=>localStorage.getItem("athena-forma-language")),"vi");
   await p.reload({waitUntil:"load"});
   await p.waitForFunction(()=>document.querySelector("#architecture-studio-top")?.getAttribute("lang")==="vi");
   if(width<500){
    const menu=root.locator("header button[aria-expanded]");
    await menu.click();assert.equal(await menu.getAttribute("aria-expanded"),"true");
    assert((await root.locator("aside a").first().innerText()).includes("Nhà ở"));
    await p.keyboard.press("Escape");assert.equal(await menu.getAttribute("aria-expanded"),"false");
   }
   await en.click();
   assert((await root.locator("main h1").first().innerText()).includes("Space"));
   const overflow=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
   assert(overflow<=3,"overflow "+overflow);
   assert.equal(errors.length,0,errors.join(";"));
   if(width===390||width===1440){await vi.click();await p.screenshot({path:".qa/forma-i18n/home-vi-"+width+".png",animations:"disabled"});}
   console.log("PASS_FORMA_LOCALE_WIDTH",width,overflow);passes++;
  }finally{await p.close();}
 }
 const p=await browser.newPage({viewport:{width:390,height:844}});
 try{
  await p.goto(base,{waitUntil:"load"});
  await p.getByRole("button",{name:"Tiếng Việt"}).click();
  const routes=[
   ["work","Nhà ở / Nghiên cứu vật liệu"],
   ["work/1","Nhà ở"],
   ["services","Không gian công cộng"],
   ["about","Không gian định hình tư duy"],
   ["contact","Cùng trao đổi về không gian"]
  ];
  for(const [route,expected] of routes){
   assert.equal((await p.goto(base+"/"+route,{waitUntil:"load"}))?.status(),200);
   await p.waitForFunction(()=>document.querySelector("#architecture-studio-top")?.getAttribute("lang")==="vi");
   assert((await p.locator("#architecture-studio-top main").innerText()).includes(expected),"route "+route);
   console.log("PASS_FORMA_LOCALE_ROUTE",route);
   passes++;
  }
  await p.goto(base+"/contact",{waitUntil:"load"});
  await p.waitForFunction(()=>document.querySelector("#architecture-studio-top")?.getAttribute("lang")==="vi");
  assert.equal(await p.locator("#architecture-studio-top form button").innerText(),"MỞ ỨNG DỤNG EMAIL →");
  await p.getByRole("button",{name:"English"}).click();
  assert((await p.locator("main h1").innerText()).includes("Let’s talk"));
  console.log("PASS_FORMA_LOCALE_FORM");passes++;
 }finally{await p.close();}
 const interactive=await browser.newPage({viewport:{width:1440,height:900}});
 try{
  await interactive.goto(base,{waitUntil:"load"});
  await interactive.getByRole("button",{name:"Tiếng Việt"}).click();
  const slider=interactive.locator('[class*="compareRange"]');
  assert.equal(await slider.getAttribute("aria-label"),"So sánh bản vẽ kiến trúc và ảnh nội thất");
  await slider.scrollIntoViewIfNeeded();await slider.fill("78");assert.equal(await slider.inputValue(),"78");
  await interactive.getByRole("button",{name:"English"}).click();
  assert.equal(await slider.inputValue(),"78");
  const group=interactive.getByRole("group",{name:"Explore architectural materials"});
  await group.getByRole("button",{name:/M03 Timber/}).click();
  assert.equal(await group.getByRole("button",{name:/M03 Timber/}).getAttribute("aria-pressed"),"true");
  await interactive.getByRole("button",{name:"Tiếng Việt"}).click();
  assert((await interactive.locator('[class*="materialVisual"] figcaption').innerText()).includes("Gỗ"));
  await interactive.getByRole("button",{name:"Ảnh tiếp theo"}).click();
  assert((await interactive.locator('[class*="galleryLayout"] figcaption').innerText()).includes("02"));
  console.log("PASS_FORMA_LOCALE_INTERACTIVE");passes++;
 }finally{await interactive.close();}
}finally{await browser.close();}
console.log("FORMA_I18N_QA_PASS",passes);
