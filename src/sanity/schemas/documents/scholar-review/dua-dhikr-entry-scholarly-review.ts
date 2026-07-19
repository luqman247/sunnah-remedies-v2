import { defineField, defineType } from "sanity";

const DECISION_VALUES = [
  "approved",
  "approved-with-arabic-correction",
  "approved-with-translation-revision",
  "approved-with-transliteration-revision",
  "approved-with-source-correction",
  "additional-source-verification-required",
  "hadith-grading-required",
  "duplicate-consolidate",
  "keep-unpublished",
  "reject-entry",
  "defer",
] as const;

const DECISION_TITLES: Record<(typeof DECISION_VALUES)[number], string> = {
  approved: "Approved",
  "approved-with-arabic-correction": "Approved with Arabic correction",
  "approved-with-translation-revision": "Approved with translation revision",
  "approved-with-transliteration-revision": "Approved with transliteration revision",
  "approved-with-source-correction": "Approved with source correction",
  "additional-source-verification-required": "Additional source verification required",
  "hadith-grading-required": "Hadith grading required",
  "duplicate-consolidate": "Duplicate entry — consolidate",
  "keep-unpublished": "Keep unpublished",
  "reject-entry": "Reject entry",
  defer: "Defer",
};

/** Decisions where a comment is NOT strictly required (everything else requires one). */
export const DUA_DHIKR_REVIEW_DECISIONS_NOT_REQUIRING_COMMENT = new Set<string>(["approved", "defer"]);

/**
 * One scholar's review of one duaDhikrEntry — a PROPOSAL record, never a
 * mutation of the authoritative entry. The original entry is referenced,
 * never edited; every correction field here is a suggestion for a human
 * editor to apply later through the existing Duʿā & Dhikr editorial
 * workflow, exactly as docs/i-am-feeling/SPEC.md §7.1's "preserve the
 * original, propose corrections separately" rule already establishes for
 * this codebase.
 *
 * STAGING-ONLY. See scholarly-review-session.ts's file-level note.
 *
 * @see /scholar-review/dua-dhikr/[entryId]
 */
export const duaDhikrEntryScholarlyReview = defineType({
  name: "duaDhikrEntryScholarlyReview",
  title: "Duʿā & Dhikr Entry — Scholarly Review",
  type: "document",
  fields: [
    defineField({ name: "session", title: "Review Session", type: "reference", to: [{ type: "scholarlyReviewSession" }], validation: (r) => r.required() }),
    defineField({ name: "entry", title: "Duʿā & Dhikr Entry", type: "reference", to: [{ type: "duaDhikrEntry" }], validation: (r) => r.required() }),
    defineField({
      name: "decision",
      title: "Decision",
      type: "string",
      options: { list: DECISION_VALUES.map((v) => ({ title: DECISION_TITLES[v], value: v })) },
    }),
    defineField({ name: "comments", title: "Comments", type: "text", rows: 4 }),
    defineField({
      name: "proposedArabicCorrection",
      title: "Proposed Arabic Correction",
      type: "text",
      description: "The ORIGINAL arabicText is never edited by this record — this is a proposed replacement, for a human editor to apply.",
    }),
    defineField({ name: "proposedArabicCorrectionReason", title: "Reason for Arabic Correction", type: "text", rows: 2 }),
    defineField({ name: "proposedTranslation", title: "Proposed Translation", type: "text" }),
    defineField({ name: "proposedTransliteration", title: "Proposed Transliteration", type: "text" }),
    defineField({ name: "correctedSource", title: "Corrected Source Citation", type: "text", rows: 2 }),
    defineField({ name: "hadithGrading", title: "Proposed Hadith Grading", type: "string" }),
    defineField({ name: "duplicateTargetEntry", title: "Duplicate Target Entry", type: "reference", to: [{ type: "duaDhikrEntry" }] }),
    defineField({
      name: "duplicateResolution",
      title: "Duplicate Resolution",
      type: "string",
      options: {
        list: [
          { title: "Not a duplicate", value: "not-duplicate" },
          { title: "Duplicate — retain first", value: "retain-first" },
          { title: "Duplicate — retain second", value: "retain-second" },
          { title: "Duplicate — create corrected canonical entry", value: "create-canonical" },
          { title: "Further review required", value: "further-review-required" },
        ],
      },
    }),
    defineField({ name: "virtueConcern", title: "Virtue Concern", type: "text", rows: 2 }),
    defineField({ name: "explanationConcern", title: "Explanation Concern", type: "text", rows: 2 }),
    defineField({ name: "generalComments", title: "General Comments", type: "text", rows: 3 }),
    defineField({ name: "createdAt", title: "Created At", type: "datetime", validation: (r) => r.required() }),
    defineField({ name: "updatedAt", title: "Updated At", type: "datetime" }),
    defineField({ name: "submittedAt", title: "Submitted At", type: "datetime" }),
    defineField({ name: "reviewVersion", title: "Review Version", type: "number", initialValue: 1 }),
    defineField({ name: "completed", title: "Completed", type: "boolean", initialValue: false }),
  ],
  preview: {
    select: { title: "entry.titleEn", subtitle: "decision" },
  },
});
