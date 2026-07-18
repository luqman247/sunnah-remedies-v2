"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getContinueReading } from "@/lib/dua-dhikr/local-storage";
import "./dua-dhikr.css";

/**
 * Gentle "Continue reading" list from local visit history.
 * Only surfaces collections that are currently publicly published —
 * unpublished history entries are omitted, never linked.
 */
export function ContinueReading({
  publishedSlugs,
}: {
  publishedSlugs: readonly string[];
}) {
  const t = useTranslations("duaDhikr.landing");
  const [items, setItems] = useState<ReturnType<typeof getContinueReading>>([]);

  useEffect(() => {
    const allowed = new Set(publishedSlugs);
    setItems(getContinueReading().filter((item) => allowed.has(item.collectionSlug)));
  }, [publishedSlugs]);

  if (items.length === 0) return null;

  return (
    <>
      <h2 className="section-label">{t("continueReadingHeading")}</h2>
      <nav aria-label={t("continueReadingHeading")} className="dua-dhikr-discovery-list">
        {items.map((item) => (
          <Link
            key={item.collectionSlug}
            href={`/knowledge-library/dua-dhikr/${item.collectionSlug}`}
            className="dua-dhikr-discovery-link"
          >
            {item.titleEn}
          </Link>
        ))}
      </nav>
    </>
  );
}
