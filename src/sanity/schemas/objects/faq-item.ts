/**
 * FAQ item — reusable Q&A for products, collections, and ingredients.
 *
 * @see Phase 4 Part 2, Spec 09 §9.13
 */

import { defineField, defineType } from "sanity";

export const faqItem = defineType({
  name: "faqItem",
  title: "FAQ Item",
  type: "object",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "array",
      of: [{ type: "block" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Manual ordering within the list.",
    }),
  ],
  preview: {
    select: { title: "question", order: "order" },
    prepare({ title, order }) {
      return {
        title: title || "Untitled question",
        subtitle: typeof order === "number" ? `Order ${order}` : undefined,
      };
    },
  },
});
