"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { AppLocale } from "@/i18n/locales";
import type { DhikrItemPublic } from "@/sanity/lib/dhikr-public-fetch";
import type { DhikrReferenceCollectionEntry } from "@/lib/dhikr-research/public-reference-projection";
import { ReviewedDhikrCard } from "@/components/dhikr/ReviewedDhikrCard";
import { PendingReferenceCard } from "@/components/dhikr/PendingReferenceCard";
import { CollectionStatusNotice } from "@/components/dhikr/CollectionStatusNotice";
import {
  DhikrCollectionFilters,
  type DhikrCollectionFilterDef,
  type DhikrCollectionTranslator,
} from "@/components/dhikr/DhikrCollectionFilters";
import "@/components/dhikr/dhikr-collection.css";

/**
 * Evening Dhikr — interactive collection view. Structurally the same
 * two-section honest model as MorningDhikrCollection.tsx (see that file's
 * docblock), reusing the exact same shared per-item card components, but
 * fed exclusively by Evening-specific, independently-defined data sources:
 * getEveningDhikrItemsPublic() (src/sanity/lib/dhikr-public-fetch.ts) and
 * getPendingEveningReferenceCollection() (src/lib/dhikr-research/public-
 * reference-projection.ts). Neither of those ever returns a morning-only or
 * timing-uncertain record — see tests/dhikr/dhikr-evening-eligibility.test.ts.
 *
 * Filtering is client-side only — it never changes what data was fetched,
 * only what is currently visible.
 *
 * @see docs/dhikr/40-scholarly-review-and-adjudication-framework.md
 */

type FilterKey = "all" | "editorial" | "pending" | "evening-only" | "morning-and-evening";

const FILTERS: readonly DhikrCollectionFilterDef<FilterKey>[] = [
  { key: "all", labelKey: "filters.all" },
  { key: "editorial", labelKey: "filters.editoriallyReviewed" },
  { key: "pending", labelKey: "filters.reviewPending" },
  { key: "evening-only", labelKey: "filters.eveningOnly" },
  { key: "morning-and-evening", labelKey: "filters.morningAndEvening" },
];

function matchesFilter(filter: FilterKey, kind: "editorial" | "pending", timing: string | undefined): boolean {
  switch (filter) {
    case "all":
      return true;
    case "editorial":
      return kind === "editorial";
    case "pending":
      return kind === "pending";
    case "evening-only":
      return timing === "evening-only";
    case "morning-and-evening":
      return timing === "morning-and-evening";
  }
}

export interface EveningDhikrCollectionProps {
  locale: AppLocale;
  items: DhikrItemPublic[];
  referenceEntries: DhikrReferenceCollectionEntry[];
  reviewedCount: number;
  totalCount: number;
}

export function EveningDhikrCollection({
  locale,
  items,
  referenceEntries,
  reviewedCount,
  totalCount,
}: EveningDhikrCollectionProps) {
  const t = useTranslations("dhikrEvening");
  const [filter, setFilter] = useState<FilterKey>("all");

  const visibleItems = useMemo(
    () => items.filter((item) => matchesFilter(filter, "editorial", item.timingLabel)),
    [items, filter],
  );
  const visibleReferenceEntries = useMemo(
    () => referenceEntries.filter((entry) => matchesFilter(filter, "pending", entry.knownTiming)),
    [referenceEntries, filter],
  );

  return (
    <div className="evening-dhikr-layout">
      <aside className="evening-dhikr-sidebar">
        <p className="evening-dhikr-progress">
          {t("progressIndicator", { reviewed: reviewedCount, total: totalCount })}
        </p>

        <DhikrCollectionFilters
          filters={FILTERS}
          activeFilter={filter}
          onChange={setFilter}
          t={t as DhikrCollectionTranslator}
          ariaLabel={t("filters.all")}
        />

        <nav className="evening-dhikr-contents" aria-label={t("contentsLabel")}>
          {visibleItems.length > 0 && (
            <a href="#evening-dhikr-section-editorial">{t("sectionEditoriallyReviewedHeading")}</a>
          )}
          {visibleReferenceEntries.length > 0 && (
            <a href="#evening-dhikr-section-reference">{t("sectionReferenceHeading")}</a>
          )}
        </nav>
      </aside>

      <div className="evening-dhikr-content">
        {visibleItems.length > 0 && (
          <section
            id="evening-dhikr-section-editorial"
            aria-labelledby="evening-dhikr-section-editorial-heading"
            className="evening-dhikr-section"
          >
            <h2 id="evening-dhikr-section-editorial-heading" className="evening-dhikr-section__heading">
              {t("sectionEditoriallyReviewedHeading")}
            </h2>
            <p className="type-body evening-dhikr-section__description">
              {t("sectionEditoriallyReviewedDescription")}
            </p>

            {items.some((item) => item.publicationPathway === "editorial-pending-scholarly-review") && (
              <CollectionStatusNotice variant="editorial">{t("editorialNotice")}</CollectionStatusNotice>
            )}

            <ol className="dhikr-list" aria-label={t("sectionEditoriallyReviewedHeading")}>
              {visibleItems.map((item) => (
                <li key={item._id}>
                  <ReviewedDhikrCard item={item} locale={locale} t={t as DhikrCollectionTranslator} />
                </li>
              ))}
            </ol>
          </section>
        )}

        {visibleReferenceEntries.length > 0 && (
          <section
            id="evening-dhikr-section-reference"
            aria-labelledby="evening-dhikr-section-reference-heading"
            className="evening-dhikr-section"
          >
            <h2 id="evening-dhikr-section-reference-heading" className="evening-dhikr-section__heading">
              {t("sectionReferenceHeading")}
            </h2>
            <p className="evening-dhikr-reference-count">
              {t("referenceCollectionCount", { count: referenceEntries.length })}
            </p>

            <CollectionStatusNotice variant="reference">{t("referenceCollectionNotice")}</CollectionStatusNotice>

            <ol className="dhikr-reference-list" aria-label={t("sectionReferenceHeading")}>
              {visibleReferenceEntries.map((entry) => (
                <li key={entry.internalId}>
                  <PendingReferenceCard entry={entry} t={t as DhikrCollectionTranslator} />
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </div>
  );
}
