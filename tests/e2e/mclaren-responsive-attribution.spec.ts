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

test("wide home camera shifts its lens while orbiting around the centered car",async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto(home,{waitUntil:"domcontentloaded"});
 const canvas=page.locator(".ix-auto-3d-canvas");
 if(await supportsWebGL2(page)){
  await expect(canvas).toHaveAttribute("data-camera-target-x","0.00",{timeout:15000});
  expect(Number(await canvas.getAttribute("data-camera-film-offset"))).toBeLessThan(-5);
 }else await expect(canvas).toHaveAttribute("data-renderer","fallback",{timeout:15000});
});

test("dragging multiple full turns stays centered and scrolling does not unwind the camera",async({page})=>{
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
 await expect.poll(async()=>Number(await canvas.getAttribute("data-manual-orbit"))).toBeLessThan(-1.5);
 const before=Number(await canvas.getAttribute("data-manual-orbit"));
 expect(Math.abs(before)).toBeLessThanOrEqual(Math.PI);
 await page.evaluate(()=>{window.scrollBy(0,120);window.dispatchEvent(new Event("scroll"));});
 await page.waitForTimeout(400);
 const after=Number(await canvas.getAttribute("data-manual-orbit"));
 expect(Math.abs(after-before)).toBeLessThan(.001);
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
