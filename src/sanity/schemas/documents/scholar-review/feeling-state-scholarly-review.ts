import { defineField, defineType } from "sanity";

const DECISION_VALUES = [
  "approved",
  "approved-with-wording-revision",
  "replace-religious-content-pairing",
  "additional-source-verification-required",
  "clinical-or-safeguarding-review-required",
  "keep-unpublished",
  "deferred",
] as const;

const DECISION_TITLES: Record<(typeof DECISION_VALUES)[number], string> = {
  approved: "Approved",
  "approved-with-wording-revision": "Approved with wording revision",
  "replace-religious-content-pairing": "Replace religious-content pairing",
  "additional-source-verification-required": "Additional source verification required",
  "clinical-or-safeguarding-review-required": "Clinical or safeguarding review required",
  "keep-unpublished": "Keep unpublished",
  deferred: "Deferred",
};

/** Decisions where a comment IS required (everything except Approved/Deferred, which allow optional comments). */
export const FEELING_STATE_REVIEW_DECISIONS_REQUIRING_COMMENT = new Set<string>([
  "approved-with-wording-revision",
  "replace-religious-content-pairing",
  "additional-source-verification-required",
  "clinical-or-safeguarding-review-required",
  "keep-unpublished",
]);

/**
 * One scholar's review of one feelingState — covers both whether the
 * underlying religious content is sound AND whether it is appropriately
 * paired with that emotional state (docs/i-am-feeling/SPEC.md §13). Never
 * mutates the feelingState document itself. STAGING-ONLY.
 *
 * @see /scholar-review/i-am-feeling/[feelingId]
 */
export const feelingStateScholarlyReview = defineType({
  name: "feelingStateScholarlyReview",
  title: "Feeling State — Scholarly Review",
  type: "document",
  fields: [
    defineField({ name: "session", title: "Review Session", type: "reference", to: [{ type: "scholarlyReviewSession" }], validation: (r) => r.required() }),
    defineField({ name: "feelingState", title: "Feeling State", type: "reference", to: [{ type: "feelingState" }], validation: (r) => r.required() }),
    defineField({
      name: "decision",
      title: "Decision",
      type: "string",
      options: { list: DECISION_VALUES.map((v) => ({ title: DECISION_TITLES[v], value: v })) },
    }),
    defineField({ name: "comments", title: "Comments", type: "text", rows: 4 }),
    defineField({ name: "approvedIntroduction", title: "Approved / Revised Introduction", type: "text" }),
    defineField({ name: "approvedReflection", title: "Approved / Revised Reflection", type: "text" }),
    defineField({ name: "approvedPracticalNextStep", title: "Approved / Revised Practical Next Step", type: "text" }),
    defineField({ name: "entriesToRetain", title: "Entries to Retain", type: "array", of: [{ type: "reference", to: [{ type: "duaDhikrEntry" }] }] }),
    defineField({ name: "entriesToRemove", title: "Entries to Remove", type: "array", of: [{ type: "reference", to: [{ type: "duaDhikrEntry" }] }] }),
    defineField({ name: "replacementEntrySuggestion", title: "Replacement Entry Suggestion", type: "text", description: "Free text — a scholar's suggested Qurʾānic verse, prophetic duʿā, dhikr, or scholarly pathway when no current entry fits (SPEC §12)." }),
    defineField({ name: "sourceConcern", title: "Source Concern", type: "text", rows: 2 }),
    defineField({ name: "authenticityConcern", title: "Authenticity Concern", type: "text", rows: 2 }),
    defineField({ name: "safeguardingConcern", title: "Safeguarding Concern", type: "text", rows: 2 }),
    defineField({ name: "otherComments", title: "Other Comments", type: "text", rows: 3 }),
    defineField({ name: "createdAt", title: "Created At", type: "datetime", validation: (r) => r.required() }),
    defineField({ name: "updatedAt", title: "Updated At", type: "datetime" }),
    defineField({ name: "submittedAt", title: "Submitted At", type: "datetime" }),
    defineField({ name: "reviewVersion", title: "Review Version", type: "number", initialValue: 1 }),
    defineField({ name: "completed", title: "Completed", type: "boolean", initialValue: false }),
  ],
  preview: {
    select: { title: "feelingState.labelEn", subtitle: "decision" },
  },
});
