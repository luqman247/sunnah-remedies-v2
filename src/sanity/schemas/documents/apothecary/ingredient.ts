import { defineField, defineType } from "sanity";

export const ingredient = defineType({
  name: "ingredient",
  title: "Ingredient",
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
      name: "botanicalName",
      title: "Botanical Name",
      type: "string",
    }),
    defineField({
      name: "arabicName",
      title: "Arabic Name",
      type: "string",
    }),
    defineField({
      name: "family",
      title: "Botanical Family",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "traditionalUses",
      title: "Traditional Uses",
      type: "array",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "propheticBasis",
      title: "Prophetic Basis",
      type: "text",
      description: "Referenced in Prophetic medicine? Citation and context.",
    }),
    defineField({
      name: "preparation",
      title: "Traditional Preparation",
      type: "array",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "contraindications",
      title: "Contraindications",
      type: "array",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "interactions",
      title: "Known Interactions",
      type: "array",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt Text", type: "string" }),
        defineField({ name: "cloudinaryAssetId", title: "Cloudinary Asset ID", type: "string", hidden: true }),
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "botanicalName", media: "image" },
  },
});
