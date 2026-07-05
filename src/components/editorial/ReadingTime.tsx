"use client";

/**
 * ReadingTime — computed reading time display (Ch. 3.2).
 * Calculates from word count unless overridden.
 */

import { useTranslations } from "next-intl";

interface ReadingTimeProps {
  wordCount?: number;
  override?: number;
}

const WORDS_PER_MINUTE = 200;

export function computeReadingTime(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

export function ReadingTime({ wordCount, override }: ReadingTimeProps) {
  const t = useTranslations("editorial");
  const minutes = override || (wordCount ? computeReadingTime(wordCount) : null);
  if (!minutes) return null;

  return (
    <span className="type-caption" style={{ color: "var(--ink-soft)" }}>
      {t("readingTime", { minutes })}
    </span>
  );
}
