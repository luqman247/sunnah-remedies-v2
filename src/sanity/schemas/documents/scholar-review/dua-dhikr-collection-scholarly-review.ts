import { defineField, defineType } from "sanity";

const DECISION_VALUES = [
  "approved",
  "approved-with-wording-changes",
  "reorder-entries",
  "add-missing-entry",
  "remove-entry",
  "merge-collection",
  "keep-unpublished",
  "defer",
] as const;

const DECISION_TITLES: Record<(typeof DECISION_VALUES)[number], string> = {
  approved: "Approved",
  "approved-with-wording-changes": "Approved with wording changes",
  "reorder-entries": "Reorder entries",
  "add-missing-entry": "Add missing entry",
  "remove-entry": "Remove entry",
  "merge-collection": "Merge collection",
  "keep-unpublished": "Keep unpublished",
  defer: "Defer",
};

export const DUA_DHIKR_COLLECTION_REVIEW_DECISIONS_NOT_REQUIRING_COMMENT = new Set<string>(["approved", "defer"]);

/**
 * One scholar's review of one duaDhikrCollection — proposal record only,
 * never a mutation of the authoritative collection. STAGING-ONLY.
 *
 * @see /scholar-review/dua-dhikr/collections/[collectionId]
 */
export const duaDhikrCollectionScholarlyReview = defineType({
  name: "duaDhikrCollectionScholarlyReview",
  title: "Duʿā & Dhikr Collection — Scholarly Review",
  type: "document",
  fields: [
    defineField({ name: "session", title: "Review Session", type: "reference", to: [{ type: "scholarlyReviewSession" }], validation: (r) => r.required() }),
    defineField({ name: "collection", title: "Duʿā & Dhikr Collection", type: "reference", to: [{ type: "duaDhikrCollection" }], validation: (r) => r.required() }),
    defineField({
      name: "decision",
      title: "Decision",
      type: "string",
      options: { list: DECISION_VALUES.map((v) => ({ title: DECISION_TITLES[v], value: v })) },
    }),
    defineField({ name: "comments", title: "Comments", type: "text", rows: 4 }),
    defineField({ name: "proposedOrdering", title: "Proposed Ordering", type: "text", description: "Free-text description of a proposed reorder — comma-separated entry titles/slugs in the suggested order." }),
    defineField({ name: "createdAt", title: "Created At", type: "datetime", validation: (r) => r.required() }),
    defineField({ name: "updatedAt", title: "Updated At", type: "datetime" }),
    defineField({ name: "submittedAt", title: "Submitted At", type: "datetime" }),
    defineField({ name: "reviewVersion", title: "Review Version", type: "number", initialValue: 1 }),
    defineField({ name: "completed", title: "Completed", type: "boolean", initialValue: false }),
  ],
  preview: {
    select: { title: "collection.titleEn", subtitle: "decision" },
  },
});
