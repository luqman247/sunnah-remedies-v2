import { defineField, defineType } from "sanity";
import {
  requiredWhenDhikrPublished,
  requiredDhikrSourceReferences,
  requiredDhikrBoardApprovals,
  isUniqueDhikrSlug,
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
  // Studio tabs, matching the multi-section convention already used by
  // src/sanity/schemas/documents/apothecary/product.ts. This is purely
  // Studio-side presentation metadata — see docs/dhikr/21-decision-log.md
  // for confirmation that switching from fieldsets to groups does not
  // change stored document data in any way.
  //
  // "Editorial Review" intentionally has no field uniquely its own:
  // boardApprovals holds both scholarly and editorial sign-off entries in
  // one shared array (distinguished only by each entry's own `board`
  // value), and per explicit instruction it is placed in exactly one
  // group (Scholarly Review) rather than shown in two groups at once.
  // reviewStatus is shared between Scholarly Review and Editorial Review
  // (assigned to both groups) since it is a single pipeline-wide field
  // that neither review stage owns exclusively — this is Sanity's native
  // multi-group display mechanism, not a second copy of the field.
  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "arabicSourceText", title: "Arabic Source Text" },
    { name: "supportingTranslations", title: "Supporting Translations" },
    { name: "repetitionGuidance", title: "Repetition Guidance" },
    { name: "sourcesAndAuthenticity", title: "Sources and Authenticity" },
    { name: "scholarlyReview", title: "Scholarly Review" },
    { name: "editorialReview", title: "Editorial Review" },
  ],
  fields: [
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "dhikrCategory" }],
      description: "Which category this item belongs to. Selecting a category does not itself make the item public.",
      group: "identity",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Position within category",
      group: "identity",
    }),
    defineField({
      name: "titleEn",
      title: "Title (English)",
      type: "string",
      description: "Internal working title, no religious content itself.",
      placeholder: "Enter internal English title",
      group: "identity",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "titleDa",
      title: "Title (Dansk)",
      type: "string",
      placeholder: "Enter internal Danish title",
      group: "identity",
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "Public URL segment for this item. Optional while this prototype has no reviewed content — only required once reviewStatus reaches \"published\" (see docs/dhikr/19-implementation-roadmap.md). A public item-detail route does not exist yet regardless of whether a slug is set; see docs/dhikr/21-decision-log.md.",
      group: "identity",
      options: {
        source: "titleEn",
        maxLength: 96,
        isUnique: isUniqueDhikrSlug,
      },
      validation: (rule) => rule.custom(requiredWhenDhikrPublished("A slug is required before publishing.")),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      group: "identity",
    }),
    defineField({
      name: "arabicText",
      title: "Arabic Text",
      type: "text",
      description:
        "Entered once here and remains the authoritative source for this item (see docs/dhikr/03) — never duplicated onto a separate English/Danish record. Empty in this prototype phase.",
      placeholder: "Enter verified Arabic text",
      group: "arabicSourceText",
      validation: (rule) => rule.custom(requiredWhenDhikrPublished("Arabic text is required before publishing.")),
    }),
    defineField({
      name: "transliteration",
      title: "Transliteration",
      type: "text",
      description: "Optional unless editorial policy later requires it. Empty in this prototype phase.",
      placeholder: "Enter reviewed transliteration if required",
      group: "arabicSourceText",
    }),
    defineField({
      name: "translationEn",
      title: "Translation (English)",
      type: "text",
      description:
        "A supporting translation derived from arabicText, not independent content — see docs/dhikr/03. Empty in this prototype phase.",
      placeholder: "Enter reviewed English translation",
      group: "supportingTranslations",
      validation: (rule) =>
        rule.custom(requiredWhenDhikrPublished("English translation is required before publishing.")),
    }),
    defineField({
      name: "translationDa",
      title: "Translation (Dansk)",
      type: "text",
      description: "A supporting translation derived from arabicText, not independent content. Empty in this prototype phase.",
      placeholder: "Enter reviewed Danish translation",
      group: "supportingTranslations",
      validation: (rule) =>
        rule.custom(requiredWhenDhikrPublished("Danish translation is required before publishing.")),
    }),
    defineField({
      name: "recommendedRepetitions",
      title: "Recommended Repetitions",
      type: "number",
      description: "Must be sourced, not assumed — see docs/dhikr/07. Not populated in this architecture/prototype phase.",
      group: "repetitionGuidance",
    }),
    defineField({
      name: "audioAsset",
      title: "Audio Asset",
      type: "reference",
      to: [{ type: "audioAsset" }],
      description: "Optional recitation audio, grouped here as a reading/practice aid alongside repetition guidance — see docs/dhikr/10. Not populated or used in this prototype phase.",
      group: "repetitionGuidance",
    }),
    defineField({
      name: "sourceReferences",
      title: "Source References",
      type: "array",
      of: [{ type: "sourceReference" }],
      description:
        "Citations must be primary or independently verified — no invented or placeholder citation numbers (see docs/dhikr/03). At least one is required before publishing. Empty in this prototype phase.",
      group: "sourcesAndAuthenticity",
      validation: (rule) => rule.custom(requiredDhikrSourceReferences),
    }),
    defineField({
      name: "reviewStatus",
      title: "Review Status",
      type: "string",
      description:
        "The current pipeline stage. Changing this value does not itself guarantee public eligibility — publication also requires every condition in the canonical gate (src/sanity/lib/dhikr-publication-gate.ts) to be met, shown on the separate Publication Readiness view.",
      options: {
        list: DHIKR_REVIEW_STATUS_VALUES.map((value) => ({
          title: DHIKR_REVIEW_STATUS_TITLES[value],
          value,
        })),
      },
      initialValue: "sourced",
      group: ["scholarlyReview", "editorialReview"],
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
        "Governance records, not public content. Scholarly and editorial sign-off are recorded together in this single array (distinguished by each entry's own board selection) — there is no separate Editorial Review array; add editorial entries here too. Both a scholarly and an editorial approval are required, independently, before publishing — one approval of either kind alone is not sufficient (see docs/dhikr/03).",
      group: "scholarlyReview",
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
