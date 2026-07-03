import { defineField, defineType } from "sanity";

export const faculty = defineType({
  name: "faculty",
  title: "Faculty",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title & Qualifications",
      type: "string",
      description: "e.g. 'BSc (Hons), PGDip, MBBCH'",
    }),
    defineField({
      name: "licence",
      title: "Professional Licence",
      type: "string",
    }),
    defineField({
      name: "chain",
      title: "Chain of Transmission (Isnad)",
      type: "string",
    }),
    defineField({
      name: "biography",
      title: "Biography",
      type: "array",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "portrait",
      title: "Portrait",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt Text", type: "string" }),
        defineField({ name: "cloudinaryAssetId", title: "Cloudinary Asset ID", type: "string", hidden: true }),
      ],
    }),
    defineField({
      name: "departments",
      title: "Departments",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Academy", value: "academy" },
          { title: "Clinical", value: "clinical" },
          { title: "Sacred Journeys", value: "sacred-journeys" },
          { title: "Knowledge Library", value: "knowledge-library" },
        ],
      },
    }),
    defineField({
      name: "specialisms",
      title: "Specialisms",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      description: "e.g. 'Lead Faculty', 'Clinical Supervisor'",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "title", media: "portrait" },
  },
});
