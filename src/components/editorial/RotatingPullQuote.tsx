"use client";

import { useCallback, useEffect, useState } from "react";

interface RotatingPullQuoteProps {
  statements: readonly string[];
  interval?: number;
  dark?: boolean;
}

const FADE_MS = 1400;

function pickRandomIndex(length: number, exclude: number): number {
  if (length < 2) return 0;
  let next = exclude;
  while (next === exclude) {
    next = Math.floor(Math.random() * length);
  }
  return next;
}

export function RotatingPullQuote({
  statements,
  interval = 15000,
  dark = true,
}: RotatingPullQuoteProps) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const rotate = useCallback(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      setIndex((prev) => pickRandomIndex(statements.length, prev));
      return;
    }

    setVisible(false);
    setTimeout(() => {
      setIndex((prev) => pickRandomIndex(statements.length, prev));
      setVisible(true);
    }, FADE_MS);
  }, [statements.length]);

  useEffect(() => {
    if (statements.length < 2 || !interval) return;

    const timer = setInterval(rotate, interval);
    return () => clearInterval(timer);
  }, [interval, rotate, statements.length]);

  const className = [
    "pull-quote",
    "pull-quote--rotating",
    dark ? "pull-quote--dark" : "",
    visible ? "pull-quote--rotating-visible" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <blockquote className={className} aria-live="polite">
      <p className="pull-quote__text">{statements[index]}</p>
    </blockquote>
  );
}
