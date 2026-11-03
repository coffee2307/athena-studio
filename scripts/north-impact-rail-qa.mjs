import {chromium} from "@playwright/test";
import {mkdirSync,writeFileSync} from "node:fs";

const origin=process.env.ATHENA_QA_ORIGIN||"http://127.0.0.1:3182";
const dir=".qa/north-impact-rail";mkdirSync(dir,{recursive:true});
const sizes=[[320,680],[390,760],[390,844],[428,926],[768,1024],[1024,768],[1440,900]];
const browser=await chromium.launch({headless:true,channel:process.platform==="win32"?"chrome":undefined});
const results=[],failures=[];
function check(cond,msg){if(!cond)throw Error(msg);}
for(const [w,h] of sizes){
 const page=await browser.newPage({viewport:{width:w,height:h},reducedMotion:"reduce"});
 try{
  const response=await page.goto(origin+"/template-demos/modern-corporate",{waitUntil:"load",timeout:40000});
  check(response?.status()===200,"HTTP "+response?.status());
  await page.evaluate(()=>document.fonts.ready);
  const initial=await page.evaluate(()=>({
   overflow:document.documentElement.scrollWidth-innerWidth,
   header:(()=>{const el=document.querySelector('[data-north-page="home"] header');const r=el?.getBoundingClientRect();return r?{top:r.top,height:r.height}:null})()
  }));
  check(initial.overflow<=3,"Horizontal overflow "+initial.overflow);
  check(Boolean(initial.header)&&initial.header.height>40,"Missing NORTH header");
  const selector='[data-north-page="home"] button[aria-controls="north-decision-result"]';
  const buttons=page.locator(selector);
  check(await buttons.count()===3,"Decision panel must have 3 controls");
  for(let i=0;i<3;i++){
   await buttons.nth(i).click();
   check(await buttons.nth(i).getAttribute("aria-pressed")==="true","Selection not reflected "+i);
   check(await page.locator(selector+'[aria-pressed="true"]').count()===1,"Multiple decisions selected");
   const expected=["Xác định ưu tiên","Kết nối quy trình","Lập kế hoạch triển khai"][i];
   check((await page.locator("#north-decision-result").innerText()).includes(expected),"Incorrect outcome "+i);
   const style=await buttons.nth(i).evaluate(el=>({width:el.getBoundingClientRect().width,display:getComputedStyle(el).display,color:getComputedStyle(el).color}));
   check(style.width>10&&style.display!=="none"&&style.color!=="rgba(0, 0, 0, 0)","Invisible control");
  }
  await buttons.first().focus();
  await page.keyboard.press("Tab");
  check(await buttons.nth(1).evaluate(el=>el===document.activeElement),"Keyboard cannot navigate decisions");
  if(w>=1024){
   for(const y of [0,150,410,850]){
    await page.evaluate(v=>window.scrollTo(0,v),y);
    await page.waitForTimeout(80);
    const geom=await page.evaluate(()=>{
     const r=document.querySelector('[data-north-page="home"] header')?.getBoundingClientRect();
     return {top:r?.top,overflow:document.documentElement.scrollWidth-innerWidth};
    });
    check(y===0 ? (geom.top>=0&&geom.top<=40) : Math.abs(geom.top??999)<2,"Header positioning at y="+y+" "+JSON.stringify(geom));
    check(geom.overflow<=3,"Overflow after scrolling "+y);
    results.push({viewport:w,scroll:y,pass:true});
   }
  }else if(w<=428){
   const toggle=page.locator('header button[aria-controls="north-mobile-menu"]');
   await toggle.click();
   check(await toggle.getAttribute("aria-expanded")==="true","Mobile menu not opened");
   check(await page.getByRole("button",{name:"Đóng điều hướng"}).isVisible(),"Accessible close button missing");
   await page.keyboard.press("Escape");
   check(await toggle.getAttribute("aria-expanded")==="false","Escape does not dismiss mobile menu");
  }
  const result=page.locator("#north-decision-result");
  const overlap=await page.evaluate(()=>{
   const root=document.querySelector("#north-decision-result");const items=document.querySelectorAll('[data-north-page="home"] button[aria-controls="north-decision-result"]');
   if(!root||items.length!==3)return -1;
   const a=root.getBoundingClientRect();
   return [...items].reduce((sum,el)=>{const b=el.getBoundingClientRect();return sum+Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));},0);
  });
  check(overlap>=0&&overlap<=24,"NORTH results overlap decision choices: "+overlap);
  await result.screenshot({path:dir+"/north-decision-"+w+"-"+h+".png",animations:"disabled",timeout:15000});
  results.push({viewport:w,decisionClicks:3,keyboard:true,overlap,pass:true});
  console.log("NORTH_RAIL_IMPACT_PASS",w,h);
 }catch(e){const issue={width:w,height:h,error:String(e)};failures.push(issue);console.error("NORTH_RAIL_IMPACT_FAIL",JSON.stringify(issue));}
 finally{await page.close();}
}
await browser.close();
writeFileSync(dir+"/results.json",JSON.stringify({results,failures,engine:"LAB_CHROME_DESKTOP_AND_EMULATED_MOBILE",realSafari:"UNVERIFIED"},null,2)+"\n");
console.log("NORTH_RAIL_IMPACT_RESULT",JSON.stringify({passed:results.length,failures:failures.length}));
if(failures.length)process.exitCode=1;
