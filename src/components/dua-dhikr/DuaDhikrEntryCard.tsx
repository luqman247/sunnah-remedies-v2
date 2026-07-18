"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { AppLocale } from "@/i18n/locales";
import type { DuaDhikrEntryPublic } from "@/sanity/lib/dua-dhikr-public-fetch";
import { ArabicText } from "./ArabicText";
import { getMemoriseState, setMemoriseState, type MemoriseState } from "@/lib/dua-dhikr/local-storage";
import "./dua-dhikr.css";

interface DuaDhikrEntryCardProps {
  entry: DuaDhikrEntryPublic;
  locale: AppLocale;
}

const KNOWN_TIMING_KEYS = ["morning-only", "evening-only", "morning-and-evening", "not-time-specific"] as const;

function isKnownTimingKey(value: string | undefined): value is (typeof KNOWN_TIMING_KEYS)[number] {
  return !!value && (KNOWN_TIMING_KEYS as readonly string[]).includes(value);
}

/**
 * Reusable Duʿa & Dhikr entry component — see docs/dua-dhikr/CONTENT_MODEL.md
 * "Duʿa entry component" and docs/dua-dhikr/VISUAL_SYSTEM.md for the reading
 * hierarchy (Arabic first, then translation, transliteration, virtue,
 * explanation, references). Virtue/explanation/references are collapsible;
 * Arabic and the primary translation are never hidden behind an accordion.
 *
 * Memorise mode hides translation/transliteration behind an explicit
 * "reveal" action (progressive reveal, not simply deleted) and enlarges the
 * Arabic text. Learning/memorised state and the memorise-mode preference
 * itself are local-only (src/lib/dua-dhikr/local-storage.ts) — no account,
 * no server round-trip, no gamification (no streaks, badges, or counters
 * that reward speed).
 */
export function DuaDhikrEntryCard({ entry, locale }: DuaDhikrEntryCardProps) {
  const t = useTranslations("duaDhikr.entryCard");
  const [memoriseMode, setMemoriseMode] = useState(false);
  const [revealTranslation, setRevealTranslation] = useState(false);
  const [revealTransliteration, setRevealTransliteration] = useState(false);
  const [learningState, setLearningState] = useState<MemoriseState | undefined>(undefined);

  useEffect(() => {
    setLearningState(getMemoriseState(entry._id));
  }, [entry._id]);

  // Never falls back to English on a Danish route in practice: the Danish
  // public fetch only ever returns entries whose gate already required
  // translationDa (see dua-dhikr-publication-gate.ts) — an
  // owner-approved-english-first entry is never fetched for locale "da" at
  // all, so entry.translationDa is guaranteed present whenever locale is
  // actually "da" here.
  const translation = locale === "da" && entry.translationDa ? entry.translationDa : entry.translationEn;
  const pendingScholarlyReview = entry.publicationPathway === "editorial-pending-scholarly-review";
  const ownerApprovedEnglishFirst = entry.publicationPathway === "owner-approved-english-first";
  const timingKey = isKnownTimingKey(entry.timingLabel) ? entry.timingLabel : undefined;

  function toggleMemoriseMode() {
    setMemoriseMode((v) => !v);
    setRevealTranslation(false);
    setRevealTransliteration(false);
  }

  function cycleLearningState() {
    const next: MemoriseState | undefined =
      learningState === undefined ? "learning" : learningState === "learning" ? "memorised" : undefined;
    setLearningState(next);
    setMemoriseState(entry._id, next);
  }

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : undefined;
    const shareData = { title: entry.titleEn, text: `${entry.arabicText}\n\n${translation}`, url };
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(shareData);
      } else if (typeof navigator !== "undefined" && navigator.clipboard && url) {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      // User cancelled the share sheet, or clipboard access was denied — no-op.
    }
  }

  return (
    <article className="dua-dhikr-entry-card" aria-labelledby={`dua-dhikr-${entry._id}-arabic`}>
      {pendingScholarlyReview && (
        <span className="dua-dhikr-pending-badge" role="note">
          {t("pendingScholarlyReviewBadge")}
        </span>
      )}

      {ownerApprovedEnglishFirst && (
        <span className="dua-dhikr-pending-badge" role="note">
          {t("ownerApprovedBadge")}
        </span>
      )}

      {entry.whatItIsFor && <p className="dua-dhikr-entry-card__what-for">{entry.whatItIsFor}</p>}

      <ArabicText id={`dua-dhikr-${entry._id}-arabic`} size={memoriseMode ? "large" : "default"}>
        {entry.arabicText}
      </ArabicText>

      {memoriseMode ? (
        <div className="dua-dhikr-entry-card__badges">
          {!revealTranslation && (
            <button type="button" className="dua-dhikr-entry-card__action" onClick={() => setRevealTranslation(true)}>
              {t("revealTranslation")}
            </button>
          )}
          {entry.transliteration && !revealTransliteration && (
            <button
              type="button"
              className="dua-dhikr-entry-card__action"
              onClick={() => setRevealTransliteration(true)}
            >
              {t("revealTransliteration")}
            </button>
          )}
        </div>
      ) : null}

      {(!memoriseMode || revealTranslation) && (
        <p className="dua-dhikr-entry-card__translation" lang={locale}>
          {translation}
        </p>
      )}

      {entry.transliteration && (!memoriseMode || revealTransliteration) && (
        <p className="dua-dhikr-entry-card__transliteration">{entry.transliteration}</p>
      )}

      {(timingKey || (entry.recommendedRepetitions ?? 0) > 0) && (
        <div className="dua-dhikr-entry-card__badges">
          {timingKey && <span className="dua-dhikr-entry-card__badge">{t(`timing.${timingKey}`)}</span>}
          {entry.recommendedRepetitions !== undefined && entry.recommendedRepetitions > 0 && (
            <span className="dua-dhikr-entry-card__badge">
              {t("repetitionLabel", { count: entry.recommendedRepetitions })}
            </span>
          )}
        </div>
      )}

      {entry.virtueText && (
        <details>
          <summary>{t("virtueLabel")}</summary>
          <p className="dua-dhikr-entry-card__detail-body">{entry.virtueText}</p>
        </details>
      )}

      {entry.explanationText && (
        <details>
          <summary>{t("explanationLabel")}</summary>
          <p className="dua-dhikr-entry-card__detail-body">{entry.explanationText}</p>
        </details>
      )}

      {entry.sourceReferences.length > 0 && (
        <details>
          <summary>{t("referencesLabel")}</summary>
          <ul className="dua-dhikr-entry-card__detail-body">
            {entry.sourceReferences.map((ref, index) => (
              <li key={`${entry._id}-source-${index}`}>{ref.citation}</li>
            ))}
          </ul>
        </details>
      )}

      {entry.sourceReferences[0]?.citation && (
        <p className="dua-dhikr-entry-card__source">
          <span>{t("sourceLabel")}</span>
          <span>{entry.sourceReferences[0].citation}</span>
        </p>
      )}

      {entry.hasAudioAsset && entry.audioAssetUrl && (
        // eslint-disable-next-line jsx-a11y/media-has-caption -- no verified transcript exists yet; control itself is never shown without a real audio asset.
        <audio controls preload="none" src={entry.audioAssetUrl} aria-label={t("audioLabel", { title: entry.titleEn })} />
      )}

      <div className="dua-dhikr-entry-card__toolbar" role="group" aria-label={t("toolbarLabel")}>
        <button
          type="button"
          className="dua-dhikr-entry-card__action"
          aria-pressed={memoriseMode}
          onClick={toggleMemoriseMode}
        >
          {memoriseMode ? t("exitMemoriseMode") : t("enterMemoriseMode")}
        </button>
        <button type="button" className="dua-dhikr-entry-card__action" onClick={cycleLearningState}>
          {learningState === "memorised"
            ? t("markedMemorised")
            : learningState === "learning"
              ? t("markedLearning")
              : t("markAsLearning")}
        </button>
        <button type="button" className="dua-dhikr-entry-card__action" onClick={handleShare}>
          {t("share")}
        </button>
      </div>
    </article>
  );
}
