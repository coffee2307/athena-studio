import type { ReactNode } from "react";

interface HeadingProps {
  children: ReactNode;
  level?: 1 | 2 | 3;
  className?: string;
}

export function Heading({ children, level = 2, className = "" }: HeadingProps) {
  const Tag = `h${level}` as const;
  const classNameByLevel = { 1: "display", 2: "heading-2", 3: "heading-3" }[level];
  return <Tag className={`${classNameByLevel} ${className}`}>{children}</Tag>;
}
