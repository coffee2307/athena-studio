import {test,expect} from "@playwright/test";

test("Unapproved staging explicitly blocks robots and uses noindex metadata",async({page,request})=>{
 const robots=await request.get("/robots.txt");
 expect(robots.status()).toBe(200);
 expect(await robots.text()).toMatch(/Disallow:\s*\//i);
 await page.goto("/");
 await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content",/noindex/i);
 await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});
test("Customer can prepare a structured email without submitting to an unconfigured backend",async({page})=>{
 const apiCalls:string[]=[];
 page.on("request",req=>{if(req.url().includes("/api/inquiry"))apiCalls.push(req.method());});
 await page.goto("/contact");
 await expect(page.locator(".form-offline")).toBeVisible();
 await page.locator(".athena-email-brief-details>summary").click();
 const form=page.locator(".athena-email-brief-form");
 await expect(form).toBeVisible();
 await form.locator('input[name="name"]').fill("Nguyễn Văn A");
 await form.locator('input[name="email"]').fill("a@example.com");
 await form.locator('select[name="service"]').selectOption("website-care");
 await form.locator('textarea[name="message"]').fill("Website tải chậm, tôi cần cải thiện trải nghiệm khách hàng trên điện thoại.");
 await form.getByRole("button",{name:/Chuẩn bị nội dung email/}).click();
 await expect(page.getByText("Đã chuẩn bị bản nháp — chưa gửi")).toBeVisible();
 const link=page.getByRole("link",{name:/Mở ứng dụng email/});
 await expect(link).toHaveAttribute("href",/^mailto:coffee2307@gmail\.com\?/);
 await expect(page.locator("#athena-draft-preview")).toHaveValue(/Website tải chậm/);
 expect(apiCalls).toEqual([]);
});
test("Production visual CSS remains styled after navigation",async({page})=>{
 const failures:string[]=[];
 page.on("response",r=>{if(r.status()>=400&&/\/_next\/static\//.test(r.url()))failures.push(r.url());});
 for(const path of ["/","/services","/projects","/pricing","/contact","/legal/privacy"]){
  await page.goto(path,{waitUntil:"load"});
  const css=await page.locator("body").evaluate(el=>getComputedStyle(el).fontFamily);
  expect(css,path).toContain("Be Vietnam Pro");
  await expect(page.getByRole("main")).toBeVisible();
  const width=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  expect(width,path).toBeLessThanOrEqual(1);
 }
 expect(failures).toEqual([]);
});
