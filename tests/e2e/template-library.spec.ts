import {test,expect} from "@playwright/test";

test("template library has 12 searchable directions and filters by industry",async({page})=>{
 await page.goto("/services/web-development/templates");
 await expect(page.getByRole("heading",{name:/Chọn một hướng đi/})).toBeVisible();
 await expect(page.locator(".template-card")).toHaveCount(12);
 await page.getByLabel("Ngành").selectOption({label:"Thời trang"});
 await expect(page.locator(".template-card")).toHaveCount(1);
 await expect(page.locator(".template-card h2")).toContainText("Thương hiệu thời trang");
 await page.getByLabel("Ngành").selectOption({label:"Tất cả ngành"});
 await page.getByLabel("Tìm mẫu").fill("đặt chỗ");
 await expect(page.locator(".template-card")).toHaveCount(1);
 await expect(page.locator(".template-card h2").first()).toContainText("Nhà hàng");
});

test("clicking a template opens a real, scrollable website with scope and pricing",async({page})=>{
 await page.goto("/services/web-development/templates");
 await page.getByRole("button",{name:"Mở demo website Thương hiệu thời trang"}).click();
 const modal=page.getByRole("dialog",{name:/Thương hiệu thời trang/});
 await expect(modal).toBeVisible();
 await expect(modal.getByText("25–55 triệu đồng")).toBeVisible();
 await expect(modal.getByText("Phạm vi tham khảo")).toBeVisible();
 const demo=page.locator(".template-demo-modal .template-demo-site");
 await expect(demo).toBeVisible();
 await expect(demo.locator(".template-demo-image")).toHaveCount(8);
 await demo.getByRole("button",{name:"Mở menu"}).click();
 await expect(demo.getByRole("navigation",{name:"Điều hướng demo"})).toBeVisible();
 await modal.getByRole("button",{name:"Đóng bản demo"}).click();
 await expect(modal).toBeHidden();
});

test("commerce demo supports local cart interactions without checkout",async({page})=>{
 await page.goto("/services/web-development/templates");
 await page.getByRole("button",{name:"Mở demo website Cửa hàng trực tuyến"}).click();
 const demo=page.locator(".template-demo-modal .template-demo-site");
 await demo.getByRole("button",{name:/Thêm vào túi/}).first().click();
 await expect(demo.getByRole("button",{name:"Giỏ hàng, 1 sản phẩm"})).toBeVisible();
});

test("direct demo contains five local images and fits mobile width",async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto("/template-demos/architecture-studio");
 await expect(page.locator(".template-demo-site-header")).toBeVisible();
 await expect(page.locator(".template-demo-image")).toHaveCount(8);
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
 expect(overflow).toBeLessThanOrEqual(1);
});

test("demo asks whether the visitor likes the template after five minutes",async({page})=>{
 await page.clock.install();
 await page.goto("/template-demos/creative-studio");
 await page.clock.fastForward(5*60*1000);
 await expect(page.getByRole("dialog",{name:/Bạn có thích mẫu này/})).toBeVisible();
 await expect(page.getByRole("link",{name:/Trao đổi với Athena/})).toHaveAttribute("href",/template=creative-studio/);
});

test("template detail links preserve the selected template in inquiry",async({page})=>{
 await page.goto("/templates/fashion-archive");
 await expect(page.getByRole("heading",{level:1,name:/.+/})).toBeVisible();
 const mobile=page.getByRole("button",{name:"Điện thoại"});
 await mobile.click();
 await expect(mobile).toHaveAttribute("aria-pressed","true");
 await page.getByRole("link",{name:/Yêu cầu tùy biến mẫu này/}).click();
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

test("selected template creates a reviewed project brief without transmitting a lead",async({page})=>{
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

test("empty search resets all filters and the demo link can be opened from the detail page",async({page})=>{
 await page.goto("/services/web-development/templates");
 await page.getByLabel("Tìm mẫu").fill("không-có-mẫu-này");
 await expect(page.locator(".template-count")).toContainText("0 mẫu phù hợp");
 await page.getByRole("button",{name:"Xóa bộ lọc"}).click();
 await expect(page.locator(".template-card")).toHaveCount(12);
 await page.getByLabel("Sắp xếp").selectOption("name");
 const titles=await page.locator(".template-card h2").allTextContents();
 expect(titles).toEqual([...titles].sort((a,b)=>a.localeCompare(b,"vi")));
 await page.goto("/templates/creative-studio");
 await expect(page.getByRole("link",{name:"Mở demo toàn trang"})).toHaveAttribute("href","/template-demos/creative-studio");
});

test("template routes have no horizontal overflow and reduced motion is respected",async({page})=>{
 for(const width of [360,390,768,1440]){
  await page.setViewportSize({width,height:900});
  for(const route of ["/services/web-development/templates","/templates/creative-studio","/template-demos/creative-studio","/contact?template=creative-studio"]){
   await page.goto(route);
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
   expect(overflow,route+" at "+width).toBeLessThanOrEqual(1);
  }
 }
 await page.emulateMedia({reducedMotion:"reduce"});
 await page.goto("/");
 await expect(page.locator(".athena-ticker-track")).toHaveCSS("animation-name","none");
});
