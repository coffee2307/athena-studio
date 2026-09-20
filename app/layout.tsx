import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createMetadata } from "@/lib/metadata";
import "@/app/globals.css";

export const metadata: Metadata = {
  ...createMetadata(),
  icons: {
    icon: "/branding/favicon.ico",
    shortcut: "/branding/favicon.ico",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Navbar /><main>{children}</main><Footer /></body></html>;
}
