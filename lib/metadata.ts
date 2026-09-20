import type { Metadata } from "next";
import { siteConfig } from "@/lib/constants";

export function createMetadata(title?: string, description = siteConfig.description): Metadata {
  return {
    title: title ? `${title} — ${siteConfig.name}` : siteConfig.name,
    description,
    metadataBase: new URL(siteConfig.url),
    openGraph: {
      title: title ? `${title} — ${siteConfig.name}` : siteConfig.name,
      description,
      siteName: siteConfig.name,
      type: "website",
    },
  };
}
