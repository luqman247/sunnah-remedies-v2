/**
 * Eyebrow — mono uppercase label (Ch. 16).
 */

import type { ReactNode } from "react";

interface EyebrowProps {
  children: ReactNode;
  className?: string;
}

export function Eyebrow({ children, className = "" }: EyebrowProps) {
  return (
    <span className={`type-eyebrow-v2 ${className}`}>
      {children}
    </span>
  );
}
