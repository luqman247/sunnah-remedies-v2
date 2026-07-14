import { defineField, defineType } from "sanity";
import { isUniqueDhikrSlug } from "@/sanity/validation/governance";

/**
 * Dhikr Category — organisational grouping only (e.g. Morning, Evening).
 *
 * Deliberately has no reviewStatus/publication workflow of its own: category
 * labels are structural, not religious content (see docs/dhikr/05). Categories
 * are exposed only through the internal-preview path in this phase; no public
 * category query exists yet (see docs/dhikr/12-sanity-integration-plan.md).
 *
 * @see docs/dhikr/04-dhikr-content-schema.md
 */
export const dhikrCategory = defineType({
  name: "dhikrCategory",
  title: "Dhikr Category",
  type: "document",
  fields: [
    defineField({
      name: "nameEn",
      title: "Name (English)",
      type: "string",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "nameDa",
      title: "Name (Dansk)",
      type: "string",
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "Public URL segment for this category. Optional while this prototype has no reviewed content — dhikrCategory has no reviewStatus of its own (see docs/dhikr/12-sanity-integration-plan.md), so a category only becomes publicly reachable once it contains at least one publicly eligible dhikrItem (see src/sanity/lib/dhikr-publication-gate.ts); setting a slug alone does not expose it.",
      options: {
        source: "nameEn",
        maxLength: 96,
        isUnique: isUniqueDhikrSlug,
      },
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Display order, mirrors departmentCard.order",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      description:
        "Editorial framing only — must not assert any reward/virtue claim. See docs/dhikr/03-authenticity-and-scholarly-review-policy.md.",
    }),
  ],
  orderings: [
    { title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "nameEn", order: "order" },
    prepare({ title, order }) {
      return { title: `${order}. ${title}` };
    },
  },
});
