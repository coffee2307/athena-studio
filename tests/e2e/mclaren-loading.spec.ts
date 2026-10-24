import {expect,test} from "@playwright/test";

test("McLaren: slow network shows honest loading state, keeps poster and allows user to skip",async({page})=>{
 await page.route("**/models/mclaren-ultimate-vision-gt.glb",async route=>{
  await new Promise(resolve=>setTimeout(resolve,1600));
  await route.continue();
 });
 await page.goto("/template-demos/auto-showroom");
 const stage=page.locator(".immersive-stage");
 const photo=stage.locator(".ix-hero-photograph");
 await expect(photo).toBeVisible();
 await page.getByRole("button",{name:"Bật chế độ 3D"}).click();
 await expect(stage.locator("[data-model-loading=loading]")).toBeVisible({timeout:12000});
 const progress=stage.getByRole("progressbar",{name:"Tiến độ tải mô hình McLaren"});
 await expect(progress).toHaveAttribute("aria-valuemin","0");
 await expect(photo).toBeVisible();
 await stage.getByRole("button",{name:/Xem ảnh thay thế/}).click();
 await expect(page.getByRole("button",{name:"Bật chế độ 3D"})).toHaveAttribute("aria-pressed","false");
 await expect(stage.locator(".ix-3d-canvas")).toHaveAttribute("data-renderer","fallback");
 await expect(photo).toBeVisible();
});

test("McLaren: a failed GLB download offers an accessible image fallback",async({page})=>{
 await page.route("**/models/mclaren-ultimate-vision-gt.glb",route=>route.abort("failed"));
 await page.goto("/template-demos/auto-showroom");
 await page.getByRole("button",{name:"Bật chế độ 3D"}).click();
 const stage=page.locator(".immersive-stage");
 await expect(stage.locator("[data-model-loading=failed]")).toBeVisible({timeout:15000});
 await expect(stage.getByRole("button",{name:/Xem ảnh thay thế/})).toBeVisible();
 await stage.getByRole("button",{name:/Xem ảnh thay thế/}).click();
 await expect(stage.locator(".ix-hero-photograph")).toBeVisible();
 await expect(stage.locator(".ix-3d-canvas")).toHaveAttribute("data-renderer","fallback");
});
