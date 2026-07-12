import { defineField, defineType } from "sanity";

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
