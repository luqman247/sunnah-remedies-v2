import { defineField, defineType } from "sanity";
import {
  requiredWhenDhikrPublished,
  requiredDhikrSourceReferences,
  requiredDhikrBoardApprovals,
} from "@/sanity/validation/governance";

/**
 * The five reviewStatus stages, per docs/dhikr/03. "approved" means required
 * reviews passed; it is NOT sufficient for public exposure — only
 * "published" is (see src/sanity/lib/dhikr-publication-gate.ts).
 */
const DHIKR_REVIEW_STATUS_VALUES = [
  "sourced",
  "scholarly-review",
  "editorial-review",
  "approved",
  "published",
] as const;

const DHIKR_REVIEW_STATUS_TITLES: Record<(typeof DHIKR_REVIEW_STATUS_VALUES)[number], string> = {
  sourced: "Sourced",
  "scholarly-review": "Scholarly Review",
  "editorial-review": "Editorial Review",
  approved: "Approved",
  published: "Published",
};

/**
 * Dhikr Item — content model shape only. Empty in this prototype phase:
 * no Arabic text, translation, source citation, grading, or repetition
 * count has been populated anywhere.
 *
 * reviewStatus stages (see docs/dhikr/03-authenticity-and-scholarly-review-policy.md):
 *   sourced -> scholarly-review -> editorial-review -> approved -> published
 * "approved" means required reviews passed; it does NOT mean publication has
 * been authorised or activated. Only "published" is publicly visible, and
 * only when it also satisfies the full eligibility rule in
 * src/sanity/lib/dhikr-publication-gate.ts (mandatory fields + both board
 * approvals) — reviewStatus alone is not sufficient for public exposure.
 *
 * sourceReferences reuses the existing sourceReference object (citation +
 * hadith grading + "unverified attribution" rule) rather than inventing a
 * bespoke citation field. boardApprovals reuses the existing boardApproval
 * object, which already has "Scholarly Review Board" and "Editorial" as
 * board options — both are required, independently approved, before publish.
 *
 * @see docs/dhikr/04-dhikr-content-schema.md
 * @see docs/dhikr/12-sanity-integration-plan.md
 */
export const dhikrItem = defineType({
  name: "dhikrItem",
  title: "Dhikr Item",
  type: "document",
  // All three fieldsets render fully expanded (no `options: { collapsible,
  // collapsed }`) — in particular "Sourcing & Review" holds the fields that
  // gate publication and must never be hidden from an editor by default.
  fieldsets: [
    { name: "identity", title: "Identity" },
    { name: "content", title: "Content" },
    { name: "sourcingReview", title: "Sourcing & Review" },
  ],
  fields: [
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "dhikrCategory" }],
      fieldset: "identity",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Position within category",
      fieldset: "identity",
    }),
    defineField({
      name: "titleEn",
      title: "Title (English)",
      type: "string",
      description: "Short label, no religious content itself.",
      fieldset: "identity",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "titleDa",
      title: "Title (Dansk)",
      type: "string",
      fieldset: "identity",
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      fieldset: "identity",
    }),
    defineField({
      name: "arabicText",
      title: "Arabic Text",
      type: "text",
      description:
        "Authoritative source text (see docs/dhikr/03). Empty in this prototype phase. Stored once here — never duplicated onto a separate English/Danish record.",
      fieldset: "content",
      validation: (rule) => rule.custom(requiredWhenDhikrPublished("Arabic text is required before publishing.")),
    }),
    defineField({
      name: "transliteration",
      title: "Transliteration",
      type: "text",
      description: "Empty in this prototype phase.",
      fieldset: "content",
    }),
    defineField({
      name: "translationEn",
      title: "Translation (English)",
      type: "text",
      description:
        "Derived from arabicText, not independent content — see docs/dhikr/03. Empty in this prototype phase.",
      fieldset: "content",
      validation: (rule) =>
        rule.custom(requiredWhenDhikrPublished("English translation is required before publishing.")),
    }),
    defineField({
      name: "translationDa",
      title: "Translation (Dansk)",
      type: "text",
      description: "Derived from arabicText, not independent content. Empty in this prototype phase.",
      fieldset: "content",
      validation: (rule) =>
        rule.custom(requiredWhenDhikrPublished("Danish translation is required before publishing.")),
    }),
    defineField({
      name: "recommendedRepetitions",
      title: "Recommended Repetitions",
      type: "number",
      description: "Not populated in this architecture/prototype phase — see docs/dhikr/07.",
      fieldset: "content",
    }),
    defineField({
      name: "audioAsset",
      title: "Audio Asset",
      type: "reference",
      to: [{ type: "audioAsset" }],
      description: "Not populated or used in this prototype phase — see docs/dhikr/10.",
      fieldset: "content",
    }),
    defineField({
      name: "sourceReferences",
      title: "Source References",
      type: "array",
      of: [{ type: "sourceReference" }],
      description:
        "Citation + grading (see docs/dhikr/03). At least one is required before publishing. Empty in this prototype phase.",
      fieldset: "sourcingReview",
      validation: (rule) => rule.custom(requiredDhikrSourceReferences),
    }),
    defineField({
      name: "reviewStatus",
      title: "Review Status",
      type: "string",
      options: {
        list: DHIKR_REVIEW_STATUS_VALUES.map((value) => ({
          title: DHIKR_REVIEW_STATUS_TITLES[value],
          value,
        })),
      },
      initialValue: "sourced",
      fieldset: "sourcingReview",
      // .custom() enforces the enum at the validation layer (not just the
      // Studio dropdown, which is bypassable via a direct API write). .valid()
      // is not available on this field's inferred Rule type, so the same
      // constraint is expressed as a custom check against the same constant.
      validation: (rule) =>
        rule.required().custom((value) => {
          if (value !== undefined && !(DHIKR_REVIEW_STATUS_VALUES as readonly string[]).includes(value as string)) {
            return `reviewStatus must be one of: ${DHIKR_REVIEW_STATUS_VALUES.join(", ")}`;
          }
          return true;
        }),
    }),
    defineField({
      name: "boardApprovals",
      title: "Board Approvals",
      type: "array",
      of: [{ type: "boardApproval" }],
      description:
        "Scholarly and editorial sign-off (see docs/dhikr/03). Both are required, independently approved, before publishing — one approval of either kind alone is not sufficient.",
      fieldset: "sourcingReview",
      validation: (rule) => rule.custom(requiredDhikrBoardApprovals),
    }),
  ],
  orderings: [
    { title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "titleEn", status: "reviewStatus" },
    prepare({ title, status }) {
      return { title, subtitle: status };
    },
  },
});
