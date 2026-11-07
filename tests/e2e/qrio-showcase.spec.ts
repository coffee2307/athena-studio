import {test,expect} from "@playwright/test";
test("Qrio replaces the technology template and opens a safe independent QR experience",async({page,isMobile})=>{
 await page.goto("/services/web-development/templates");
 const card=page.locator(".template-card").filter({hasText:"Qrio"});
 await expect(card).toHaveCount(1);
 await expect(card).toContainText("QR");
 await card.locator(".template-card-preview").click();
 if(isMobile){
  await expect(page).toHaveURL(/\/immersive\/qrio\/index\.html/);
  await expect(page.locator("#qr-canvas")).toBeVisible();
 }else{
  const modal=page.locator(".template-demo-modal");
  await expect(modal).toBeVisible();
  const iframe=modal.frameLocator("iframe");
  await expect(iframe.locator("#qr-canvas")).toBeVisible();
  await expect(modal.locator("iframe")).toHaveAttribute("src",/\/immersive\/qrio\/index\.html/);
 }
});
test("Qrio native creator supports VI/EN, local QR regeneration and downloads without backend",async({page})=>{
 const apiCalls:string[]=[];
 page.on("request",request=>{if(/\/api\//.test(request.url()))apiCalls.push(request.url());});
 await page.goto("/immersive/qrio/index.html?lang=vi");
 await expect(page.locator("#qr-canvas")).toBeVisible();
 await expect(page.locator("html")).toHaveAttribute("lang","vi");
 const original=await page.locator("#qr-canvas").evaluate(c=>(c as HTMLCanvasElement).toDataURL());
 await page.locator("#qr-data").fill("https://example.org/test-qrio");
 await page.locator("#generate").click();
 const next=await page.locator("#qr-canvas").evaluate(c=>(c as HTMLCanvasElement).toDataURL());
 expect(next).not.toBe(original);
 const [png]=await Promise.all([page.waitForEvent("download"),page.locator("#download-png").click()]);
 expect(png.suggestedFilename()).toBe("qrio-code.png");
 await page.locator("#language").click();
 await expect(page.locator("html")).toHaveAttribute("lang","en");
 await expect(page.getByRole("heading",{level:1})).toContainText("One QR code");
 const [svg]=await Promise.all([page.waitForEvent("download"),page.locator("#download-svg").click()]);
 expect(svg.suggestedFilename()).toBe("qrio-code.svg");
 expect(apiCalls).toHaveLength(0);
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
 expect(overflow).toBeLessThanOrEqual(2);
});
