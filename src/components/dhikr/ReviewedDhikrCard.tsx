import type { AppLocale } from "@/i18n/locales";
import type { DhikrItemPublic } from "@/sanity/lib/dhikr-public-fetch";
import { DhikrTimingIcon, type DhikrTimingIconName } from "./DhikrTimingIcon";
import type { DhikrCollectionTranslator } from "./DhikrCollectionFilters";
import "./dhikr-collection.css";

const TIMING_KEYS = ["morning-only", "evening-only", "morning-and-evening", "not-time-specific"] as const;

function isKnownTimingKey(value: string | undefined): value is (typeof TIMING_KEYS)[number] {
  return !!value && (TIMING_KEYS as readonly string[]).includes(value);
}

const TIMING_ICON: Record<(typeof TIMING_KEYS)[number], DhikrTimingIconName | undefined> = {
  "morning-only": "morning",
  "evening-only": "evening",
  "morning-and-evening": "morning",
  "not-time-specific": undefined,
};

/**
 * A single editorially-reviewed (or scholarly-approved) Dhikr card — shared
 * between Morning and Evening. Renders exactly what dhikr-public-fetch.ts
 * returned: never fabricates a translation, never renders virtue text
 * unless item.virtueText is genuinely present, and always shows the
 * pending-scholarly-review badge when publicationPathway says so. This is
 * the ONLY place either collection renders a reviewed item's content.
 */
export function ReviewedDhikrCard({
  item,
  locale,
  t,
}: {
  item: DhikrItemPublic;
  locale: AppLocale;
  t: DhikrCollectionTranslator;
}) {
  const translation = locale === "da" && item.translationDa ? item.translationDa : item.translationEn;
  const primaryReference = item.sourceReferences[0]?.citation;
  const timingKey = isKnownTimingKey(item.timingLabel) ? item.timingLabel : undefined;
  const pendingScholarlyReview = item.publicationPathway === "editorial-pending-scholarly-review";
  const timingIcon = timingKey ? TIMING_ICON[timingKey] : undefined;

  return (
    <article className="dhikr-card" aria-labelledby={`dhikr-${item._id}-arabic`}>
      {pendingScholarlyReview && (
        <span className="dhikr-card__pending-badge">
          <DhikrTimingIcon name="review-pending" />
          {t("pendingScholarlyReviewBadge")}
        </span>
      )}

      <p id={`dhikr-${item._id}-arabic`} className="type-arabic dhikr-card__arabic" dir="rtl" lang="ar">
        {item.arabicText}
      </p>

      <p className="type-body dhikr-card__translation" lang={locale}>
        {translation}
      </p>

      {(timingKey || item.recommendedRepetitions) && (
        <div className="dhikr-card__badges">
          {timingKey && (
            <span className="dhikr-card__badge">
              {timingIcon && <DhikrTimingIcon name={timingIcon} />}
              {t(`timing.${timingKey}`)}
            </span>
          )}
          {item.recommendedRepetitions !== undefined && item.recommendedRepetitions > 0 && (
            <span className="dhikr-card__badge">
              <DhikrTimingIcon name="repetition" />
              {t("repetitionLabel", { count: item.recommendedRepetitions })}
            </span>
          )}
        </div>
      )}

      {item.virtueText && (
        <p className="dhikr-card__virtue" lang={locale}>
          <span className="dhikr-card__source-label">{t("virtueLabel")}: </span>
          {item.virtueText}
        </p>
      )}

      {primaryReference && (
        <>
          <hr className="dhikr-card__divider" />
          <div className="dhikr-card__source">
            <span className="dhikr-card__source-label">
              <DhikrTimingIcon name="source" />
              {t("sourceLabel")}
            </span>
            <span>{primaryReference}</span>
          </div>
        </>
      )}
    </article>
  );
}
