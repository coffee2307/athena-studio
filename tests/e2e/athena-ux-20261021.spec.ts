import {test,expect} from "@playwright/test";

test("Zalo and WhatsApp preserve branded icons and accessible surfaces",async({page,isMobile})=>{
 await page.goto("/");
 const nav=page.getByRole("navigation",{name:"Liên hệ nhanh"});
 if(isMobile)await nav.getByRole("button",{name:/Liên hệ/}).click();
 for(const name of [/Zalo/,/WhatsApp/]){
  const link=nav.getByRole("link",{name});
  await expect(link).toBeVisible();
  await expect(link).toHaveCSS("background-color",isMobile?"rgb(244, 247, 241)":"rgb(255, 255, 255)");
  await expect(link.locator("img")).toBeVisible();
 }
});

test("Desktop contact email shows exactly Gmail and Outlook actions",async({page,isMobile})=>{
 test.skip(isMobile,"Desktop contact dialog scenario");
 await page.goto("/contact");
 await page.locator(".agency-footer-cta-button").click();
 const dialog=page.getByRole("dialog",{name:"Soạn yêu cầu tư vấn"});
 await expect(dialog).toBeVisible();
 await expect(dialog.getByRole("link",{name:/Soạn bằng Gmail/})).toBeVisible();
 await expect(dialog.getByRole("link",{name:/Soạn bằng Outlook/})).toBeVisible();
 await expect(dialog.getByRole("link",{name:/Mở ứng dụng email/})).toHaveCount(0);
 await expect(dialog.getByRole("button",{name:/Sao chép nội dung thư/})).toHaveCount(0);
 await page.keyboard.press("Escape");
 await expect(dialog).not.toBeVisible();
});

test("Desktop services dropdown closes on outside click, Escape, and navigation",async({page,isMobile})=>{
 test.skip(isMobile,"Desktop navigation scenario");
 await page.goto("/");
 const details=page.locator(".agency-service-menu");
 const summary=details.locator("summary");
 await summary.click();await expect(details).toHaveAttribute("open","");
 await page.locator("#hero-title").click();
 await expect(details).not.toHaveAttribute("open","");
 await summary.click();await expect(details).toHaveAttribute("open","");
 await page.keyboard.press("Escape");
 await expect(details).not.toHaveAttribute("open","");
 await summary.click();
 await details.getByRole("link",{name:/Thiết kế website/}).click();
 await expect(page).toHaveURL(/\/services\/web-development/);
 await expect(details).not.toHaveAttribute("open","");
});

test("Home hierarchy remains usable without horizontal overflow at mobile width",async({page})=>{
 await page.goto("/");
 await expect(page.locator(".dna-home-hero")).toBeVisible();
 await expect(page.locator(".athena-editorial-seam")).toContainText("Kiểm thử trước bàn giao");
 await expect(page.locator(".dna-services-grid-home .dna-service-card")).toHaveCount(3);
 const width=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
 expect(width.scroll).toBeLessThanOrEqual(width.client+1);
});
