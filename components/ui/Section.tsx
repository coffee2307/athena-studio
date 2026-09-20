import type { ReactNode } from "react";
import { PageContainer } from "@/components/layout/PageContainer";

interface SectionProps {
  children: ReactNode;
  id?: string;
  tone?: "default" | "inverse";
  className?: string;
}

export function Section({ children, id, tone = "default", className = "" }: SectionProps) {
  return <section id={id} className={`section section-${tone} ${className}`}><PageContainer>{children}</PageContainer></section>;
}
