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
  // The 3D canvas can briefly unmount while WebGL initializes or swaps fallback.
  // Obtain one atomic DOM frame after the actual renderer has settled; a stale
  // Playwright element handle must not turn a healthy WebGL transition into a fail.
  const frame=await page.waitForFunction(()=>{
   const hero=document.querySelector(".ix-auto-showroom .bv-cinematic-track>.ix-hero");
   if(!hero)return null;
   const nodes=[".ix-hero-links",".ix-auto-3d-canvas",".bv-cinematic-nav"].map(selector=>hero.querySelector(selector));
   if(nodes.some(node=>!node))return null;
   const box=nodes.map(node=>{
    const r=(node as Element).getBoundingClientRect();
    return {x:r.x,y:r.y,width:r.width,height:r.height};
   });
   return box.every(r=>r.width>30&&r.height>30)?box:null;
  },undefined,{timeout:24000});
  const boxes=await frame.jsonValue();
  if(!boxes)throw new Error("McLaren canvas, copy or HUD failed to settle into a measurable frame");
  const [linksBox,canvasBox,navBox]=boxes;
  // The viewport-filling 3D canvas intentionally extends behind editorial
  // copy; only the PROJECTED vehicle mesh must stay clear of the text and HUD.
  // A canvas CSS rectangle is not the visible model silhouette.
  const projected=await canvas.getAttribute("data-model-frame");
  if(projected){
   const [left,right,bottom,top]=projected.split(",").map(Number);
   for(const n of [left,right,bottom,top])expect(Number.isFinite(n)).toBe(true);
   const modelTop=canvasBox!.y+(1-top)*canvasBox!.height/2;
   const modelBottom=canvasBox!.y+(1-bottom)*canvasBox!.height/2;
   expect(modelTop).toBeGreaterThanOrEqual(linksBox!.y+linksBox!.height-4);
   expect(modelBottom).toBeLessThanOrEqual(navBox!.y-12);
  }else{
   // Fallback photo is faded at both edges and never an interactive model.
   const mask=await canvas.evaluate(el=>getComputedStyle(el).maskImage);
   expect(mask).toBeTruthy();
  }
  expect(navBox!.x).toBeGreaterThanOrEqual(0);
  expect(navBox!.x+navBox!.width).toBeLessThanOrEqual(width);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(2);
  const buttons=nav.getByRole("button");
  await expect(buttons).toHaveCount(5);
  for(const button of await buttons.all())expect((await button.boundingBox())?.height).toBeGreaterThanOrEqual(44);
 });
}

test("wide home camera aims left to place the car clear of editorial copy",async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto(home,{waitUntil:"domcontentloaded"});
 const canvas=page.locator(".ix-auto-3d-canvas");
 if(await supportsWebGL2(page))await expect(canvas).toHaveAttribute("data-camera-target-x","0.00",{timeout:15000});
 else await expect(canvas).toHaveAttribute("data-renderer","fallback",{timeout:15000});
});
