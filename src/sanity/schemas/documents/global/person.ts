import { defineType, defineField } from "sanity";

export default defineType({
  name: "person",
  title: "Person",
  type: "document",
  description: "Faculty, authors, producers, guides — anyone appearing on the site",
  fields: [
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role / Title",
      type: "string",
      description: "e.g. Lead Practitioner, Faculty Member, Author",
    }),
    defineField({
      name: "bioShort",
      title: "Short Biography",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: "bioLong",
      title: "Full Biography",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "portrait",
      title: "Portrait",
      type: "reference",
      to: [{ type: "mediaAsset" }],
      description: "Uses portrait preset (4:5, face-detection gravity)",
    }),
    defineField({
      name: "credentials",
      title: "Credentials",
      type: "array",
      of: [{ type: "string" }],
      description: "Qualifications, certifications, memberships",
    }),
    defineField({
      name: "links",
      title: "Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "url", title: "URL", type: "url" }),
          ],
        },
      ],
    }),
    defineField({
      name: "departments",
      title: "Departments",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "The Apothecary", value: "apothecary" },
          { title: "The Academy", value: "academy" },
          { title: "Sacred Journeys", value: "journeys" },
          { title: "Knowledge Library", value: "library" },
          { title: "Clinical", value: "clinical" },
        ],
      },
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "portrait" },
  },
});
