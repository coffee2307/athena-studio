import {expect,test} from "@playwright/test";
const projects=["/projects","/projects/pham","/projects/econith","/projects/digital-creators"];
for(const width of [320,390,1440]){
 test.describe(`documentation-style projects ${width}px`,()=>{
  test.use({viewport:{width,height:width===1440?900:844}});
  test("project routes are readable with no horizontal overflow or decorative asterisk",async({page})=>{
   for(const route of projects){
    await page.goto(route);
    await expect(page.locator("h1")).toHaveCount(1);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),route).toBeLessThanOrEqual(2);
    expect(await page.locator("body").innerText()).not.toContain("✳");
   }
  });
  test("directory goes straight to article; no popup or iframe",async({page})=>{
   await page.goto("/projects");
   await page.locator(".ae-project-pham .ae-project-visual-action").click();
   await expect(page).toHaveURL(/\/projects\/pham\/?$/);
   await expect(page.locator(".ae-preview-dialog")).toHaveCount(0);
   await expect(page.locator(".ae-article-section")).toHaveCount(7);
   if(width<761){await page.locator(".ae-article-mobile-toc summary").click();await expect(page.locator(".ae-article-mobile-toc nav a")).toHaveCount(7);}
   else{await expect(page.locator(".ae-article-navigation nav a")).toHaveCount(7);}
  });
  test("PHAM screenshots show full, sharp captures and original links",async({page})=>{
   await page.goto("/projects/pham");
   const figures=page.locator(".ae-article-figure");
   await expect(figures).toHaveCount(4);
   await expect(figures.nth(0).locator("img")).toHaveAttribute("src",/pham-home-hires.webp/);
   await expect(figures.nth(2).locator("img")).toHaveAttribute("src",/pham-home-mobile-hires.webp/);
   for(let i=0;i<4;i++){
    const image=figures.nth(i).locator("img");
    await expect(image).toBeVisible();
    const st=await image.evaluate(el=>({fit:getComputedStyle(el).objectFit,natural:(el as HTMLImageElement).naturalWidth,complete:(el as HTMLImageElement).complete}));
    expect(st.complete).toBe(true);expect(st.natural).toBeGreaterThanOrEqual(i<2?1400:1000);
    expect(st.fit).toBe("contain");
    await expect(figures.nth(i).locator("a")).toHaveAttribute("href",/\.webp$/);
   }
  });
  test("template library is compact on mobile and does not crop screenshot previews",async({page})=>{
   await page.goto("/services/web-development/templates");
   await expect(page.locator(".templates-catalog .template-card")).toHaveCount(20);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(2);
   const card=page.locator(".templates-catalog .template-card").first();
   const style=await card.evaluate(el=>{const img=el.querySelector(".template-thumbnail-screen img") as HTMLImageElement;return {display:getComputedStyle(el).display,fit:getComputedStyle(img).objectFit,transform:getComputedStyle(img).transform}});
   expect(style.fit).toBe("contain");expect(style.transform).toBe("none");
   if(width<761)expect(style.display).toBe("grid");
  });
 });
}
