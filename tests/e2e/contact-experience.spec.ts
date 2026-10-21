import {test,expect} from "@playwright/test";
test("Desktop phone button opens actionable number/QR popup and can switch channels",async({page,isMobile})=>{
 test.skip(isMobile,"Desktop popup has its own desktop user journey");
 await page.goto("/");
 await page.getByRole("navigation",{name:"Liên hệ nhanh"}).getByRole("link",{name:/Gọi điện/}).click();
 const dialog=page.locator(".athena-contact-dialog");
 await expect(dialog).toBeVisible();
 await expect(dialog.locator("img[alt*='QR']")).toHaveAttribute("src","/qr/phone.png");
 await expect(dialog.getByRole("link",{name:/Mở ứng dụng gọi điện/})).toHaveAttribute("href","tel:+84965747147");
 await dialog.getByRole("button",{name:"Zalo"}).click();
 await expect(dialog.getByRole("link",{name:/Mở Zalo/})).toHaveAttribute("href","https://zalo.me/0965747147");
 await expect(dialog.locator("img[alt*='QR']")).toHaveAttribute("src","/qr/zalo.png");
 await dialog.getByRole("button",{name:"Email"}).click();
 await expect(dialog.getByRole("link",{name:/Soạn bằng Gmail/})).toHaveAttribute("href",/mail\.google\.com\/mail/);
 await expect(dialog.getByRole("link",{name:/Soạn bằng Outlook/})).toHaveAttribute("href",/outlook\.live\.com/);
 await dialog.getByRole("button",{name:"Đóng cửa sổ liên hệ"}).click();
 await expect(page.getByRole("dialog")).toHaveCount(0);
});
test("Ticker animates left-to-right and stops on reduced motion",async({page})=>{
 await page.goto("/");
 const ticker=page.locator(".athena-ticker-track");
 await expect(ticker).toBeVisible();
 await expect(ticker).toContainText("TÍCH HỢP AI");
 const a=await ticker.evaluate(e=>getComputedStyle(e).animationName);
 expect(a).toBe("athena-marquee-forward");
 await page.emulateMedia({reducedMotion:"reduce"});
 await expect(ticker).toHaveCSS("animation-name","none");
});
test("Provided Zalo/WhatsApp SVGs and on-site QR assets are served",async({request})=>{
 for(const path of ["/branding/zalo-provided.svg","/branding/whatsapp-provided.svg","/qr/phone.png","/qr/zalo.png","/qr/whatsapp.png"]){
  const res=await request.get(path);
  expect(res.status(),path).toBe(200);
  expect((await res.body()).length,path).toBeGreaterThan(200);
 }
});
