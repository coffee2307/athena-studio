import type {NextConfig} from "next";

const site=process.env.NEXT_PUBLIC_SITE_URL||"";
const httpsOrigin=/^https:\/\//i.test(site);
const supabaseOrigin=(()=>{
 try{
  if(process.env.NEXT_PUBLIC_ATHENA_AUTH_ENABLED!=="true")return "";
  const origin=new URL(process.env.NEXT_PUBLIC_SUPABASE_URL||"");
  return origin.protocol==="https:"?origin.origin:"";
 }catch{return "";}
})();
const policy=[
 "default-src 'self'",
 "base-uri 'self'",
 "object-src 'none'",
 "frame-ancestors 'none'",
 "form-action 'self'",
 "img-src 'self' data:",
 "font-src 'self' data:",
 "style-src 'self' 'unsafe-inline'",
 // Next.js static hydration uses framework inline scripts; strict nonces are
 // deferred until the verified hosting model supports per-request nonce SSR.
 "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
 ["connect-src 'self' https://challenges.cloudflare.com",supabaseOrigin].filter(Boolean).join(" "),
 "frame-src https://challenges.cloudflare.com",
 ...(httpsOrigin?["upgrade-insecure-requests"]:[])
].join("; ");
const headers=[
 {key:"X-Content-Type-Options",value:"nosniff"},
 {key:"Referrer-Policy",value:"strict-origin-when-cross-origin"},
 {key:"X-Frame-Options",value:"DENY"},
 {key:"Permissions-Policy",value:"camera=(), microphone=(), geolocation=(), payment=(), usb=()"},
 {key:"Cross-Origin-Opener-Policy",value:"same-origin"},
 {key:"Content-Security-Policy",value:policy},
 ...(httpsOrigin?[{key:"Strict-Transport-Security",value:"max-age=31536000"}]:[])
];
const nextConfig:NextConfig={
 // Build a minimal single-process image for small VPS hosts only when requested.
 ...(process.env.ATHENA_VPS_STANDALONE_BUILD==="true"?{output:"standalone" as const}:{}),
 poweredByHeader:false,
 // Private project documents allow up to 8 MiB; request envelope has bounded overhead.
 experimental:{serverActions:{bodySizeLimit:"9mb"}},
 async redirects(){return [
  {source:"/dich-vu/:path*",destination:"/services/:path*",permanent:true},
  {source:"/du-an/:path*",destination:"/projects/:path*",permanent:true},
  {source:"/quy-trinh",destination:"/process",permanent:true},
  {source:"/ve-athena",destination:"/about",permanent:true},
  {source:"/san-pham/:path*",destination:"/products/:path*",permanent:true},
  {source:"/bao-gia",destination:"/pricing",permanent:true},
  {source:"/lien-he",destination:"/contact",permanent:true},
  {source:"/phap-ly/quyen-rieng-tu",destination:"/legal/privacy",permanent:true},
  {source:"/phap-ly/dieu-khoan",destination:"/legal/terms",permanent:true},
  {source:"/phap-ly/chinh-sach-dich-vu",destination:"/legal/service-policy",permanent:true},
  {source:"/phap-ly/cookie",destination:"/legal/cookies",permanent:true},
  {source:"/phap-ly",destination:"/legal",permanent:true},
  {source:"/dang-nhap",destination:"/login",permanent:true},
  {source:"/dang-ky",destination:"/signup",permanent:true},
  {source:"/quen-mat-khau",destination:"/forgot-password",permanent:true},
  {source:"/tai-khoan/doi-mat-khau",destination:"/account/change-password",permanent:true},
  {source:"/tai-khoan/du-an/:path*",destination:"/account/projects/:path*",permanent:true},
  {source:"/tai-khoan/ho-tro/:path*",destination:"/account/support/:path*",permanent:true},
  {source:"/tai-khoan",destination:"/account",permanent:true},
  {source:"/quan-tri/du-an/:path*",destination:"/admin/projects/:path*",permanent:true},
  {source:"/quan-tri/ho-tro/:path*",destination:"/admin/support/:path*",permanent:true},
  {source:"/quan-tri",destination:"/admin",permanent:true},
  {source:"/work/:path*",destination:"/projects/:path*",permanent:true},
  {source:"/studio",destination:"/about",permanent:true},
  {source:"/account/du-an/:path*",destination:"/account/projects/:path*",permanent:true},
  {source:"/account/ho-tro/:path*",destination:"/account/support/:path*",permanent:true},
  {source:"/account/doi-mat-khau",destination:"/account/change-password",permanent:true},
  {source:"/admin/du-an/:path*",destination:"/admin/projects/:path*",permanent:true},
  {source:"/admin/ho-tro/:path*",destination:"/admin/support/:path*",permanent:true},
  {source:"/legal/quyen-rieng-tu",destination:"/legal/privacy",permanent:true},
  {source:"/legal/dieu-khoan",destination:"/legal/terms",permanent:true},
  {source:"/legal/chinh-sach-dich-vu",destination:"/legal/service-policy",permanent:true},
  {source:"/legal/cookie",destination:"/legal/cookies",permanent:true},
 ];},
 async headers(){return [{source:"/:path*",headers}];}
};
export default nextConfig;
