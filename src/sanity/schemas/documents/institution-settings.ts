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
      name: "descriptor",
      title: "Descriptor",
      type: "string",
      initialValue: "Institute of Prophetic Medicine",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
    }),
    defineField({
      name: "foundingYear",
      title: "Founding Year",
      type: "string",
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
            defineField({ name: "platform", title: "Platform", type: "string" }),
            defineField({ name: "url", title: "URL", type: "url" }),
          ],
        },
      ],
    }),
    defineField({
      name: "globalSeo",
      title: "Global SEO",
      type: "seo",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Institution Settings" }),
  },
});
