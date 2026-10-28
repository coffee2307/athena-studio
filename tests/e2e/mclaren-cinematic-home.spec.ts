import {expect,test} from "@playwright/test";
import {supportsWebGL2} from "./webgl-capability";

test("McLaren homepage is a reversible five-scene scroll film with one canvas",async({page})=>{
 test.setTimeout(90000);
 await page.emulateMedia({reducedMotion:"no-preference"});
 await page.setViewportSize({width:1440,height:900});
 await page.goto("/template-demos/auto-showroom",{waitUntil:"domcontentloaded"});
 const track=page.locator("#bv-cinematic-track");
 const canvas=track.locator("canvas.ix-auto-3d-canvas");
 const nav=track.locator(".bv-cinematic-nav button");
 await expect(track).toHaveCount(1);
 await expect(track.locator(".bv-cinematic-step")).toHaveCount(5);
 await expect(nav).toHaveCount(5);
 await expect(canvas).toHaveCount(1);
 await expect(track).toHaveAttribute("data-chapter","0");
 // Wait for the client scroll owner to hydrate before clicking SSR buttons.
 await expect.poll(()=>track.evaluate(element=>element.style.getPropertyValue("--bv-progress"))).not.toBe("");
 // This test checks chapter state, not smooth-scroll timing under software WebGL.
 // A separate test verifies that real navigation requests smooth scrolling.
 await page.evaluate(()=>{
  const nativeScrollTo=window.scrollTo.bind(window);
  window.scrollTo=((options:ScrollToOptions)=>nativeScrollTo({...options,behavior:"instant"})) as typeof window.scrollTo;
 });

 await nav.nth(1).click();
 await expect(track).toHaveAttribute("data-chapter","1");
 await nav.nth(2).click();
 await expect(track).toHaveAttribute("data-chapter","2");
 await expect(track.locator(".bv-cinematic-copy.is-current")).toContainText("EVERY SURFACE COUNTS.");
 const state=await track.evaluate(element=>{
  const rect=element.getBoundingClientRect();
  const p=Math.max(0,Math.min(1,-rect.top/Math.max(1,rect.height-innerHeight)));
  const shown=Number.parseFloat(getComputedStyle(element).getPropertyValue("--bv-progress"));
  return {p,shown};
 });
 expect(Math.abs(state.p-state.shown)).toBeLessThan(.02);

 if(await supportsWebGL2(page)){
  await expect(canvas).toHaveAttribute("data-renderer","ready",{timeout:30000});
  await expect.poll(async()=>Number(await canvas.getAttribute("data-scroll-progress"))).toBeGreaterThan(.45);
  const quality=await canvas.getAttribute("data-render-quality");
  const dpr=Number(await canvas.getAttribute("data-render-dpr"));
  if(quality==="adaptive-high")expect(dpr).toBeGreaterThanOrEqual(.95);
  else expect(quality).toBe("compatibility");
 }else{
  await expect(canvas).toHaveAttribute("data-renderer","fallback",{timeout:30000});
 }
 await nav.nth(0).click();
 await expect(track).toHaveAttribute("data-chapter","0");
 await expect.poll(async()=>track.evaluate(element=>Number.parseFloat(getComputedStyle(element).getPropertyValue("--bv-progress")))).toBeLessThan(.02);
});

test("McLaren mobile story preserves native scroll and a skip link",async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto("/template-demos/auto-showroom",{waitUntil:"domcontentloaded"});
 const track=page.locator("#bv-cinematic-track");
 await expect(track).toBeVisible();
 const before=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
 expect(before).toBeLessThanOrEqual(2);
 await track.getByRole("link",{name:/BỎ QUA HÀNH TRÌNH/}).click();
 await expect(page.locator("#bv-after-cinematic")).toBeInViewport();
});

test("McLaren chapter buttons request smooth native scrolling and respect reduced motion",async({page})=>{
 await page.emulateMedia({reducedMotion:"no-preference"});
 await page.setViewportSize({width:1440,height:900});
 await page.goto("/template-demos/auto-showroom",{waitUntil:"domcontentloaded"});
 const track=page.locator("#bv-cinematic-track");
 await expect.poll(()=>track.evaluate(element=>element.style.getPropertyValue("--bv-progress"))).not.toBe("");
 await page.evaluate(()=>{
  const original=window.scrollTo.bind(window);
  window.scrollTo=((options:ScrollToOptions)=>{
   document.documentElement.dataset.cinematicScrollBehavior=options.behavior??"auto";
   original(options);
  }) as typeof window.scrollTo;
 });
 const nav=page.locator("#bv-cinematic-track .bv-cinematic-nav button");
 await nav.nth(3).click();
 await expect(page.locator("html")).toHaveAttribute("data-cinematic-scroll-behavior","smooth");
 await expect(page.locator("#bv-cinematic-track")).toHaveAttribute("data-chapter","3");
 await page.emulateMedia({reducedMotion:"reduce"});
 await nav.nth(0).click();
 await expect(page.locator("html")).toHaveAttribute("data-cinematic-scroll-behavior","instant");
});
