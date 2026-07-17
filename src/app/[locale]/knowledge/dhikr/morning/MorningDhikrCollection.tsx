"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { AppLocale } from "@/i18n/locales";
import type { DhikrItemPublic } from "@/sanity/lib/dhikr-public-fetch";
import type { DhikrReferenceCollectionEntry } from "@/lib/dhikr-research/public-reference-projection";

/**
 * Morning Dhikr — interactive collection view. Renders TWO clearly
 * separated sections:
 *  - "Editorially reviewed": items from getMorningDhikrItemsPublic()
 *    (either publication pathway — see dhikr-public-fetch.ts). Never
 *    describes an item as scholarly-approved unless publicationPathway
 *    says so.
 *  - "Reference collection": the remaining source-register records, via
 *    the public-safe projection in
 *    src/lib/dhikr-research/public-reference-projection.ts. Every entry
 *    here has reviewStatus "pending" by construction; this component never
 *    renders "verified", "authenticated", or "scholarly approved" for any
 *    of them, never invents a translation, and never treats an unverified
 *    repetition count as authoritative.
 *
 * Filtering is client-side only — it never changes what data was fetched,
 * only what is currently visible.
 *
 * @see docs/dhikr/40-scholarly-review-and-adjudication-framework.md
 */

const TIMING_KEYS = ["morning-only", "evening-only", "morning-and-evening", "not-time-specific"] as const;

function isKnownTimingKey(value: string | undefined): value is (typeof TIMING_KEYS)[number] {
  return !!value && (TIMING_KEYS as readonly string[]).includes(value);
}

type FilterKey = "all" | "editorial" | "pending" | "morning-only" | "morning-and-evening";

const FILTERS = [
  { key: "all", labelKey: "filters.all" },
  { key: "editorial", labelKey: "filters.editoriallyReviewed" },
  { key: "pending", labelKey: "filters.reviewPending" },
  { key: "morning-only", labelKey: "filters.morningOnly" },
  { key: "morning-and-evening", labelKey: "filters.morningAndEvening" },
] as const satisfies { key: FilterKey; labelKey: string }[];

function matchesFilter(filter: FilterKey, kind: "editorial" | "pending", timing: string | undefined): boolean {
  switch (filter) {
    case "all":
      return true;
    case "editorial":
      return kind === "editorial";
    case "pending":
      return kind === "pending";
    case "morning-only":
      return timing === "morning-only";
    case "morning-and-evening":
      return timing === "morning-and-evening";
  }
}

export interface MorningDhikrCollectionProps {
  locale: AppLocale;
  items: DhikrItemPublic[];
  referenceEntries: DhikrReferenceCollectionEntry[];
  reviewedCount: number;
  totalCount: number;
}

export function MorningDhikrCollection({
  locale,
  items,
  referenceEntries,
  reviewedCount,
  totalCount,
}: MorningDhikrCollectionProps) {
  const t = useTranslations("dhikrMorning");
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
    <div className="morning-dhikr-layout">
      <aside className="morning-dhikr-sidebar">
        <p className="morning-dhikr-progress">
          {t("progressIndicator", { reviewed: reviewedCount, total: totalCount })}
        </p>

        <div className="morning-dhikr-filterbar" role="group" aria-label={t("filters.all")}>
          {FILTERS.map(({ key, labelKey }) => (
            <button
              key={key}
              type="button"
              className="morning-dhikr-filter-button"
              aria-pressed={filter === key}
              onClick={() => setFilter(key)}
            >
              {t(labelKey)}
            </button>
          ))}
        </div>

        <nav className="morning-dhikr-contents" aria-label={t("contentsLabel")}>
          {visibleItems.length > 0 && (
            <a href="#morning-dhikr-section-editorial">{t("sectionEditoriallyReviewedHeading")}</a>
          )}
          {visibleReferenceEntries.length > 0 && (
            <a href="#morning-dhikr-section-reference">{t("sectionReferenceHeading")}</a>
          )}
        </nav>
      </aside>

      <div className="morning-dhikr-content">
        {visibleItems.length > 0 && (
          <section
            id="morning-dhikr-section-editorial"
            aria-labelledby="morning-dhikr-section-editorial-heading"
            className="morning-dhikr-section"
          >
            <h2 id="morning-dhikr-section-editorial-heading" className="morning-dhikr-section__heading">
              {t("sectionEditoriallyReviewedHeading")}
            </h2>
            <p className="type-body morning-dhikr-section__description">
              {t("sectionEditoriallyReviewedDescription")}
            </p>

            {items.some((item) => item.publicationPathway === "editorial-pending-scholarly-review") && (
              <div className="morning-dhikr-editorial-notice" role="note">
                <p className="type-body">{t("editorialNotice")}</p>
              </div>
            )}

            <ol className="morning-dhikr-list" aria-label={t("sectionEditoriallyReviewedHeading")}>
              {visibleItems.map((item) => {
                const translation = locale === "da" && item.translationDa ? item.translationDa : item.translationEn;
                const primaryReference = item.sourceReferences[0]?.citation;
                const timingKey = isKnownTimingKey(item.timingLabel) ? item.timingLabel : undefined;
                const pendingScholarlyReview = item.publicationPathway === "editorial-pending-scholarly-review";

                return (
                  <li key={item._id}>
                    <article
                      className="morning-dhikr-card"
                      aria-labelledby={`morning-dhikr-${item._id}-arabic`}
                    >
                      {pendingScholarlyReview && (
                        <span className="morning-dhikr-card__pending-badge">{t("pendingScholarlyReviewBadge")}</span>
                      )}

                      <p
                        id={`morning-dhikr-${item._id}-arabic`}
                        className="type-arabic morning-dhikr-card__arabic"
                        dir="rtl"
                        lang="ar"
                      >
                        {item.arabicText}
                      </p>

                      <p className="type-body morning-dhikr-card__translation" lang={locale}>
                        {translation}
                      </p>

                      {(timingKey || item.recommendedRepetitions) && (
                        <div className="morning-dhikr-card__badges">
                          {timingKey && (
                            <span className="morning-dhikr-card__badge">{t(`timing.${timingKey}`)}</span>
                          )}
                          {item.recommendedRepetitions !== undefined && item.recommendedRepetitions > 0 && (
                            <span className="morning-dhikr-card__badge">
                              {t("repetitionLabel", { count: item.recommendedRepetitions })}
                            </span>
                          )}
                        </div>
                      )}

                      {item.virtueText && (
                        <p className="morning-dhikr-card__virtue" lang={locale}>
                          <span className="morning-dhikr-card__source-label">{t("virtueLabel")}: </span>
                          {item.virtueText}
                        </p>
                      )}

                      {primaryReference && (
                        <>
                          <hr className="morning-dhikr-card__divider" />
                          <div className="morning-dhikr-card__source">
                            <span className="morning-dhikr-card__source-label">{t("sourceLabel")}</span>
                            <span>{primaryReference}</span>
                          </div>
                        </>
                      )}
                    </article>
                  </li>
                );
              })}
            </ol>
          </section>
        )}

        {visibleReferenceEntries.length > 0 && (
          <section
            id="morning-dhikr-section-reference"
            aria-labelledby="morning-dhikr-section-reference-heading"
            className="morning-dhikr-section"
          >
            <h2 id="morning-dhikr-section-reference-heading" className="morning-dhikr-section__heading">
              {t("sectionReferenceHeading")}
            </h2>
            <p className="morning-dhikr-reference-count">
              {t("referenceCollectionCount", { count: referenceEntries.length })}
            </p>

            <div className="morning-dhikr-reference-notice" role="note">
              <p className="type-body">{t("referenceCollectionNotice")}</p>
            </div>

            <ol className="morning-dhikr-reference-list" aria-label={t("sectionReferenceHeading")}>
              {visibleReferenceEntries.map((entry) => (
                <li key={entry.internalId}>
                  <article
                    className="morning-dhikr-reference-card"
                    aria-labelledby={`morning-dhikr-reference-${entry.internalId}-arabic`}
                  >
                    <span className="morning-dhikr-reference-card__badge">{t("reviewPendingBadge")}</span>

                    <p
                      id={`morning-dhikr-reference-${entry.internalId}-arabic`}
                      className="type-arabic morning-dhikr-card__arabic"
                      dir="rtl"
                      lang="ar"
                    >
                      {entry.protectedArabicText}
                    </p>

                    <p className="morning-dhikr-reference-card__translation-pending">
                      {t("translationUnderReview")}
                    </p>

                    {(entry.knownTiming || entry.knownRepetitionCount !== undefined) && (
                      <div className="morning-dhikr-reference-card__meta">
                        {entry.knownTiming && (
                          <p className="morning-dhikr-reference-card__meta-line">
                            {t("pendingTimingLabel", { timing: t(`timing.${entry.knownTiming}`) })}
                          </p>
                        )}
                        {entry.knownRepetitionCount !== undefined && entry.knownRepetitionCount > 0 && (
                          <p className="morning-dhikr-reference-card__meta-line">
                            {t("pendingRepetitionLabel", { count: entry.knownRepetitionCount })}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="morning-dhikr-reference-card__source">
                      <span className="morning-dhikr-card__source-label">{t("sourceLabel")}</span>
                      <span>{entry.documentedSourceReference ?? t("sourceVerificationPending")}</span>
                    </div>
                  </article>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </div>
  );
}
