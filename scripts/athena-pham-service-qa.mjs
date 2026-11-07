import {chromium} from "@playwright/test";
import {mkdirSync,writeFileSync} from "node:fs";
const folder=".qa/athena-pham-service-qa";
mkdirSync(folder,{recursive:true});
const b=await chromium.launch({channel:process.platform==="win32"?"chrome":undefined,headless:true});
const cases=[[320,680],[390,844],[428,926],[1440,900]];
const results=[],failures=[];
for(const [width,height] of cases){
 const page=await b.newPage({viewport:{width,height},deviceScaleFactor:1});
 const errors=[];page.on("pageerror",e=>errors.push(e.message));
 const check=(condition,msg)=>{if(!condition)throw Error(msg)};
 try{
  let response=await page.goto("http://127.0.0.1:3182/",{waitUntil:"load",timeout:30000});
  check(response?.status()===200,"Athena home HTTP "+response?.status());
  const preview=page.locator(".dna-service-web-development .dna-browser-preview");
  await preview.scrollIntoViewIfNeeded();
  const im=preview.locator("img");
  await im.waitFor({state:"visible",timeout:10000});
  await page.waitForFunction(()=>{const i=document.querySelector(".dna-service-web-development .dna-browser-preview img");return Boolean(i?.complete&&i?.naturalWidth>0)},null,{timeout:10000});
  const info=await im.evaluate(image=>{
   const bounds=image.getBoundingClientRect(),parent=image.closest(".dna-browser-preview").getBoundingClientRect();
   return {source:image.currentSrc,fit:getComputedStyle(image).objectFit,naturalSize:[image.naturalWidth,image.naturalHeight],
     bounds:{width:bounds.width,height:bounds.height},parent:{width:parent.width,height:parent.height}};
  });
  check(info.fit==="cover","Image must cover the browser preview");
  check(width<=760?info.source.includes("creative-studio-service-mobile.webp"):info.source.includes("creative-studio.jpg"),"Wrong image selected "+info.source);
  check(info.bounds.width>=info.parent.width-2&&info.bounds.height>=info.parent.height-2,"Image does not fill frame");
  await page.locator(".dna-service-web-development").screenshot({path:folder+"/"+width+"-sora-card.png",animations:"disabled"});
  results.push({width,route:"/",info});
  response=await page.goto("http://127.0.0.1:3182/projects",{waitUntil:"load",timeout:25000});
  check(response?.status()===200,"Projects HTTP "+response?.status());
  const cover=page.locator(".ae-project-pham .agency-real-art img").first();
  await cover.scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>{const img=document.querySelector(".ae-project-pham .agency-real-art img");return Boolean(img?.complete&&img?.naturalWidth>0)},null,{timeout:15000});
  const src=await cover.getAttribute("src");
  check(src?.includes("pham-home-hires.webp"),"PHAM cover source not updated "+src);
  await page.locator(".ae-project-pham").screenshot({path:folder+"/"+width+"-pham-project-card.png",animations:"disabled"});
  results.push({width,route:"/projects",cover:src});
  response=await page.goto("http://127.0.0.1:3182/projects/pham",{waitUntil:"load",timeout:25000});
  check(response?.status()===200,"PHAM case study HTTP "+response?.status());
  const gallery=page.locator(".ae-article-gallery img");
  check(await gallery.count()===4,"PHAM should have four screenshots");
  for(let i=0;i<4;i++)check((await gallery.nth(i).getAttribute("src"))?.includes("v=20261103"),"Unversioned PHAM gallery image "+i);
  check((await page.locator("body").innerText()).includes("03/11/2026"),"Missing updated screenshot date");
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  check(overflow<=3,"PHAM case study overflow "+overflow);
  results.push({width,route:"/projects/pham",gallery:4});
  check(errors.length===0,"Page errors: "+errors.join(" | "));
 }catch(e){failures.push({width,error:String(e),jsErrors:errors});}
 await page.close();
}
await b.close();
writeFileSync(folder+"/report.json",JSON.stringify({passes:results.length,failures,results},null,2));
console.log(JSON.stringify({passes:results.length,failures},null,2));
if(failures.length)process.exitCode=1;
