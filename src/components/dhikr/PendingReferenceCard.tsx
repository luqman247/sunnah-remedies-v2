import type { DhikrReferenceCollectionEntry } from "@/lib/dhikr-research/public-reference-projection";
import { DhikrTimingIcon } from "./DhikrTimingIcon";
import type { DhikrCollectionTranslator } from "./DhikrCollectionFilters";
import "./dhikr-collection.css";

/**
 * A single pending reference-collection card — shared between Morning and
 * Evening. Renders only what DhikrReferenceCollectionEntry actually
 * contains: protected Arabic, "Translation under review" (never an invented
 * translation), a "Review pending" badge, cautiously-labelled timing/
 * repetition (never as an instruction), and documented source or
 * "Source verification pending". This component has no way to render virtue
 * text, a grading claim, or an authentication claim — those fields do not
 * exist on DhikrReferenceCollectionEntry.
 */
export function PendingReferenceCard({
  entry,
  t,
}: {
  entry: DhikrReferenceCollectionEntry;
  t: DhikrCollectionTranslator;
}) {
  return (
    <article className="dhikr-reference-card" aria-labelledby={`dhikr-reference-${entry.internalId}-arabic`}>
      <span className="dhikr-reference-card__badge">
        <DhikrTimingIcon name="review-pending" />
        {t("reviewPendingBadge")}
      </span>

      <p id={`dhikr-reference-${entry.internalId}-arabic`} className="type-arabic dhikr-card__arabic" dir="rtl" lang="ar">
        {entry.protectedArabicText}
      </p>

      <p className="dhikr-reference-card__translation-pending">
        <DhikrTimingIcon name="translation" />
        {t("translationUnderReview")}
      </p>

      {(entry.knownTiming || entry.knownRepetitionCount !== undefined) && (
        <div className="dhikr-reference-card__meta">
          {entry.knownTiming && (
            <p className="dhikr-reference-card__meta-line">
              <DhikrTimingIcon name={entry.knownTiming === "evening-only" ? "evening" : "morning"} />
              {t("pendingTimingLabel", { timing: t(`timing.${entry.knownTiming}`) })}
            </p>
          )}
          {entry.knownRepetitionCount !== undefined && entry.knownRepetitionCount > 0 && (
            <p className="dhikr-reference-card__meta-line">
              <DhikrTimingIcon name="repetition" />
              {t("pendingRepetitionLabel", { count: entry.knownRepetitionCount })}
            </p>
          )}
        </div>
      )}

      <div className="dhikr-reference-card__source">
        <span className="dhikr-card__source-label">
          <DhikrTimingIcon name="source" />
          {t("sourceLabel")}
        </span>
        <span>{entry.documentedSourceReference ?? t("sourceVerificationPending")}</span>
      </div>
    </article>
  );
}
