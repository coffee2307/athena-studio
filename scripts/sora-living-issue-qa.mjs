import {chromium} from "@playwright/test";
import {mkdirSync,writeFileSync} from "node:fs";
const root=process.env.ATHENA_QA_ORIGIN||"http://127.0.0.1:3182";
const base=root+"/template-demos/creative-studio";
const dir=".qa/sora-living-issue";mkdirSync(dir,{recursive:true});
const browser=await chromium.launch({headless:true,channel:process.platform==="win32"?"chrome":undefined});
const widths=[{w:320,h:680},{w:390,h:760},{w:428,h:926},{w:768,h:1024},{w:1440,h:900}];
const passes=[],failures=[];
const check=(condition,msg)=>{if(!condition)throw Error(msg)};
for(const {w,h} of widths){
 for(const route of ["","contact","work","services","about","work/1"]){
  const page=await browser.newPage({viewport:{width:w,height:h},reducedMotion:"no-preference"});
  const issues=[];page.on("pageerror",e=>issues.push(e.message));
  try{
   const response=await page.goto(base+(route?"/"+route:""),{waitUntil:"load",timeout:45000});
   check(response?.status()===200,"HTTP "+response?.status());
   await page.evaluate(()=>document.fonts.ready);
   const metrics=await page.evaluate(()=>{
    const textRects=e=>{const range=document.createRange();range.selectNodeContents(e);return [...range.getClientRects()].map(r=>({left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}));};
    const rect=e=>e?.getBoundingClientRect();
    const overlap=(a,b)=>a&&b?Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)):0;
    const result={overflow:document.documentElement.scrollWidth-innerWidth,violations:[],h1:document.querySelector("main h1")?.textContent||""};
    const body=document.querySelector("section[aria-label='Trang bìa tạp chí sáng tạo SORA']");
    if(body){
     const heading=body.querySelector("h1"),art=body.querySelector("figure"),copy=body.querySelector("p:not(.kicker)");
     if(heading&&art)for(const range of textRects(heading))if(overlap(range,rect(art))>24)result.violations.push("Hero heading/photo intersect");
     if(copy&&art)for(const range of textRects(copy))if(overlap(range,rect(art))>24)result.violations.push("Hero paragraph/photo intersect");
    }
    const form=document.querySelector("form[aria-label='Soạn thư gửi SORA']");
    if(form){
     const options=[...form.querySelectorAll("input[type=radio]")];
     if(options.length!==3)result.violations.push("Expected 3 native radio choices");
     const preview=form.querySelector('[class*="_letterPreview__"]');
     if(!preview)result.violations.push("No live letter preview");
     const label=form.querySelector("legend"),first=form.querySelector("label");
     if(label&&first&&overlap(rect(label),rect(first))>25)result.violations.push("Form heading overlaps topic choice");
    }
    return result;
   });
   check(metrics.h1.length>3,"H1 absent");
   check(metrics.overflow<=3,"Horizontal overflow "+metrics.overflow);
   check(metrics.violations.length===0,metrics.violations.join("; "));
   if(!route){
    await page.evaluate(()=>scrollTo(0,0));
    await page.screenshot({path:dir+"/firstfold-"+w+".png",animations:"disabled",timeout:20000});
    const cover=page.locator("section[aria-label='Trang bìa tạp chí sáng tạo SORA']");
    check(await cover.count()===1,"Cover missing");
    const image=cover.locator("figure img").first();
    const before=await image.getAttribute("src");
    await page.getByRole("button",{name:"Xem 02 / KHÔNG GIAN"}).click();
    check(await page.getByRole("button",{name:"Xem 02 / KHÔNG GIAN"}).getAttribute("aria-pressed")==="true","Cover selector not selected");
    const after=await image.getAttribute("src");
    check(before!==after,"Cover image did not update");
    await page.getByRole("button",{name:"Trang bìa tiếp theo"}).click();
    check(await page.getByRole("button",{name:"Xem 03 / TRẢI NGHIỆM"}).getAttribute("aria-pressed")==="true","Cover arrow not working");
    if(w===1440){
     const art=page.locator('[class*="_livingArtboard__"]');
     const box=await art.boundingBox();check(!!box,"Cover artboard missing");
     const x=box.x+box.width*.5,y=box.y+box.height*.5;
     await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x-85,y,{steps:6});await page.mouse.up();
     check(await page.getByRole("button",{name:"Xem 01 / NHẬN DIỆN"}).getAttribute("aria-pressed")==="true","Drag gesture did not change page");
    }
    await page.screenshot({path:dir+"/home-"+w+".png",animations:"disabled",timeout:20000});
    await page.getByRole("link",{name:/Lật sang trang sau/}).click();
    const target=await page.evaluate(()=>location.hash);
    check(target==="#sora-manifesto","Scroll narrative anchor incorrect");
   }
   if(route==="contact"){
    await page.evaluate(()=>scrollTo(0,0));
    await page.screenshot({path:dir+"/contact-firstfold-"+w+".png",animations:"disabled",timeout:20000});
    if(w<=428){
     const spacing=await page.evaluate(()=>{
      const section=document.querySelector('[class*="_letterForm__"]');
      const form=section?.querySelector("form");
      const intro=section?.querySelector('[class*="_routeIntro__"]');
      if(!section||!form||!intro)return {missing:true};
      const padding=parseFloat(getComputedStyle(section).paddingLeft);
      return {missing:false,desired:section.getBoundingClientRect().left+padding,formLeft:form.getBoundingClientRect().left,introLeft:intro.getBoundingClientRect().left,formRight:innerWidth-form.getBoundingClientRect().right};
     });
     check(!spacing.missing&&Math.abs(spacing.desired-spacing.formLeft)<4&&Math.abs(spacing.desired-spacing.introLeft)<4,"SORA letter desk has old unbalanced mobile indentation "+JSON.stringify(spacing));
    }
    const group=page.getByRole("group",{name:/Bạn đang nghĩ về điều gì/});
    check(await group.count()===1,"Accessible subject group missing");
    const radios=page.getByRole("radio");
    check(await radios.count()===3,"Missing radio controls");
    await page.getByRole("radio",{name:/Website sáng tạo/}).check();
    check(await page.getByRole("radio",{name:/Website sáng tạo/}).isChecked(),"Topic click failed");
    const note=page.getByRole("textbox",{name:"Ý tưởng của bạn"});
    await note.fill("Tôi muốn một portfolio với chữ và hình ảnh thay đổi theo dự án.");
    const preview=page.locator('[class*="_letterPreview__"]');
    check((await preview.innerText()).includes("portfolio với chữ"),"Draft preview failed to update");
    await page.getByRole("button",{name:/Sao chép thư/}).click();
    const status=await page.getByRole("status").last().textContent();
    check(!!status,"Copy action failed to report outcome");
    await page.screenshot({path:dir+"/contact-"+w+".png",animations:"disabled",timeout:20000});
    const submit=page.getByRole("button",{name:/Soạn trong email/});
    check(await submit.count()===1,"Email action missing");
    check(!(await page.content()).includes("hello@example.com"),"Sample address is still used in outgoing draft");
   }
   if(issues.length)throw Error("JS errors "+issues.join("|"));
   passes.push({viewport:w,route:route||"home"});
   console.log("SORA_LIVING_PASS",w,route||"home");
  }catch(e){const failure={viewport:w,route:route||"home",error:String(e)};failures.push(failure);console.log("SORA_LIVING_FAIL",JSON.stringify(failure));}
  finally{await page.close()}
 }
}
await browser.close();
writeFileSync(dir+"/results.json",JSON.stringify({passes,failures,engine:"Windows Chromium, emulated mobile only"},null,2)+"\n");
console.log("SORA_LIVING_RESULT",JSON.stringify({passed:passes.length,failed:failures.length}));
if(failures.length||passes.length!==widths.length*6)process.exitCode=1;
