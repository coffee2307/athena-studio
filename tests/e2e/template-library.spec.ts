import {test,expect} from "@playwright/test";

test("template library presents 20 concepts, search and industry filters",async({page})=>{
 await page.goto("/services/web-development/templates");
 await expect(page.locator(".template-card")).toHaveCount(20);
 await expect(page.getByRole("heading",{name:/Chọn cảm hứng/})).toBeVisible();
 await page.getByLabel("Ngành nghề").selectOption({label:"Thời trang"});
 await expect(page.locator(".template-card")).toHaveCount(1);
 await expect(page.locator(".template-card h3")).toContainText("Thương hiệu thời trang");
 await page.getByLabel("Ngành nghề").selectOption({label:"Tất cả ngành"});
 await page.getByLabel("Tìm kiếm").fill("đặt chỗ");
 await expect(page.locator(".template-card")).toHaveCount(1);
 await expect(page.locator(".template-card h3")).toContainText("Nhà hàng");
});

test("template dialog provides iframe demo, pricing and working navigation",async({page})=>{
 await page.goto("/services/web-development/templates");
 await page.getByRole("button",{name:"Trải nghiệm website Thương hiệu thời trang"}).click();
 const dialog=page.locator("dialog.template-demo-modal");
 await expect(dialog).toBeVisible();
 await expect(dialog.getByText("25–55 triệu đồng")).toBeVisible();
 await expect(dialog.getByText("Cấu trúc dự kiến")).toBeVisible();
 const demo=page.frameLocator(".template-demo-viewport iframe");
 await expect(demo.locator(".world-header")).toBeVisible();
 await demo.locator(".world-desktop-nav a[href$='/services']").click();
 await expect(demo.locator(".experience-service-panels")).toBeVisible();
 await dialog.getByRole("button",{name:"Đóng bản xem trước"}).click();
 await expect(dialog).not.toBeVisible();
});

test("commerce demo supports local cart without external checkout",async({page})=>{
 await page.goto("/template-demos/commerce-standard/work");
 await page.locator(".experience-catalog-card button").first().click();
 await expect(page.getByRole("dialog",{name:"Giỏ hàng demo"})).toBeVisible();
 await expect(page.locator(".world-cart-drawer")).toContainText("1 sản phẩm");
 await expect(page.locator("input[name='payment']")).toHaveCount(0);
});

test("direct demo is responsive and uses real site header",async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto("/template-demos/architecture-studio");
 await expect(page.locator(".world-header")).toBeVisible();
 await expect(page.locator("img[src*='image-']").first()).toBeVisible();
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
 expect(overflow).toBeLessThanOrEqual(2);
});

test("five-minute visitor prompt is accessible but creates no booking",async({page})=>{
 await page.clock.install();
 await page.goto("/template-demos/creative-studio");
 await page.clock.fastForward(5*60*1000);
 await expect(page.getByRole("dialog",{name:/Bạn có thích mẫu này/})).toBeVisible();
 await expect(page.getByRole("link",{name:/Trao đổi với Athena/})).toHaveAttribute("href",/template=creative-studio/);
});

test("detail pages preserve chosen template and scope",async({page})=>{
 await page.goto("/templates/fashion-archive");
 await expect(page.getByRole("heading",{level:1})).toBeVisible();
 const mobile=page.getByRole("button",{name:"Điện thoại"});
 await mobile.click();
 await expect(mobile).toHaveAttribute("aria-pressed","true");
 await page.getByRole("link",{name:/Yêu cầu tùy biến mẫu này/}).click();
 await expect(page).toHaveURL(/\/contact\?service=web-development&template=fashion-archive/);
 await expect(page.getByText("Thương hiệu thời trang",{exact:true})).toBeVisible();
});

test("auth remains navigable without duplicate footer",async({page})=>{
 await page.goto("/login");
 await expect(page.locator(".agency-header")).toBeVisible();
 await expect(page.locator(".agency-footer")).toHaveCount(0);
 await expect(page.locator(".agency-contact-dock")).toHaveCount(0);
});

test("contact brief includes current template version and does not submit to API",async({page})=>{
 const posts:string[]=[];
 page.on("request",request=>{if(request.url().includes("/api/inquiry"))posts.push(request.url());});
 await page.goto("/contact?service=web-development&template=creative-studio");
 const form=page.locator(".athena-email-brief-form");
 await expect(form).toBeVisible();
 await form.getByLabel("Họ tên").fill("Nguyễn Coffee");
 await form.getByLabel("Email liên hệ").fill("coffee@example.com");
 await form.getByLabel("Mục tiêu chính").fill("Trưng bày portfolio để nhận yêu cầu tư vấn.");
 await form.getByLabel("Ngân sách dự kiến").selectOption("10-30m");
 await form.getByLabel("Thời gian mong muốn").selectOption("1-3-months");
 await form.getByLabel("Nhu cầu và mục tiêu").fill("Tôi muốn một website giới thiệu năng lực và các dự án đã làm.");
 await form.getByRole("button",{name:/Chuẩn bị nội dung email/}).click();
 const result=page.locator(".athena-email-brief-result");
 await expect(result).toContainText("chưa gửi");
 const preview=page.getByLabel("Nội dung bản nháp");
 await expect(preview).toHaveValue(/creative-studio · v2.0.0/);
 await expect(preview).toHaveValue(/10–30 triệu đồng/);
 const href=await result.getByRole("link",{name:/Mở ứng dụng email/}).getAttribute("href");
 expect(href).toMatch(/^mailto:/);
 expect(posts).toEqual([]);
 await form.getByLabel("Mục tiêu chính").fill("Mục tiêu đã thay đổi");
 await expect(result).toHaveCount(0);
});

test("contact preselects website-care service",async({page})=>{
 await page.goto("/contact?service=website-care");
 await expect(page.locator(".athena-email-brief-form").getByLabel("Dịch vụ quan tâm")).toHaveValue("website-care");
});

test("empty search resets filters and templates sort by name",async({page})=>{
 await page.goto("/services/web-development/templates");
 await page.getByLabel("Tìm kiếm").fill("không-có-mẫu-này");
 await expect(page.locator(".template-empty")).toBeVisible();
 await page.getByRole("button",{name:/Xem tất cả mẫu/}).click();
 await expect(page.locator(".template-card")).toHaveCount(20);
 await page.getByLabel("Sắp xếp").selectOption("name");
 const titles=await page.locator(".template-card h3").allTextContents();
 expect(titles).toEqual([...titles].sort((a,b)=>a.localeCompare(b,"vi")));
 await page.goto("/templates/creative-studio");
 await expect(page.getByRole("link",{name:"Mở demo toàn trang"})).toHaveAttribute("href","/template-demos/creative-studio");
});

test("template layouts avoid horizontal overflow and support reduced motion",async({page})=>{
 for(const width of [360,390,768,1440]){
  await page.setViewportSize({width,height:900});
  for(const route of ["/services/web-development/templates","/templates/creative-studio","/template-demos/creative-studio","/contact?template=creative-studio"]){
   await page.goto(route);
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
   expect(overflow,route+" at "+width).toBeLessThanOrEqual(2);
  }
 }
 await page.emulateMedia({reducedMotion:"reduce"});
 await page.goto("/");
 await expect(page.locator(".athena-ticker-track")).toHaveCSS("animation-name","none");
});
