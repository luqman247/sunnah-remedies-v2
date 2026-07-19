import { defineField, defineType } from "sanity";
import {
  isUniqueFeelingSlug,
  requiredWhenFeelingPublished,
  requiredFeelingProfessionalSupportNote,
  requiredFeelingClinicalApproval,
} from "@/sanity/validation/governance";
import { CANONICAL_FEELING_STATE_SLUGS } from "@/lib/feeling/taxonomy";
import { hasApprovedFeelingBoard } from "@/sanity/lib/feeling-publication-gate";

const FEELING_TONE_VALUES = ["heavy", "unsettled", "intense", "distant", "open", "transitional"] as const;

const FEELING_LAUNCH_STATUS_VALUES = ["launch", "deferred", "not-suitable"] as const;

const FEELING_SAFEGUARDING_LEVEL_VALUES = ["standard", "heightened", "crisis-adjacent"] as const;

const FEELING_REVIEW_STATUS_VALUES = ["sourced", "editorial-review", "approved", "published"] as const;

/**
 * "I am feeling…" Feeling State — the curatorial document behind one
 * /i-am-feeling/[feelingSlug] page (see docs/i-am-feeling/SPEC.md §5, §6).
 *
 * Curates and references existing duaDhikrEntry content — never duplicates
 * arabicText, transliteration, translationEn/Da, sourceReferences,
 * authenticationNote, virtueText, explanationText, audioAsset, or
 * reviewStatus, all of which remain owned exclusively by duaDhikrEntry. A
 * correction to a featured entry propagates to every feeling page
 * referencing it automatically, because nothing here is copied.
 *
 * Deliberately independent of dua-dhikr-publication-gate.ts's own review
 * pipeline: this document's reviewStatus/boardApprovals govern only its OWN
 * curatorial copy (introduction, reflection, practical step) and whether
 * this page exists publicly at all — never whether a featured entry itself
 * is eligible (that is decided independently by
 * isDuaDhikrEntryPubliclyEligibleForLocale, imported unchanged).
 *
 * @see docs/i-am-feeling/SPEC.md
 */
export const feelingState = defineType({
  name: "feelingState",
  title: "I am feeling… — Feeling State",
  type: "document",
  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "content", title: "Content" },
    { name: "featured", title: "Featured Duʿās" },
    { name: "related", title: "Related" },
    { name: "safeguarding", title: "Safeguarding & Review" },
    { name: "seoGroup", title: "SEO" },
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
      name: "labelEn",
      title: "Public Label (English)",
      type: "string",
      description: 'e.g. "Anxious or Worried" — this is the page heading.',
      group: "identity",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "labelDa",
      title: "Public Label (Dansk)",
      type: "string",
      group: "identity",
      validation: (rule) =>
        rule.max(60).custom(requiredWhenFeelingPublished("A Danish label is required before this state's Danish page can publish.")),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Must match a canonical feeling-state slug from src/lib/feeling/taxonomy.ts.",
      group: "identity",
      options: { source: "labelEn", maxLength: 64, isUnique: isUniqueFeelingSlug },
      validation: (rule) =>
        rule
          .required()
          .custom((value) => {
            const current = (value as { current?: string } | undefined)?.current;
            if (current && !(CANONICAL_FEELING_STATE_SLUGS as readonly string[]).includes(current)) {
              return `"${current}" is not a canonical feeling-state slug. Add it to src/lib/feeling/taxonomy.ts first.`;
            }
            return true;
          }),
    }),
    defineField({
      name: "family",
      title: "Family",
      type: "reference",
      to: [{ type: "feelingFamily" }],
      group: "identity",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "oneLineDescriptionEn",
      title: "One-line Description (English)",
      type: "string",
      description: "Card copy on the landing page.",
      group: "identity",
      validation: (rule) => rule.required().max(140),
    }),
    defineField({
      name: "oneLineDescriptionDa",
      title: "One-line Description (Dansk)",
      type: "string",
      group: "identity",
      validation: (rule) =>
        rule.max(140).custom(requiredWhenFeelingPublished("A Danish one-line description is required before this state's Danish page can publish.")),
    }),
    defineField({
      name: "tone",
      title: "Tone",
      type: "string",
      description: "Drives restrained motion/copy-register variation only — never colour (SPEC §10).",
      group: "identity",
      options: { list: FEELING_TONE_VALUES.map((v) => ({ title: v, value: v })) },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "launchStatus",
      title: "Launch Status",
      type: "string",
      description:
        '"deferred" means architected but intentionally not yet public (e.g. pending scholarly review) — never means excluded. Only "launch" states receive a generateStaticParams route.',
      group: "identity",
      options: {
        list: [
          { title: "Launch", value: "launch" },
          { title: "Deferred (architected, not yet public)", value: "deferred" },
          { title: "Not suitable for a public tile", value: "not-suitable" },
        ],
      },
      initialValue: "deferred",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "safeguardingLevel",
      title: "Safeguarding Level",
      type: "string",
      description:
        '"heightened" requires an approved "clinical" board approval and a professional-support note before this state can publish. "crisis-adjacent" additionally requires a "standards-council" approval — no launch state uses it (SPEC §6).',
      group: "safeguarding",
      options: { list: FEELING_SAFEGUARDING_LEVEL_VALUES.map((v) => ({ title: v, value: v })) },
      initialValue: "standard",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featuredEntries",
      title: "Featured Duʿās",
      type: "array",
      description: "At least one is required before publishing. Reuse an existing duaDhikrEntry wherever one already exists (SPEC §7.4) — never duplicate Arabic text.",
      group: "featured",
      of: [
        {
          type: "object",
          name: "featuredFeelingEntry",
          fields: [
            defineField({
              name: "entry",
              title: "Duʿā & Dhikr Entry",
              type: "reference",
              to: [{ type: "duaDhikrEntry" }],
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "reflectionEn",
              title: "Reflection for this feeling (English)",
              type: "text",
              rows: 3,
              description: "Interpretive framing specific to this feeling — kept separate from the entry's own explanationText so the same entry can carry a different reflection elsewhere.",
            }),
            defineField({
              name: "reflectionDa",
              title: "Reflection for this feeling (Dansk)",
              type: "text",
              rows: 3,
            }),
          ],
          preview: {
            select: { title: "entry.titleEn" },
            prepare({ title }) {
              return { title: title || "Untitled entry" };
            },
          },
        },
      ],
      validation: (rule) =>
        rule.custom((value, context) => {
          const document = context.document as Record<string, unknown> | undefined;
          const reviewStatus = document?.reviewStatus as string | undefined;
          if (reviewStatus === "published" && (!Array.isArray(value) || value.length === 0)) {
            return "At least one featured duʿā is required before publishing.";
          }
          return true;
        }),
    }),
    defineField({
      name: "relatedFeelingStates",
      title: "Related Feeling States",
      type: "array",
      group: "related",
      of: [{ type: "reference", to: [{ type: "feelingState" }] }],
    }),
    defineField({
      name: "relatedCollectionsOverride",
      title: "Related Collections (override)",
      type: "array",
      description: "Optional. When empty, the detail page derives related collections from the featured entries' own collections automatically.",
      group: "related",
      of: [{ type: "reference", to: [{ type: "duaDhikrCollection" }] }],
    }),
    defineField({
      name: "introductionEn",
      title: "Introduction (English)",
      type: "text",
      rows: 4,
      group: "content",
      validation: (rule) => rule.custom(requiredWhenFeelingPublished("An English introduction is required before publishing.")),
    }),
    defineField({
      name: "introductionDa",
      title: "Introduction (Dansk)",
      type: "text",
      rows: 4,
      group: "content",
      validation: (rule) => rule.custom(requiredWhenFeelingPublished("A Danish introduction is required before this state's Danish page can publish.")),
    }),
    defineField({
      name: "groundingMomentEn",
      title: "Grounding Moment (English, optional)",
      type: "text",
      rows: 2,
      description: "A single short instruction requiring no reading beyond the page itself. Omitted from the page entirely when empty.",
      group: "content",
    }),
    defineField({
      name: "groundingMomentDa",
      title: "Grounding Moment (Dansk, optional)",
      type: "text",
      rows: 2,
      group: "content",
    }),
    defineField({
      name: "practicalNextStepEn",
      title: "Practical Next Step (English)",
      type: "text",
      rows: 2,
      description: "One concrete, small, achievable action. Never a guarantee of resolution (SPEC §5 non-guarantee rule).",
      group: "content",
      validation: (rule) => rule.custom(requiredWhenFeelingPublished("An English practical next step is required before publishing.")),
    }),
    defineField({
      name: "practicalNextStepDa",
      title: "Practical Next Step (Dansk)",
      type: "text",
      rows: 2,
      group: "content",
      validation: (rule) => rule.custom(requiredWhenFeelingPublished("A Danish practical next step is required before this state's Danish page can publish.")),
    }),
    defineField({
      name: "professionalSupportNoteEn",
      title: "Professional-support Note (English)",
      type: "text",
      rows: 3,
      description: "Required when Safeguarding Level is not \"standard\". Draw wording from the reviewed message pool — never freely improvise per document (SPEC §6).",
      group: "safeguarding",
      validation: (rule) => rule.custom(requiredFeelingProfessionalSupportNote),
    }),
    defineField({
      name: "professionalSupportNoteDa",
      title: "Professional-support Note (Dansk)",
      type: "text",
      rows: 3,
      group: "safeguarding",
      validation: (rule) => rule.custom(requiredFeelingProfessionalSupportNote),
    }),
    defineField({
      name: "featuredOrder",
      title: "Featured Order (optional)",
      type: "number",
      description: "Position within the landing page's 'Where visitors begin' section. States without a value appear only in their family grid. Editorial judgement only — never set from click-through data (SPEC §3.3, §7.6).",
      group: "identity",
    }),
    defineField({
      name: "seo",
      title: "SEO & Social",
      type: "seo",
      group: "seoGroup",
    }),
    defineField({
      name: "reviewStatus",
      title: "Review Status",
      type: "string",
      description: 'Gates this state\'s own curatorial copy and whether the page publishes at all — never whether a featured entry itself is eligible.',
      group: "safeguarding",
      options: { list: FEELING_REVIEW_STATUS_VALUES.map((v) => ({ title: v, value: v })) },
      initialValue: "sourced",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "boardApprovals",
      title: "Board Approvals",
      type: "array",
      description: 'An approved "clinical" board approval is required before publishing when Safeguarding Level is not "standard".',
      group: "safeguarding",
      of: [{ type: "boardApproval" }],
      validation: (rule) => rule.custom(requiredFeelingClinicalApproval),
    }),
    defineField({
      name: "lastReviewedAt",
      title: "Last Reviewed",
      type: "date",
      group: "safeguarding",
    }),
  ],
  preview: {
    select: {
      title: "labelEn",
      launchStatus: "launchStatus",
      safeguardingLevel: "safeguardingLevel",
      reviewStatus: "reviewStatus",
      boardApprovals: "boardApprovals",
    },
    prepare({ title, launchStatus, safeguardingLevel, reviewStatus, boardApprovals }) {
      const clinicalApproved = hasApprovedFeelingBoard(boardApprovals, "clinical");
      const safeguardingNote =
        safeguardingLevel && safeguardingLevel !== "standard"
          ? ` · ${safeguardingLevel}${clinicalApproved ? " ✓clinical" : " ⚠no clinical approval"}`
          : "";
      return {
        title,
        subtitle: `${launchStatus} · ${reviewStatus}${safeguardingNote}`,
      };
    },
  },
});
