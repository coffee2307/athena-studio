import {expect,test} from "@playwright/test";
import {supportsWebGL2} from "./webgl-capability";
const url="/template-demos/auto-showroom";
for(const {width,height} of [{width:320,height:680},{width:390,height:844},{width:428,height:926}]){
 test("Mobile showroom chapter composition never covers car "+width+"x"+height,async({page})=>{
  test.setTimeout(115000);
  await page.setViewportSize({width,height});
  await page.goto(url,{waitUntil:"domcontentloaded"});
  if(!(await supportsWebGL2(page)))return;
  const canvas=page.locator(".ix-auto-3d-canvas");
  await expect(canvas).toHaveAttribute("data-renderer","ready",{timeout:45000});
  const positions=[0,.25,.5,.75,1];
  let firstCanvas:null|{x:number,y:number,width:number,height:number}=null;
  for(let i=0;i<positions.length;i++){
   await page.evaluate(p=>{
    const e=document.getElementById("bv-cinematic-track");
    if(!e)return;
    const r=e.getBoundingClientRect();
    window.scrollTo({top:scrollY+r.top+Math.max(1,r.height-innerHeight)*p,behavior:"instant"});
   },positions[i]);
   await page.waitForFunction(p=>{
    const el=document.querySelector(".ix-auto-3d-canvas");
    return Math.abs(Number(el?.getAttribute("data-scroll-progress"))-p)<.015;
   },positions[i],{timeout:20000});
   const layout=await page.evaluate(i=>{
    const c=document.querySelector(".ix-auto-3d-canvas");
    const r=c?.getBoundingClientRect();
    if(!r)throw Error("Missing canvas");
    const f=(c.getAttribute("data-model-frame")||"").split(",").map(Number);
    const vehicleTop=r.top+(1-f[3])*r.height/2;
    const vehicleBottom=r.top+(1-f[2])*r.height/2;
    const el=i===0?document.querySelector(".ix-hero-copy"):document.querySelector(".bv-mobile-scene[data-mobile-chapter='"+i+"']");
    const story=el?.getBoundingClientRect();
    const nav=document.querySelector(".bv-cinematic-nav")?.getBoundingClientRect();
    return {canvas:{x:r.x,y:r.y,width:r.width,height:r.height},vehicleTop,vehicleBottom,storyBottom:story?.bottom||0,visibleStory:!!el&&getComputedStyle(el).display!=="none",navTop:nav?.top||0,navBottom:nav?.bottom||0,safe:c.getAttribute("data-model-safe"),overflow:document.documentElement.scrollWidth-innerWidth};
   },i);
   if(!firstCanvas)firstCanvas=layout.canvas;
   expect(Math.abs(layout.canvas.y-firstCanvas.y)).toBeLessThan(2);
   expect(Math.abs(layout.canvas.height-firstCanvas.height)).toBeLessThan(2);
   expect(layout.visibleStory).toBe(true);
   expect(layout.storyBottom).toBeLessThan(layout.vehicleTop-14);
   expect(layout.vehicleBottom).toBeLessThan(layout.navTop-16);
   expect(layout.navBottom).toBeLessThan(height-12);
   expect(layout.safe).toBe("true");
   expect(layout.overflow).toBeLessThanOrEqual(2);
  }
 });
}
