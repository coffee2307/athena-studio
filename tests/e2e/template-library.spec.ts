import {test,expect} from "@playwright/test";

test("homepage advertises the same complete library as the template index",async({page})=>{
 await page.goto("/");
 await expect(page.locator(".home-demo-facts")).toContainText("21");
 await expect(page.getByRole("link",{name:"Khám phá đủ 21 website"})).toBeVisible();
});

test("template library presents 21 concepts, search and industry filters",async({page})=>{
 await page.goto("/services/web-development/templates");
 await expect(page.locator(".template-card")).toHaveCount(21);
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
 // The iframe uses its own responsive breakpoint, independent of the host
 // viewport. Exercise whichever navigation is visible in the preview frame.
 const desktopNav=demo.locator(".world-desktop-nav a[href$='/services']");
 if(await desktopNav.isVisible()){
  await desktopNav.click();
 }else{
  await demo.getByRole("button",{name:"Mở menu"}).click();
  await expect(demo.locator(".world-mobile-nav.is-open")).toBeVisible();
  await demo.locator(".world-mobile-nav a[href$='/services']").click();
 }
 await expect(demo.locator(".experience-services")).toBeVisible();
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
 await expect(page.locator(".immersive-stage")).toBeVisible();
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
 expect(overflow).toBeLessThanOrEqual(2);
});

test("five-minute visitor prompt is accessible but creates no booking",async({page})=>{
 await page.clock.install();
 await page.goto("/template-demos/creative-studio");
 // Interact after hydration so the invitation timer is armed before advancing the clock.
 await page.locator(".ix-scene-rail .ix-mode-list button").nth(1).click();
 await expect(page.locator(".ix-scene-rail .ix-mode-list button").nth(1)).toHaveAttribute("aria-pressed","true");
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
 await expect(page.locator(".template-card")).toHaveCount(21);
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


test("immersive phase 0 worlds and local Digital Creators build are reachable",async({page})=>{
 await page.goto("/template-demos/creative-studio");
 await expect(page.locator(".immersive-stage")).toBeVisible();
 await page.getByRole("button",{name:/Không gian/}).click();
 await expect(page.locator(".immersive-stage")).toHaveAttribute("data-preset","1");
 await page.goto("/template-demos/auto-showroom");
 await expect(page.locator("canvas.ix-auto-3d-canvas")).toBeVisible();
 const dcErrors:string[]=[];
 page.on("pageerror",err=>dcErrors.push(err.message));
 await page.goto("/template-demos/digital-creators");
 await expect(page).toHaveURL(/\/immersive\/digital-creators\/index\.html/);
 await expect(page.getByRole("banner").getByRole("link",{name:/digitalcreators|digital creators/i})).toBeVisible();
 await expect(page.getByRole("heading",{level:1})).toContainText("Nơi ý tưởng");
 expect(dcErrors).toEqual([]);
 const html=await page.request.get("/immersive/digital-creators/index.html");
 expect(html.status()).toBe(200);
 expect(await html.text()).toContain("assets/index-");
});

test("Digital Creators gallery displays a real captured homepage and opens the original site without nested iframe",async({page})=>{
 await page.goto("/services/web-development/templates");
 const card=page.locator(".template-card").filter({hasText:"Digital Creators"});
 await expect(card.locator("img")).toHaveAttribute("src",/digital-creators.png/);
 await card.getByRole("button",{name:/Trải nghiệm website Digital Creators/}).click();
 const modal=page.locator("dialog.template-demo-modal");
 await expect(modal).toBeVisible();
 const iframe=modal.locator(".template-demo-viewport iframe");
 await expect(iframe).toHaveAttribute("src","/immersive/digital-creators/index.html");
 await expect(page.frameLocator(".template-demo-viewport iframe").getByRole("banner").getByRole("link",{name:/digitalcreators|digital creators/i})).toBeVisible();
 await expect(page.frameLocator(".template-demo-viewport iframe").locator("iframe")).toHaveCount(0);
});

test("Phase 0 immersive library preview assets load, including the VELAR editorial poster",async({page})=>{
 await page.goto("/services/web-development/templates");
 for(const [slug,label] of [
  ["creative-studio","Studio sáng tạo"],
  ["architecture-studio","Kiến trúc & không gian"],
  ["auto-showroom","Showroom ô tô Velar"]
 ]){
  const card=page.locator(".template-card").filter({hasText:label});
  const img=card.locator(".template-thumbnail-screen img");
  await expect(img).toHaveAttribute("src",new RegExp(slug+"\\.png"));
  const captured=await page.request.get("/template-previews/"+slug+".png");
  expect(captured.status()).toBe(200);
  expect(captured.headers()["content-type"]).toContain("image/png");
  await card.getByRole("button",{name:/Trải nghiệm website/}).click();
  const frame=page.frameLocator(".template-demo-viewport iframe");
  if(slug==="auto-showroom"){
   await expect(frame.locator("canvas.ix-auto-3d-canvas")).toBeAttached();
   await expect(frame.locator(".ix-hero-photograph")).toHaveCount(0);
  }else await expect(frame.locator(".ix-hero-photograph")).toBeVisible();
  await expect(frame.locator(".immersive-stage")).toHaveAttribute("data-preset","0");
  await page.getByRole("button",{name:"Đóng bản xem trước"}).click();
 }
});
