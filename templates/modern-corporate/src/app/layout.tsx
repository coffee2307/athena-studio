import type {Metadata} from "next";
import site from "../data/site.json";
// Self-hosted Vietnamese subsets: standalone export cannot depend on Athena root layout.
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/400-italic.css";
import "@fontsource/be-vietnam-pro/500.css";
import "@fontsource/be-vietnam-pro/600.css";
import "@fontsource/be-vietnam-pro/700.css";
import "@fontsource/noto-serif/400.css";
import "@fontsource/noto-serif/400-italic.css";
import "@fontsource/noto-serif/700.css";
export const metadata:Metadata={title:site.title,description:site.description};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="vi"><body style={{margin:0}}>{children}</body></html>;}
