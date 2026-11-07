import fs from "node:fs";
import assert from "node:assert/strict";
import {chromium} from "playwright";
const base="http://127.0.0.1:3182";
const browser=await chromium.launch({channel:"chrome",headless:true,args:["--disable-dev-shm-usage"]});
const paths=["/","/services","/services/web-development","/projects","/about","/process","/contact","/pricing","/start","/products","/legal","/templates/creative-studio","/templates/modern-corporate","/templates/commerce-standard","/templates/fashion-archive","/templates/saas-product","/templates/campaign-landing","/templates/hospitality-booking","/templates/architecture-studio","/templates/auto-showroom","/templates/digital-creators","/login","/signup","/forgot-password"];
const skipVi=new Set(["MỞ","Bếp & Chuyện","NHÀ MỘC"]);
const results=[],failures=[];
const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:"reduce"});
const jsErrors=[];page.on("pageerror",e=>jsErrors.push(e.message));
async function visit(path,lang){
 const response=await page.goto(base+path,{waitUntil:"domcontentloaded",timeout:30000});
 assert.equal(response?.status(),200,"HTTP "+path);
 await page.waitForFunction(lang=>document.documentElement.lang===lang,lang,{timeout:7000});
 await page.waitForTimeout(260);
 const data=await page.evaluate(()=>{
  const root=document.body,walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  let n,viText=[];
  while(n=walker.nextNode()){
   const text=n.textContent?.trim();
   if(!text||!(/[đĐ]/.test(text)||/[\u0300-\u036F]/.test(text.normalize("NFD"))))continue;
   if(n.parentElement?.closest(".template-demo-main,[data-athena-no-translate],script,style,noscript,svg,code,pre"))continue;
   if(["Đang kiểm tra tài khoản…"].includes(text))continue;
   viText.push(text.slice(0,150));
  }
  return{lang:document.documentElement.lang,header:document.querySelector(".agency-header")?.getBoundingClientRect().toJSON(),overflow:document.documentElement.scrollWidth-innerWidth,viText:[...new Set(viText)],main:(document.querySelector("main h1")||document.querySelector("h1"))?.textContent?.trim().slice(0,85)};
 });
 assert(data.overflow<=4,path+" overflow "+data.overflow);
 results.push({path,lang,h1:data.main,remaining:data.viText.length,examples:data.viText.slice(0,8)});
 console.log("I18N_VISIT",path,lang,"VI_TEXT",data.viText.length,"h1",JSON.stringify(data.main));
 return data;
}
try{
 await visit("/","vi");
 let menu=page.locator(".athena-language-trigger:visible").first();
 await menu.click();
 await page.locator('.athena-language-options [lang="en"]').first().click();
 await page.waitForFunction(()=>document.documentElement.lang==="en");
 assert((await page.locator("header .agency-auth-link").innerText()).includes("Sign In"));
 assert((await page.locator("header .agency-register-link").innerText()).includes("Sign Up"));
 console.log("AUTH_NAV_DESKTOP_TRANSLATED");
 for(const path of paths){
  try{
   const data=await visit(path,"en");
   if(path==="/login"||path==="/signup")assert(data.viText.length===0,"auth page has Vietnamese "+JSON.stringify(data.viText.slice(0,10)));
   if(path.startsWith("/templates/")){
    assert(data.viText.length===0,"template detail untranslated: "+JSON.stringify(data.viText.slice(0,12)));
    const links=await page.locator('a[href*="/template-demos/"]').evaluateAll(els=>els.map(e=>e.getAttribute("href")||""));
    assert(links.length>=1&&links.every(h=>h.includes("lang=en")),"template links do not preserve EN: "+JSON.stringify(links));
    const frame=page.locator(".template-detail-iframe iframe");
    assert((await frame.getAttribute("src"))?.includes("lang=en"),"template iframe did not preserve EN");
   }
  }catch(e){failures.push({path,error:String(e).slice(0,350)});console.log("FAIL",path,String(e).slice(0,180));}
 }
 const mobile=await browser.newPage({viewport:{width:390,height:844},reducedMotion:"reduce"});
 try{
  const response=await mobile.goto(base+"/",{waitUntil:"domcontentloaded",timeout:30000});
  assert.equal(response.status(),200);
  await mobile.locator(".agency-menu-toggle").click();
  await mobile.locator("#athena-mobile-menu .athena-language-trigger").click();
  assert(await mobile.locator('#athena-mobile-menu .athena-language-options [lang="en"]').isVisible());
  await mobile.locator('#athena-mobile-menu .athena-language-options [lang="en"]').click();
  await mobile.waitForFunction(()=>document.documentElement.lang==="en");
  const mobileSignIn=mobile.locator("#athena-mobile-menu .agency-mobile-signin");
  assert((await mobileSignIn.innerText()).includes("Sign In"),"mobile sign in label");
  assert((await mobile.locator("#athena-mobile-menu .agency-mobile-signup").innerText()).includes("Sign Up"),"mobile signup label");
  await mobile.locator("#athena-mobile-menu .athena-language-trigger").click();
  await mobile.locator('#athena-mobile-menu .athena-language-options [lang="vi"]').click();
  await mobile.waitForFunction(()=>document.documentElement.lang==="vi");
  assert((await mobileSignIn.innerText()).includes("Đăng nhập"),"mobile VI label");
  console.log("AUTH_NAV_MOBILE_SWITCH_PASS");
 }catch(e){failures.push({path:"mobile",error:String(e).slice(0,350)});console.log("FAIL_MOBILE",String(e).slice(0,250));}
 finally{await mobile.close();}
}catch(e){failures.push({path:"global",error:String(e).slice(0,350)});console.log("FAIL_GLOBAL",String(e).slice(0,300));}
finally{
 await page.close();await browser.close();
 fs.mkdirSync(".qa/athena-i18n-audit",{recursive:true});
 fs.writeFileSync(".qa/athena-i18n-audit/qa-final.json",JSON.stringify({results,failures,jsErrors},null,2));
 console.log("I18N_QA_RESULTS",JSON.stringify({paths:results.length,failures,jsErrors}));
 if(failures.length||jsErrors.length)process.exitCode=1;
}
