import {chromium} from "playwright";
import sharp from "sharp";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {createHash} from "node:crypto";
import assert from "node:assert/strict";
const base=process.env.ATHENA_QA_ORIGIN||"http://127.0.0.1:3182";
const browser=await chromium.launch({headless:true,channel:process.platform==="win32"?"chrome":undefined});
try{
 const page=await browser.newPage({viewport:{width:1600,height:1000},deviceScaleFactor:1.5,reducedMotion:"reduce"});
 const res=await page.goto(base+"/template-demos/architecture-studio?embed=1",{waitUntil:"load",timeout:45000});
 assert.equal(res?.status(),200);
 await page.evaluate(()=>document.fonts.ready);
 await page.waitForTimeout(350);
 const info=await page.evaluate(()=>({
  headline:document.querySelector("[data-forma-home] h1")?.textContent?.trim(),
  overflow:document.documentElement.scrollWidth-innerWidth,
  imageReady:[...document.querySelectorAll("[data-forma-home] img")].filter(x=>{const r=x.getBoundingClientRect();return r.top<innerHeight&&x.complete&&x.naturalWidth===0}).length,
  demoOverlay:document.querySelectorAll(".athena-demo-float.is-expanded").length
 }));
 assert(info.headline&&info.overflow<=3&&info.imageReady===0&&info.demoOverlay===0,JSON.stringify(info));
 mkdirSync(".qa/architecture-datum-v1",{recursive:true});
 const png=await page.screenshot({type:"png",animations:"disabled",timeout:30000});
 const file="public/template-previews/architecture-studio.jpg";
 await sharp(png).resize(1920,1200,{fit:"fill"}).jpeg({quality:90,progressive:true,mozjpeg:true}).toFile(file);
 const hash=createHash("sha256").update(readFileSync(file)).digest("hex").slice(0,16);
 const versions="data/template-preview-versions.json";
 const data=JSON.parse(readFileSync(versions,"utf8"));
 data["architecture-studio"]=hash;
 writeFileSync(versions,JSON.stringify(data,null,2)+"\n","utf8");
 writeFileSync(".qa/architecture-datum-v1/cover-report.json",JSON.stringify({file,hash,info,viewport:"1600x1000",output:"1920x1200",source:base+"/template-demos/architecture-studio?embed=1"},null,2)+"\n","utf8");
 console.log("FORMA_COVER_PASS",JSON.stringify({file,hash,info}));
}finally{await browser.close();}
