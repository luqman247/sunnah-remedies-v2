import { defineField, defineType } from "sanity";
import {
  requiredWhenDhikrPublished,
  requiredDhikrSourceReferences,
  requiredDhikrBoardApprovals,
  isUniqueDhikrSlug,
} from "@/sanity/validation/governance";

/**
 * Duʿa & Dhikr Entry — the content unit for the wider Duʿa & Dhikr library.
 *
 * Deliberately modelled on dhikrItem (src/sanity/schemas/documents/dhikr/
 * dhikr-item.ts): same reviewStatus pipeline, same reused sourceReference /
 * boardApproval objects, same canonical + editorial-bypass publication
 * pathways. It is a distinct document type (not a reuse of dhikrItem
 * itself) because its field set is broader — collections/subcategories
 * instead of a single category reference, occasion/instruction/explanation
 * fields, related entries, and import provenance — see docs/dua-dhikr/
 * CONTENT_MODEL.md for the field-by-field rationale and docs/dua-dhikr/
 * REVIEW_BYPASS.md for exactly how the editorial pathway works here.
 *
 * Morning and Evening Dhikr remain dhikrItem documents and are NOT
 * migrated to this type — they continue to be served by
 * src/sanity/lib/dhikr-public-fetch.ts exactly as before. This type exists
 * for the rest of the Duʿa & Dhikr taxonomy only.
 */

const DUA_DHIKR_REVIEW_STATUS_VALUES = [
  "sourced",
  "scholarly-review",
  "editorial-review",
  "approved",
  "published",
] as const;

const DUA_DHIKR_REVIEW_STATUS_TITLES: Record<(typeof DUA_DHIKR_REVIEW_STATUS_VALUES)[number], string> = {
  sourced: "Sourced",
  "scholarly-review": "Scholarly Review",
  "editorial-review": "Editorial Review",
  approved: "Approved",
  published: "Published",
};

const DUA_DHIKR_TIMING_LABEL_VALUES = [
  "morning-only",
  "evening-only",
  "morning-and-evening",
  "not-time-specific",
] as const;

export const duaDhikrEntry = defineType({
  name: "duaDhikrEntry",
  title: "Duʿa & Dhikr Entry",
  type: "document",
  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "arabicSourceText", title: "Arabic Source Text" },
    { name: "supportingTranslations", title: "Supporting Translations" },
    { name: "guidance", title: "Guidance" },
    { name: "sourcesAndAuthenticity", title: "Sources and Authenticity" },
    { name: "media", title: "Audio & Sharing" },
    { name: "scholarlyReview", title: "Scholarly Review" },
    { name: "editorialReview", title: "Editorial Review" },
    { name: "importGroup", title: "Import & Provenance" },
  ],
  fields: [
    defineField({
      name: "internalTitle",
      title: "Internal Title",
      type: "string",
      description: "Working title for Studio lists only — never displayed publicly.",
      group: "identity",
      validation: (rule) => rule.required().max(96),
    }),
    defineField({
      name: "titleEn",
      title: "Public Title (English)",
      type: "string",
      group: "identity",
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: "titleDa",
      title: "Public Title (Dansk)",
      type: "string",
      group: "identity",
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "Public URL segment, only required once reviewStatus reaches \"published\". A public entry-detail route may not exist for every collection yet — see docs/dua-dhikr/INFORMATION_ARCHITECTURE.md.",
      group: "identity",
      options: { source: "titleEn", maxLength: 96, isUnique: isUniqueDhikrSlug },
      validation: (rule) => rule.custom(requiredWhenDhikrPublished("A slug is required before publishing.")),
    }),
    defineField({
      name: "collections",
      title: "Collections",
      type: "array",
      of: [{ type: "reference", to: [{ type: "duaDhikrCollection" }] }],
      description: "Which collection(s) this entry belongs to. Selecting a collection does not itself make the entry public.",
      group: "identity",
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "subcategorySlugs",
      title: "Subcategories",
      type: "array",
      of: [{ type: "string" }],
      description: "Subcategory slugs from the referenced collection(s) (e.g. \"entering-home\"), for filtering only.",
      options: { layout: "tags" },
      group: "identity",
    }),
    defineField({
      name: "order",
      title: "Sort Order",
      type: "number",
      description: "Position within its collection.",
      group: "identity",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
      group: "identity",
    }),
    defineField({
      name: "whatItIsFor",
      title: "What This Is For",
      type: "text",
      rows: 2,
      description: "One or two plain-language sentences describing the situation/occasion this entry addresses.",
      group: "identity",
      validation: (rule) => rule.max(240),
    }),
    defineField({
      name: "occasion",
      title: "Occasion / Situation Tags",
      type: "array",
      of: [{ type: "string" }],
      description: "Free-text situation tags used by \"What do you need a duʿa for?\" discovery (e.g. \"beginning my day\", \"travelling\").",
      options: { layout: "tags" },
      group: "identity",
    }),
    defineField({
      name: "searchAliases",
      title: "Search Aliases",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      group: "identity",
    }),
    defineField({
      name: "arabicText",
      title: "Arabic Text",
      type: "text",
      description: "Authoritative source text. Full tashkīl required — see docs/dhikr/28-arabic-typography-standard.md, which this type also follows.",
      group: "arabicSourceText",
      validation: (rule) => rule.custom(requiredWhenDhikrPublished("Arabic text is required before publishing.")),
    }),
    defineField({
      name: "transliteration",
      title: "Transliteration",
      type: "text",
      group: "arabicSourceText",
    }),
    defineField({
      name: "translationEn",
      title: "Translation (English)",
      type: "text",
      group: "supportingTranslations",
      validation: (rule) =>
        rule.custom(requiredWhenDhikrPublished("English translation is required before publishing.")),
    }),
    defineField({
      name: "translationDa",
      title: "Translation (Dansk)",
      type: "text",
      group: "supportingTranslations",
      validation: (rule) =>
        rule.custom(requiredWhenDhikrPublished("Danish translation is required before publishing.")),
    }),
    defineField({
      name: "recommendedRepetitions",
      title: "Repetition Count",
      type: "number",
      description: "Must be sourced, not assumed. Leave empty rather than guessing — see docs/dua-dhikr/SOURCE_POLICY.md.",
      group: "guidance",
    }),
    defineField({
      name: "timingLabel",
      title: "Timing",
      type: "string",
      options: {
        list: DUA_DHIKR_TIMING_LABEL_VALUES.map((value) => ({
          title: value.replace(/-/g, " "),
          value,
        })),
      },
      group: "guidance",
    }),
    defineField({
      name: "instructionText",
      title: "Instruction",
      type: "text",
      rows: 3,
      description: "Practical how-to guidance (e.g. posture, hand position) distinct from virtue/explanation.",
      group: "guidance",
    }),
    defineField({
      name: "virtueText",
      title: "Virtue / Reward Text",
      type: "text",
      description: "Only populated where a reviewer has confirmed a genuinely supported claim. Always optional.",
      group: "guidance",
    }),
    defineField({
      name: "explanationText",
      title: "Explanation",
      type: "text",
      rows: 4,
      description: "Longer editorial explanation of context/meaning. Shown in an expandable section, never hidden behind an accordion together with the Arabic or primary translation.",
      group: "guidance",
    }),
    defineField({
      name: "sourceReferences",
      title: "Source References",
      type: "array",
      of: [{ type: "sourceReference" }],
      description: "At least one is required before publishing. Encodes Qurʾān/hadith reference, source URL, source type, hadith collection/number, and grading.",
      group: "sourcesAndAuthenticity",
      validation: (rule) => rule.custom(requiredDhikrSourceReferences),
    }),
    defineField({
      name: "authenticationNote",
      title: "Authentication Note",
      type: "text",
      rows: 2,
      description: "Free-text elaboration beyond each source reference's own grading (e.g. a noted scholarly disagreement).",
      group: "sourcesAndAuthenticity",
    }),
    defineField({
      name: "relatedEntries",
      title: "Related Entries",
      type: "array",
      of: [{ type: "reference", to: [{ type: "duaDhikrEntry" }] }],
      group: "sourcesAndAuthenticity",
    }),
    defineField({
      name: "audioAsset",
      title: "Audio Asset",
      type: "reference",
      to: [{ type: "audioAsset" }],
      description: "Optional recitation audio. Never autoplayed; the control is hidden entirely when unset.",
      group: "media",
    }),
    defineField({
      name: "reviewStatus",
      title: "Review Status",
      type: "string",
      description:
        "The current pipeline stage. \"published\" alone is not sufficient for public exposure — see src/sanity/lib/dua-dhikr-publication-gate.ts for the full canonical rule.",
      options: {
        list: DUA_DHIKR_REVIEW_STATUS_VALUES.map((value) => ({
          title: DUA_DHIKR_REVIEW_STATUS_TITLES[value],
          value,
        })),
      },
      initialValue: "sourced",
      group: ["scholarlyReview", "editorialReview"],
      validation: (rule) =>
        rule.required().custom((value) => {
          if (
            value !== undefined &&
            !(DUA_DHIKR_REVIEW_STATUS_VALUES as readonly string[]).includes(value as string)
          ) {
            return `reviewStatus must be one of: ${DUA_DHIKR_REVIEW_STATUS_VALUES.join(", ")}`;
          }
          return true;
        }),
    }),
    defineField({
      name: "boardApprovals",
      title: "Board Approvals",
      type: "array",
      of: [{ type: "boardApproval" }],
      description: "Both a scholarly and an editorial approval are required, independently, before the canonical (non-bypass) publication pathway applies.",
      group: "scholarlyReview",
      validation: (rule) => rule.custom(requiredDhikrBoardApprovals),
    }),
    defineField({
      name: "editorialPublicationStatus",
      title: "Editorial Publication Status",
      type: "string",
      description:
        "The temporary, reversible scholarly-review bypass for this Duʿa & Dhikr expansion phase only — see docs/dua-dhikr/REVIEW_BYPASS.md. A separate, additive pathway from reviewStatus/boardApprovals above; never weakens the canonical gate. Public display must always show a neutral \"scholarly review pending\" note, never a claim of scholarly approval.",
      options: {
        list: [
          { title: "(not published via this pathway)", value: "" },
          { title: "Editorial only — scholarly review pending", value: "editorial-only-scholarly-review-pending" },
        ],
      },
      initialValue: "",
      group: "editorialReview",
    }),
    defineField({
      name: "editorialNotes",
      title: "Editorial Notes (Internal)",
      type: "text",
      rows: 3,
      description: "Internal only. Never projected into any public query.",
      group: "editorialReview",
    }),
    defineField({
      name: "importIdentifier",
      title: "Import Identifier",
      type: "string",
      description: "Stable identifier of the row in the source content document this entry was imported from — see docs/dua-dhikr/CONTENT_IMPORT_GUIDE.md. Set once at import time.",
      readOnly: true,
      group: "importGroup",
    }),
    defineField({
      name: "contentProvenance",
      title: "Content Provenance",
      type: "provenanceNote",
      description: "Internal sourcing/import narrative — never displayed publicly.",
      group: "importGroup",
    }),
    defineField({
      name: "lastReviewedAt",
      title: "Last Reviewed",
      type: "date",
      group: "importGroup",
    }),
  ],
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "titleEn", status: "reviewStatus" },
    prepare({ title, status }) {
      return { title, subtitle: status };
    },
  },
});
