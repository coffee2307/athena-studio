#!/usr/bin/env node
/** Capture the real WebGL showroom after the McLaren GLB has finished loading.
 *
 * Usage: node scripts/capture-mclaren-showroom.mjs [base URL] [output dir]
 * Set PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH when the managed Playwright browser
 * is unavailable (for example when using a separately installed Chromium).
 */
import {chromium} from "playwright";
import {mkdir} from "node:fs/promises";
import {resolve} from "node:path";

const base=(process.argv[2]??"http://127.0.0.1:3000").replace(/\/$/,"");
const output=resolve(process.argv[3]??".qa/mclaren-visual-v2");
const only=process.argv[4];
const executablePath=process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
const browser=await chromium.launch({
 headless:true,
 ...(executablePath?{executablePath}:{}),
 args:["--enable-webgl","--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"],
});

try{
 await mkdir(output,{recursive:true});
 for(const shot of [
  {name:"01-desktop",width:1440,height:900,dpr:1.5,mobile:false},
  {name:"02-mobile-390",width:390,height:844,dpr:2,mobile:true},
  {name:"03-mobile-320",width:320,height:700,dpr:2,mobile:true},
  {name:"04-template-cover",width:1280,height:720,dpr:2,mobile:false},
 ].filter(shot=>!only||shot.name===only)){
  const context=await browser.newContext({
   viewport:{width:shot.width,height:shot.height},
   deviceScaleFactor:shot.dpr,
   isMobile:shot.mobile,
   hasTouch:shot.mobile,
  });
  // For static cover photography only, allow a CPU browser to render at the
  // hardware pixel budget. Production runtime keeps its adaptive CPU cap.
  if(process.env.CAPTURE_FORCE_WEBGL_QUALITY==="1"){
   await context.addInitScript(()=>{
    for(const prototype of [WebGLRenderingContext.prototype,WebGL2RenderingContext.prototype]){
     const getExtension=prototype.getExtension;
     prototype.getExtension=function(name){
      if(name==="WEBGL_debug_renderer_info")return null;
      return getExtension.call(this,name);
     };
    }
   });
  }
  const page=await context.newPage();
  page.on("pageerror",error=>console.error(`${shot.name}: ${error.message}`));
  await page.goto(`${base}/template-demos/auto-showroom`,{waitUntil:"domcontentloaded"});
  await page.locator('.ix-auto-3d-canvas[data-renderer="ready"]').waitFor({timeout:70000});
  await page.evaluate(async()=>{await document.fonts.ready;});
  await page.waitForTimeout(1400);
  const path=resolve(output,`${shot.name}.png`);
  await page.screenshot({path,animations:"disabled"});
  if(shot.name==="04-template-cover"&&process.env.CAPTURE_UPDATE_PREVIEW==="1"){
   await page.screenshot({
    path:resolve("public/template-previews/auto-showroom.jpg"),
    type:"jpeg",quality:92,scale:"css",animations:"disabled",
   });
   await page.screenshot({
    path:resolve("public/template-previews/auto-showroom.png"),
    type:"png",scale:"css",animations:"disabled",
   });
  }
  const measurements=await page.evaluate(()=>({
   scrollWidth:document.documentElement.scrollWidth,
   viewportWidth:innerWidth,
   model:document.querySelector('.ix-auto-3d-canvas')?.getAttribute("data-renderer"),
   heading:document.querySelector("h1")?.textContent?.trim(),
   webgl:!!document.createElement("canvas").getContext("webgl2"),
   renderQuality:document.querySelector('.ix-auto-3d-canvas')?.getAttribute("data-render-quality"),
  }));
  console.log(`${path} ${JSON.stringify(measurements)}`);
  await context.close();
 }
}finally{await browser.close();}
