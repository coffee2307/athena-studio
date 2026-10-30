import {test,expect} from "@playwright/test";

test("Production public pages load styled CSS and JS assets",async({page})=>{
 const failures:string[]=[];
 page.on("response",response=>{
  if(response.status()>=400&&/\/_next\/static\//.test(response.url()))failures.push(`${response.status()} ${response.url()}`);
 });
 page.on("requestfailed",request=>{
  if(/\/_next\/static\//.test(request.url()))failures.push(`${request.failure()?.errorText} ${request.url()}`);
 });
 await page.goto("/",{waitUntil:"load"});
 await expect(page.locator(".dna-home-hero")).toBeVisible();
 const state=await page.evaluate(()=>{
  const hero=document.querySelector(".dna-home-hero")!;
  const card=document.querySelector(".dna-hero-art")!;
  return {
   bodyFont:getComputedStyle(document.body).fontFamily,
   heroBackground:getComputedStyle(hero).backgroundColor,
   cardBackground:getComputedStyle(card).backgroundColor,
   styles:[...document.querySelectorAll('link[rel="stylesheet"]')].map(x=>(x as HTMLLinkElement).href),
  };
 });
 expect(state.bodyFont).toContain("Be Vietnam Pro");
 expect(state.heroBackground).not.toBe("rgba(0, 0, 0, 0)");
 expect(state.cardBackground).not.toBe("rgba(0, 0, 0, 0)");
 expect(state.styles.length).toBeGreaterThan(0);
 expect(failures).toEqual([]);
});
test("Navigating between public pages does not revert to unstyled HTML",async({page,isMobile})=>{
 await page.goto("/");
 if(isMobile){await page.locator(".agency-menu-toggle").click();await page.locator("#athena-mobile-menu a[href='/services']").click();}
 else await page.locator(".agency-desktop-nav a[href='/projects']").click();
 await expect(page).toHaveURL(isMobile?/\/services/:/\/projects/);
 await expect(page.locator(".athena-header")).toBeVisible();
 expect(await page.locator("body").evaluate(x=>getComputedStyle(x).fontFamily)).toContain("Be Vietnam Pro");
});
