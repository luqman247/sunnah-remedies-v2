/**
 * Display labels for the three review decision enums, kept separate from
 * the Sanity schema files (which are Studio-only and shouldn't be imported
 * into the Next.js app bundle). Values here must stay in sync with:
 *   src/sanity/schemas/documents/scholar-review/dua-dhikr-entry-scholarly-review.ts
 *   src/sanity/schemas/documents/scholar-review/dua-dhikr-collection-scholarly-review.ts
 *   src/sanity/schemas/documents/scholar-review/feeling-state-scholarly-review.ts
 */

export const DUA_DHIKR_ENTRY_DECISIONS = [
  { value: "approved", label: "Approved" },
  { value: "approved-with-arabic-correction", label: "Approved with Arabic correction" },
  { value: "approved-with-translation-revision", label: "Approved with translation revision" },
  { value: "approved-with-transliteration-revision", label: "Approved with transliteration revision" },
  { value: "approved-with-source-correction", label: "Approved with source correction" },
  { value: "additional-source-verification-required", label: "Additional source verification required" },
  { value: "hadith-grading-required", label: "Hadith grading required" },
  { value: "duplicate-consolidate", label: "Duplicate entry — consolidate" },
  { value: "keep-unpublished", label: "Keep unpublished" },
  { value: "reject-entry", label: "Reject entry" },
  { value: "defer", label: "Defer" },
] as const;

export const DUA_DHIKR_ENTRY_DECISIONS_NOT_REQUIRING_COMMENT = new Set<string>(["approved", "defer"]);

export const DUA_DHIKR_ENTRY_DUPLICATE_RESOLUTIONS = [
  { value: "not-duplicate", label: "Not a duplicate" },
  { value: "retain-first", label: "Duplicate — retain first" },
  { value: "retain-second", label: "Duplicate — retain second" },
  { value: "create-canonical", label: "Duplicate — create corrected canonical entry" },
  { value: "further-review-required", label: "Further review required" },
] as const;

export const DUA_DHIKR_COLLECTION_DECISIONS = [
  { value: "approved", label: "Approved" },
  { value: "approved-with-wording-changes", label: "Approved with wording changes" },
  { value: "reorder-entries", label: "Reorder entries" },
  { value: "add-missing-entry", label: "Add missing entry" },
  { value: "remove-entry", label: "Remove entry" },
  { value: "merge-collection", label: "Merge collection" },
  { value: "keep-unpublished", label: "Keep unpublished" },
  { value: "defer", label: "Defer" },
] as const;

export const DUA_DHIKR_COLLECTION_DECISIONS_NOT_REQUIRING_COMMENT = new Set<string>(["approved", "defer"]);

export const FEELING_STATE_DECISIONS = [
  { value: "approved", label: "Approved" },
  { value: "approved-with-wording-revision", label: "Approved with wording revision" },
  { value: "replace-religious-content-pairing", label: "Replace religious-content pairing" },
  { value: "additional-source-verification-required", label: "Additional source verification required" },
  { value: "clinical-or-safeguarding-review-required", label: "Clinical or safeguarding review required" },
  { value: "keep-unpublished", label: "Keep unpublished" },
  { value: "deferred", label: "Deferred" },
] as const;

export const FEELING_STATE_DECISIONS_NOT_REQUIRING_COMMENT = new Set<string>(["approved", "deferred"]);

export function decisionLabel(list: readonly { value: string; label: string }[], value: string | undefined): string {
  if (!value) return "Not reviewed";
  return list.find((d) => d.value === value)?.label ?? value;
}
