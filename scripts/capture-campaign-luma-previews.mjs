import {chromium} from "@playwright/test";
import sharp from "sharp";
import {writeFileSync,mkdirSync} from "node:fs";
import {execSync} from "node:child_process";
const root=process.env.ATHENA_QA_ORIGIN||"http://127.0.0.1:3182";
const browser=await chromium.launch({headless:true,channel:process.platform==="win32"?"chrome":undefined});
const report=[];
for(const slug of ["campaign-landing","saas-product"]){
 const page=await browser.newPage({viewport:{width:1600,height:1000},deviceScaleFactor:1.5,reducedMotion:"reduce"});
 const url=root+"/template-demos/"+slug+"?embed=1";
 try{
  const response=await page.goto(url,{waitUntil:"load",timeout:50000});
  if(response?.status()!==200)throw Error("HTTP "+response?.status());
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(350);
  const state=await page.evaluate(()=>({
   heading:document.querySelector("main h1")?.innerText||null,
   overflow:document.documentElement.scrollWidth-innerWidth,
   overlays:document.querySelectorAll(".athena-demo-float.is-expanded").length,
   broken:[...document.images].filter(x=>x.complete&&!x.naturalWidth).map(x=>x.getAttribute("src")),
  }));
  if(!state.heading||state.overflow>3||state.overlays||state.broken.length)throw Error("Unclean screenshot "+JSON.stringify(state));
  const png=await page.screenshot({type:"png",animations:"disabled",timeout:30000});
  const image="public/template-previews/"+slug+".jpg";
  await sharp(png).resize(1920,1200,{fit:"fill"}).jpeg({quality:89,mozjpeg:true,progressive:true}).toFile(image);
  const m=await sharp(image).metadata();
  report.push({slug,path:image,width:m.width,height:m.height,size:m.size,heading:state.heading});
  console.log("PREVIEW_UPDATED",slug,m.width+"x"+m.height,m.size,"bytes");
 }finally{await page.close();}
}
await browser.close();
mkdirSync(".qa/campaign-luma-v3",{recursive:true});
writeFileSync(".qa/campaign-luma-v3/preview-capture.json",JSON.stringify({source:execSync("git rev-parse --short HEAD",{encoding:"utf8"}).trim(),images:report,source:"Real Chrome Playwright DOM, not generated mock"},null,2)+"\n");
