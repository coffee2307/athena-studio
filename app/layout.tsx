import type { Metadata, Viewport } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactDock } from "@/components/layout/ContactDock";
import { ExperienceEffects } from "@/components/experience/ExperienceEffects";
import { PageTransition } from "@/components/experience/PageTransition";
import { createMetadata } from "@/lib/metadata";
// Self-hosted fonts with explicit Vietnamese Unicode coverage (no external font CDN).
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/400-italic.css";
import "@fontsource/be-vietnam-pro/500.css";
import "@fontsource/be-vietnam-pro/600.css";
import "@fontsource/be-vietnam-pro/700.css";
import "@fontsource/noto-serif/400-italic.css";
import "@/app/globals.css";
import "@/app/agency-relaunch.css";
import "@/app/contact-experience.css";

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
  return <html lang="vi"><body><a className="skip-link" href="#main-content">Chuyển tới nội dung chính</a><Navbar/><main id="main-content"><PageTransition>{children}</PageTransition></main><Footer/><ContactDock/><ExperienceEffects/></body></html>;
}
