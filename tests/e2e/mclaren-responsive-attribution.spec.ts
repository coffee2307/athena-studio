import {expect,test} from "@playwright/test";
import {supportsWebGL2} from "./webgl-capability";

const home="/template-demos/auto-showroom";

test("McLaren home and cinematic route credit the reported creator and CC BY source",async({page})=>{
 await page.goto(home,{waitUntil:"domcontentloaded"});
 const credit=page.locator(".ix-scene-rail .ix-glb-credit");
 await expect(credit).toContainText("vecarz (@heynic)");
 await expect(credit.getByRole("link",{name:"McLaren P1"})).toHaveAttribute("href",/sketchfab\.com\/3d-models\/mclaren-p1/);
 await expect(credit.getByRole("link",{name:"CC BY 4.0"})).toHaveAttribute("href","https://creativecommons.org/licenses/by/4.0/");
 await page.goto(home+"/experience",{waitUntil:"domcontentloaded"});
 await expect(page.locator(".journey-outro .ix-glb-credit")).toContainText("vecarz (@heynic)");
});

for(const {width,height} of [{width:320,height:900},{width:390,height:844}]){
 test(`McLaren mobile ${width}px separates copy, car and accessible five-step control`,async({page})=>{
  await page.setViewportSize({width,height});
  await page.goto(home,{waitUntil:"domcontentloaded"});
  const hero=page.locator(".ix-auto-showroom .bv-cinematic-track>.ix-hero");
  const links=hero.locator(".ix-hero-links");
  const canvas=hero.locator(".ix-auto-3d-canvas");
  const nav=hero.locator(".bv-cinematic-nav");
  await expect(links).toBeVisible();
  await expect(canvas).toBeVisible();
  await expect(hero.locator(".bv-model-credit")).toContainText("vecarz");
  const [linksBox,canvasBox,navBox]=await Promise.all([links.boundingBox(),canvas.boundingBox(),nav.boundingBox()]);
  expect(linksBox).not.toBeNull();expect(canvasBox).not.toBeNull();expect(navBox).not.toBeNull();
  expect(linksBox!.y+linksBox!.height).toBeLessThanOrEqual(canvasBox!.y+10);
  expect(canvasBox!.y+canvasBox!.height).toBeLessThanOrEqual(navBox!.y-18);
  expect(navBox!.x).toBeGreaterThanOrEqual(0);
  expect(navBox!.x+navBox!.width).toBeLessThanOrEqual(width);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(2);
  const buttons=nav.getByRole("button");
  await expect(buttons).toHaveCount(5);
  for(const button of await buttons.all())expect((await button.boundingBox())?.height).toBeGreaterThanOrEqual(44);
 });
}

test("auto showroom hides redundant viewpoint and 3D toggle buttons",async({page})=>{
 await page.goto(home,{waitUntil:"domcontentloaded"});
 await expect(page.locator(".ix-auto-showroom .ix-rail-actions")).toHaveCount(0);
 await expect(page.locator(".ix-auto-showroom .bv-cinematic-nav button")).toHaveCount(5);
 await expect(page.locator(".ix-auto-showroom .ix-scene-rail .ix-glb-credit")).toContainText("vecarz");
});

test("mobile model moves continuously across the chapter-one boundary",async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto(home,{waitUntil:"domcontentloaded"});
 const track=page.locator("#bv-cinematic-track");
 const canvas=track.locator("canvas.ix-auto-3d-canvas");
 await expect.poll(()=>track.evaluate(el=>el.style.getPropertyValue("--bv-progress"))).not.toBe("");
 const sample=async(progress:number)=>{
  await page.evaluate(value=>{
   const el=document.getElementById("bv-cinematic-track")!;
   const distance=el.getBoundingClientRect().height-innerHeight;
   window.scrollTo({top:el.getBoundingClientRect().top+scrollY+distance*value,behavior:"instant"});
  },progress);
  await expect.poll(()=>track.evaluate(el=>Number(el.style.getPropertyValue("--bv-progress")))).toBeGreaterThan(progress-.008);
  return (await canvas.boundingBox())!.y;
 };
 const start=await sample(.02);
 const before=await sample(.18);
 const after=await sample(.22);
 const finish=await sample(.32);
 expect(start).toBeGreaterThan(before);
 expect(before).toBeGreaterThan(after);
 expect(after).toBeGreaterThan(finish);
 expect(before-after).toBeLessThan(80);
 await expect(track).toHaveAttribute("data-chapter","1");
 await expect(track.locator(".bv-model-credit")).toHaveCSS("opacity","0");
});

test("wide home camera shifts its lens while orbiting around the centered car",async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto(home,{waitUntil:"domcontentloaded"});
 const canvas=page.locator(".ix-auto-3d-canvas");
 if(await supportsWebGL2(page)){
  await expect(canvas).toHaveAttribute("data-camera-target-x","0.00",{timeout:15000});
  expect(Number(await canvas.getAttribute("data-camera-film-offset"))).toBeLessThan(-5);
 }else await expect(canvas).toHaveAttribute("data-renderer","fallback",{timeout:15000});
});

test("scrolling after many manual turns reaches the authored absolute orbit",async({page})=>{
 test.setTimeout(60000);
 await page.setViewportSize({width:1440,height:900});
 await page.goto(home,{waitUntil:"domcontentloaded"});
 const canvas=page.locator("canvas.ix-auto-3d-canvas");
 if(!(await supportsWebGL2(page)))return;
 await expect(canvas).toHaveAttribute("data-renderer","ready",{timeout:30000});
 await page.evaluate(()=>{
  const element=document.querySelector<HTMLCanvasElement>("canvas.ix-auto-3d-canvas")!;
  // Synthetic pointer moves exercise the exact gesture handlers without
  // moving the physical test mouse outside the browser viewport.
  Object.defineProperty(element,"setPointerCapture",{value:()=>{},configurable:true});
  const emit=(name:string,x:number)=>element.dispatchEvent(new PointerEvent(name,{
   bubbles:true,pointerId:1,isPrimary:true,clientX:x,clientY:500
  }));
  emit("pointerdown",300);
  for(let i=1;i<=140;i++)emit("pointermove",300+i*35);
  emit("pointerup",5200);
 });
 await expect(canvas).toHaveAttribute("data-orbit-source","drag");
 const before=Number(await canvas.getAttribute("data-manual-orbit"));
 expect(Math.abs(before)).toBeLessThanOrEqual(Math.PI);
 await page.evaluate(()=>{window.scrollBy(0,120);window.dispatchEvent(new Event("scroll"));});
 await expect(canvas).toHaveAttribute("data-orbit-source","scroll");
 const wrap=(a:number)=>Math.atan2(Math.sin(a),Math.cos(a));
 const expected=(p:number)=>{
  const angles=[1.02,1.42,2.12,3.82,5.42];
  const position=Math.max(0,Math.min(4,p*4));
  const lower=Math.min(3,Math.floor(position));
  const t=position-lower;
  const s=t*t*(3-2*t);
  return wrap(angles[lower]+(angles[lower+1]-angles[lower])*s);
 };
 await expect.poll(async()=>{
  const p=Number(await canvas.getAttribute("data-scroll-progress"));
  const goal=Number(await canvas.getAttribute("data-camera-goal-orbit"));
  return Math.abs(wrap(goal-expected(p)));
 }).toBeLessThan(.002);
 await expect.poll(async()=>Math.abs(wrap(Number(await canvas.getAttribute("data-camera-orbit"))-Number(await canvas.getAttribute("data-camera-goal-orbit"))))).toBeLessThan(.08);


 await expect(canvas).toHaveAttribute("data-model-x","0.0000");
 await expect(canvas).toHaveAttribute("data-camera-target-x","0.00");
});

test("desktop framing scales with width while preserving the orbit center",async({page})=>{
 await page.setViewportSize({width:1600,height:900});
 await page.goto(home,{waitUntil:"domcontentloaded"});
 if(!(await supportsWebGL2(page)))return;
 const canvas=page.locator("canvas.ix-auto-3d-canvas");
 await expect(canvas).toHaveAttribute("data-renderer","ready",{timeout:30000});
 const offset=async()=>Number(await canvas.getAttribute("data-camera-film-offset"));
 await expect.poll(offset).toBe(-7);
 await page.setViewportSize({width:1280,height:900});
 await expect.poll(offset).toBeGreaterThan(-7);
 await page.setViewportSize({width:1100,height:900});
 await expect.poll(offset).toBeGreaterThan(-5);
 await expect(canvas).toHaveAttribute("data-camera-target-x","0.00");
 await expect(canvas).toHaveAttribute("data-model-x","0.0000");
});
