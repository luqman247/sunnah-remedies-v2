import { defineField, defineType } from "sanity";

export const researchPublication = defineType({
  name: "researchPublication",
  title: "Research Publication",
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
      name: "authors",
      title: "Authors",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "abstract",
      title: "Abstract",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "date",
    }),
    defineField({
      name: "journal",
      title: "Journal / Source",
      type: "string",
    }),
    defineField({
      name: "externalUrl",
      title: "External URL",
      type: "url",
    }),
    defineField({
      name: "downloadFile",
      title: "PDF",
      type: "downloadFile",
    }),
    defineField({
      name: "accessLevel",
      title: "Access Level",
      type: "string",
      options: {
        list: [
          { title: "Practitioner", value: "practitioner" },
          { title: "Researcher", value: "researcher" },
          { title: "Faculty", value: "faculty" },
        ],
      },
      initialValue: "practitioner",
    }),
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      initialValue: "en",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "journal" },
  },
});
