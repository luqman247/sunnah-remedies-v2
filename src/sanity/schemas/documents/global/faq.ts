import { defineField, defineType } from "sanity";

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
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
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "department",
      title: "Department",
      type: "string",
      options: {
        list: [
          { title: "Apothecary", value: "apothecary" },
          { title: "Academy", value: "academy" },
          { title: "Sacred Journeys", value: "sacred-journeys" },
          { title: "Knowledge Library", value: "knowledge-library" },
          { title: "Clinical", value: "clinical" },
          { title: "General", value: "general" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "orderRank",
      title: "Order",
      type: "number",
      description: "Lower numbers appear first.",
    }),
  ],
  preview: {
    select: { title: "question", subtitle: "department" },
  },
  orderings: [
    {
      title: "Order",
      name: "orderAsc",
      by: [{ field: "orderRank", direction: "asc" }],
    },
  ],
});
