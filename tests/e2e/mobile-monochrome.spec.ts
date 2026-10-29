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
test("Approved creative studio palette uses restrained warm neutral and one meaningful accent",async({page})=>{
 await page.goto("/");
 const hero=page.locator(".dna-home-hero");
 await expect(hero).toBeVisible();
 await expect(hero).toHaveCSS("background-color","rgb(246, 245, 241)");
 const primary=page.locator(".dna-home-hero .dna-button-primary");
 await expect(primary).toBeVisible();
 await expect(primary).toHaveCSS("background-color","rgb(217, 95, 66)");
 await expect(page.locator(".dna-services-grid-home .dna-service-card")).toHaveCount(3);
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

test("Mobile menu exposes distinct square login/sign-up controls and a valid menu counter",async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.route("**/api/identity/get-session",route=>route.fulfill({status:503,contentType:"application/json",body:'{"error":"disabled"}'}));
 await page.goto("/");
 await page.locator(".agency-menu-toggle").click();
 const menu=page.locator("#athena-mobile-menu");
 await expect(menu.locator(".agency-mobile-menu-counter")).toHaveText("01 / 05");
 const signin=menu.locator(".agency-mobile-signin");
 const signup=menu.locator(".agency-mobile-signup");
 await expect(signin).toBeVisible();
 await expect(signup).toBeVisible();
 await expect(signin).toHaveAttribute("href","/login");
 await expect(signup).toHaveAttribute("href","/signup");
 await expect(signin).toHaveCSS("border-radius","0px");
 await expect(signup).toHaveCSS("border-radius","0px");
 await expect(menu).toHaveCSS("border-top-left-radius","0px");
});

test("Pending mobile identity shows readable Vietnamese text, not CSS-generated garbling",async({page})=>{
 await page.setViewportSize({width:390,height:844});
 let release:()=>void=()=>{};
 const blocked=new Promise<void>(resolve=>{release=()=>resolve();});
 await page.route("**/api/identity/get-session",async route=>{await blocked;await route.fulfill({status:503,contentType:"application/json",body:'{"error":"disabled"}'});});
 await page.goto("/",{waitUntil:"domcontentloaded"});
 await page.locator(".agency-menu-toggle").click();
 const status=page.locator(".agency-mobile-account .agency-auth-loading.mobile");
 await expect(status).toHaveText("Đang kiểm tra tài khoản…");
 await expect(status).toHaveAttribute("role","status");
 release();
});
