import {chromium} from "@playwright/test";
import {mkdirSync,writeFileSync,readFileSync} from "node:fs";
import {join,resolve} from "node:path";
const ORIGIN=process.env.ATHENA_QA_ORIGIN||"http://127.0.0.1:3182";
const root=resolve(import.meta.dirname,"..");
const dir=join(root,".qa/sovereign-p8");
mkdirSync(dir,{recursive:true});
const browser=await chromium.launch({channel:process.platform==="win32"?"chrome":undefined,headless:true});
const sites=["creative-studio","modern-corporate","commerce-standard"];
const viewports=[{label:"320",width:320,height:680},{label:"390",width:390,height:760},{label:"428",width:428,height:926},{label:"768",width:768,height:1024},{label:"1440",width:1440,height:900}];
const failures=[],passes=[],fontEvidence=[];
const overlap=(a,b)=>Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
for(const site of sites){
 const css=readFileSync(join(root,"templates",site,"src/components",site==="creative-studio"?"Sora.module.css":site==="modern-corporate"?"North.module.css":"Moc.module.css"),"utf8");
 if(/Georgia|Times New Roman/.test(css))failures.push({site,route:"source",error:"Forbidden font family in sovereign CSS"});
 for(const vp of viewports){
  const page=await browser.newPage({viewport:{width:vp.width,height:vp.height},reducedMotion:"reduce"});
  const routes=["","work","services","about","work/1","contact"];
  try{
   for(const route of routes){
    const url=ORIGIN+"/template-demos/"+site+(route?"/"+route:"");
    const response=await page.goto(url,{waitUntil:"load",timeout:45000});
    if(response?.status()!==200)throw Error("HTTP "+response?.status()+" "+url);
    await page.evaluate(()=>document.fonts.ready);
    const selectors=site==="creative-studio"?{root:".sora",close:'[class*="_drawerX__"]',panel:'[class*="_drawer__"]'}:site==="modern-corporate"?{root:".north",close:'[class*="_panelTop__"] button',panel:'[class*="_panel__"]'}:{root:".moc",close:'[class*="_browseClose__"]',panel:'[class*="_browsePanel__"]'};
    const measured=await page.evaluate(({site,route})=>{
     const rect=e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}};
     const by=q=>[...document.querySelectorAll(q)].filter(e=>getComputedStyle(e).display!=="none");
     const issues=[];
     const collide=(a,b,description,ratio=.02)=>{const A=rect(a),B=rect(b);const x=Math.max(0,Math.min(A.right,B.right)-Math.max(A.left,B.left)),y=Math.max(0,Math.min(A.bottom,B.bottom)-Math.max(A.top,B.top));if(x*y>Math.max(24,Math.min(A.width*A.height,B.width*B.height)*ratio))issues.push({description,area:Math.round(x*y)})};
     if(site==="creative-studio"){
      const cards=by(route==="work"?'[class*="_workPiece__"]':'[class*="_project__"]');
      for(let i=0;i<cards.length;i++)for(let j=i+1;j<cards.length;j++){
       for(const e of [...cards[i].querySelectorAll("h2,p,small")])for(const img of cards[j].querySelectorAll("img"))collide(e,img,"SORA text/image cards "+i+"/"+j);
       for(const e of [...cards[j].querySelectorAll("h2,p,small")])for(const img of cards[i].querySelectorAll("img"))collide(e,img,"SORA text/image cards "+j+"/"+i);
      }
     }
     if(site==="commerce-standard"&&!route){
      const strips=['[class*="_shippingNote__"]','[class*="_storeHead__"]','[class*="_secondary__"]'].map(q=>document.querySelector(q)).filter(Boolean);
      for(let i=0;i<strips.length-1;i++)collide(strips[i],strips[i+1],"MOC header bands",.002);
      const logo=document.querySelector('[class*="_wordmark__"]');const cat=document.querySelector('[class*="_secondary__"]');if(logo&&cat)collide(logo,cat,"MOC logo/nav",.001);
      const labels=by('[class*="_secondary__"] a');
      for(let i=0;i<labels.length;i++)for(let j=i+1;j<labels.length;j++)collide(labels[i],labels[j],"MOC nav labels",.003);
     }
     const all=[...document.querySelectorAll("h1,h2,h3,label,nav a,button,figcaption,small")].filter(e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return s.display!=="none"&&r.width>3&&r.height>3&&!e.closest('[aria-hidden="true"]')});
     for(const e of all){const st=getComputedStyle(e);if(/Georgia|Times New Roman/.test(st.fontFamily))issues.push({description:"Forbidden painted candidate "+st.fontFamily,element:e.tagName,text:e.textContent?.slice(0,40)});}
     return {issues,overflow:document.documentElement.scrollWidth-innerWidth,textCount:all.length,title:document.querySelector("main h1")?.textContent,fonts:[...document.fonts].map(x=>({family:x.family,status:x.status}))};
    },{site,route});
    if(measured.issues.length)throw Error("Collisions/legacy fonts "+JSON.stringify(measured.issues.slice(0,6)));
    if(measured.overflow>3)throw Error("Horizontal overflow "+measured.overflow);
    if(!measured.title)throw Error("Missing main heading");
    if(route==="contact"&&vp.width<=428&&site==="creative-studio"){
     const cdps=await page.context().newCDPSession(page);
     await cdps.send("DOM.enable");await cdps.send("CSS.enable");
     const doc=await cdps.send("DOM.getDocument");
     for(const selector of ['[class*="_letterForm__"] label','[class*="_letterForm__"] h1']){
      const {nodeId}=await cdps.send("DOM.querySelector",{nodeId:doc.root.nodeId,selector});
      if(!nodeId)throw Error("Missing CDP font target "+selector);
      const res=await cdps.send("CSS.getPlatformFontsForNode",{nodeId});
      fontEvidence.push({site,viewport:vp.width,selector,fonts:res.fonts});
      const names=res.fonts.filter(x=>x.glyphCount>0).map(x=>x.familyName);
      if(names.some(x=>/Georgia|Times New Roman/.test(x)))throw Error("Forbidden actual glyph painting "+JSON.stringify(res.fonts));
     }
     await cdps.detach();
    }
    if(vp.width<=428&&site==="commerce-standard"&&route===""){
     const mobileHeader=await page.evaluate(()=>{
      const help=document.querySelector('[class*="_actions__"] [class*="_support__"]');
      const strip=document.querySelector('[class*="_shippingNote__"]');
      return {helpVisible:!!help&&getComputedStyle(help).display!=="none",stripHeight:strip?.getBoundingClientRect().height,stripLine:strip?parseFloat(getComputedStyle(strip).lineHeight):null};
     });
     if(mobileHeader.helpVisible)throw Error("MOC desktop help label bleeds into mobile header");
     if(mobileHeader.stripHeight>mobileHeader.stripLine*2+12)throw Error("MOC utility announcement is wrapping excessively");
    }
    if(vp.width<=428&&route===""){
     const toggle=page.locator("header button[aria-expanded]").first();if(!await toggle.count())throw Error("Missing mobile toggle");
     await toggle.click();
     const close=page.locator(selectors.close);
     await close.waitFor({state:"visible",timeout:8000});
     const label=await close.evaluate(e=>(e.innerText||"").trim().replace(/\s+/g,""));
     if(label!=="×"&&label!=="✕"&&label!=="✖")throw Error("Menu close not X only "+label);
     if(await close.count()!==1)throw Error("Duplicate X control");
     const size=await close.boundingBox();if(!size||size.width<44||size.height<44)throw Error("X hit area too small");
     await close.click();if(await toggle.getAttribute("aria-expanded")!=="false")throw Error("X failed to close menu");
     // no click on the shared invisible scrim is needed to prove the menu exit.
    }
    if(vp.width===1440&&route===""){
     await page.screenshot({type:"jpeg",path:join(dir,site+"-home-1440.jpg"),quality:86,animations:"disabled",timeout:15000});
    }
    if(vp.width===390){
     await page.screenshot({path:join(dir,site+"-"+(route||"home")+"-390.png"),animations:"disabled",timeout:15000});
    }
    passes.push({site,route:route||"home",viewport:vp.width});
    console.log("P8_PASS",site,route||"home",vp.width);
   }
   // 200% browser zoom approximation for the two high-risk surfaces
   if(vp.width===390){
    for(const route of ["contact","work","services","about"]){
     await page.goto(ORIGIN+"/template-demos/"+site+"/"+route,{waitUntil:"load"});
     await page.evaluate(()=>{document.documentElement.style.zoom="2"});
     const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
     if(overflow>4)throw Error("200% CSS zoom produced horizontal overflow "+overflow+" "+route);
    }
   }
  }catch(e){const failure={site,viewport:vp.width,error:String(e)};failures.push(failure);console.log("P8_FAIL",JSON.stringify(failure));}
  finally{await page.close()}
 }
}
await browser.close();
writeFileSync(join(dir,"result.json"),JSON.stringify({passes,failures,fontEvidence,engine:"Chromium (desktop and emulated mobile), CSS zoom approximation",at:new Date().toISOString()},null,2)+"\n");
console.log("P8_TOTAL",JSON.stringify({passes:passes.length,failures:failures.length,paintSamples:fontEvidence.length}));
if(failures.length)process.exitCode=1;
