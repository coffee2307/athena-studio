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
  await expect(canvas).toBeVisible();
  const box=await canvas.boundingBox();
  expect(box?.height||0).toBeGreaterThanOrEqual(minStage);
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
 const after=Number(await canvas.getAttribute("data-orbit-offset"));
 expect(Math.abs(angle-after)).toBeLessThan(.001);
 await expect(canvas).toHaveAttribute("data-model-safe","true");
});
