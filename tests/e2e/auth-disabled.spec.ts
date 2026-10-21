import {test,expect} from "@playwright/test";
test("Unauthenticated auth screens show real unavailable state",async({page})=>{
 for(const route of ["/login","/signup","/forgot-password"]){
  await page.goto(route);
  await expect(page.getByRole("heading",{level:1})).toContainText("Đang hoàn thiện");
  await expect(page.locator(".auth-unavailable")).toBeVisible();
  await expect(page.locator("form.auth-form")).toHaveCount(0);
  const robots=await page.locator('meta[name="robots"]').getAttribute("content");
  expect(robots).toContain("noindex");
 }
});
test("Private routes cannot be opened without verified session",async({request})=>{
 for(const path of ["/account","/account/change-password","/account/projects","/account/projects/dddddddd-dddd-4ddd-8ddd-dddddddddddd","/account/support","/account/support/ffffffff-ffff-4fff-8fff-ffffffffffff","/admin","/admin/projects","/admin/support"]){
  const response=await request.get(path,{maxRedirects:0});
  expect([307,308]).toContain(response.status());
  expect(new URL(response.headers()["location"],"http://127.0.0.1:3189").pathname).toBe("/login");
 }
});
test("Document endpoint refuses anonymous signed URL creation",async({request})=>{
 const response=await request.get("/api/operations/documents/12345678-1234-4234-8234-123456789012",{maxRedirects:0});
 expect(response.status()).toBe(503);
 expect(response.headers()["cache-control"]).toContain("no-store");
});
test("Callback and confirmation fail closed if Auth not explicitly active",async({request})=>{
 for(const path of ["/auth/callback?code=fake-test","/auth/callback?code=fake&next=%2F%2Fevil.test","/auth/confirm?token_hash=fake&type=signup"]){
  const response=await request.get(path,{maxRedirects:0});
  expect([307,308]).toContain(response.status());
  const target=new URL(response.headers()["location"],"http://127.0.0.1:3189");
  expect(target.pathname).toBe("/login");
  expect(target.host).not.toBe("evil.test");
 }
});
