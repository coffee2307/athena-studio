import {expect,test} from "@playwright/test";

for(const width of [320,390,428,768,1440]){
 test.describe("ATHENA-DNA-02 interaction and layout "+width,()=>{
  test.use({viewport:{width,height:width>=768?900:844},reducedMotion:"reduce"});
  test.setTimeout(120000);
  test("hero previews switch and expose correct functional demo",async({page})=>{
   await page.goto("/");
   const previews=page.locator(".dna02-preview-window");
   await expect(previews).toHaveCount(2);
   await previews.nth(1).click();
   await expect(previews.nth(1)).toHaveAttribute("aria-pressed","true");
   await expect(page.locator(".dna02-preview-stage .dna-hero-art-bottom a")).toHaveAttribute("href","/template-demos/fashion-archive");
   expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(2);
  });
  test("projects can be selected and navigated",async({page})=>{
   await page.goto("/projects");
   const cards=page.locator(".dna02-work-art button");
   await expect(cards).toHaveCount(3);
   await cards.nth(0).click();
   await expect(cards.nth(0)).toHaveAttribute("aria-pressed","true");
   await expect(page.locator(".dna02-work-note a")).toHaveAttribute("href","/projects/pham");
   expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(2);
  });
  test("process stages are selected and readable on mobile",async({page})=>{
   await page.goto("/process");
   const steps=page.locator(".dna02-journey-stop");
   await expect(steps).toHaveCount(6);
   await steps.nth(4).click();
   await expect(page.locator(".dna02-journey-scene h3")).toContainText("Kiểm thử");
   await expect(page.locator(".dna02-journey-deliverable")).toContainText("nghiệm thu");
   expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(2);
  });
  test("about principles switch without hiding the next action",async({page})=>{
   await page.goto("/about");
   const options=page.locator(".dna02-about-options button");
   await expect(options).toHaveCount(4);
   await options.nth(2).click();
   await expect(options.nth(2)).toHaveAttribute("aria-pressed","true");
   await expect(page.locator(".dna02-about-focus h3")).toContainText("Thiết kế");
   expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(2);
  });
  test("SitePulse changes ONLY local simulation state",async({page})=>{
   await page.goto("/products");
   await expect(page.locator(".dna02-pulse-disclosure")).toContainText("không đo");
   await page.getByRole("button",{name:"Phản hồi tốt"}).click();
   await expect(page.locator(".dna02-pulse .athena-product-mini-grid strong").first()).toHaveText("200");
   await page.getByRole("button",{name:"Cần xác minh"}).click();
   await expect(page.locator(".dna02-pulse .athena-product-mini-grid strong").first()).toHaveText("503");
   await expect(page.locator(".dna02-pulse")).toContainText("GIẢ LẬP");
   expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(2);
  });
 });
}
