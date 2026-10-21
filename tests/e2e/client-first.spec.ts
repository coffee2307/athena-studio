import {test,expect} from "@playwright/test";

test("A customer can identify a need and find the matching service without reading the company story",async({page})=>{
 await page.goto("/");
 await expect(page.getByRole("heading",{level:1})).toContainText("Website chưa hiệu quả?");
 const shortcuts=page.locator(".client-quick-nav a");
 await expect(shortcuts).toHaveCount(3);
 await expect(shortcuts.nth(0)).toHaveAttribute("href","/services/web-development");
 await expect(shortcuts.nth(1)).toHaveAttribute("href","/services/website-care");
 await expect(shortcuts.nth(2)).toHaveAttribute("href","/services/ai-integration");
 await expect(page.locator(".client-solution-card")).toHaveCount(3);
 await expect(page.getByRole("link",{name:/Gửi nhu cầu của bạn/})).toHaveAttribute("href","/contact");
 await expect(page.locator(".client-lab-band")).toContainText("chưa được mở bán");
 await expect(page.locator(".case-section-head")).toContainText("không phải danh sách hợp đồng khách hàng");
 await page.locator(".client-quick-nav a").nth(1).click();
 await expect(page).toHaveURL(/\/services\/website-care$/);
});

test("A visitor gets a usable brief and a direct email path while the inquiry form is offline",async({page})=>{
 await page.goto("/contact");
 await expect(page).toHaveTitle(/Athena/i);
 const steps=page.locator(".contact-help-steps>div");
 await expect(steps).toHaveCount(3);
 await expect(steps.nth(0)).toContainText("Hiện trạng");
 await expect(steps.nth(1)).toContainText("Vấn đề");
 await expect(steps.nth(2)).toContainText("Ưu tiên");
 const email=page.getByRole("link",{name:/Soạn email mô tả nhu cầu/});
 await expect(email).toHaveAttribute("href",/mailto:coffee2307@gmail.com\?subject=.*&body=/);
 await expect(page.locator(".form-offline")).toBeVisible();
});

test("Vietnamese display typography uses a single locally bundled family without serif fallback",async({page})=>{
 await page.goto("/");
 await page.evaluate(()=>document.fonts.ready);
 const metrics=await page.evaluate(async()=>{
  await document.fonts.load('italic 400 36px "Be Vietnam Pro"','Đặng Nguyễn ễ ệ ứ ự');
  const footer=document.querySelector(".agency-footer-cta h2 span");
  const italics=document.querySelector(".page-hero h1 em");
  const h1=document.querySelector(".client-hero-copy h1");
  const footerStyle=footer?getComputedStyle(footer):null;
  const h1Style=h1?getComputedStyle(h1):null;
  const chars="Hãy cùng tạo điều khác biệt. Đặng Nguyễn ễ ệ ứ ự";
  return {
   footerFamily:footerStyle?.fontFamily??"",
   footerSpacing:footerStyle?parseFloat(footerStyle.letterSpacing):NaN,
   footerFontSize:footerStyle?parseFloat(footerStyle.fontSize):0,
   headingFont:h1Style?.fontFamily??"",
   fontLoaded:document.fonts.check('400 36px "Be Vietnam Pro"',chars),
   italicLoaded:document.fonts.check('italic 400 36px "Be Vietnam Pro"',chars),
   serifDisplay:italics?getComputedStyle(italics).fontFamily:"",
   screen:innerWidth,
   width:document.documentElement.scrollWidth
  };
 });
 expect(metrics.footerFamily).toContain("Be Vietnam Pro");
 expect(metrics.footerFamily).not.toContain("Georgia");
 expect(metrics.fontLoaded).toBe(true);
 expect(metrics.italicLoaded).toBe(true);
 expect(metrics.headingFont).toContain("Be Vietnam Pro");
 expect(metrics.footerSpacing).toBeGreaterThan(-0.06*metrics.footerFontSize);
 expect(metrics.width).toBeLessThanOrEqual(metrics.screen+1);
});

test("Solutions and service detail show concrete deliverables, not unverified outcomes",async({page})=>{
 await page.goto("/services");
 await expect(page.getByRole("heading",{level:1})).toContainText("Bạn cần giải quyết");
 await expect(page.locator(".service-solution-grid .client-solution-card")).toHaveCount(3);
 await expect(page.locator(".service-solution-grid")).toContainText("PHẠM VI CÓ THỂ BÀN GIAO");
 await expect(page.locator(".client-lab-band")).toContainText("NGHIÊN CỨU, CHƯA MỞ BÁN");
 await page.getByRole("link",{name:/Trình bày nhu cầu/}).click();
 await expect(page).toHaveURL(/\/contact$/);
});
