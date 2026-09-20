import type { ReactNode } from "react";

interface TextProps {
  children: ReactNode;
  size?: "body" | "large" | "small";
  className?: string;
}

export function Text({ children, size = "body", className = "" }: TextProps) {
  return <p className={`${size === "large" ? "body-large" : size === "small" ? "small" : "body"} ${className}`}>{children}</p>;
}
