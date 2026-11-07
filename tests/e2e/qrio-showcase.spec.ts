import {test,expect} from "@playwright/test";
test("Qrio gallery shows the original native home screen in both viewport types",async({page,isMobile})=>{
 await page.goto("/services/web-development/templates");
 const card=page.locator(".template-card").filter({hasText:"Qrio"});
 await expect(card).toHaveCount(1);
 await expect(card).toContainText("QR");
 await card.locator(".template-card-preview").click();
 if(isMobile){
  await expect(page).toHaveURL(/\/immersive\/qrio\/index\.html/);
  await expect(page.locator(".hero-title")).toContainText("Tạo mã QR");
  await expect(page.locator("#project-modal")).toHaveCount(1);
 }else{
  const modal=page.locator(".template-demo-modal");
  await expect(modal).toBeVisible();
  const iframe=modal.frameLocator("iframe");
  await expect(iframe.locator(".hero-title")).toContainText("Tạo mã QR");
  await expect(iframe.locator("#project-modal")).toHaveCount(1);
  await expect(modal.locator("iframe")).toHaveAttribute("src",/\/immersive\/qrio\/index\.html/);
 }
});
test("Qrio native New Project -> QR Editor preserves source UI and creates a local QR",async({page,isMobile})=>{
 const apiCalls:string[]=[];
 const pageErrors:string[]=[];
 page.on("request",request=>{if(/\/api\//.test(request.url()))apiCalls.push(request.url());});
 page.on("pageerror",error=>pageErrors.push(error.message));
 await page.goto("/immersive/qrio/index.html?lang=vi");
 await expect(page.locator(".hero-title")).toContainText("Tạo mã QR");
 await page.locator('a[href="edit.html"]').first().click();
 await expect(page.locator("#project-modal")).toHaveClass(/show/);
 await page.locator("#project-choice-qr").click();
 await expect(page).toHaveURL(/\/immersive\/qrio\/edit\.html/);
 // Native Qrio creates an empty project first. On mobile its original sidebar
 // intentionally sits outside the viewport, so verify the real native empty
 // state without inventing a working mobile QR-create flow.
 if(isMobile){
  await expect(page.getByRole("heading",{name:"Chưa có mã QR"})).toHaveCount(1);
 }else{
  await page.locator('button[onclick="addQRElement()"]').click();
  await expect(page.locator(".qr-base").first()).toBeVisible({timeout:20000});
  await expect(page.locator(".qr-base").first()).toHaveAttribute("src",/^data:image\/png;base64,/);
 }
 expect(apiCalls).toHaveLength(0);
 expect(pageErrors).toHaveLength(0);
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
 expect(overflow).toBeLessThanOrEqual(2);
});
test("Qrio native homepage retains English localization",async({page})=>{
 await page.goto("/immersive/qrio/index.html?lang=en");
 await expect(page.locator(".hero-title")).toContainText("Create QR");
 await expect(page.locator("#project-modal")).toHaveCount(1);
});
