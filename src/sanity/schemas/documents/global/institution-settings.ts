import { defineField, defineType } from "sanity";

export const institutionSettings = defineType({
  name: "institutionSettings",
  title: "Institution Settings",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Institution Name",
      type: "string",
      initialValue: "Sunnah Remedies",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      initialValue: "Institute of Prophetic Medicine",
    }),
    defineField({
      name: "description",
      title: "Institution Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "foundingYear",
      title: "Founding Year",
      type: "string",
      initialValue: "MMXXV",
    }),
    defineField({
      name: "closingStatement",
      title: "Closing Statement",
      type: "string",
      description: "Appears in the footer and institutional contexts.",
      initialValue: "Knowledge before commerce. Service before profit. Trust before growth.",
    }),
    defineField({
      name: "colophon",
      title: "Colophon",
      type: "string",
      description: "The footer closing line.",
      initialValue: "Sunnah Remedies · Est. MMXXV · Healing is from Allah · the remedy is a means",
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
    }),
    defineField({
      name: "contactPhone",
      title: "Contact Phone",
      type: "string",
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "platform", title: "Platform", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "url", title: "URL", type: "url", validation: (rule) => rule.required() }),
          ],
          preview: {
            select: { title: "platform", subtitle: "url" },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Institution Settings" }),
  },
});
