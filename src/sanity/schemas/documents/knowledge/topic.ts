import { defineField, defineType } from "sanity";

export const topic = defineType({
  name: "topic",
  title: "Topic",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (rule) => rule.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "lede", title: "Lede", type: "text", rows: 3, description: "Opening paragraph for the topic page." }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "heading", title: "Heading", type: "string", validation: (rule) => rule.required() }),
          defineField({ name: "body", title: "Body", type: "array", of: [{ type: "text" }] }),
        ],
        preview: { select: { title: "heading" } },
      }],
    }),
    defineField({
      name: "related",
      title: "Related Topics",
      type: "array",
      of: [{ type: "reference", to: [{ type: "topic" }] }],
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: {
    select: { title: "title" },
  },
});
