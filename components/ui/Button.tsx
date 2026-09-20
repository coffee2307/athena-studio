import Link from "next/link";
import type { ReactNode } from "react";

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline";
}

export function Button({ href, children, variant = "solid" }: ButtonProps) {
  return <Link className={`button button-${variant}`} href={href}>{children}<span aria-hidden="true">↗</span></Link>;
}
