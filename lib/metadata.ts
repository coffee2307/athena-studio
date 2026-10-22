import type {Metadata} from "next";
import {siteConfig} from "@/lib/constants";
import {publicReleaseDecision} from "@/lib/release/public";
const release=publicReleaseDecision();
export function createMetadata(title?:string,description=siteConfig.description,path?:string):Metadata{
 const fullTitle=title?`${title} — ${siteConfig.name}`:siteConfig.name;
 return {
  title:fullTitle,description,metadataBase:new URL(siteConfig.url),
  alternates:path&&release.approved&&release.origin?{canonical:new URL(path,release.origin).toString()}:undefined,
  robots:release.approved?{index:true,follow:true}:{index:false,follow:false,noarchive:true},
  openGraph:{title:fullTitle,description,siteName:siteConfig.name,locale:"vi_VN",type:"website",images:[{url:"/og-athena.png",width:1200,height:630,alt:"Athena Studio — Thiết kế và công nghệ"}]},
  twitter:{card:"summary_large_image",title:fullTitle,description,images:["/og-athena.png"]},
 };
}
