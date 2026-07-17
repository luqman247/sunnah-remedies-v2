import { defineField, defineType } from "sanity";
import { isUniqueDhikrSlug } from "@/sanity/validation/governance";
import { PARENT_GROUPS, ICON_KEYS, CANONICAL_COLLECTION_SLUGS } from "@/lib/dua-dhikr/taxonomy";

/**
 * Duʿa & Dhikr Collection — one node in the canonical taxonomy defined in
 * src/lib/dua-dhikr/taxonomy.ts (docs/dua-dhikr/CATEGORY_ALIAS_MAP.md).
 *
 * Structural in the same sense as dhikrCategory (see
 * src/sanity/schemas/documents/dhikr/dhikr-category.ts): a collection with
 * zero eligible duaDhikrEntry documents still renders its structural shell
 * (title, icon, subcategory nav) but its own editorial description/
 * introduction copy is gated by reviewStatus/editorialPublicationStatus
 * below — see docs/dua-dhikr/REVIEW_BYPASS.md for exactly what those two
 * fields do and do not gate.
 *
 * `slug` is constrained to CANONICAL_COLLECTION_SLUGS so an editor cannot
 * accidentally create a second collection for a concept that already has a
 * canonical home under a different name (see docs/dua-dhikr/
 * CATEGORY_ALIAS_MAP.md for the full alias table) — new overlapping terms
 * belong in `searchAliases`, not as a new document.
 *
 * @see docs/dua-dhikr/CONTENT_MODEL.md
 * @see docs/dua-dhikr/INFORMATION_ARCHITECTURE.md
 */
export const duaDhikrCollection = defineType({
  name: "duaDhikrCollection",
  title: "Duʿa & Dhikr Collection",
  type: "document",
  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "copy", title: "Copy" },
    { name: "structure", title: "Structure" },
    { name: "seoGroup", title: "SEO" },
    { name: "review", title: "Review" },
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
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "titleDa",
      title: "Public Title (Dansk)",
      type: "string",
      group: "identity",
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "Must match a canonical collection slug from src/lib/dua-dhikr/taxonomy.ts — this prevents a duplicate collection being created for a concept that already exists under a different name.",
      group: "identity",
      options: {
        source: "titleEn",
        maxLength: 96,
        isUnique: isUniqueDhikrSlug,
      },
      validation: (rule) =>
        rule
          .required()
          .custom((value) => {
            const current = (value as { current?: string } | undefined)?.current;
            if (current && !(CANONICAL_COLLECTION_SLUGS as string[]).includes(current)) {
              return `"${current}" is not a canonical collection slug. Add it to src/lib/dua-dhikr/taxonomy.ts first, or use an existing canonical slug and add this term as a search alias instead.`;
            }
            return true;
          }),
    }),
    defineField({
      name: "parentGroup",
      title: "Parent Group",
      type: "string",
      group: "identity",
      options: {
        list: PARENT_GROUPS.map((g) => ({ title: g.titleEn, value: g.key })),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      group: "identity",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured (Quick Access)",
      type: "boolean",
      description: "Shown in the landing page's Quick Access row.",
      initialValue: false,
      group: "identity",
    }),
    defineField({
      name: "iconKey",
      title: "Icon",
      type: "string",
      description: "Selects an original line icon from src/components/dua-dhikr/icons.tsx.",
      group: "identity",
      options: { list: [...ICON_KEYS] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "visualMotifKey",
      title: "Visual Motif Key",
      type: "string",
      description: "Optional secondary motif identifier for the collection hero (e.g. a subtle background treatment). Free text, matched by convention in the visual system — see docs/dua-dhikr/VISUAL_SYSTEM.md.",
      group: "identity",
    }),
    defineField({
      name: "descriptionEn",
      title: "Short Description (English)",
      type: "text",
      rows: 2,
      description: "Card-length description shown on the landing page and breadcrumb. Editorial framing only — no reward/virtue claim (see docs/dua-dhikr/SOURCE_POLICY.md).",
      group: "copy",
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: "descriptionDa",
      title: "Short Description (Dansk)",
      type: "text",
      rows: 2,
      group: "copy",
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: "introductionEn",
      title: "Collection Introduction (English)",
      type: "text",
      rows: 4,
      description: "Longer introduction shown at the top of the collection page. Gated by Review status below — see docs/dua-dhikr/REVIEW_BYPASS.md.",
      group: "copy",
    }),
    defineField({
      name: "introductionDa",
      title: "Collection Introduction (Dansk)",
      type: "text",
      rows: 4,
      group: "copy",
    }),
    defineField({
      name: "whenReadEn",
      title: "When This Is Read (English)",
      type: "text",
      rows: 2,
      description: "Optional guidance on when this collection is typically recited.",
      group: "copy",
    }),
    defineField({
      name: "whenReadDa",
      title: "When This Is Read (Dansk)",
      type: "text",
      rows: 2,
      group: "copy",
    }),
    defineField({
      name: "searchAliases",
      title: "Search Aliases",
      type: "array",
      of: [{ type: "string" }],
      description: "Additional editorial search terms beyond the canonical aliases already defined in src/lib/dua-dhikr/taxonomy.ts.",
      options: { layout: "tags" },
      group: "structure",
    }),
    defineField({
      name: "subcategories",
      title: "Subcategories",
      type: "array",
      description: "Must mirror the canonical subcategories for this collection's slug in src/lib/dua-dhikr/taxonomy.ts.",
      of: [
        {
          type: "object",
          name: "duaDhikrSubcategory",
          fields: [
            defineField({ name: "slug", title: "Slug", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "titleEn", title: "Title (English)", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "titleDa", title: "Title (Dansk)", type: "string" }),
          ],
          preview: { select: { title: "titleEn", subtitle: "slug" } },
        },
      ],
      group: "structure",
    }),
    defineField({
      name: "relatedCollections",
      title: "Related Collections",
      type: "array",
      of: [{ type: "reference", to: [{ type: "duaDhikrCollection" }] }],
      description: "Shown as \"Related collections\" on the collection page — also used to render umbrella groupings such as Marriage & Children.",
      group: "structure",
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
      description: "Gates this collection's own introductionEn/Da and whenReadEn/Da copy only — never gates whether the collection page itself renders or whether its entries appear (entries gate individually via the Duʿa & Dhikr publication rule). See docs/dua-dhikr/REVIEW_BYPASS.md.",
      options: {
        list: [
          { title: "Sourced", value: "sourced" },
          { title: "Editorial Review", value: "editorial-review" },
          { title: "Approved", value: "approved" },
          { title: "Published", value: "published" },
        ],
      },
      initialValue: "sourced",
      group: "review",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "editorialPublicationStatus",
      title: "Editorial Publication Status",
      type: "string",
      description:
        "The same additive, reversible bypass pathway used on Duʿa & Dhikr entries — see docs/dua-dhikr/REVIEW_BYPASS.md. Never displayed publicly as \"scholarly reviewed\".",
      options: {
        list: [
          { title: "(not published via this pathway)", value: "" },
          { title: "Editorial only — scholarly review pending", value: "editorial-only-scholarly-review-pending" },
        ],
      },
      initialValue: "",
      group: "review",
    }),
    defineField({
      name: "lastReviewedAt",
      title: "Last Reviewed",
      type: "date",
      group: "review",
    }),
  ],
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "titleEn", parentGroup: "parentGroup", slug: "slug.current" },
    prepare({ title, parentGroup, slug }) {
      return { title, subtitle: `${parentGroup} · /${slug}` };
    },
  },
});
