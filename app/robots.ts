import type {MetadataRoute} from "next";
import {siteConfig} from "@/lib/constants";
export default function robots():MetadataRoute.Robots {
 const publicUrl=process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https://");
 return {rules:{userAgent:"*",...(publicUrl?{allow:"/"}:{disallow:"/"})},...(publicUrl?{sitemap:new URL("/sitemap.xml",siteConfig.url).toString()}:{})};
}
