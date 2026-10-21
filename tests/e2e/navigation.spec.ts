import {test,expect} from "@playwright/test";
test("Public navigation and translated case studies work",async({page})=>{
 await page.goto("/");
 await expect(page.locator("html")).toHaveAttribute("lang","vi");
 await expect(page.getByRole("heading",{level:1})).toBeVisible();
 await page.goto("/projects");
 await expect(page.getByRole("heading",{level:1})).toBeVisible();
 await expect(page.locator(".case-card")).toHaveCount(2);
 await page.getByRole("button",{name:"Nghiên cứu"}).click();
 await expect(page.locator(".case-card")).toHaveCount(1);
 await expect(page.locator(".case-card").getByRole("heading",{name:"ECONITH"})).toBeVisible();
 await page.getByRole("button",{name:"Tất cả"}).click();
 await expect(page.locator(".case-card")).toHaveCount(2);
 await page.goto("/projects/qrio");
 await expect(page.locator("body")).toContainText("không tồn tại");
});
test("Viewport has no horizontal overflow and all content is reachable",async({page})=>{
 for(const url of ["/","/projects","/services","/contact","/legal"]){
  await page.goto(url);await page.waitForLoadState("domcontentloaded");
  const width=await page.evaluate(()=>({screen:innerWidth,document:document.documentElement.scrollWidth}));
  expect(width.document,url+" overflow").toBeLessThanOrEqual(width.screen+1);
  await page.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));
  await expect(page.locator(".athena-footer")).toBeVisible();
 }
});
test("Responsive mobile navigation has proper state and keyboard close",async({page,isMobile})=>{
 if(!isMobile){
  await page.goto("/");
  const skip=page.locator(".skip-link");
  await page.keyboard.press("Tab");
  await expect(skip).toBeFocused();
  await expect(skip).toHaveAttribute("href","#main-content");
  return;
 }
 await page.goto("/");
 const toggle=page.getByRole("button",{name:"Mở menu"});
 await toggle.click();
 await expect(page.getByRole("button",{name:"Đóng menu",exact:true})).toHaveAttribute("aria-expanded","true");
 await page.keyboard.press("Escape");
 await expect(page.getByRole("button",{name:"Mở menu"})).toHaveAttribute("aria-expanded","false");
 await toggle.click();
 await page.locator(".agency-mobile-panel a[href=\"/projects\"]").click();
 await expect(page).toHaveURL(/\/projects$/);
});
test("Reduced motion preserves routes and disables reveal hiding",async({page})=>{
 await page.emulateMedia({reducedMotion:"reduce"});
 await page.goto("/");
 const state=await page.evaluate(()=>({active:document.documentElement.classList.contains("reveal-ready"),
  animation:getComputedStyle(document.querySelector(".client-hero-copy h1")!).animationDuration}));
 expect(state.active).toBe(false);
 expect(parseFloat(state.animation)).toBeLessThanOrEqual(0.05);
 await page.goto("/projects");
 await expect(page.locator(".case-card")).toHaveCount(2);
});
test("No fake inquiry submission; readiness reports blocked",async({page,request})=>{
 await page.goto("/contact");
 await expect(page.locator(".form-offline")).toBeVisible();
 await expect(page.getByRole("button",{name:/Soạn email mô tả nhu cầu/})).toBeVisible();
 const inquiry=await request.post("/api/inquiry",{data:{name:"Example",email:"test@example.com"}});
 expect(inquiry.status()).toBe(503);
 const health=await request.get("/api/health");
 expect(health.status()).toBe(200);
 const readiness=await request.get("/api/readiness");
 expect(readiness.status()).toBe(503);
});
