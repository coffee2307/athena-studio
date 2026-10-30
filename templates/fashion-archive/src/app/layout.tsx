import "./globals.css";
import type {Metadata} from "next";
import site from "../data/site.json";
export const metadata:Metadata={title:site.title,description:site.description};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="vi"><body>{children}</body></html>;}
