/**
 * True browser screenshot pipeline for the active template catalog.
 * node scripts/sovereign-refresh-previews.mjs --apply [--slugs=comma-separated|all]
 * --apply updates preview files and cache version keys only after every requested
 * screenshot passes checks. It never writes to production or deploys anything.
 */
import {chromium} from "@playwright/test";
import {readFileSync,mkdirSync,writeFileSync,copyFileSync,existsSync} from "node:fs";
import {resolve,join} from "node:path";
import {createHash} from "node:crypto";
const root=resolve(import.meta.dirname,"..");
const origin=process.env.ATHENA_QA_ORIGIN||"http://127.0.0.1:3182";
const apply=process.argv.includes("--apply");
const all=JSON.parse(readFileSync(join(root,"data/templates.json"),"utf8")).map(x=>x.slug);
const arg=process.argv.find(x=>x.startsWith("--slugs="));
const requested=arg?arg.slice(8).split(",").filter(Boolean):all;
const slugs=requested.includes("all")?all:requested.filter(x=>x!=="none");
if(slugs.some(x=>!all.includes(x))||new Set(slugs).size!==slugs.length)throw Error("Unknown/duplicate preview slug: "+slugs.join(","));
if(!slugs.length){console.log("NO_TEMPLATE_SOURCE_CHANGES");process.exit(0);}
const temp=join(root,".qa/template-preview-refresh");
const out=join(root,"public/template-previews");
mkdirSync(temp,{recursive:true});
const browser=await chromium.launch({headless:true,channel:process.platform==="win32"?"chrome":undefined});
const results=[],failures=[];
for(const slug of slugs){
 const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1,reducedMotion:slug==="auto-showroom"?"no-preference":"reduce"});
 const url=origin+"/template-demos/"+slug;
 const isDigital=slug==="digital-creators";
 const filename=slug+(isDigital?".png":".jpg");
 try{
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  const response=await page.goto(url,{waitUntil:"load",timeout:60000});
  if(response?.status()!==200)throw Error("HTTP "+response?.status());
  await page.evaluate(()=>document.fonts.ready);
  await page.locator("h1").first().waitFor({timeout:15000});
  // A finished GLB scene is part of the actual cover, not an optional decoration.
  // Never overwrite the Fashion cover with a blank "loading" placeholder.
  if(slug==="fashion-archive"){
   await page.locator('[data-active-model="pose-floor"][data-model-state="ready"]').waitFor({timeout:35000});
   await page.waitForTimeout(250);
  }else{
   await page.waitForTimeout(slug==="auto-showroom"?6500:isDigital?950:300);
  }
  if(slug==="auto-showroom"){
   if(await page.locator('[data-model-loading="failed"]').count())throw Error("McLaren model failed to render — refusing to overwrite valid car cover");
   if(await page.locator("canvas").count()===0)throw Error("McLaren scene canvas missing — refusing blank cover");
  }
  const state=await page.evaluate(()=>({
   heading:document.querySelector("h1")?.textContent?.trim()||"",
   overflow:document.documentElement.scrollWidth-innerWidth,
   images:[...document.querySelectorAll("main img")].filter(i=>{
    const r=i.getBoundingClientRect();return r.width>10&&r.height>10&&r.top<innerHeight;
   }).map(i=>({src:i.currentSrc||i.src,ready:i.complete&&i.naturalWidth>0})),
   hasCanvas:!!document.querySelector("canvas")
  }));
  if(!state.heading||state.overflow>4||state.images.some(i=>!i.ready)||errors.length)throw Error("Invalid render "+JSON.stringify({state,errors}));
  const imagePath=join(temp,filename);
  await page.screenshot({path:imagePath,type:isDigital?"png":"jpeg",quality:isDigital?undefined:85,animations:"disabled",timeout:30000});
  const companion=["creative-studio","architecture-studio","auto-showroom"].includes(slug)?slug+".png":null;
  if(companion)await page.screenshot({path:join(temp,companion),type:"png",animations:"disabled",timeout:30000});
  const bytes=readFileSync(imagePath);
  if(bytes.length<10000)throw Error("Screenshot too small: "+bytes.length);
  const hash=createHash("sha256").update(bytes).digest("hex").slice(0,16);
  results.push({slug,hash,filename,companion,bytes:bytes.length,url,heading:state.heading,hasCanvas:state.hasCanvas});
  console.log("PREVIEW_CAPTURED",slug,hash,bytes.length);
 }catch(error){failures.push({slug,message:String(error)});console.error("PREVIEW_FAILED",slug,String(error));}
 finally{await page.close();}
}
const browserVersion=browser.version();
await browser.close();
let applied=false;
if(!failures.length&&results.length===slugs.length&&apply){
 mkdirSync(out,{recursive:true});
 const versionsPath=join(root,"data/template-preview-versions.json");
 const versions=existsSync(versionsPath)?JSON.parse(readFileSync(versionsPath,"utf8")):{};
 for(const item of results){
  copyFileSync(join(temp,item.filename),join(out,item.filename));
  if(item.companion)copyFileSync(join(temp,item.companion),join(out,item.companion));
  versions[item.slug]=item.hash;
 }
 for(const old of Object.keys(versions))if(!all.includes(old))delete versions[old];
 writeFileSync(versionsPath,JSON.stringify(versions,null,2)+"\n");
 applied=true;
}
writeFileSync(join(temp,"evidence.json"),JSON.stringify({origin,engine:"Chromium "+browserVersion,viewport:"1440x900",actualBrowserCapture:true,applied,results,failures},null,2)+"\n");
console.log("PREVIEW_RESULT",JSON.stringify({requested:slugs.length,captured:results.length,failures:failures.length,applied}));
if(failures.length||results.length!==slugs.length)process.exitCode=1;
