"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Brief nonblocking entrance; avoids intercepting links or trapping focus. */
export function PageTransition({children}:{children:ReactNode}) {
 const pathname=usePathname();
 return <div className="page-transition" key={pathname}>{children}</div>;
}
