/**
 * Browser-produced Athena gallery thumbnails. No synthetic/stock/faked preview.
 * --apply copies successful verified screenshots into public/template-previews.
 * First collect and check ALL nineteen before copying ANY.
 * Special 3D scenes auto-showroom and Digital Creators are intentionally excluded.
 */
import {chromium} from "@playwright/test";
import {readFileSync,mkdirSync,writeFileSync,copyFileSync,existsSync} from "node:fs";
import {resolve,join} from "node:path";
import {createHash} from "node:crypto";
const root=resolve(import.meta.dirname,"..");
const base=process.env.ATHENA_QA_ORIGIN||"http://127.0.0.1:3182";
const apply=process.argv.includes("--apply");
const slugs=JSON.parse(readFileSync(join(root,"data/templates.json"),"utf8"))
 .map(x=>x.slug).filter(x=>!["digital-creators","auto-showroom"].includes(x));
const temp=join(root,".qa/athena-21-sovereign/p4-preview-evidence");
const output=join(root,"public/template-previews");
mkdirSync(temp,{recursive:true});
const browser=await chromium.launch({headless:true,channel:process.platform==="win32"?"chrome":undefined});
const viewport={width:1440,height:900};
const data=[],failures=[];
for(const slug of slugs){
 const page=await browser.newPage({viewport,deviceScaleFactor:1,reducedMotion:"reduce"});
 const url=base+"/template-demos/"+slug;
 try{
  const response=await page.goto(url,{waitUntil:"load",timeout:45000});
  if(response?.status()!==200)throw Error("HTTP "+response?.status());
  await page.locator("main h1").first().waitFor({timeout:15000});
  await page.waitForTimeout(200);
  const state=await page.evaluate(()=>{
   const first=document.querySelector("main img");
   return {
    header:!!document.querySelector("header"),
    footer:!!document.querySelector("footer"),
    h1:document.querySelector("main h1")?.textContent?.trim(),
    legacy:!!document.querySelector(".world-site"),
    overflow:document.documentElement.scrollWidth-innerWidth,
    firstImageLoaded:!first||(first).naturalWidth>0
   };
  });
  if(state.legacy||!state.h1||!state.footer||!state.header||state.overflow>3||!state.firstImageLoaded)throw Error("Invalid rendered site "+JSON.stringify(state));
  const image=join(temp,slug+".jpg");
  await page.screenshot({type:"jpeg",path:image,quality:82,animations:"disabled",timeout:25000});
  const sha=createHash("sha256").update(readFileSync(image)).digest("hex");
  data.push({slug,image,sha,url,...state});
  console.log("PREVIEW_CAPTURED",slug,sha.slice(0,12));
 }catch(error){failures.push({slug,error:String(error)});console.log("PREVIEW_FAILED",slug,String(error));}
 finally{await page.close();}
}
const browserVersion=browser.version();
await browser.close();
if(!failures.length&&data.length===19&&new Set(data.map(x=>x.sha)).size===19&&apply){
 mkdirSync(output,{recursive:true});
 for(const item of data)copyFileSync(item.image,join(output,item.slug+".jpg"));
}
writeFileSync(join(temp,"evidence.json"),JSON.stringify({origin:base,browser:"Chromium "+browserVersion,viewport,source:"actual browser screenshots",applied:!failures.length&&data.length===19&&apply,data,failures},null,2)+"\n");
console.log("SOVEREIGN_THUMBNAILS",JSON.stringify({captured:data.length,expected:19,failures:failures.length,applied:!failures.length&&data.length===19&&apply}));
if(failures.length||data.length!==19||new Set(data.map(x=>x.sha)).size!==19)process.exitCode=1;
