import { defineField, defineType } from "sanity";
import { isUniqueFeelingSlug } from "@/sanity/validation/governance";
import { CANONICAL_FEELING_FAMILY_SLUGS } from "@/lib/feeling/taxonomy";

/**
 * "I am feeling…" Family — one of the six grouping headings on the
 * /i-am-feeling landing page (see docs/i-am-feeling/SPEC.md §4).
 *
 * Structural in the same sense as duaDhikrCollection: the family/state
 * structure itself is fixed, curated code in src/lib/feeling/taxonomy.ts —
 * NOT read from Sanity. This document is optional, additive editorial
 * enrichment (a short description) layered on top of that fixed structure,
 * never a replacement for it. `slug` is constrained to
 * CANONICAL_FEELING_FAMILY_SLUGS so an editor cannot create a second,
 * competing family document for a family that already exists.
 *
 * @see docs/i-am-feeling/SPEC.md
 */
export const feelingFamily = defineType({
  name: "feelingFamily",
  title: "I am feeling… — Family",
  type: "document",
  fields: [
    defineField({
      name: "internalTitle",
      title: "Internal Title",
      type: "string",
      description: "Working title for Studio lists only — never displayed publicly.",
      validation: (rule) => rule.required().max(96),
    }),
    defineField({
      name: "titleEn",
      title: "Title (English)",
      type: "string",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "titleDa",
      title: "Title (Dansk)",
      type: "string",
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Must match a canonical family key from src/lib/feeling/taxonomy.ts.",
      options: { source: "titleEn", maxLength: 64, isUnique: isUniqueFeelingSlug },
      validation: (rule) =>
        rule
          .required()
          .custom((value) => {
            const current = (value as { current?: string } | undefined)?.current;
            if (current && !(CANONICAL_FEELING_FAMILY_SLUGS as readonly string[]).includes(current)) {
              return `"${current}" is not a canonical family slug. Add it to src/lib/feeling/taxonomy.ts first.`;
            }
            return true;
          }),
    }),
    defineField({
      name: "descriptionEn",
      title: "Description (English)",
      type: "text",
      rows: 2,
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: "descriptionDa",
      title: "Description (Dansk)",
      type: "text",
      rows: 2,
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "titleEn", slug: "slug.current" },
    prepare({ title, slug }) {
      return { title, subtitle: slug ? `/${slug}` : undefined };
    },
  },
});
