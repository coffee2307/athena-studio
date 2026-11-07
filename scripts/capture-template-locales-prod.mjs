import fs from "node:fs";
import crypto from "node:crypto";
import {chromium} from "playwright";
import sharp from "sharp";
const registry=JSON.parse(fs.readFileSync("data/templates.json","utf8"));
const dictionaries=JSON.parse(fs.readFileSync("data/template-locales.json","utf8"));
const excluded=new Set(["wellness-clinic","property-showcase","education-platform","pet-store","construction-firm"]);
const selection=(process.env.ONLY_SLUGS||process.env.ONLY_SLUG||"all").split(",").map(x=>x.trim()).filter(Boolean);
const targets=registry.filter(t=>!excluded.has(t.slug)&&(selection.includes("all")||selection.includes(t.slug)));
if(selection.some(slug=>slug!=="all"&&!registry.some(t=>t.slug===slug)))throw Error("Unknown preview slug: "+selection.join(","));
const origin=process.env.ATHENA_QA_ORIGIN||"http://127.0.0.1:3182";
const versions=JSON.parse(fs.readFileSync("data/template-preview-versions.json","utf8"));
const browser=await chromium.launch({channel:process.platform==="win32"?"chrome":undefined,headless:true,args:["--disable-dev-shm-usage"]});
const report=[],failures=[];
let index=0;
async function processNext(){
 while(index<targets.length*2){
  const pos=index++,template=targets[Math.floor(pos/2)],lang=pos%2?"en":"vi";
  const isStatic=template.slug==="digital-creators";
  const isQrio=template.slug==="saas-product";
  const url=origin+(isQrio?"/immersive/qrio/index.html":isStatic?"/immersive/digital-creators/index.html":"/template-demos/"+template.slug)+(isQrio||isStatic?"?lang=":"?embed=1&lang=")+lang;
  const page=await browser.newPage({viewport:{width:1600,height:1000},deviceScaleFactor:1.2,reducedMotion:"reduce"});
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  try{
   const response=await page.goto(url,{waitUntil:"domcontentloaded",timeout:35000});
   if(response?.status()!==200)throw Error("HTTP "+response?.status());
   await page.waitForTimeout(350);
   if(!isQrio)await page.evaluate(({lang,dictionary})=>{
    const root=document.querySelector(".template-demo-main")||document.querySelector("#root")||document.body;
    const memo=new WeakMap(),amemo=new WeakMap();
    const attrs=["title","alt","placeholder","aria-label"];
    const translate=str=>{
     const key=str.trim();const target=dictionary[key];
     return target&&target!==key?str.replace(key,target):str;
    };
    const update=(n)=>{
     if(n.nodeType===3){
      if(!n.parentElement||n.parentElement.closest("script,style,noscript,svg,code,pre"))return;
      const current=n.data,old=memo.get(n),source=old&&old.rendered===current?old.source:current;
      const converted=translate(source);
      if(converted!==current)n.data=converted;
      memo.set(n,{source,rendered:converted});
     }else if(n.nodeType===1){
      const el=n;if(el.matches("script,style,noscript,svg,code,pre"))return;
      for(const attr of attrs){
       const current=el.getAttribute(attr);if(current===null)continue;
       let map=amemo.get(el);if(!map){map=new Map();amemo.set(el,map);}
       const old=map.get(attr),source=old&&old.rendered===current?old.source:current;
       const converted=translate(source);
       if(converted!==current)el.setAttribute(attr,converted);
       map.set(attr,{source,rendered:converted});
      }
     }
    };
    const scan=node=>{
     if(node.nodeType===3){update(node);return;}
     if(node.nodeType!==1&&node.nodeType!==9)return;
     update(node);const walk=document.createTreeWalker(node,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT);
     let n;while(n=walk.nextNode())update(n);
    };
    scan(root);let raf=0;const queue=new Set();
    const observer=new MutationObserver(records=>{
     for(const r of records){if(r.type==="childList")r.addedNodes.forEach(n=>queue.add(n));else queue.add(r.target);}
     if(queue.size&&!raf)raf=requestAnimationFrame(()=>{
      raf=0;const changed=[...queue];queue.clear();
      for(const n of changed)if(n.isConnected)scan(n);
     });
    });
    observer.observe(root,{childList:true,characterData:true,subtree:true,attributes:true,attributeFilter:attrs});
    root.dataset.templateLanguage=lang;
   },{lang,dictionary:dictionaries[lang]});
   await page.evaluate(()=>document.fonts.ready);
   if(isQrio){
    await page.locator(".hero-title").waitFor({state:"visible",timeout:15000});
    await page.waitForTimeout(250);
   }else await page.waitForTimeout(template.slug==="auto-showroom"?2400:1050);
   await page.evaluate(async()=>{
    await Promise.all([...document.images].filter(img=>{
     const r=img.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight;
    }).map(img=>img.decode().catch(()=>{})));
   });
   await page.waitForTimeout(200);
   if(template.slug==="fashion-archive"){
    // A rendered 3D figure is mandatory in the cover: wait for Meshopt + WebGL,
    // not just DOM hydration. Never publish a screenshot of the loading state.
    await page.locator('[data-active-model="pose-floor"][data-model-state="ready"]').waitFor({timeout:45000});
    await page.waitForFunction(()=>{
     const canvas=document.querySelector("[data-fashion-3d-hero] canvas");
     return canvas instanceof HTMLCanvasElement&&canvas.width>100&&canvas.height>100;
    },null,{timeout:10000});
    await page.waitForTimeout(300);
   }
   if(isStatic||template.slug==="fashion-archive")await page.addStyleTag({content:".athena-demo-float,.athena-demo-info,.athena-demo-float-handle{display:none!important}"});
   const state=await page.evaluate(()=>{
    const main=document.querySelector(".template-demo-main")||document.querySelector("#root")||document.body;
    const walker=document.createTreeWalker(main,NodeFilter.SHOW_TEXT);let n;const visible=[];
    while(n=walker.nextNode()){
     const s=n.textContent?.trim();
     if(!s||s.length>180||!n.parentElement)continue;
     const r=n.parentElement.getBoundingClientRect();
     if(r.top<innerHeight&&r.bottom>0&&getComputedStyle(n.parentElement).visibility!=="hidden")visible.push(s);
    }
    return{title:document.title,examples:visible.slice(0,32),viFragments:visible.filter(x=>/[\u00c0-\u1ef9]/.test(x)).length,total:visible.length,overflow:document.documentElement.scrollWidth-innerWidth};
   });
   const stylesheets=await page.evaluate(()=>document.styleSheets.length);
   if(stylesheets<(isQrio?1:isStatic?3:5))throw Error("Missing CSS: only "+stylesheets+" stylesheets");
   const screenshot=await page.screenshot({animations:"disabled",timeout:30000});
   const destination="public/template-previews/"+template.slug+"-"+lang+".jpg";
   await sharp(screenshot).resize(1920,1200,{fit:"cover"}).jpeg({quality:87,mozjpeg:true,progressive:true}).toFile(destination);
   const hash=crypto.createHash("sha256").update(fs.readFileSync(destination)).digest("hex").slice(0,16);
   versions[template.slug+"-"+lang]=hash;
   // Qrio is a native bilingual standalone experience; update its default cover as well.
   if(isQrio&&lang==="vi"){
    fs.copyFileSync(destination,"public/template-previews/saas-product.jpg");
    versions["saas-product"]=hash;
   }
   // Keep the unlocalized fallback in sync with the latest verified VI 3D cover.
   if(template.slug==="fashion-archive"&&lang==="vi"){
    fs.copyFileSync(destination,"public/template-previews/fashion-archive.jpg");
    versions["fashion-archive"]=hash;
   }
   report.push({slug:template.slug,lang,destination,hash,state,errors});
   console.log("COVER_OK",template.slug,lang,hash,"VI",state.viFragments,"/ text",state.total);
  }catch(e){const f={slug:template.slug,lang,error:String(e).slice(0,500),errors};failures.push(f);console.log("COVER_ERROR",JSON.stringify(f));}
  finally{await page.close();}
 }
}
await Promise.all([processNext(),processNext()]);
await browser.close();
fs.writeFileSync("data/template-preview-versions.json",JSON.stringify(versions,null,2)+"\n");
fs.mkdirSync(".qa/athena-locale-covers",{recursive:true});
fs.writeFileSync(".qa/athena-locale-covers/report.json",JSON.stringify({report,failures},null,2)+"\n");
console.log("COVERS_COMPLETED",JSON.stringify({count:report.length,failures}));
if(failures.length)process.exitCode=1;