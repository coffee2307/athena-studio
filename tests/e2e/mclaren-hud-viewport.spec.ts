import {expect,test} from "@playwright/test";
import {supportsWebGL2} from "./webgl-capability";

test("McLaren showroom keeps chapter navigation on-screen in the opening viewport",async({page})=>{
 for(const viewport of [
  {width:320,height:700},
  {width:390,height:844},
  {width:1280,height:720},
 ]){
  await page.setViewportSize(viewport);
  await page.goto("/template-demos/auto-showroom",{waitUntil:"domcontentloaded"});
  const nav=page.locator(".bv-cinematic-nav");
  await expect(nav).toBeVisible();
  await expect.poll(()=>page.evaluate(()=>{
   const nav=document.querySelector(".bv-cinematic-nav")!.getBoundingClientRect();
   return nav.top>=0&&nav.bottom<=innerHeight-8;
  }),{message:`chapter navigation visible at ${viewport.width}px`}).toBe(true);
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),{
   message:`no horizontal overflow at ${viewport.width}px`,
  }).toBe(true);
  if(viewport.width>760){
   const overlap=await page.evaluate(()=>{
    const c=document.querySelector(".ix-hero-links")!.getBoundingClientRect();
    const s=document.querySelector(".bv-cinematic-skip")!.getBoundingClientRect();
    const zoom=document.querySelector(".bv-zoom-controls")!.getBoundingClientRect();
    const nav=document.querySelector(".bv-cinematic-nav")!.getBoundingClientRect();
    const intersect=(a:DOMRect,b:DOMRect)=>
     a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
    return {skip:intersect(c,s),controls:intersect(zoom,nav)};
   });
   expect(overlap,{message:"desktop hero CTA and chapter controls must remain separate"})
    .toEqual({skip:false,controls:false});
  }
 }
});

test("McLaren scroll camera uses authored absolute angles after repeated user spins",async({page})=>{
 test.setTimeout(60000);
 await page.setViewportSize({width:1280,height:720});
 await page.goto("/template-demos/auto-showroom",{waitUntil:"domcontentloaded"});
 if(!(await supportsWebGL2(page))){test.skip();return;}
 const canvas=page.locator('.ix-auto-3d-canvas[data-scene-type="auto-showroom"]');
 await expect(canvas).toHaveAttribute("data-renderer","ready",{timeout:40000});
 const rect=await canvas.boundingBox();
 expect(rect).not.toBeNull();
 const x=rect!.x+rect!.width*.66,y=rect!.y+rect!.height*.49;
 for(let i=0;i<8;i++){
  await page.mouse.move(x,y);
  await page.mouse.down();
  await page.mouse.move(x+175,y,{steps:5});
  await page.mouse.up();
 }
 await expect.poll(()=>canvas.getAttribute("data-orbit-source")).toBe("drag");
 await page.evaluate(()=>{
  const track=document.getElementById("bv-cinematic-track")!;
  const rect=track.getBoundingClientRect();
  const extent=Math.max(1,rect.height-innerHeight);
  window.scrollTo({top:rect.top+scrollY+extent*.34,behavior:"instant"});
 });
 await expect.poll(()=>canvas.getAttribute("data-orbit-source")).toBe("scroll");
 await expect.poll(async()=>{
  const values=await canvas.evaluate(element=>({
   progress:Number(element.getAttribute("data-scroll-progress")),
   orbit:Number(element.getAttribute("data-camera-orbit")),
   goal:Number(element.getAttribute("data-camera-goal-orbit")),
  }));
  const keyframes=[1.02,1.42,2.12,3.82,5.42];
  const position=Math.max(0,Math.min(4,values.progress*4));
  const lower=Math.min(3,Math.floor(position));
  const fraction=position-lower;
  const eased=fraction*fraction*(3-2*fraction);
  const expected=keyframes[lower]+(keyframes[lower+1]-keyframes[lower])*eased;
  const difference=(a:number,b:number)=>Math.abs(Math.atan2(Math.sin(a-b),Math.cos(a-b)));
  return values.progress>.28&&difference(values.goal,expected)<.02&&difference(values.orbit,expected)<.12;
 },{timeout:15000,message:"camera should settle on the fixed chapter pose via the shortest arc"}).toBe(true);
});
