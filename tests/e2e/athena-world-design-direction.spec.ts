import {expect,test} from "@playwright/test";

const worlds=[
 {slug:"creative-studio",headline:/Ý tưởng không ở yên/},
 {slug:"architecture-studio",headline:/Bề mặt\. Ánh sáng/},
 {slug:"auto-showroom",headline:/EVERY SURFACE COUNTS/}
] as const;

for(const {slug,headline} of worlds){
 test("Athena creative direction: "+slug+" keeps its original visual identity across viewports",async({page})=>{
  for(const width of [390,1440]){
   await page.setViewportSize({width,height:900});
   await page.goto("/template-demos/"+slug);
   const home=page.locator(".immersive-home");
   const editorial=page.locator(".ix-editorial");
   await expect(home).toBeVisible();
   await expect(home).toHaveAttribute("data-immersive",slug==="auto-showroom"?"true":"false");
   await expect(editorial.getByRole("heading",{name:headline})).toHaveCount(1);
   await expect(editorial.locator("figure")).toHaveCount(2);
   await expect(editorial.getByRole("link",{name:/KHÁM PHÁ DESIGN STUDIES|Xem hồ sơ công trình|Đi sâu vào từng dự án/}))
      .toHaveAttribute("href","/template-demos/"+slug+"/work");
   // The active WebGL stage can stay layout-unstable while Playwright waits
   // for element stability. Scroll directly, then assert the actual viewport.
   await editorial.evaluate(element=>element.scrollIntoView({block:"center",behavior:"instant"}));
   await expect(editorial).toBeInViewport();
   // Lazy photos should only load after the image itself enters the viewport.
   await editorial.locator("figure img").first().scrollIntoViewIfNeeded();
   await expect.poll(async()=>editorial.locator("figure img").first().evaluate(node=>{
    const image=node as HTMLImageElement;return image.complete&&image.naturalWidth>0;
   })).toBe(true);
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
   expect(overflow,slug+" "+width+"px overflow").toBeLessThanOrEqual(2);
   await page.locator(".ix-render-toggle").click();
   await expect(home).toHaveAttribute("data-immersive",slug==="auto-showroom"?"false":"true");
   if(slug==="creative-studio"){
     await expect(page.locator(".ix-studio-overlay")).toHaveCount(0);
   }
  }
 });
}
