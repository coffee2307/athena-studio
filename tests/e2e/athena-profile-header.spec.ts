import {test,expect} from "@playwright/test";

test("Header shows profile instead of login and signup after a verified session",async({page,isMobile})=>{
 await page.route("**/api/identity/get-session",route=>route.fulfill({
  status:200,contentType:"application/json",
  body:JSON.stringify({user:{id:"qa-profile",name:"Khách hàng Athena"},session:{id:"qa-session"}})
 }));
 await page.goto("/");
 if(isMobile){
  await page.getByRole("button",{name:"Mở menu"}).click();
  const panel=page.locator(".agency-mobile-panel");
  await expect(panel.getByRole("link",{name:"Hồ sơ cá nhân"})).toHaveAttribute("href","/profile");
  await expect(panel.getByRole("link",{name:/Đăng nhập/})).toHaveCount(0);
  await expect(panel.getByRole("link",{name:/Đăng ký/})).toHaveCount(0);
 }else{
  const action=page.locator(".agency-nav-actions");
  await expect(action.getByRole("link",{name:"Hồ sơ cá nhân"})).toHaveAttribute("href","/profile");
  await expect(action.getByRole("link",{name:/Đăng nhập/})).toHaveCount(0);
  await expect(action.getByRole("link",{name:/Đăng ký/})).toHaveCount(0);
 }
});

test("Without verified session header displays sign-in and registration",async({page,isMobile})=>{
 await page.route("**/api/identity/get-session",route=>route.fulfill({status:200,contentType:"application/json",body:"null"}));
 await page.goto("/");
 if(isMobile){
  await page.getByRole("button",{name:"Mở menu"}).click();
  const menu=page.locator(".agency-mobile-panel");
  await expect(menu.getByRole("link",{name:/Đăng nhập/})).toBeVisible();
  await expect(menu.getByRole("link",{name:/Đăng ký/})).toBeVisible();
  await expect(menu.getByRole("link",{name:"Hồ sơ cá nhân"})).toHaveCount(0);
 }else{
  const nav=page.locator(".agency-nav-actions");
  await expect(nav.getByRole("link",{name:/Đăng nhập/})).toBeVisible();
  await expect(nav.getByRole("link",{name:/Đăng ký/})).toBeVisible();
  await expect(nav.getByRole("link",{name:"Hồ sơ cá nhân"})).toHaveCount(0);
 }
});

test("Private profile is not exposed when identity feature is disabled",async({request})=>{
 const r=await request.get("/profile",{maxRedirects:0});
 const html=await r.text();
 expect([200,404]).toContain(r.status()); // Next streaming can emit 404 content with HTTP 200.
 expect(html).not.toContain("ATHENA / KH?NG GIAN C? NH?N");
 expect(html).not.toContain("Chi ti?t t?i kho?n");
});
