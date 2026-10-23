import type { Metadata, Viewport } from "next";
import {SiteChrome} from "@/components/layout/SiteChrome";
import { createMetadata } from "@/lib/metadata";
// Self-hosted fonts with explicit Vietnamese Unicode coverage (no external font CDN).
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/400-italic.css";
import "@fontsource/be-vietnam-pro/500.css";
import "@fontsource/be-vietnam-pro/600.css";
import "@fontsource/be-vietnam-pro/700.css";
import "@fontsource/noto-serif/400.css";
import "@fontsource/noto-serif/400-italic.css";
import "@/app/globals.css";
import "@/app/agency-relaunch.css";
import "@/app/contact-experience.css";
import "@/app/athena-refinement.css";
import "@/app/auth-profile.css";
import "@/app/auth-pages-redesign.css";
import "@/app/athena-monochrome.css";
import "@/app/production-a.css";
import "@/app/templates.css";
import "@/app/template-demo.css";
import "@/app/template-modal.css";
import "@/app/products-projects.css";
import "@/app/profile-github.css";
import "@/app/template-revamp.css";
import "@/app/template-worlds.css";
import "@/app/template-signatures.css";
import "@/app/template-special-existing.css";
import "@/app/template-legacy-signatures.css";
import "@/app/template-experience-pages.css";
import "@/app/athena-home-showcase-and-navigation.css";
import "@/app/athena-products-fix.css";
import "@/app/athena-soft-launch.css";
import "@/app/template-accessibility.css";

export const metadata: Metadata = {
  ...createMetadata(),
  icons: {
    icon: [{url:"/branding/logo-symbol-black.svg",type:"image/svg+xml"},{url:"/branding/favicon.ico",sizes:"any"}],
    shortcut: "/branding/logo-symbol-black.svg",
    apple: "/apple-touch-icon.png",
  },
};
export const viewport: Viewport = { themeColor: "#ffffff", width: "device-width", initialScale: 1 };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body><a className="skip-link" href="#main-content">Chuyển tới nội dung chính</a><SiteChrome>{children}</SiteChrome></body></html>;
}
