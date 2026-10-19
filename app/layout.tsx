import type { Metadata, Viewport } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createMetadata } from "@/lib/metadata";
import "@/app/globals.css";

export const metadata: Metadata = { ...createMetadata(), icons: { icon: "/branding/favicon.svg", shortcut: "/branding/favicon.svg" } };
export const viewport: Viewport = { themeColor: "#0b0e0d", width: "device-width", initialScale: 1 };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body><a className="skip-link" href="#main-content">Bỏ qua điều hướng</a><Navbar /><main id="main-content">{children}</main><Footer /></body></html>;
}
