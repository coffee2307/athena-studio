import {test,expect} from "@playwright/test";

test("CTA dẫn đến hành động khác nhau theo ngữ cảnh, không quay lại trang hiện tại",async({page})=>{
 await page.goto("/");
 const footer=page.locator(".agency-footer-cta-button");
 await expect(footer).toHaveAttribute("href","/contact");
 await footer.click();
 await expect(page).toHaveURL(/\/contact$/);
 const newAction=page.locator(".agency-footer-cta-button");
 await expect(newAction).toHaveText(/Soạn email tư vấn/);
 await expect(newAction).toHaveAttribute("href",/^mailto:coffee2307@gmail.com\?subject=/);
 await expect(page.locator(".agency-header .agency-primary-cta")).toHaveAttribute("href",/^mailto:/);
 await expect(page.locator(".form-offline a")).toHaveAttribute("href",/^mailto:/);
});

test("Các nút liên hệ luôn là đường dẫn thật và header có số điện thoại",async({page,isMobile})=>{
 await page.goto("/");
 const dock=page.getByRole("navigation",{name:"Liên hệ nhanh"});
 await expect(dock.locator("a")).toHaveCount(3);
 for(const [pattern,target] of [[/Gọi điện/,"tel:+84965747147"],[/WhatsApp/,"https://wa.me/84965747147"],[/Zalo/,"https://zalo.me/0965747147"]] as const){
  const link=dock.getByRole("link",{name:pattern});
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute("href",target);
  const geometry=await link.boundingBox();
  expect(geometry?.width).toBeGreaterThanOrEqual(44);
  expect(geometry?.height).toBeGreaterThanOrEqual(44);
 }
 if(!isMobile){
  await expect(page.locator(".agency-topline-contacts a[href='tel:+84965747147']")).toBeVisible();
  await expect(page.locator(".agency-topline-contacts a[href='mailto:coffee2307@gmail.com']")).toBeVisible();
 }
});

test("Menu mobile nhận chạm thật và điều hướng sau cuộn trang",async({page,isMobile})=>{
 test.skip(!isMobile,"Chỉ kiểm tra trên giao diện cảm ứng");
 await page.goto("/");
 const toggle=page.getByRole("button",{name:"Mở menu"});
 const box=await toggle.boundingBox();
 expect(box).not.toBeNull();
 await page.touchscreen.tap(box!.x+box!.width/2,box!.y+box!.height/2);
 await expect(page.locator(".agency-mobile-panel")).toBeVisible();
 await expect(page.locator("body")).toHaveCSS("overflow","hidden");
 await expect(page.locator(".agency-mobile-panel a[href='tel:+84965747147']")).toBeVisible();
 await page.locator(".agency-mobile-panel a[href='/projects']").tap();
 await expect(page).toHaveURL(/\/projects$/);
 await expect(page.locator(".agency-mobile-panel")).not.toBeVisible();
 await page.evaluate(()=>window.scrollTo(0,450));
 await toggle.tap();
 await expect(page.locator(".agency-mobile-panel")).toBeVisible();
 await page.getByRole("button",{name:"Đóng menu điều hướng"}).tap({force:true});
 await expect(page.locator(".agency-mobile-panel")).not.toBeVisible();
});

test("Trang dự án không công khai nhãn nội bộ hoặc mã nguồn",async({page})=>{
 for(const path of ["/","/projects","/projects/pham","/projects/econith"]){
  await page.goto(path);
  const body=page.locator("main");
  for(const term of ["PHÂN LOẠI","Dự án founder","VAI TRÒ THỰC HIỆN","không được trình bày là hợp đồng","Đã đối chiếu"]){
   await expect(body,path+" must not show "+term).not.toContainText(term);
  }
  expect(await body.locator("a[href*='github.com']").count()).toBe(0);
 }
});
