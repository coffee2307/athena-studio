import type {Metadata} from "next";
import {siteConfig} from "@/lib/constants";
const siteUrl=process.env.NEXT_PUBLIC_SITE_URL;
const publicOrigin=siteUrl&&/^https:\/\//.test(siteUrl);
export function createMetadata(title?:string,description=siteConfig.description,path?:string):Metadata{
 const fullTitle=title?`${title} — ${siteConfig.name}`:siteConfig.name;
 return {
  title:fullTitle,description,metadataBase:new URL(siteConfig.url),
  alternates:path&&publicOrigin?{canonical:new URL(path,siteUrl).toString()}:undefined,
  robots:publicOrigin?{index:true,follow:true}:{index:false,follow:false},
  openGraph:{title:fullTitle,description,siteName:siteConfig.name,locale:"vi_VN",type:"website",images:[{url:"/og-athena.png",width:1200,height:630,alt:"Athena Studio — Thiết kế và công nghệ"}]},
  twitter:{card:"summary_large_image",title:fullTitle,description,images:["/og-athena.png"]},
 };
}
