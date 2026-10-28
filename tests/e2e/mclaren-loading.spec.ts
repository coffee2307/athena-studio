import {expect,test} from "@playwright/test";
import {supportsWebGL2} from "./webgl-capability";

test("McLaren: slow network starts GLB by default and allows static studio fallback",async({page})=>{
 test.setTimeout(60000);
 let releaseRequest=()=>{};
 const heldRequest=new Promise<void>(resolve=>{releaseRequest=resolve;});
 await page.route("**/models/mclaren.glb",async route=>{
  // Hold the model response until the visitor chooses the poster. A fixed
  // delay races with hydration and can make the loading button disappear.
  await heldRequest;
  await route.abort("failed").catch(()=>{});
 });
 try{
 await page.goto("/template-demos/auto-showroom");
 const stage=page.locator(".immersive-stage");
 const photo=stage.locator(".bv-studio-fallback");
 await expect(photo).toHaveCount(1);
 await expect(page.getByRole("button",{name:"Tắt chế độ 3D"})).toHaveAttribute("aria-pressed","true");
 if(!(await supportsWebGL2(page))){
  await expect(stage.locator(".ix-auto-3d-canvas")).toHaveAttribute("data-renderer","fallback");
  await expect(stage.locator(".ix-hero-image")).toHaveCSS("opacity","1");
  return;
 }
 await expect(stage.locator("[data-model-loading=loading]")).toBeVisible({timeout:12000});
 const progress=stage.getByRole("progressbar",{name:"Tiến độ tải mô hình McLaren"});
 await expect(progress).toHaveAttribute("aria-valuemin","0");
 await expect(stage.locator(".ix-hero-image")).toHaveCSS("opacity","0");
 await stage.getByRole("button",{name:/Dùng nền tĩnh/}).click();
 await expect(page.getByRole("button",{name:"Bật chế độ 3D"})).toHaveAttribute("aria-pressed","false");
 await expect(stage.locator(".ix-3d-canvas")).toHaveAttribute("data-renderer","fallback");
 await expect(photo).toBeVisible();
 }finally{releaseRequest();}
});

test("McLaren: auto-start download failure offers an accessible static backdrop",async({page})=>{
 test.setTimeout(60000);
 await page.route("**/models/mclaren.glb",route=>route.abort("failed"));
 await page.goto("/template-demos/auto-showroom");
 await expect(page.getByRole("button",{name:"Tắt chế độ 3D"})).toHaveAttribute("aria-pressed","true");
 const stage=page.locator(".immersive-stage");
 await expect(stage.locator("[data-model-loading=failed]")).toBeVisible({timeout:15000});
 await expect(stage.getByRole("button",{name:/Dùng nền tĩnh/})).toBeVisible();
 await stage.getByRole("button",{name:/Dùng nền tĩnh/}).click();
 await expect(stage.locator(".bv-studio-fallback")).toBeVisible();
 await expect(stage.locator(".ix-3d-canvas")).toHaveAttribute("data-renderer","fallback");
});
