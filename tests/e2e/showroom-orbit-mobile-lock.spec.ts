import {expect,test} from "@playwright/test";
import {supportsWebGL2} from "./webgl-capability";
const route="/template-demos/auto-showroom";

for(const {width,height,minStage} of [
 {width:320,height:680,minStage:270},
 {width:390,height:844,minStage:340},
 {width:428,height:926,minStage:340}
]){
 test("BLACK VELOCITY locked mobile stage "+width,async({page})=>{
  test.setTimeout(80000);
  await page.setViewportSize({width,height});
  await page.goto(route,{waitUntil:"domcontentloaded"});
  const canvas=page.locator(".ix-auto-3d-canvas");
  // React may replace the canvas as the GLB renderer changes loading state.
  // Measure the real live node and its dimensions in a single DOM frame.
  const stage=await page.waitForFunction((minimum:number)=>{
   const el=document.querySelector(".ix-auto-3d-canvas");
   if(!el)return null;
   const r=el.getBoundingClientRect();
   if(r.width<100||r.height<minimum)return null;
   return {width:r.width,height:r.height,renderer:el.getAttribute("data-renderer")};
  },minStage,{timeout:30000});
  expect((await stage.jsonValue())?.height??0).toBeGreaterThanOrEqual(minStage);
  await expect(page.locator(".bv-zoom-controls")).toBeHidden();
  const nav=page.locator(".bv-cinematic-nav").getByRole("button");
  await expect(nav).toHaveCount(5);
  for(const item of await nav.all())expect((await item.boundingBox())?.height||0).toBeGreaterThanOrEqual(44);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(2);
  if(await supportsWebGL2(page)){
   await expect(canvas).toHaveAttribute("data-renderer","ready",{timeout:55000});
   await expect(canvas).toHaveAttribute("data-model-safe","true");
   const frame=(await canvas.getAttribute("data-model-frame"))?.split(",").map(Number)||[];
   expect(frame[1]-frame[0]).toBeGreaterThan(1.15);
  }
 });
}
test("BLACK VELOCITY drag many times then scroll without counter-rotation",async({page})=>{
 test.setTimeout(110000);
 await page.setViewportSize({width:390,height:844});
 await page.goto(route,{waitUntil:"domcontentloaded"});
 if(!(await supportsWebGL2(page)))return;
 const canvas=page.locator(".ix-auto-3d-canvas");
 await expect(canvas).toHaveAttribute("data-renderer","ready",{timeout:55000});
 const box=await canvas.boundingBox();
 if(!box)throw Error("No WebGL surface");
 const cy=box.y+box.height*.5,start=box.x+45,end=box.x+box.width-45;
 for(let i=0;i<9;i++){
  await page.mouse.move(start,cy);await page.mouse.down();
  for(let j=1;j<=12;j++)await page.mouse.move(start+(end-start)*j/12,cy);
  await page.mouse.up();
 }
 const angle=Number(await canvas.getAttribute("data-orbit-offset"));
 expect(Number.isFinite(angle)).toBe(true);
 expect(Math.abs(angle)).toBeLessThanOrEqual(Math.PI+.001);
 expect(Math.abs(angle)).toBeGreaterThan(.01);
 await page.evaluate(()=>{
  const track=document.getElementById("bv-cinematic-track");
  if(!track)return;
  const r=track.getBoundingClientRect();
  window.scrollTo({top:window.scrollY+r.top+Math.max(1,r.height-innerHeight)*.51,behavior:"instant"});
 });
 await page.waitForFunction(()=>Number(document.querySelector(".ix-auto-3d-canvas")?.getAttribute("data-scroll-progress"))>.40,{timeout:30000});
 await page.waitForTimeout(250);
 await page.waitForFunction(()=>{
  const el=document.querySelector(".ix-auto-3d-canvas");
  return el?.getAttribute("data-camera-mode")==="scroll"&&Math.abs(Number(el.getAttribute("data-scroll-progress"))-.51)<.007;
 },undefined,{timeout:30000});
 const after=Number(await canvas.getAttribute("data-camera-yaw"));
 const expected=2.12;
 expect(Math.abs(Math.atan2(Math.sin(after-expected),Math.cos(after-expected)))).toBeLessThan(.15);
 await expect(canvas).toHaveAttribute("data-model-safe","true");
});


test("BLACK VELOCITY desktop drag is immediate and does not unwind on scroll",async({page})=>{
 test.setTimeout(110000);
 await page.setViewportSize({width:1440,height:900});
 await page.goto(route,{waitUntil:"domcontentloaded"});
 if(!(await supportsWebGL2(page)))return;
 const canvas=page.locator(".ix-auto-3d-canvas");
 await expect(canvas).toHaveAttribute("data-renderer","ready",{timeout:55000});
 const b=await canvas.boundingBox();
 if(!b)throw Error("No desktop WebGL surface");
 const y=b.y+b.height*.52,start=b.x+b.width*.66,end=b.x+b.width*.90;
 for(let i=0;i<9;i++){
  await page.mouse.move(start,y);await page.mouse.down();
  for(let j=1;j<=10;j++)await page.mouse.move(start+(end-start)*j/10,y);
  await page.mouse.up();
 }
 const before=Number(await canvas.getAttribute("data-orbit-offset"));
 expect(Math.abs(before)).toBeGreaterThan(.01);
 expect(Math.abs(before)).toBeLessThanOrEqual(Math.PI+.001);
 await page.evaluate(()=>{
  const track=document.getElementById("bv-cinematic-track");
  if(!track)return;
  const r=track.getBoundingClientRect();
  scrollTo({top:scrollY+r.top+Math.max(1,r.height-innerHeight)*.51,behavior:"instant"});
 });
 await page.waitForFunction(()=>Number(document.querySelector(".ix-auto-3d-canvas")?.getAttribute("data-scroll-progress"))>.40,{timeout:30000});
 await page.waitForFunction(()=>{
  const el=document.querySelector(".ix-auto-3d-canvas");
  return el?.getAttribute("data-camera-mode")==="scroll"&&Math.abs(Number(el.getAttribute("data-scroll-progress"))-.51)<.007;
 },undefined,{timeout:30000});
 const after=Number(await canvas.getAttribute("data-camera-yaw"));
 expect(Math.abs(Math.atan2(Math.sin(after-2.12),Math.cos(after-2.12)))).toBeLessThan(.15);
 await expect(canvas).toHaveAttribute("data-model-safe","true");
});

test("BLACK VELOCITY mobile camera radius and stage remain fixed during drag and across all chapters",async({page})=>{
 test.setTimeout(110000);
 await page.setViewportSize({width:390,height:844});
 await page.goto(route,{waitUntil:"domcontentloaded"});
 if(!(await supportsWebGL2(page)))return;
 const canvas=page.locator(".ix-auto-3d-canvas");
 await expect(canvas).toHaveAttribute("data-renderer","ready",{timeout:55000});
 const first=await canvas.boundingBox();
 if(!first)throw Error("Missing stage");
 const radius=Number(await canvas.getAttribute("data-camera-radius"));
 const cx=first.x+first.width*.47,cy=first.y+first.height*.5;
 const samples:number[]=[];
 for(let i=0;i<9;i++){
  await page.mouse.move(cx-110,cy);await page.mouse.down();
  for(let j=1;j<=10;j++)await page.mouse.move(cx-110+j*22,cy);
  await page.mouse.up();
  samples.push(Number(await canvas.getAttribute("data-camera-radius")));
 }
 for(const recorded of samples)expect(Math.abs(recorded-radius)).toBeLessThan(.001);
 for(const index of [1,2,3,4,0]){
  const expected=[.72,1.42,2.12,3.82,5.42][index];
  await page.evaluate(p=>{
   const track=document.getElementById("bv-cinematic-track");
   if(!track)return;const rect=track.getBoundingClientRect();
   scrollTo({top:scrollY+rect.top+Math.max(1,rect.height-innerHeight)*p,behavior:"instant"});
  },index/4);
  await page.waitForFunction(p=>{
   const el=document.querySelector(".ix-auto-3d-canvas");
   return el?.getAttribute("data-camera-mode")==="scroll"&&Math.abs(Number(el.getAttribute("data-scroll-progress"))-p)<.007;
  },index/4,{timeout:30000});
  const yaw=Number(await canvas.getAttribute("data-camera-yaw"));
  expect(Math.abs(Math.atan2(Math.sin(yaw-expected),Math.cos(yaw-expected)))).toBeLessThan(.12);
  expect(Math.abs(Number(await canvas.getAttribute("data-camera-radius"))-radius)).toBeLessThan(.002);
  const current=await canvas.boundingBox();
  expect(Math.abs((current?.height||0)-first.height)).toBeLessThan(1.2);
  await expect(canvas).toHaveAttribute("data-model-safe","true");
 }
});
