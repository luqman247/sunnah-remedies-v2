import { ReactNode } from "react";

interface LeafProps {
  children: ReactNode;
  variant?: "default" | "grave" | "inset";
  className?: string;
}

export function Leaf({ children, variant = "default", className = "" }: LeafProps) {
  const variantClass =
    variant === "grave" ? "leaf--grave" : variant === "inset" ? "leaf--inset" : "";

  return <section className={`leaf ${variantClass} ${className}`.trim()}>{children}</section>;
}
