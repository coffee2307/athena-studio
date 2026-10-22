import type {MetadataRoute} from "next";
import {publicReleaseDecision} from "@/lib/release/public";
export default function robots():MetadataRoute.Robots {
 const gate=publicReleaseDecision();
 return gate.approved&&gate.origin
  ?{rules:{userAgent:"*",allow:"/"},sitemap:new URL("/sitemap.xml",gate.origin).toString()}
  :{rules:{userAgent:"*",disallow:"/"}};
}
