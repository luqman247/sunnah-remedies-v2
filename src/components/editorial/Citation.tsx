"use client";

/**
 * Citation — inline academic citation marker (Ch. 3.2).
 * Links to the reference list at the bottom of the article.
 */

import { useTranslations } from "next-intl";

interface CitationProps {
  id: string;
  number: number;
}

export function Citation({ id, number }: CitationProps) {
  const t = useTranslations("editorial");

  return (
    <sup>
      <a
        href={`#ref-${id}`}
        id={`cite-${id}`}
        aria-label={t("reference", { number })}
        className="type-folio-v2"
        style={{ color: "var(--brass)", textDecoration: "none" }}
      >
        [{number}]
      </a>
    </sup>
  );
}
