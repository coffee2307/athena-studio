import {test,expect} from "@playwright/test";
function contrast(a:string,b:string){
 const parse=(s:string)=>{const m=s.match(/rgba?\(([^)]+)\)/);if(!m)return null;const p=m[1].split(",").map(Number);return p.length>=3?{rgb:p.slice(0,3),alpha:p.length>3?p[3]:1}:null;};
 const c=parse(a),d=parse(b);if(!c||!d||c.alpha<0.99||d.alpha<0.99)return null;
 const lum=(rgb:number[])=>{const n=rgb.map(x=>{const v=x/255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4});return .2126*n[0]+.7152*n[1]+.0722*n[2]};
 const x=lum(c.rgb),y=lum(d.rgb);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
}
const routes=["/","/process","/services/web-development","/services/website-care","/services/ai-integration"];
for(const width of [390,1440])for(const route of routes){
 test("DNA-03 CTA foreground/background "+width+" "+route,async({page})=>{
  await page.setViewportSize({width,height:844});
  await page.goto(route,{waitUntil:"domcontentloaded"});
  const selector=".dna-button,.pill-link,.dna03-stage-choices button,.home-demo-open,.home-demo-visit,.dna02-page-scene-options button";
  const data=await page.locator(selector).evaluateAll(els=>els.filter(x=>x.getBoundingClientRect().width>0&&x.getBoundingClientRect().height>0).map(el=>{
   const s=getComputedStyle(el);return {label:el.textContent?.trim().slice(0,40),fg:s.color,bg:s.backgroundColor};
  }));
  let evaluated=0;
  for(const item of data){
   const ratio=contrast(item.fg,item.bg);
   if(ratio===null)continue;
   evaluated++;
   expect(ratio,`${route} @ ${width}px: ${item.label} ${item.fg} on ${item.bg}`).toBeGreaterThanOrEqual(4.5);
  }
  expect(evaluated).toBeGreaterThan(0);
 });
}
