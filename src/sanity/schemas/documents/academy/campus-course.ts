import { defineField, defineType } from "sanity";

export const campusCourse = defineType({
  name: "campusCourse",
  title: "Campus Course",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "programme",
      title: "Linked Programme",
      type: "reference",
      to: [{ type: "programme" }],
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "readingList",
      title: "Reading List",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      initialValue: "en",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "subtitle" },
  },
});
