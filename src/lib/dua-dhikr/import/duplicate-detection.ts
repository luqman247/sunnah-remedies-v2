/**
 * Duʿa & Dhikr — duplicate and near-duplicate detection for the content
 * import pipeline. Pure functions, no I/O, no Sanity access — safe to run
 * against fixture data and unit-test directly.
 *
 * Deliberately conservative: this module flags candidates for a human to
 * resolve, it never merges or discards a row itself, and it never treats
 * similar English wording alone as evidence of duplication — two entries
 * can legitimately share a purpose ("before sleep") while being two
 * different, both-authentic duʿās, and two entries can legitimately be the
 * SAME duʿā deliberately reused across two collections (e.g. a duʿā said
 * both after salah and before sleep). See docs/dua-dhikr/CONTENT_IMPORT_GUIDE.md,
 * "Duplicate-detection strategy", for how a human resolves each case below.
 */

import type { DuaDhikrImportRow } from "./schema";

/**
 * Strips Arabic diacritics (tashkīl) and normalises whitespace so that two
 * transcriptions of the same duʿā that differ only in diacritic marks or
 * spacing compare equal. Does NOT strip base letters, so this never
 * conflates two genuinely different duʿās.
 *
 * Unicode ranges removed: U+0610–U+061A (honorifics/small signs),
 * U+064B–U+065F (tashkīl), U+0670 (superscript alef), U+06D6–U+06ED
 * (Qurʾānic annotation marks).
 */
export function normalizeArabicForComparison(text: string): string {
  return text
    .replace(/[ؐ-ًؚ-ٰٟۖ-ۭ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Normalises punctuation/whitespace differences in a citation string for comparison, without touching wording. */
function normalizeCitationForComparison(text: string): string {
  return text.toLowerCase().replace(/[.,;:\s]+/g, " ").trim();
}

export type DuplicateCandidateReason =
  | "same-import-identifier"
  | "same-arabic-normalized"
  | "same-source-and-repetition"
  | "same-arabic-reused-in-other-collection";

export interface DuplicateCandidateGroup {
  reason: DuplicateCandidateReason;
  /** Row indices (into the original rows array) involved in this candidate group. */
  rowIndices: number[];
  importIdentifiers: (string | undefined)[];
  /** Human-readable explanation of why this was flagged and what a reviewer should check. */
  note: string;
}

/**
 * Every duplicate/near-duplicate signal this module currently detects,
 * across one import batch. Returns an empty array for a batch with no
 * candidates — this is the expected common case, not a failure mode.
 *
 * Deliberately does NOT flag:
 *   - two rows with similar English titleEn/whatItIsFor but different Arabic
 *     (different duʿās can share a plain-language purpose)
 *   - the same Arabic legitimately assigned to two different collections
 *     alone (flagged as an informational candidate, not an error — see
 *     "same-arabic-reused-in-other-collection", which is advisory only)
 */
export function findDuplicateCandidates(rows: DuaDhikrImportRow[]): DuplicateCandidateGroup[] {
  const groups: DuplicateCandidateGroup[] = [];

  // Same Arabic (after normalising tashkīl/whitespace) — the strongest signal.
  const byNormalizedArabic = new Map<string, number[]>();
  rows.forEach((row, index) => {
    const key = normalizeArabicForComparison(row.arabicText);
    if (!key) return;
    byNormalizedArabic.set(key, [...(byNormalizedArabic.get(key) ?? []), index]);
  });
  for (const [, indices] of byNormalizedArabic) {
    if (indices.length < 2) continue;
    const collections = new Set(indices.map((i) => rows[i].collectionSlug));
    if (collections.size > 1) {
      // Same Arabic, different collections — plausibly legitimate reuse;
      // still surfaced, but as the weaker, advisory reason so a reviewer
      // can confirm rather than reject outright.
      groups.push({
        reason: "same-arabic-reused-in-other-collection",
        rowIndices: indices,
        importIdentifiers: indices.map((i) => rows[i].importIdentifier),
        note: "Identical Arabic text (ignoring diacritics/whitespace) appears under more than one collection. This may be a legitimate, deliberate reuse of the same duʿā in different contexts — confirm before treating as an error.",
      });
    } else {
      groups.push({
        reason: "same-arabic-normalized",
        rowIndices: indices,
        importIdentifiers: indices.map((i) => rows[i].importIdentifier),
        note: "Identical Arabic text (ignoring diacritics/whitespace) appears more than once in the same collection. Likely a true duplicate — confirm which importIdentifier should be kept before staging both.",
      });
    }
  }

  // Same primary source citation + same repetition count — a secondary,
  // weaker signal (does not by itself imply identical Arabic).
  const bySourceAndRepetition = new Map<string, number[]>();
  rows.forEach((row, index) => {
    const citation = row.references[0]?.citation;
    if (!citation || row.repetitionCount === undefined) return;
    const key = `${normalizeCitationForComparison(citation)}::${row.repetitionCount}`;
    bySourceAndRepetition.set(key, [...(bySourceAndRepetition.get(key) ?? []), index]);
  });
  for (const [, indices] of bySourceAndRepetition) {
    if (indices.length < 2) continue;
    // Skip groups already fully covered by an exact-Arabic match above.
    const alreadyFlagged = groups.some(
      (g) => g.reason !== "same-source-and-repetition" && indices.every((i) => g.rowIndices.includes(i)),
    );
    if (alreadyFlagged) continue;
    groups.push({
      reason: "same-source-and-repetition",
      rowIndices: indices,
      importIdentifiers: indices.map((i) => rows[i].importIdentifier),
      note: "Multiple rows cite the same source and the same repetition count but have different Arabic text — verify these are genuinely distinct duʿās from that source, not a transcription split across two rows.",
    });
  }

  return groups;
}
