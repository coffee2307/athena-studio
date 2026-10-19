import type {NextConfig} from "next";

const site=process.env.NEXT_PUBLIC_SITE_URL||"";
const httpsOrigin=/^https:\/\//i.test(site);
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
 "connect-src 'self' https://challenges.cloudflare.com",
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
 poweredByHeader:false,
 async headers(){return [{source:"/:path*",headers}];}
};
export default nextConfig;
