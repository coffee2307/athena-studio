import {test,expect} from "@playwright/test";

for(const route of ["/login","/signup"]){
 test(`${route} keeps a centered account card below the shared white header without footer`,async({page})=>{
  await page.goto(route);
  const frame=page.locator(".athena-auth-screen");
  const card=page.locator(".athena-auth-card");
  await expect(frame).toBeVisible();
  await expect(card).toBeVisible();
  await expect(page.locator(".athena-header")).toBeVisible();
  await expect(page.locator(".athena-header")).toHaveCSS("background-color","rgb(255, 255, 255)");
  await expect(page.locator(".athena-footer")).toHaveCount(0);
  await expect(page.locator(".athena-ticker-track")).toHaveCount(0);
  await expect(page.locator(".agency-contact-dock")).toHaveCount(0);
  await expect(page.locator(".client-hero")).toHaveCount(0);
  const geometry=await page.evaluate(()=>{
   const screen=document.querySelector(".athena-auth-screen")!.getBoundingClientRect();
   const card=document.querySelector(".athena-auth-card")!.getBoundingClientRect();
   return {screenW:screen.width,cardW:card.width,centerDelta:Math.abs((card.left+card.width/2)-(screen.left+screen.width/2)),overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth};
  });
  expect(geometry.centerDelta).toBeLessThan(2);
  expect(geometry.cardW).toBeLessThanOrEqual(geometry.screenW);
  expect(geometry.overflow).toBeLessThanOrEqual(1);
  await expect(page.locator("main#main-content")).toHaveCount(1);
 });
}
test("Existing marketing layout still renders on public pages",async({page})=>{
 await page.goto("/");
 await expect(page.locator(".athena-header")).toBeVisible();
 await expect(page.locator(".athena-footer")).toBeVisible();
 await expect(page.locator(".athena-auth-card")).toHaveCount(0);
});
test("Unauthenticated users cannot see the redesigned private profile",async({request})=>{
 const response=await request.get("/profile",{maxRedirects:0});
 const html=await response.text();
 expect(html).not.toContain("KHÔNG GIAN CÁ NHÂN");
 expect(html).not.toContain("Chỉnh sửa hồ sơ");
});
