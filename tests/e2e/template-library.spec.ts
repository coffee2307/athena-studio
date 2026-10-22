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
 await page.locator(".athena-ticker").hover();
 await expect(track).not.toHaveCSS("animation-play-state","paused");
 await page.goto("/login");
 await expect(page.locator(".agency-header")).toBeVisible();
 await expect(page.locator(".agency-footer")).toHaveCount(0);
 await expect(page.locator(".athena-contact-dock")).toHaveCount(0);
});

test("a selected template produces a reviewed project brief without transmitting a lead",async({page})=>{
 const requests:string[]=[];
 page.on("request",request=>{if(request.url().includes("/api/inquiry"))requests.push(request.url());});
 await page.goto("/contact?service=web-development&template=creative-studio");
 await expect(page.locator(".template-inquiry-selection")).toContainText("Studio sáng tạo");
 const form=page.locator(".athena-email-brief-form");
 await expect(form).toBeVisible();
 await expect(form.getByLabel("Dịch vụ quan tâm")).toHaveValue("web-development");
 await form.getByLabel("Họ tên").fill("Nguyễn Coffee");
 await form.getByLabel("Email liên hệ").fill("coffee@example.com");
 await form.getByLabel("Mục tiêu chính").fill("Trưng bày portfolio để nhận yêu cầu tư vấn.");
 await form.getByLabel("Ngân sách dự kiến").selectOption("10-30m");
 await form.getByLabel("Thời gian mong muốn").selectOption("1-3-months");
 await form.getByLabel("Nhu cầu và mục tiêu").fill("Tôi muốn một website giới thiệu năng lực và các dự án đã làm.");
 await form.getByRole("button",{name:/Chuẩn bị nội dung email/}).click();
 const result=page.locator(".athena-email-brief-result");
 await expect(result).toContainText("chưa gửi");
 await expect(page.getByLabel("Nội dung bản nháp")).toHaveValue(/creative-studio · v1.0.0/);
 await expect(page.getByLabel("Nội dung bản nháp")).toHaveValue(/10–30 triệu đồng/);
 const href=await result.getByRole("link",{name:/Mở ứng dụng email/}).getAttribute("href");
 expect(new URL(href!).searchParams.get("body")).toContain("Trưng bày portfolio");
 expect(requests).toEqual([]);
 await form.getByLabel("Mục tiêu chính").fill("Mục tiêu đã thay đổi");
 await expect(result).toHaveCount(0);
});

test("service-only contact links preserve the requested service in the email brief",async({page})=>{
 await page.goto("/contact?service=website-care");
 await expect(page.locator(".athena-email-brief-form").getByLabel("Dịch vụ quan tâm")).toHaveValue("website-care");
});

test("empty search can be reset and preview controls work with keyboard",async({page})=>{
 await page.goto("/services/web-development/templates");
 await page.getByLabel("Tìm mẫu").fill("không-có-mẫu-này");
 await expect(page.locator(".template-count")).toContainText("0 mẫu phù hợp");
 await page.getByRole("button",{name:"Xóa bộ lọc"}).click();
 await expect(page.locator(".template-card")).toHaveCount(8);
 await page.getByLabel("Sắp xếp").selectOption("name");
 const titles=await page.locator(".template-card h2").allTextContents();
 expect(titles).toEqual([...titles].sort((a,b)=>a.localeCompare(b,"vi")));
 await page.goto("/templates/creative-studio");
 const mobile=page.getByRole("button",{name:"Điện thoại"});
 await mobile.focus();await page.keyboard.press("Enter");
 await expect(mobile).toHaveAttribute("aria-pressed","true");
});

test("template routes have no horizontal overflow and ticker respects reduced motion",async({page})=>{
 for(const width of [360,390,768,1440]){
  await page.setViewportSize({width,height:900});
  for(const route of ["/services/web-development/templates","/templates/creative-studio","/contact?template=creative-studio"]){
   await page.goto(route);
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
   expect(overflow,route+" at "+width).toBeLessThanOrEqual(1);
  }
 }
 await page.emulateMedia({reducedMotion:"reduce"});
 await page.goto("/");
 await expect(page.locator(".athena-ticker-track")).toHaveCSS("animation-name","none");
});
