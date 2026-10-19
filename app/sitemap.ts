import type { MetadataRoute } from "next";
import { offerings } from "@/lib/offerings";
import { siteConfig } from "@/lib/constants";
export default function sitemap(): MetadataRoute.Sitemap { const paths = ["/", "/services", ...offerings.map((item) => "/services/" + item.slug), "/products", "/studio", "/contact"]; return paths.map((path) => ({ url: new URL(path, siteConfig.url).toString(), changeFrequency: "monthly", priority: path === "/" ? 1 : 0.6 })); }