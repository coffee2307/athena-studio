import {test,expect} from "@playwright/test";

const canonical=[
 "/","/services","/services/web-development","/projects","/projects/pham",
 "/process","/about","/products","/products/sitepulse","/pricing",
 "/contact","/legal","/legal/privacy","/legal/terms","/legal/cookies",
 "/legal/service-policy","/login","/signup","/forgot-password"
];
const redirects=[
 ["/dich-vu","/services"],["/dich-vu/web-development","/services/web-development"],
 ["/du-an","/projects"],["/du-an/pham","/projects/pham"],
 ["/lien-he","/contact"],["/quy-trinh","/process"],["/ve-athena","/about"],
 ["/san-pham","/products"],["/bao-gia","/pricing"],
 ["/phap-ly","/legal"],["/phap-ly/quyen-rieng-tu","/legal/privacy"],
 ["/phap-ly/cookie","/legal/cookies"],["/dang-nhap","/login"],
 ["/dang-ky","/signup"],["/quen-mat-khau","/forgot-password"],
 ["/tai-khoan","/account"],["/quan-tri","/admin"],
 ["/studio","/about"],["/work","/projects"],["/work/pham","/projects/pham"]
] as const;

test("Canonical English paths render content and localized text remains Vietnamese",async({request,page})=>{
 for(const path of canonical){
  const res=await request.get(path,{maxRedirects:0});
  expect(res.status(),path).toBe(200);
 }
 await page.goto("/projects");
 await expect(page.locator("html")).toHaveAttribute("lang","vi");
 await expect(page.getByRole("heading",{level:1})).toBeVisible();
 await page.locator(".case-card a").first().click();
 await expect(page).toHaveURL(/\/projects\/(?:pham|econith)$/);
});
test("All previous Vietnamese URLs redirect one-way to English canonical paths",async({request})=>{
 for(const [from,to] of redirects){
  const res=await request.get(from,{maxRedirects:0});
  expect(res.status(),from).toBe(308);
  const location=new URL(res.headers()["location"]||"", "http://127.0.0.1:3189");
  expect(location.pathname,from).toBe(to);
 }
 const q=await request.get("/lien-he?service=website-care",{maxRedirects:0});
 expect(q.status()).toBe(308);
 const target=new URL(q.headers()["location"],"http://127.0.0.1:3189");
 expect(target.pathname).toBe("/contact");
 expect(target.searchParams.get("service")).toBe("website-care");
});
test("Sitemap exposes English paths only and menu/CTA use canonical links",async({request,page,isMobile})=>{
 const site=await (await request.get("/sitemap.xml")).text();
 for(const route of ["/services","/projects/pham","/contact","/legal/privacy","/pricing"])expect(site).toContain(route);
 for(const old of ["/dich-vu","/du-an","/lien-he","/phap-ly"])expect(site).not.toContain(old);
 await page.goto("/");
 if(isMobile){
  await page.getByRole("button",{name:"Mở menu"}).click();
  await expect(page.locator(".agency-mobile-panel a[href='/projects']")).toBeVisible();
  await page.locator(".agency-mobile-panel a[href='/projects']").click();
  await expect(page).toHaveURL(/\/projects$/);
 }else{
  await expect(page.locator(".agency-desktop-nav a[href='/projects']")).toBeVisible();
 }
 await page.goto("/contact");
 await expect(page.locator(".agency-footer-cta-button")).toHaveAttribute("href",/^mailto:/);
});
