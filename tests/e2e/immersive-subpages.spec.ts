import {expect,test} from "@playwright/test";

const worlds=["creative-studio","architecture-studio","auto-showroom"] as const;
const routes=["work","services","about","contact","work/1"] as const;

for(const slug of worlds){
 test("editorial continuity across "+slug+" child pages",async({page})=>{
   await page.setViewportSize({width:390,height:844});
   for(const route of routes){
     await page.goto("/template-demos/"+slug+"/"+route);
     const feature=page.locator(".ix-subpage-feature");
     await expect(feature).toBeVisible();
     const link=feature.getByRole("link",{name:/KHÁM PHÁ KHÔNG GIAN 3D/});
     await expect(link).toHaveAttribute("href","/template-demos/"+slug+"/experience");
     const image=feature.locator("img");
     await expect(image).toHaveCount(1);
     await expect.poll(async()=>image.evaluate(node=> {
       const img=node as HTMLImageElement;
       return img.complete&&img.naturalWidth>0;
     })).toBe(true);
     const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
     expect(overflow,slug+"/"+route+" mobile horizontal overflow").toBeLessThanOrEqual(2);
     await expect(page.locator("canvas.ix-3d-canvas")).toHaveCount(0);
   }
 });
}
