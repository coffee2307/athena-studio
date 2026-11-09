import {test,expect} from "@playwright/test";
test("MỞ culture homepage renders cinematic photography and switches each poster without navigation",async({page})=>{
 const exceptions:string[]=[];
 page.on("pageerror",error=>exceptions.push(error.message));
 await page.goto("/template-demos/campaign-landing");
 const stage=page.locator('[data-dna04-artifact="campaign-landing-posterStage"]');
 await expect(stage).toBeVisible();
 await expect(page.locator("h1")).toContainText("THÀNH PHỐ");
 await expect(stage.locator("img[data-visible='true']")).toHaveCount(1);
 await expect(stage).toHaveAttribute("data-active-chapter","0");
 const selector=stage.getByRole("group",{name:"Chọn hình ảnh poster theo chương"});
 const choices=selector.getByRole("button");
 await expect(choices).toHaveCount(3);
 for(const i of [1,2,0]){
  await choices.nth(i).click();
  await expect(stage).toHaveAttribute("data-active-chapter",String(i));
  await expect(choices.nth(i)).toHaveAttribute("aria-pressed","true");
  await expect(stage.locator("img[data-visible='true']")).toHaveCount(1);
 }
 await stage.getByRole("button",{name:"Chuyển đến chương tiếp theo"}).click();
 await expect(stage).toHaveAttribute("data-active-chapter","1");
 const visibleImage=stage.locator("img[data-visible='true']");
 expect(await visibleImage.evaluate((img)=>(img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
 expect(exceptions).toHaveLength(0);
});
test("MỞ poster lightbox opens, switches chapters and closes with Escape",async({page})=>{
 await page.goto("/template-demos/campaign-landing");
 await page.getByRole("button",{name:/XEM POSTER/}).click();
 const dialog=page.getByRole("dialog",{name:"Poster chương trình MỞ Festival"});
 await expect(dialog).toBeVisible();
 await expect(dialog.locator("img")).toBeVisible();
 await dialog.getByRole("group",{name:"Chọn poster trong chế độ xem lớn"}).getByRole("button").nth(2).click();
 await expect(dialog).toContainText("KẾT NỐI");
 await page.keyboard.press("Escape");
 await expect(dialog).not.toBeVisible();
 const current=page.locator('[data-dna04-artifact="campaign-landing-posterStage"]');
 await expect(current).toHaveAttribute("data-active-chapter","2");
});
test("MỞ mobile and desktop are stable; links and conceptual content preserved",async({page,isMobile})=>{
 await page.goto("/template-demos/campaign-landing");
 const dimensions=await page.evaluate(()=>({viewport:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
 expect(dimensions.scroll-dimensions.viewport).toBeLessThanOrEqual(2);
 await expect(page.getByText("2026 — CONCEPT EDITION")).toBeVisible();
 if(isMobile){
  await page.getByRole("button",{name:"Mở điều hướng"}).click();
  const nav=page.locator("#mo-mobile-navigation");
  await expect(nav).toHaveAttribute("data-open","true");
  await page.keyboard.press("Escape");
  await expect(nav).toHaveAttribute("data-open","false");
 }
 await page.goto("/template-demos/campaign-landing/work");
 await expect(page.locator("h1")).toContainText("BA CÁCH");
 await page.goto("/template-demos/campaign-landing/services");
 await expect(page.getByRole("group",{name:"Chọn trải nghiệm"}).getByRole("button")).toHaveCount(3);
 await page.goto("/template-demos/campaign-landing/contact");
 await expect(page.locator("#mo-message")).toBeVisible();
 await expect(page.getByText("không nhận hoặc lưu dữ liệu")).toBeVisible();
});
