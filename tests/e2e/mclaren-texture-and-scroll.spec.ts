import {expect,test} from "@playwright/test";

// This deliberately tests a browser event, not canvas=ready alone:
// Three GLTFLoader can report ready while silently dropping WebP maps.
for(const path of ["/template-demos/auto-showroom","/template-demos/auto-showroom/experience"]){
 test("McLaren embedded WebP textures decode without blob CSP failures: "+path,async({page})=>{
  const errors:string[]=[];
  await page.addInitScript(()=>{
   window.addEventListener("securitypolicyviolation",event=>{
    if(event.blockedURI.startsWith("blob:"))console.error("BLOB_CSP_FAILURE "+event.violatedDirective);
   });
  });
  page.on("console",event=>{
   if(event.type()==="error"||event.type()==="warning")errors.push(event.text());
  });
  page.on("pageerror",error=>errors.push(String(error)));
  const response=await page.goto(path,{waitUntil:"domcontentloaded"});
  expect(response?.status()).toBe(200);
  const policy=response?.headers()["content-security-policy"]??"";
  expect(policy).toContain("img-src 'self' data: blob:");
  expect(policy).toContain("connect-src 'self' blob:");
  const button=path.endsWith("/experience")
   ?page.getByRole("button",{name:"TẮT 3D"})
   :page.getByRole("button",{name:"Bật chế độ 3D"});
  await expect(button).toBeVisible();
  if(!path.endsWith("/experience"))await button.click();
  const stage=page.locator(path.endsWith("/experience")?".journey-stage":".immersive-stage");
  const canvas=stage.locator("canvas.ix-auto-3d-canvas");
  await expect(canvas).toHaveAttribute("data-renderer","ready",{timeout:30000});
  await page.waitForTimeout(500);
  const failures=errors.filter(msg=>/Couldn't load texture|BLOB_CSP_FAILURE|refused to connect because it violates|asset failed|incomplete 3D render/i.test(msg));
  expect(failures).toEqual([]);
 });
}

test("Auto journey progress and chapters agree with document scroll after fast reverse",async({page})=>{
 await page.goto("/template-demos/auto-showroom/experience");
 const track=page.locator("#athena-journey-auto-showroom");
 const bar=page.locator(".athena-journey-auto-showroom .journey-progress > div");
 await track.scrollIntoViewIfNeeded();
 await page.getByRole("button",{name:"Đến chương 3"}).click();
 await expect(page.getByRole("button",{name:"Đến chương 3"})).toHaveAttribute("aria-current","step");
 await page.getByRole("button",{name:"Đến chương 1"}).click();
 await expect(page.getByRole("button",{name:"Đến chương 1"})).toHaveAttribute("aria-current","step");
 const measured=await page.evaluate(()=>{
   const el=document.getElementById("athena-journey-auto-showroom");
   const meter=document.querySelector<HTMLElement>(".athena-journey-auto-showroom .journey-progress > div");
   if(!el||!meter)return null;
   const p=Math.max(0,Math.min(1,-el.getBoundingClientRect().top/Math.max(1,el.getBoundingClientRect().height-innerHeight)));
   const match=meter.style.transform.match(/scaleX\(([^)]+)\)/);
   return {p,shown:match?Number(match[1]):-1};
 });
 expect(measured).not.toBeNull();
 expect(Math.abs(measured!.p-measured!.shown)).toBeLessThan(.015);
});
