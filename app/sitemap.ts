import type {MetadataRoute} from "next";
import {offerings} from "@/lib/offerings";
import {publicProjects} from "@/data/projects";
import {siteConfig} from "@/lib/constants";
import {templates} from "@/lib/templates";
export default function sitemap():MetadataRoute.Sitemap {
 const paths=["/","/services",...offerings.map(x=>"/services/"+x.slug),"/services/web-development/templates",...templates.map(x=>"/templates/"+x.slug),"/projects",...publicProjects.map(x=>"/projects/"+x.slug),"/products","/products/sitepulse","/about","/process","/pricing","/contact","/legal","/legal/privacy","/legal/terms","/legal/cookies","/legal/service-policy"];
 return paths.map(path=>({url:new URL(path,siteConfig.url).toString(),changeFrequency:"monthly",priority:path==="/"?1:path==="/projects"||path==="/services"?.8:.5}));
}
