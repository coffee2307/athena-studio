import {test,expect} from "@playwright/test";
test("Poppy pet-zine gallery is responsive and its pet chooser switches the photo",async({page})=>{
 const errors:string[]=[];page.on("pageerror",e=>errors.push(e.message));
 await page.goto("/template-demos/pet-store");
 await expect(page.getByRole("heading",{level:1})).toContainText("Little");
 const group=page.getByRole("group",{name:"Chọn người bạn thú cưng"});
 await expect(group.getByRole("button")).toHaveCount(3);
 const image=page.locator("main figure img").first();
 await expect(image).toBeVisible();
 const source=await image.getAttribute("src");
 await group.getByRole("button").nth(1).click();
 await expect(group.getByRole("button").nth(1)).toHaveAttribute("aria-pressed","true");
 await expect(image).not.toHaveAttribute("src",source||"");
 expect(await image.evaluate((el)=>(el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
 expect(overflow).toBeLessThanOrEqual(2);expect(errors).toHaveLength(0);
});
test("FORMA technical monograph hero loads its architectural photograph and remains usable",async({page})=>{
 const errors:string[]=[];page.on("pageerror",e=>errors.push(e.message));
 await page.goto("/template-demos/architecture-studio");
 await expect(page.locator("h1")).toContainText("Không gian");
 const copy=page.locator('[class*="heroCopy"]').first();
 await expect(copy).toBeVisible();
 const background=await copy.evaluate(el=>getComputedStyle(el).backgroundColor);
 expect(background).toBe("rgb(13, 49, 67)");
 const photo=page.locator('[class*="heroPicture"] img').first();
 await expect(photo).toBeVisible();
 expect(await photo.evaluate(img=>(img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
 expect(overflow).toBeLessThanOrEqual(2);expect(errors).toHaveLength(0);
});
test("Bếp & Chuyện table invitation has working photo controls and safe booking draft",async({page,isMobile})=>{
 const errors:string[]=[];page.on("pageerror",e=>errors.push(e.message));
 await page.goto("/template-demos/hospitality-booking");
 await expect(page.getByRole("heading",{level:1})).toContainText("Ngồi lại");
 const photo=page.locator('[class*="tableStage"] figure img').first();
 const oldSrc=await photo.getAttribute("src");
 await page.getByRole("button",{name:"Hình tiếp theo"}).first().click();
 await expect(photo).not.toHaveAttribute("src",oldSrc||"");
 const card=page.locator('[class*="tableStage"] [class*="heroWords"]').first();
 await expect(card).toBeVisible();
 if(!isMobile){
  const cardBounds=await card.boundingBox(),imageBounds=await photo.boundingBox();
  expect(cardBounds&&imageBounds&&cardBounds.x<imageBounds.x+imageBounds.width).toBeTruthy();
 }
 await page.goto("/template-demos/hospitality-booking/booking");
 await expect(page.locator('input[type="date"]')).toBeVisible();
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
 expect(overflow).toBeLessThanOrEqual(2);expect(errors).toHaveLength(0);
});
test("No forbidden action glyph appears on the major public templates",async({page})=>{
 const glyph=String.fromCharCode(0x2197);
 for(const slug of ["pet-store","architecture-studio","hospitality-booking","campaign-landing","creative-studio","modern-corporate","fashion-archive","saas-product"]){
  await page.goto("/template-demos/"+slug);
  const text=await page.locator("body").innerText();
  expect(text.includes(glyph),slug).toBe(false);
 }
});
