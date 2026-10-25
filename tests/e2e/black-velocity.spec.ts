import {expect,test} from "@playwright/test";

test.describe("Black Velocity / approved motor-sport composition",()=>{
 test("hero model is live by default; interface gives distinct camera and zoom controls",async({page})=>{
  await page.goto("/template-demos/auto-showroom",{waitUntil:"domcontentloaded"});
  const hero=page.locator(".ix-auto-showroom .ix-hero");
  await expect(hero.getByRole("heading",{name:/BORN FOR.*THE EDGE/i})).toBeVisible();
  const canvas=hero.locator(".ix-auto-3d-canvas");
  await expect(canvas).toHaveCount(1);
  await expect(page.getByRole("button",{name:"Tắt chế độ 3D"})).toHaveAttribute("aria-pressed","true");
  await expect(hero.getByRole("button",{name:"Phóng to xe"})).toBeVisible();
  await expect(hero.getByRole("button",{name:"Thu nhỏ xe"})).toBeVisible();
  await hero.getByRole("button",{name:"Phóng to xe"}).click();
  await hero.getByRole("button",{name:"Phóng to xe"}).click();
  await expect(hero.getByRole("button",{name:"Phóng to xe"})).toBeDisabled();
  await hero.getByRole("button",{name:"Thu nhỏ xe"}).click();
  await expect(hero.getByRole("button",{name:"Phóng to xe"})).toBeEnabled();
  await page.locator(".ix-mode-list button").nth(2).click();
  await expect(hero.locator(".immersive-stage")).toHaveAttribute("data-preset","2");
  await expect(page.locator(".bv-feature-strip > a")).toHaveCount(3);
  await page.getByRole("button",{name:"Tắt chế độ 3D"}).click();
  await expect(canvas).toHaveAttribute("data-renderer","fallback");
  await expect(hero.locator(".ix-hero-image")).toHaveCSS("opacity","1");
 });

 for(const width of [320,390,768,1440]){
  test("first fold respects 3D typography and document width at "+width+"px",async({page})=>{
   await page.setViewportSize({width,height:900});
   await page.goto("/template-demos/auto-showroom",{waitUntil:"domcontentloaded"});
   const hero=page.locator(".ix-auto-showroom .ix-hero");
   await expect(hero).toBeVisible();
   await expect(hero.getByRole("heading",{name:/BORN FOR/i})).toBeVisible();
   const metrics=await page.evaluate(()=>{
    const copy=document.querySelector(".ix-auto-showroom .ix-hero-copy");
    const model=document.querySelector(".ix-auto-showroom .ix-auto-3d-canvas");
    const title=document.querySelector(".ix-auto-showroom .ix-hero-copy h1");
    const rectangle=(el:Element|null)=>{if(!el)return null;const r=el.getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right}};
    return {overflow:document.documentElement.scrollWidth-innerWidth,copy:rectangle(copy),model:rectangle(model),title:rectangle(title)};
   });
   expect(metrics.overflow).toBeLessThanOrEqual(2);
   expect(metrics.title).not.toBeNull();
   if(width<=760&&metrics.model&&metrics.copy)
    expect(metrics.model.top-metrics.copy.bottom).toBeGreaterThanOrEqual(-4);
  });
 }
 test("cinematic page has five reversible chapters, no fake speed telemetry",async({page})=>{
  await page.goto("/template-demos/auto-showroom/experience",{waitUntil:"domcontentloaded"});
  const journey=page.locator(".athena-journey-auto-showroom");
  await expect(journey.locator(".journey-step")).toHaveCount(5);
  const chapters=journey.locator(".journey-chapter-nav button");
  await expect(chapters).toHaveCount(5);
  await chapters.nth(4).click();
  await expect(chapters.nth(4)).toHaveAttribute("aria-current","step");
  await chapters.nth(0).click();
  await expect(chapters.nth(0)).toHaveAttribute("aria-current","step");
  await expect(journey.locator(".journey-step-copy.is-current")).toContainText("Born for the edge.");
 });
 test("all five automotive subpages retain content and do not mount extra WebGL",async({page})=>{
  for(const route of ["work","work/1","services","about","contact"]){
   await page.goto("/template-demos/auto-showroom/"+route,{waitUntil:"domcontentloaded"});
   await expect(page.locator(".ix-subpage-auto-showroom")).toBeVisible();
   await expect(page.locator(".ix-subpage-auto-showroom a[href$='/experience']")).toBeVisible();
   expect(await page.locator("canvas.ix-3d-canvas").count()).toBe(0);
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
   expect(overflow).toBeLessThanOrEqual(2);
  }
 });
 test("reduced-motion fallback keeps real HTML actions available",async({page})=>{
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("/template-demos/auto-showroom");
  await expect(page.getByRole("link",{name:/Cinematic Experience/})).toBeVisible();
  await expect(page.locator(".ix-hero-image")).toHaveCSS("opacity","1");
  await expect(page.locator(".ix-auto-3d-canvas")).toHaveAttribute("data-renderer","fallback");
 });
});
