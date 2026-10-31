import {chromium} from "@playwright/test";
import {mkdirSync,writeFileSync} from "node:fs";
const origin=process.env.ATHENA_QA_ORIGIN||"http://127.0.0.1:3182";
const out=".qa/fashion-3d";mkdirSync(out,{recursive:true});
const browser=await chromium.launch({channel:process.platform==="win32"?"chrome":undefined,headless:true});
const sizes=[[320,680],[390,760],[390,844],[428,926],[768,1024],[1440,900]];
const modelIds=["pose-floor","flowers","squat"],results=[],issues=[];
function check(condition,message){if(!condition)throw new Error(message)}
async function fonts(page,selector){
 const client=await page.context().newCDPSession(page);
 await client.send("DOM.enable");await client.send("CSS.enable");
 const doc=await client.send("DOM.getDocument",{depth:-1,pierce:true});
 const match=await client.send("DOM.querySelector",{nodeId:doc.root.nodeId,selector});
 check(match.nodeId!==0,"font query missing "+selector);
 const data=await client.send("CSS.getPlatformFontsForNode",{nodeId:match.nodeId});
 await client.detach();
 return data.fonts.map(f=>({family:f.familyName,glyphs:f.glyphCount}));
}
for(const [width,height] of sizes){
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,reducedMotion:"no-preference",hasTouch:width<=428,isMobile:width<=428});
 const page=await context.newPage();const errors=[],failed=[];
 page.on("pageerror",e=>errors.push(e.message));
 page.on("requestfailed",r=>failed.push(r.url()+" "+r.failure()?.errorText));
 try{
  const response=await page.goto(origin+"/template-demos/fashion-archive",{waitUntil:"load",timeout:45000});
  check(response?.status()===200,"home HTTP "+response?.status());
  await page.evaluate(()=>document.fonts.ready);
  const stage=page.locator("[data-fashion-3d-hero] [data-model-state]");
  await stage.waitFor({state:"visible"});
  await page.waitForTimeout(200);
  await page.locator('[data-model-state="ready"]').waitFor({timeout:28000});
  const dots=page.locator('[aria-label="Chọn mô hình 3D"] button');
  check(await dots.count()===3,"Expected 3 carousel buttons");
  check((await page.locator("main h1").innerText()).includes("FORM"),"Hero headline missing");
  const states=[];
  for(let i=0;i<3;i++){
   await dots.nth(i).click();
   await page.locator('[data-active-model="'+modelIds[i]+'"][data-model-state="ready"]').waitFor({timeout:28000});
   check(await dots.nth(i).getAttribute("aria-pressed")==="true","Dot "+i+" unselected");
   check(await page.locator('[aria-label="Chọn mô hình 3D"] button[aria-pressed="true"]').count()===1,"Only 1 selected dot");
   await page.waitForTimeout(210);
   const rotation=Number(await stage.getAttribute("data-rotation"));
   const geom=await page.evaluate(()=>{
     const s=document.querySelector("[data-fashion-3d-hero]");
     const c=s?.querySelector("canvas");
     const r=c?.getBoundingClientRect();
     return {canvas:[r?.width,r?.height],overflow:document.documentElement.scrollWidth-innerWidth,fontsReady:document.fonts.status};
   });
   check(geom.canvas[0]>120&&geom.canvas[1]>120,"Canvas dimension too small");
   check(geom.overflow<=3,"Horizontal overflow: "+geom.overflow);
   states.push({name:modelIds[i],rotation,geom});
   if([390,1440].includes(width))await page.screenshot({path:out+"/hero-"+width+"-"+modelIds[i]+".jpg",type:"jpeg",quality:85,animations:"disabled"});
  }
  await dots.nth(0).click();await page.locator('[data-active-model="pose-floor"][data-model-state="ready"]').waitFor({timeout:20000});
  const before=Number(await stage.getAttribute("data-rotation"));
  await page.waitForTimeout(650);const after=Number(await stage.getAttribute("data-rotation"));
  check(after<before-.006,"Clockwise Z auto-rotation failed: "+before+" -> "+after);
  const dragRect=await stage.boundingBox();
  check(!!dragRect,"3D stage not measurable");
  const startX=dragRect.x+dragRect.width*.32,startY=dragRect.y+dragRect.height*.49;
  const rotationBeforeDrag=Number(await stage.getAttribute("data-rotation"));
  if(width<=428){
   const cdp=await context.newCDPSession(page);
   await cdp.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x:startX,y:startY,id:0}]});
   for(let step=1;step<=8;step++){
    await cdp.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:startX+step*17,y:startY,id:0}]});
    await page.waitForTimeout(12);
   }
   await cdp.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
   await cdp.detach();
  }else{
   await page.mouse.move(startX,startY);await page.mouse.down();
   await page.mouse.move(startX+136,startY,{steps:8});await page.mouse.up();
  }
  const rotationAfterDrag=Number(await stage.getAttribute("data-rotation"));
  check(rotationAfterDrag<rotationBeforeDrag-.35,"Swipe right should turn clockwise on vertical Z: "+rotationBeforeDrag+" -> "+rotationAfterDrag);
  check(await stage.getAttribute("data-dragging")==="false","Drag state not released");
  await stage.focus();await page.keyboard.press("ArrowLeft");
  const rotationAfterKey=Number(await stage.getAttribute("data-rotation"));
  check(rotationAfterKey>rotationAfterDrag+.25,"ArrowLeft did not reverse the vertical rotation");
  await page.waitForTimeout(350);
  const afterIdle=Number(await stage.getAttribute("data-rotation"));
  check(Math.abs(afterIdle-rotationAfterKey)<.04,"Autoplay interrupted user drag too soon");
  const cta=await page.locator('[data-fashion-3d-hero] a').first().evaluate(el=>{
   const style=getComputedStyle(el), parse=s=>(s.match(/[\d.]+/g)||[]).slice(0,3).map(Number);
   const fg=parse(style.color), bg=parse(style.backgroundColor);
   const channel=c=>{c/=255;return c<=.04045?c/12.92:Math.pow((c+.055)/1.055,2.4)};
   const luminance=a=>.2126*channel(a[0])+.7152*channel(a[1])+.0722*channel(a[2]);
   const lum1=luminance(fg),lum2=luminance(bg);
   return {text:el.textContent,foreground:style.color,background:style.backgroundColor,ratio:(Math.max(lum1,lum2)+.05)/(Math.min(lum1,lum2)+.05)};
  });
  check(cta.ratio>=4.5,"CTA text contrast below 4.5:1 "+JSON.stringify(cta));
  const genericArrows=await page.locator("main a, main button, header a, header button").evaluateAll(nodes=>nodes.filter(n=>n.textContent?.includes("↗")).map(n=>n.textContent));
  check(genericArrows.length===0,"Forbidden generic northeast-arrow icon visible: "+JSON.stringify(genericArrows));
  if([390,1440].includes(width))await page.screenshot({path:out+"/hero-"+width+"-dragged.jpg",type:"jpeg",quality:88,animations:"disabled"});
  states.push({kind:"CLOCKWISE_Z_POINTER_AND_CTA",rotationBeforeDrag,rotationAfterDrag,rotationAfterKey,cta});
  await page.keyboard.press("Tab");
  const fontsIntro=await fonts(page,'[data-fashion-3d-hero] h1');
  check(fontsIntro.some(x=>x.family.toLowerCase().includes("be vietnam pro")),"Hero headline painted with unexpected font "+JSON.stringify(fontsIntro));
  await page.goto(origin+"/template-demos/fashion-archive/work",{waitUntil:"load",timeout:45000});
  await page.evaluate(()=>document.fonts.ready);
  const fontLook=await fonts(page,'[class*="lookMeta"] h3');
  check(fontLook.every(x=>x.family.toLowerCase().includes("be vietnam pro")),"Mixed look-card font "+JSON.stringify(fontLook));
  await page.goto(origin+"/template-demos/fashion-archive",{waitUntil:"load",timeout:45000});
  await page.evaluate(()=>document.fonts.ready);
  const fontMaterial=await fonts(page,'[class*="materialControls"] button strong');
  check(fontMaterial.every(x=>x.family.toLowerCase().includes("be vietnam pro")),"Mixed material font "+JSON.stringify(fontMaterial));
  const excerpt=await page.evaluate(()=>{const t=[...document.querySelectorAll('[class*="materialControls"] button strong')].map(e=>e.textContent);return t});
  check(excerpt.includes("Chất liệu"),"Missing Vietnamese texture label");
  for(const route of ["work","work/1","services","about","contact"]){
   const response=await page.goto(origin+"/template-demos/fashion-archive/"+route,{waitUntil:"load"});
   check(response?.status()===200,"Route "+route+" HTTP "+response?.status());
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
   check(overflow<=3,"Overflow in "+route+": "+overflow);
  }
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto(origin+"/template-demos/fashion-archive",{waitUntil:"load"});
  const staticStage=page.locator("[data-fashion-3d-hero] [data-model-state]");
  await page.locator('[data-model-state="ready"]').waitFor({timeout:28000});
  const initial=Number(await staticStage.getAttribute("data-rotation"));
  await page.waitForTimeout(500);
  const frozen=Number(await staticStage.getAttribute("data-rotation"));
  check(Math.abs(frozen-initial)<.004,"Reduced-motion model still spinning "+initial+" "+frozen);
  check(errors.length===0,"Browser runtime errors "+errors.join(" | "));
  check(failed.filter(e=>e.includes("/models/")||e.includes(".woff")).length===0,"Model or font network failures "+JSON.stringify(failed));
  results.push({width,height,modelStates:states,fontLook,fontMaterial,fontsIntro,reduced:[initial,frozen],status:"PASS"});
  console.log("FASHION_3D_QA_PASS",width,"3 models, glyph painting and reduced motion");
 }catch(e){const issue={width,height,message:String(e),errors,failed};issues.push(issue);console.error("FASHION_3D_QA_FAIL",JSON.stringify(issue));}
 await page.close();await context.close();
}
await browser.close();
writeFileSync(out+"/evidence.json",JSON.stringify({engine:"Chrome desktop plus mobile emulation",realSafari:"UNVERIFIED",results,issues},null,2)+"\n");
console.log("FASHION_3D_QA_RESULT",JSON.stringify({passed:results.length,failed:issues.length}));
if(issues.length)process.exitCode=1;
