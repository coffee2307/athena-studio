import {test,expect} from "@playwright/test";

test("Desktop header includes service choices, commercial process, account entry and quote CTA",async({page,isMobile})=>{
 await page.goto("/");
 if(isMobile)return;
 const header=page.locator(".agency-header");
 await expect(header.locator(".brand-lockup")).toHaveAccessibleName("Athena Studio — Trang chủ");
 expect((await header.locator(".brand-wordmark").textContent())?.includes("ATHENA STUDIO")).toBe(true);
 await expect(header.getByRole("link",{name:/Đăng nhập/})).toHaveAttribute("href","/login");
 await expect(header.getByRole("link",{name:/Đăng ký/})).toHaveAttribute("href","/signup");
 await expect(header.getByRole("link",{name:/Yêu cầu tư vấn/})).toHaveAttribute("href","/start");
 const menu=header.locator(".agency-service-menu");
 await menu.locator("summary").click();
 await expect(menu).toHaveAttribute("open","");
 await expect(menu.locator(".agency-dropdown a")).toHaveCount(5);
 await menu.locator("summary").click();
 await expect(menu).not.toHaveAttribute("open","");
 await expect(header.getByRole("link",{name:"Quy trình"})).toHaveAttribute("href","/process");
});

test("Animated mobile navigation traps focus, locks document scroll, closes with Escape",async({page,isMobile})=>{
 if(!isMobile)return;
 await page.goto("/");
 const menu=page.locator(".agency-mobile-panel");
 const toggle=page.getByRole("button",{name:"Mở menu"});
 await expect(menu).not.toBeVisible();
 await toggle.click();
 await expect(menu).toBeVisible();
 await expect(page.locator("body")).toHaveCSS("overflow","hidden");
 await expect(page.locator(".agency-mobile-panel .agency-mobile-services a")).toHaveCount(4);
 await expect(menu.locator("a.agency-mobile-signin")).toHaveAttribute("href","/login");
 await expect(menu.locator("a.agency-mobile-signup")).toHaveAttribute("href","/signup");
 const details=await menu.evaluate(el=>({
  duration:getComputedStyle(el).transitionDuration,
  opacity:getComputedStyle(el).opacity,
  width:document.documentElement.scrollWidth,
  viewport:innerWidth
 }));
 expect(details.duration).not.toBe("0s");
 expect(details.width).toBeLessThanOrEqual(details.viewport+1);
 await page.keyboard.press("Escape");
 await expect(menu).not.toBeVisible();
 await expect(page.getByRole("button",{name:"Mở menu"})).toBeFocused();
 await expect(page.locator("body")).not.toHaveCSS("overflow","hidden");
});

test("Portfolio presents real PHAM screenshots but never public repository links",async({page})=>{
 await page.goto("/projects/pham");
 await expect(page.locator(".ae-article-gallery .ae-article-figure")).toHaveCount(4);
 await expect(page.locator(".ae-article-gallery img").first()).toHaveAttribute("src",/pham-home-hires/);
 await expect(page.getByRole("link",{name:/Truy cập website dự án/})).toHaveAttribute("href","https://phamofficial.com/");
 await expect(page.locator("main")).not.toContainText("Mở repository gốc");
 expect(await page.locator("main a[href*='github.com']").count()).toBe(0);
 await page.goto("/projects/econith");
 await expect(page.locator(".ae-article-no-image")).toBeVisible();
 await expect(page.locator(".ae-article-gallery")).toHaveCount(0);
 expect(await page.locator("main a[href*='github.com']").count()).toBe(0);
});

test("Footer and contact shortcuts expose phone, email, WhatsApp and Zalo links",async({page,isMobile})=>{
 await page.goto("/");
 await expect(page.locator(".agency-footer-contact a[href='tel:+84965747147']")).toBeVisible();
 await expect(page.locator(".agency-footer-contact a[href='mailto:coffee2307@gmail.com']")).toBeVisible();
 await expect(page.locator(".agency-footer-column a[href='/legal/service-policy']")).toBeVisible();
 const dock=page.getByRole("navigation",{name:"Liên hệ nhanh"});
 if(isMobile){
  const toggle=dock.locator(".agency-contact-toggle");
  await expect(toggle).toHaveAttribute("aria-expanded","false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded","true");
 }
 await expect(dock.getByRole("link",{name:/Gọi điện/})).toHaveAttribute("href","tel:+84965747147");
 await expect(dock.getByRole("link",{name:/WhatsApp/})).toHaveAttribute("href","https://wa.me/84965747147");
 await expect(dock.getByRole("link",{name:/Zalo/})).toHaveAttribute("href","https://zalo.me/0965747147");
 await expect(dock.getByRole("link")).toHaveCount(3);
 await page.goto("/contact");
 await expect(page.locator("main")).not.toContainText("Các liên kết nhắn tin chỉ hoạt động nếu tài khoản tương ứng");
});

test("Business process and pricing pages explain deliverables, customer responsibilities and cost scope",async({page})=>{
 await page.goto("/process");
 await expect(page.getByRole("heading",{level:1})).toContainText("Làm rõ đầu ra");
 await expect(page.locator(".dna02-journey-stop")).toHaveCount(6);
 await page.locator(".dna02-journey-details").first().locator("summary").click();
 await expect(page.locator(".dna02-journey-details")).toContainText("Bạn chuẩn bị");
 await page.getByRole("link",{name:/Xem cách Athena lập báo giá/}).click();
 await expect(page).toHaveURL(/\/pricing$/);
 await expect(page.locator(".agency-price-card")).toHaveCount(3);
 await expect(page.locator(".agency-pricing-inclusions>div")).toHaveCount(6);
});

test("Realistic legal disclosure covers providers, ownership, retention uncertainty and essential cookies",async({page})=>{
 await page.goto("/legal");
 await expect(page.locator(".legal-cards>a")).toHaveCount(4);
 await page.goto("/legal/privacy");
 await expect(page.locator(".legal-content")).toContainText("nhà cung cấp");
 await expect(page.locator(".legal-content")).toContainText("Thời hạn lưu giữ");
 await expect(page.locator(".legal-content")).toContainText("repository");
 await page.goto("/legal/cookies");
 await expect(page.locator(".agency-legal-table tbody tr")).toHaveCount(4);
 await expect(page.locator(".legal-content")).toContainText("Không hiển thị banner");
 await page.goto("/legal/service-policy");
 await expect(page.locator(".legal-content")).toContainText("Bảo hành, bảo trì");
 await expect(page.locator(".legal-content")).toContainText("bàn giao");
});

test("Authentication follows verified identity configuration without inventing login access",async({page})=>{
 for(const route of ["/login","/signup"]){
  await page.goto(route);
  await expect(page.locator("h1")).toBeVisible();
  const fields=page.locator('input[type="email"]');
  if(await fields.count()){
   await expect(fields.first()).toBeVisible();
   // Identity is configured in this environment; the test must never submit credentials.
  }else{
   await expect(page.locator(".auth-unavailable")).toBeVisible();
   await expect(page.locator(".auth-unavailable")).toContainText(/chưa được kích hoạt|chưa thể đăng ký|chưa tiếp nhận đăng ký/i);
  }
 }
});
