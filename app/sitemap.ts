import type {MetadataRoute} from "next";
import {offerings} from "@/lib/offerings";
import {publicProjects} from "@/data/projects";
import {siteConfig} from "@/lib/constants";
export default function sitemap():MetadataRoute.Sitemap {
 const paths=["/","/dich-vu",...offerings.map(x=>"/dich-vu/"+x.slug),"/du-an",...publicProjects.map(x=>"/du-an/"+x.slug),"/san-pham","/san-pham/sitepulse","/ve-athena","/quy-trinh","/bao-gia","/lien-he","/phap-ly","/phap-ly/quyen-rieng-tu","/phap-ly/dieu-khoan","/phap-ly/cookie","/phap-ly/chinh-sach-dich-vu"];
 return paths.map(path=>({url:new URL(path,siteConfig.url).toString(),changeFrequency:"monthly",priority:path==="/"?1:path==="/du-an"||path==="/dich-vu"?.8:.5}));
}
