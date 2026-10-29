import {test,expect} from "@playwright/test";

test("A customer can identify a need and explore three authentic services without a text wall",async({page})=>{
 await page.goto("/");
 await expect(page.getByRole("heading",{level:1})).toContainText("Ý tưởng của bạn");
 const cards=page.locator(".dna-services-grid-home .dna-service-card");
 await expect(cards).toHaveCount(3);
 await expect(cards.nth(0)).toContainText("Thiết kế website");
 await expect(cards.nth(1)).toContainText("Chăm sóc website");
 await expect(cards.nth(2)).toContainText("Tích hợp AI");
 await expect(page.locator(".dna-home-hero a[href='/start']")).toBeVisible();
 await expect(page.locator(".dna-product-lab")).toContainText("chưa mở bán");
 await expect(page.locator("#website-mau")).toContainText("Một phong cách riêng");
 await expect(page.locator("#website-mau .home-demo-card")).toHaveCount(4);
 await cards.nth(1).locator(".dna-service-cta").click();
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
 const email=page.getByRole("button",{name:/Soạn email mô tả nhu cầu/});
 await email.click();
 await expect(page.getByRole("dialog",{name:"Soạn yêu cầu tư vấn"})).toBeVisible();
 await expect(page.getByRole("link",{name:/Soạn bằng Gmail/})).toHaveAttribute("href",/mail.google.com/);
 await expect(page.locator(".form-offline")).toBeVisible();
});

test("Vietnamese display typography uses a single locally bundled family without serif fallback",async({page})=>{
 await page.goto("/");
 await page.evaluate(()=>document.fonts.ready);
 const metrics=await page.evaluate(async()=>{
  await document.fonts.load('italic 400 36px "Be Vietnam Pro"','Đặng Nguyễn ễ ệ ứ ự');
  const footer=document.querySelector(".agency-footer-cta h2 span");
  const italics=document.querySelector(".page-hero h1 em");
  const h1=document.querySelector(".dna-home-hero-copy h1");
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
 await expect(page.getByRole("heading",{level:1})).toContainText("Chọn điều bạn");
 await expect(page.locator(".dna-services-grid-catalog .dna-service-card")).toHaveCount(3);
 await expect(page.locator(".dna-services-grid-catalog")).toContainText("Thiết kế website");
 await expect(page.locator(".dna-lab-notice")).toContainText("chưa mở bán");
 await page.getByRole("link",{name:"Gửi yêu cầu"}).click();
 await expect(page).toHaveURL(/\/start$/);
});
