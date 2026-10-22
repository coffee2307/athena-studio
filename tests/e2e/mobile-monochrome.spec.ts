import {test,expect} from "@playwright/test";
for(const width of [320,375,390,428]){
 test(`Monochrome mobile drawer and footer ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:844});
  await page.goto("/");
  const menu=page.locator("#athena-mobile-menu");
  const trigger=page.locator(".agency-menu-toggle");
  await expect(trigger).toBeVisible();
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded","true");
  await expect(menu).toBeVisible();
  await expect(menu.locator('a[href="/services"]')).toBeVisible();
  await expect(menu.locator('a[href="/services/ai-integration"]')).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded","false");
  await trigger.click();
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded","false");
  await trigger.click();
  await page.locator(".agency-menu-backdrop").click({position:{x:5,y:230}});
  await expect(trigger).toHaveAttribute("aria-expanded","false");
  await trigger.click();
  await menu.locator('a[href="/projects"]').click();
  await expect(page).toHaveURL(/\/projects/);
  await expect(trigger).toHaveAttribute("aria-expanded","false");
  const metrics=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth}));
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth+1);
  const footer=page.locator(".agency-footer");
  await footer.scrollIntoViewIfNeeded();
  await expect(footer.locator('a[href^="https://zalo.me/"]')).toBeVisible();
  await expect(footer.locator('a[href^="https://wa.me/"]')).toBeVisible();
  await expect(page.locator(".agency-footer-main")).toHaveCSS("flex-direction","column");
 });
}
test("Main site visual palette is grayscale",async({page})=>{
 await page.goto("/");
 const selectors=[".client-hero",".client-quick-nav",".client-solution-card",".client-solution-card:nth-child(2)",".client-solution-card:nth-child(3)",".athena-editorial-seam",".agency-footer-cta"];
 for(const selector of selectors){
  const el=page.locator(selector).first();
  await expect(el).toBeVisible();
  const c=await el.evaluate(element=>getComputedStyle(element).backgroundColor);
  const parts=c.match(/[\d.]+/g)?.map(Number)||[];
  expect(Math.max(...parts.slice(0,3))-Math.min(...parts.slice(0,3)),selector+" "+c).toBeLessThanOrEqual(4);
 }
});
test("Reduced-motion mobile menu locks and restores background scroll",async({page})=>{
 await page.setViewportSize({width:390,height:700});
 await page.emulateMedia({reducedMotion:"reduce"});
 await page.goto("/");
 const trigger=page.locator(".agency-menu-toggle");
 await trigger.click();
 await expect(page.locator(".agency-mobile-panel")).toBeVisible();
 await expect(page.locator(".agency-mobile-panel")).toHaveCSS("transition-duration","0s");
 await expect(page.locator("body")).toHaveCSS("overflow","hidden");
 await trigger.click();
 await expect(page.locator("body")).not.toHaveCSS("overflow","hidden");
});
