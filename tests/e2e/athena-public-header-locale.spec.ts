import {test,expect} from "@playwright/test";

test("mobile language picker stays beside the menu and never lives inside the drawer",async({page})=>{
 await page.emulateMedia({reducedMotion:"reduce"});
 for(const width of [320,390,428,768,980]){
  await page.setViewportSize({width,height:844});
  await page.goto("/");
  const header=page.locator("header.agency-header");
  const picker=header.locator(".agency-mobile-language .athena-language-trigger");
  const toggle=header.locator(".agency-menu-toggle");
  await expect(picker).toBeVisible();
  await expect(toggle).toBeVisible();
  await expect(page.locator("#athena-mobile-menu .athena-language-switch")).toHaveCount(0);
  const a=await picker.boundingBox(),b=await toggle.boundingBox();
  expect(a&&b,"header controls must have accessible bounding boxes").toBeTruthy();
  expect(a!.x+a!.width,"language picker must be directly left of menu at "+width).toBeLessThanOrEqual(b!.x+4);
  expect(b!.x-(a!.x+a!.width),"avoid empty separation at "+width).toBeLessThanOrEqual(22);
  await picker.click();
  const options=header.locator(".agency-mobile-language .athena-language-options");
  await expect(options).toBeVisible();
  await options.getByRole("menuitemradio",{name:/English/}).click();
  await expect(page.locator("html")).toHaveAttribute("lang","en");
  await expect(toggle).toHaveAttribute("aria-expanded","false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded","true");
  const drawer=page.locator("#athena-mobile-menu");
  await expect(drawer.locator(".agency-mobile-signin")).toBeVisible();
  await expect(drawer.locator(".agency-mobile-signup")).toBeVisible();
  await expect(drawer.locator(".agency-mobile-signin svg[data-icon=user]")).toHaveCount(1);
  await expect(drawer.locator(".agency-mobile-signup svg[data-icon=key]")).toHaveCount(1);
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded","false");
  await picker.click();
  await options.getByRole("menuitemradio",{name:/Tiếng Việt/}).click();
  await expect(page.locator("html")).toHaveAttribute("lang","vi");
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  expect(overflow,"horizontal overflow at "+width).toBeLessThanOrEqual(2);
 }
});

test("desktop retains text-only header account links and a separate language control",async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto("/");
 await expect(page.locator(".agency-mobile-language")).toBeHidden();
 const header=page.locator("header.agency-header");
 const signin=header.locator(".agency-auth-link");
 const signup=header.locator(".agency-register-link");
 await expect(signin).toBeVisible();
 await expect(signup).toBeVisible();
 await expect(signin.locator("svg")).toHaveCount(0);
 await expect(signup.locator("svg")).toHaveCount(0);
 await expect(header.locator(".agency-nav-actions .athena-language-trigger")).toBeVisible();
});
