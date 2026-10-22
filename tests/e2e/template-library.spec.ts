import {test,expect} from "@playwright/test";

test("template library filters and searches real registered concepts",async({page})=>{
 await page.goto("/services/web-development/templates");
 await expect(page.getByRole("heading",{name:/Chọn một hướng đi/})).toBeVisible();
 await expect(page.locator(".template-card")).toHaveCount(8);
 await page.getByLabel("Ngành").selectOption({label:"Thời trang"});
 await expect(page.locator(".template-card")).toHaveCount(1);
 await expect(page.getByRole("link",{name:/Thương hiệu thời trang/}).first()).toBeVisible();
 await page.getByLabel("Ngành").selectOption({label:"Tất cả ngành"});
 await page.getByLabel("Tìm mẫu").fill("đặt chỗ");
 await expect(page.locator(".template-card")).toHaveCount(1);
 await expect(page.locator(".template-card h2")).toContainText("Nhà hàng");
});

test("template details offer actual desktop/mobile previews and preserve template choice in inquiry",async({page})=>{
 await page.goto("/templates/fashion-archive");
 await expect(page.getByRole("heading",{name:/Thương hiệu thời trang/})).toBeVisible();
 const mobile=page.getByRole("button",{name:"Điện thoại"});
 await mobile.click();
 await expect(mobile).toHaveAttribute("aria-pressed","true");
 await expect(page.locator(".template-device-frame")).toHaveAttribute("data-device","mobile");
 await page.getByRole("link",{name:/Chọn mẫu này/}).click();
 await expect(page).toHaveURL(/\/contact\?service=web-development&template=fashion-archive/);
 await expect(page.getByText("Thương hiệu thời trang",{exact:true})).toBeVisible();
});

test("ticker animation does not pause on hover and auth keeps shared navigation without footer",async({page})=>{
 await page.goto("/");
 const track=page.locator(".athena-ticker-track");
 await expect(track).toBeVisible();
 await track.hover();
 await expect(track).not.toHaveCSS("animation-play-state","paused");
 await page.goto("/login");
 await expect(page.locator(".agency-header")).toBeVisible();
 await expect(page.locator(".agency-footer")).toHaveCount(0);
 await expect(page.locator(".athena-contact-dock")).toHaveCount(0);
});
