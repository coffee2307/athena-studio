import {expect,test} from "@playwright/test";

for(const width of [320,390,1440]){
 test.describe(`portfolio editorial ${width}px`,()=>{
  test.use({viewport:{width,height:width===1440?900:844}});

  test("routes have one heading and no horizontal overflow",async({page})=>{
   for(const route of ["/projects","/projects/pham","/projects/econith","/projects/digital-creators"]){
    await page.goto(route);
    await expect(page.locator("h1")).toHaveCount(1);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
    expect(overflow,route).toBeLessThanOrEqual(2);
   }
  });

  test("PHAM preview uses approved screenshots, never an iframe",async({page})=>{
   await page.goto("/projects");
   await page.locator(".ae-project-pham .ae-project-visual-action").click();
   const dialog=page.getByRole("dialog");
   await expect(dialog).toBeVisible();
   expect(await page.evaluate(()=>document.querySelector(".ae-preview-backdrop")?.parentElement===document.body)).toBe(true);
   const top=await page.locator(".ae-preview-backdrop").evaluate(node=>node.getBoundingClientRect().top);
   expect(top).toBe(0);
   await expect(dialog.locator("iframe")).toHaveCount(0);
   await dialog.locator(".ae-preview-device button").nth(1).click();
   await dialog.locator(".ae-preview-tabs button").nth(1).click();
   await expect(dialog.locator(".ae-preview-device-shell img")).toHaveAttribute("src",/pham-product-mobile/);
   await expect(dialog.locator("a.ae-preview-visit")).toHaveAttribute("href","https://phamofficial.com/");
   await page.keyboard.press("Escape");
   await expect(dialog).toHaveCount(0);
  });

  test("Digital Creators preview embeds same-origin demo",async({page})=>{
   await page.goto("/projects");
   await page.locator(".ae-project-digital-creators .ae-project-visual-action").click();
   const frame=page.locator(".ae-preview-dialog iframe");
   await expect(frame).toHaveAttribute("src","/template-demos/digital-creators");
   await expect(page.frameLocator(".ae-preview-dialog iframe").locator("body")).toBeVisible();
   await page.locator(".ae-preview-close").click();
   await expect(page.getByRole("dialog")).toHaveCount(0);
  });
 });
}
