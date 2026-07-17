"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getContinueReading } from "@/lib/dua-dhikr/local-storage";
import "./dua-dhikr.css";

/**
 * Gentle "Continue reading" list, derived purely from local-storage visit
 * history (src/lib/dua-dhikr/local-storage.ts) — no streaks, scores, or
 * competitive framing, per docs/dua-dhikr/README.md. Renders nothing when
 * there is no history yet (first visit, or storage unavailable).
 */
export function ContinueReading() {
  const t = useTranslations("duaDhikr.landing");
  const [items, setItems] = useState<ReturnType<typeof getContinueReading>>([]);

  useEffect(() => {
    setItems(getContinueReading());
  }, []);

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
