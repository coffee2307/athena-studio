import {expect,test} from "@playwright/test";

test("five-minute Athena invitation keeps white CTA text on dark background in desktop and mobile",async({page})=>{
 test.setTimeout(60000);
 await page.clock.install();
 await page.goto("/template-demos/creative-studio",{waitUntil:"domcontentloaded"});
 // Hydration and the invitation timer must be mounted before advancing time.
 await page.locator(".ix-scene-rail .ix-mode-list button").nth(1).click();
 await page.clock.fastForward(5*60*1000);
 const dialog=page.getByRole("dialog",{name:/Bạn có thích mẫu này/});
 await expect(dialog).toBeVisible();
 const action=dialog.getByRole("link",{name:/Trao đổi với Athena/});
 await expect(action).toHaveAttribute("href",/template=creative-studio/);
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:844});
  await expect(action).toBeVisible();
  const colors=await action.evaluate(el=>{
   const s=getComputedStyle(el);
   return {fg:s.color,bg:s.backgroundColor,width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height};
  });
  expect(colors.fg).toBe("rgb(255, 255, 255)");
  expect(colors.bg).toBe("rgb(23, 24, 23)");
  expect(colors.height).toBeGreaterThanOrEqual(44);
 }
 await action.focus();
 await expect(action).toHaveCSS("color","rgb(255, 255, 255)");
 await action.hover();
 await expect(action).toHaveCSS("color","rgb(255, 255, 255)");
});
