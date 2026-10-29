import {expect,test} from "@playwright/test";

const route="/template-demos/auto-showroom";
const sizes=[320,390] as const;

for(const width of sizes){
 test.describe(`VELAR mobile continuity at ${width}px`,()=>{
  test.use({viewport:{width,height:844},reducedMotion:"no-preference"});

  test("transparent studio backdrop and smoothly interpolated chapter copy",async({page})=>{
   await page.goto(route);
   const canvas=page.locator("canvas.ix-auto-3d-canvas");
   await expect(canvas).toHaveAttribute("data-renderer","ready",{timeout:30000});
   const backdrop=await page.evaluate(()=>{
    const el=document.querySelector(".bv-cinematic-track .ix-hero-visual")!;
    const canvas=document.querySelector("canvas.ix-auto-3d-canvas") as HTMLCanvasElement;
    return {
     track:getComputedStyle(document.querySelector(".bv-cinematic-track")!).backgroundColor,
     visual:getComputedStyle(el).backgroundColor,
     alpha:canvas.getContext("webgl2")?.getContextAttributes()?.alpha,
     horizontalOverflow:document.documentElement.scrollWidth>window.innerWidth+1
    };
   });
   expect(backdrop.visual).toBe(backdrop.track);
   expect(backdrop.alpha).toBe(true);
   expect(backdrop.horizontalOverflow).toBe(false);
   const track=page.locator("#bv-cinematic-track");
   const seek=async(p:number)=>{
    await page.evaluate(progress=>{
     const track=document.getElementById("bv-cinematic-track")!;
     const extent=track.getBoundingClientRect().height-innerHeight;
     window.scrollTo({top:track.getBoundingClientRect().top+scrollY+extent*progress,behavior:"instant"});
    },p);
    await page.waitForTimeout(180);
   };
   await seek(.20);
   const initial=await track.locator('[data-scene-index="1"]').evaluate(el=>Number(getComputedStyle(el).getPropertyValue("--bv-copy-opacity")));
   await seek(.22);
   const next=await track.locator('[data-scene-index="1"]').evaluate(el=>Number(getComputedStyle(el).getPropertyValue("--bv-copy-opacity")));
   expect(next).toBeGreaterThan(initial);
   expect(next-initial).toBeLessThan(.5);
   await seek(.28);
   const fullyVisible=await track.locator('[data-scene-index="1"]').evaluate(el=>Number(getComputedStyle(el).getPropertyValue("--bv-copy-opacity")));
   expect(fullyVisible).toBeGreaterThan(.95);
   for(const p of [.27,.52,.77]){
    await seek(p);
    const safe=await page.evaluate(()=>{
     const track=document.querySelector("#bv-cinematic-track")!;
     const stage=track.querySelector(".ix-hero")!.getBoundingClientRect();
     const nav=track.querySelector(".bv-cinematic-nav")!.getBoundingClientRect();
     const copies=Array.from(track.querySelectorAll<HTMLElement>(".bv-cinematic-copy"))
       .filter(el=>Number(getComputedStyle(el).opacity)>.8)
       .map(el=>el.getBoundingClientRect())
       .filter(rect=>rect.bottom>0&&rect.top<innerHeight);
     return {stageBottom:stage.bottom,navTop:nav.top,copies:copies.map(rect=>({top:rect.top,bottom:rect.bottom}))};
    });
    for(const box of safe.copies){
     expect(box.bottom).toBeLessThanOrEqual(safe.navTop-6);
    }
   }
  });
 });
}
