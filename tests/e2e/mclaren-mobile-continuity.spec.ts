import {expect,test} from "@playwright/test";

const route="/template-demos/auto-showroom";
const sizes=[{width:320,height:680},{width:390,height:760},{width:390,height:844}] as const;

for(const {width,height} of sizes){
 test.describe(`VELAR mobile stage at ${width}x${height}`,()=>{
  test.use({viewport:{width,height},reducedMotion:"no-preference"});

  test("one seamless stage, mobile captions pinned below the car and continuous scroll fades",async({page})=>{
   await page.goto(route);
   const canvas=page.locator("canvas.ix-auto-3d-canvas");
   await expect(canvas).toHaveAttribute("data-renderer","ready",{timeout:30000});
   const track=page.locator("#bv-cinematic-track");
   const backdrop=await page.evaluate(()=>{
    const visual=document.querySelector(".bv-cinematic-track .ix-hero-visual")!;
    const card=document.querySelector(".bv-mobile-story-card")!;
    const canvas=document.querySelector("canvas.ix-auto-3d-canvas") as HTMLCanvasElement;
    return {
     track:getComputedStyle(document.querySelector(".bv-cinematic-track")!).backgroundColor,
     visual:getComputedStyle(visual).backgroundColor,
     gradient:getComputedStyle(visual).backgroundImage,
     cardBackground:getComputedStyle(card).backgroundColor,
     cardBorder:getComputedStyle(card).borderTopWidth,
     mask:getComputedStyle(canvas).maskImage,
     alpha:canvas.getContext("webgl2")?.getContextAttributes()?.alpha,
     horizontalOverflow:document.documentElement.scrollWidth>window.innerWidth+1
    };
   });
   expect(backdrop.visual).toBe(backdrop.track);
   expect(backdrop.gradient).toContain("radial-gradient");
   expect(backdrop.cardBackground).toBe("rgba(0, 0, 0, 0)");
   expect(backdrop.cardBorder).toBe("0px");
   expect(backdrop.mask).toContain("linear-gradient");
   expect(backdrop.alpha).toBe(true);
   expect(backdrop.horizontalOverflow).toBe(false);

   const seek=async(p:number)=>{
    await page.evaluate(progress=>{
     const track=document.getElementById("bv-cinematic-track")!;
     const extent=track.getBoundingClientRect().height-innerHeight;
     window.scrollTo({top:track.getBoundingClientRect().top+scrollY+extent*progress,behavior:"instant"});
    },p);
    await page.waitForFunction(progress=>{
     const track=document.getElementById("bv-cinematic-track")!;
     return Math.abs(Number(track.style.getPropertyValue("--bv-progress"))-progress)<.01;
    },p,{timeout:10000});
   };
   const card=track.locator('[data-story-index="1"]');
   await seek(.20);
   const initial=Number(await card.evaluate(el=>getComputedStyle(el).opacity));
   await seek(.22);
   const next=Number(await card.evaluate(el=>getComputedStyle(el).opacity));
   expect(next).toBeGreaterThan(initial);
   expect(next-initial).toBeLessThan(.5);
   await seek(.28);
   expect(Number(await card.evaluate(el=>getComputedStyle(el).opacity))).toBeGreaterThan(.95);

   for(const p of [.27,.34,.52,.77]){
    await seek(p);
    // The chapter highlight must follow the same scroll snapshot as the
    // text even when the WebGL renderer delays a React render.
    await expect(track).toHaveAttribute("data-chapter",String(Math.min(4,Math.floor(p*5))));
    const safe=await page.evaluate(()=>{
     const track=document.getElementById("bv-cinematic-track")!;
     const nav=track.querySelector(".bv-cinematic-nav")!.getBoundingClientRect();
     const captions=Array.from(track.querySelectorAll<HTMLElement>(".bv-mobile-story-card"))
      .filter(el=>Number(getComputedStyle(el).opacity)>.6)
      .map(el=>el.getBoundingClientRect());
     const scrollCopies=Array.from(track.querySelectorAll<HTMLElement>(".bv-cinematic-step .bv-cinematic-copy"))
      .map(el=>Number(getComputedStyle(el).opacity));
     return {navTop:nav.top, captions:captions.map(r=>({top:r.top,bottom:r.bottom})), scrollCopies};
    });
    expect(safe.captions).toHaveLength(1);
    for(const box of safe.captions){
     expect(box.top).toBeGreaterThan(height*.46);
     expect(box.bottom).toBeLessThanOrEqual(safe.navTop-30);
    }
    expect(safe.scrollCopies.every(v=>v===0)).toBe(true);
   }
  });
 });
}
