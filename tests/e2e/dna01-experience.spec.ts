import {expect,test} from "@playwright/test";

for(const width of [320,390,428,768,1440]){
 test.describe(`ATHENA-DNA-01 responsive contract @ ${width}px`,()=>{
  test.use({viewport:{width,height:width>=768?900:844},reducedMotion:"reduce"});

  test("public creative surfaces are legible without horizontal scrolling",async({page})=>{
   for(const route of ["/","/services","/projects","/projects/pham","/services/web-development/templates"]){
    const jsErrors:string[]=[];
    const handler=(error:Error)=>jsErrors.push(error.message);
    page.on("pageerror",handler);
    const response=await page.goto(route,{waitUntil:"domcontentloaded"});
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),route).toBeLessThanOrEqual(2);
    expect(jsErrors,route).toEqual([]);
    page.off("pageerror",handler);
   }
  });

  test("home is visual-first and service actions are distinct and functional",async({page})=>{
   await page.goto("/");
   await expect(page.locator(".dna-home-hero h1")).toBeVisible();
   await expect(page.locator(".dna-home-hero .dna-button-primary")).toHaveAttribute("href","/start");
   const cards=page.locator(".dna-services-grid-home .dna-service-card");
   await expect(cards).toHaveCount(3);
   await expect(cards.nth(0).locator(".dna-browser-preview img")).toHaveCount(1);
   await expect(cards.nth(1).locator(".dna-care-board")).toBeVisible();
   await expect(cards.nth(2).locator(".dna-ai-graph")).toBeVisible();
   const destinations=await cards.locator("a.dna-service-cta").evaluateAll(els=>els.map(a=>a.getAttribute("href")));
   expect(destinations).toEqual(["/services/web-development","/services/website-care","/services/ai-integration"]);
  });

  test("PHAM screenshots stay centered, scrollable, and don't stretch the article",async({page})=>{
   await page.goto("/projects/pham");
   await expect(page.locator(".ae-article-figure")).toHaveCount(4);
   const phone=page.locator(".dna-gallery-phone").first();
   await phone.scrollIntoViewIfNeeded();
   const sizes=await phone.evaluate(el=>{const outer=el.getBoundingClientRect();const img=el.querySelector("img") as HTMLImageElement;
    return {width:outer.width,height:outer.height,scrollHeight:el.scrollHeight,clientHeight:el.clientHeight,center:outer.left+outer.width/2,fit:getComputedStyle(img).objectFit};
   });
   expect(sizes.fit).toBe("contain");
   expect(sizes.height).toBeLessThanOrEqual(width<761?520:630);
   expect(sizes.scrollHeight).toBeGreaterThan(sizes.clientHeight);
   const mid=await page.evaluate(()=>innerWidth/2);
   expect(Math.abs(sizes.center-mid)).toBeLessThanOrEqual(width<761?25:105);
  });

  test("template catalog has consistent CTA alignment across desktop peers",async({page})=>{
   await page.goto("/services/web-development/templates");
   const cards=page.locator(".template-card");
   expect(await cards.count()).toBeGreaterThanOrEqual(20);
   if(width>760){
    const tops=await cards.evaluateAll(nodes=>nodes.slice(0,3).map(n=>{const a=n.querySelector(".template-card-footer")!.getBoundingClientRect();return Math.round(a.top)}));
    expect(Math.max(...tops)-Math.min(...tops)).toBeLessThanOrEqual(3);
   }
  });
 });
}
