/**
 * Parallax — subtle background translate on scroll (Ch. 10.3).
 *
 * Desktop ≥lg only, ≤8% of scroll distance.
 * Disabled under reduced-motion.
 */

"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { useReducedMotion } from "./useReducedMotion";
import { motionTokens } from "./motionTokens";

interface ParallaxProps {
  children: ReactNode;
  intensity?: number;
  className?: string;
}

export function Parallax({ children, intensity = motionTokens.parallaxMaxDesktop, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced) return;

    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (!isDesktop) return;

    function handleScroll() {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      const progress = (viewHeight - rect.top) / (viewHeight + rect.height);
      const clamped = Math.max(0, Math.min(1, progress));
      const offset = (clamped - 0.5) * intensity * rect.height;
      el.style.transform = `translateY(${offset}px)`;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [intensity, prefersReduced]);

  return (
    <div ref={ref} className={className} style={{ willChange: prefersReduced ? "auto" : "transform" }}>
      {children}
    </div>
  );
}
