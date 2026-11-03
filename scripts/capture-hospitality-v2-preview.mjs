import {chromium} from "@playwright/test";
import sharp from "sharp";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {createHash} from "node:crypto";
import assert from "node:assert/strict";
const origin=process.env.ATHENA_QA_ORIGIN||"http://127.0.0.1:3182";
const pageUrl=origin+"/template-demos/hospitality-booking?embed=1";
const browser=await chromium.launch({headless:true,channel:process.platform==="win32"?"chrome":undefined});
try{
 const page=await browser.newPage({viewport:{width:1600,height:1000},deviceScaleFactor:1.5,reducedMotion:"reduce"});
 const response=await page.goto(pageUrl,{waitUntil:"load",timeout:45000});
 assert.equal(response?.status(),200);
 await page.evaluate(()=>document.fonts.ready);
 await page.waitForTimeout(300);
 const info=await page.evaluate(()=>({
  heading:document.querySelector("#hospitality-content h1")?.textContent?.trim(),
  overflow:document.documentElement.scrollWidth-innerWidth,
  broken:[...document.images].filter(img=>{const r=img.getBoundingClientRect();return r.top<innerHeight&&img.complete&&!img.naturalWidth}).length,
  floating:document.querySelectorAll(".athena-demo-float.is-expanded").length
 }));
 assert(info.heading&&info.overflow<=3&&info.broken===0&&info.floating===0,JSON.stringify(info));
 const png=await page.screenshot({type:"png",animations:"disabled",timeout:30000});
 const file="public/template-previews/hospitality-booking.jpg";
 await sharp(png).resize(1920,1200,{fit:"fill"}).jpeg({quality:89,mozjpeg:true,progressive:true}).toFile(file);
 const hash=createHash("sha256").update(readFileSync(file)).digest("hex").slice(0,16);
 const versions="data/template-preview-versions.json";
 const data=JSON.parse(readFileSync(versions,"utf8"));
 data["hospitality-booking"]=hash;
 writeFileSync(versions,JSON.stringify(data,null,2)+"\n","utf8");
 mkdirSync(".qa/hospitality-v2",{recursive:true});
 writeFileSync(".qa/hospitality-v2/preview-report.json",JSON.stringify({path:file,width:1920,height:1200,hash,source:pageUrl,info},null,2)+"\n","utf8");
 console.log("HOSPITALITY_PREVIEW_PASS",JSON.stringify({file,hash,info}));
 await page.close();
}finally{await browser.close();}
