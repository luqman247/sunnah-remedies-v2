/**
 * Certification — laboratory, organic, or institutional certification reference.
 */

import { defineField, defineType } from "sanity";

export const certification = defineType({
  name: "certification",
  title: "Certification",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
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
      name: "issuer",
      title: "Issuer",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "certificateNumber",
      title: "Certificate Number",
      type: "string",
    }),
    defineField({
      name: "validFrom",
      title: "Valid From",
      type: "date",
    }),
    defineField({
      name: "validUntil",
      title: "Valid Until",
      type: "date",
    }),
    defineField({
      name: "document",
      title: "Certificate Document",
      type: "file",
    }),
    defineField({
      name: "badge",
      title: "Badge Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "issuer",
      media: "badge",
    },
  },
});
