import {test,expect} from "@playwright/test";
test("SitePulse product research page is transparent, responsive and noncommercial",async({page})=>{
 await page.goto("/products");
 await page.getByRole("link",{name:/Khám phá SitePulse/}).click();
 await expect(page).toHaveURL(/\/products\/sitepulse$/);
 await expect(page.getByRole("heading",{level:1})).toContainText("Biết sớm.");
 await expect(page.locator(".sitepulse-status")).toContainText("CHƯA PHÁT HÀNH");
 await expect(page.getByRole("link",{name:/Chia sẻ trải nghiệm/})).toHaveAttribute("href",/\/contact\?service=micro-saas/);
 await expect(page.locator('input[name="payment"]')).toHaveCount(0);
 const m=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
 expect(m.scroll).toBeLessThanOrEqual(m.width+1);
});
