import {test,expect} from "@playwright/test";
test("Unauthenticated auth screens show real unavailable state",async({page})=>{
 for(const route of ["/dang-nhap","/dang-ky","/quen-mat-khau"]){
  await page.goto(route);
  await expect(page.getByRole("heading",{level:1})).toContainText("Đang hoàn thiện");
  await expect(page.locator(".auth-unavailable")).toBeVisible();
  await expect(page.locator("form.auth-form")).toHaveCount(0);
  const robots=await page.locator('meta[name="robots"]').getAttribute("content");
  expect(robots).toContain("noindex");
 }
});
test("Private routes cannot be opened without verified session",async({request})=>{
 for(const path of ["/tai-khoan","/tai-khoan/doi-mat-khau","/quan-tri"]){
  const response=await request.get(path,{maxRedirects:0});
  expect([307,308]).toContain(response.status());
  expect(new URL(response.headers()["location"],"http://127.0.0.1:3189").pathname).toBe("/dang-nhap");
 }
});
test("Callback and confirmation fail closed if Auth not explicitly active",async({request})=>{
 for(const path of ["/auth/callback?code=fake-test","/auth/callback?code=fake&next=%2F%2Fevil.test","/auth/confirm?token_hash=fake&type=signup"]){
  const response=await request.get(path,{maxRedirects:0});
  expect([307,308]).toContain(response.status());
  const target=new URL(response.headers()["location"],"http://127.0.0.1:3189");
  expect(target.pathname).toBe("/dang-nhap");
  expect(target.host).not.toBe("evil.test");
 }
});
