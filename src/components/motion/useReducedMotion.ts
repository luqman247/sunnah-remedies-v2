/**
 * useReducedMotion — hook for respecting prefers-reduced-motion (Ch. 10.3, 14).
 * Returns true when the user prefers reduced motion.
 */

"use client";

import { useState, useEffect } from "react";

export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);

    function handler(e: MediaQueryListEvent) {
      setPrefersReduced(e.matches);
    }

    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return prefersReduced;
}
