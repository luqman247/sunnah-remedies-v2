import { defineField, defineType } from "sanity";

export const ingredient = defineType({
  name: "ingredient",
  title: "Ingredient",
  type: "document",
  groups: [
    { name: "overview", title: "Overview", default: true },
    { name: "scholarship", title: "Scholarship" },
    { name: "clinical", title: "Clinical" },
    { name: "connections", title: "Connections" },
    { name: "media", title: "Media" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      group: "overview",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "overview",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "botanicalName",
      title: "Botanical Name",
      type: "string",
      group: "overview",
    }),
    defineField({
      name: "arabicName",
      title: "Arabic Name",
      type: "string",
      group: "overview",
    }),
    defineField({
      name: "transliteration",
      title: "Transliteration",
      type: "string",
      group: "overview",
      description: "Consistent house transliteration.",
    }),
    defineField({
      name: "family",
      title: "Botanical Family",
      type: "string",
      group: "overview",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      group: "overview",
      rows: 4,
    }),
    defineField({
      name: "overview",
      title: "Overview",
      type: "array",
      group: "overview",
      of: [{ type: "block" }],
      description: "Introduction to this ingredient.",
    }),
    defineField({
      name: "history",
      title: "History",
      type: "array",
      group: "overview",
      of: [{ type: "block" }],
      description: "Ingredient history narrative.",
    }),
    defineField({
      name: "traditionalUses",
      title: "Traditional Uses",
      type: "array",
      group: "overview",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "propheticBasis",
      title: "Prophetic Basis",
      type: "text",
      group: "overview",
      description: "Referenced in Prophetic medicine? Citation and context.",
    }),
    defineField({
      name: "preparation",
      title: "Traditional Preparation",
      type: "array",
      group: "overview",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "contraindications",
      title: "Contraindications",
      type: "array",
      group: "overview",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "interactions",
      title: "Known Interactions",
      type: "array",
      group: "overview",
      of: [{ type: "text" }],
    }),

    // ── Scholarship (Phase 4 Commerce) ──
    defineField({
      name: "traditionLayers",
      title: "Tradition Layers",
      type: "traditionLayers",
      group: "scholarship",
      description: "Four-layer honesty framework for this ingredient.",
    }),
    defineField({
      name: "sources",
      title: "Sources",
      type: "array",
      group: "scholarship",
      of: [{ type: "sourceReference" }],
      description: "Citations backing claims about this ingredient.",
    }),

    // ── Clinical (Phase 4 Commerce) ──
    defineField({
      name: "clinicalNotes",
      title: "Clinical Notes",
      type: "array",
      group: "clinical",
      of: [{ type: "productClinicalNote" }],
      description: "Safety/therapeutic notes with review workflow.",
    }),

    // ── Connections (Phase 4 Commerce) ──
    defineField({
      name: "relatedProducts",
      title: "Related Products",
      type: "array",
      group: "connections",
      of: [{ type: "reference", to: [{ type: "product" }] }],
      description: "Products featuring this ingredient.",
    }),
    defineField({
      name: "relatedArticles",
      title: "Related Articles",
      type: "array",
      group: "connections",
      of: [{ type: "reference", to: [{ type: "article" }] }],
    }),
    defineField({
      name: "relatedCourses",
      title: "Related Courses",
      type: "array",
      group: "connections",
      of: [{ type: "reference", to: [{ type: "programme" }] }],
    }),
    defineField({
      name: "relatedJourneys",
      title: "Related Journeys",
      type: "array",
      group: "connections",
      of: [{ type: "reference", to: [{ type: "journey" }] }],
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      group: "connections",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "question", title: "Question", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "answer", title: "Answer", type: "array", of: [{ type: "block" }], validation: (rule) => rule.required() }),
            defineField({ name: "order", title: "Order", type: "number" }),
          ],
          preview: { select: { title: "question" } },
        },
      ],
    }),

    // ── Media ──
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      group: "media",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt Text", type: "string" }),
        defineField({ name: "cloudinaryAssetId", title: "Cloudinary Asset ID", type: "string", hidden: true }),
      ],
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      group: "media",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt Text", type: "string" }),
            defineField({ name: "cloudinaryAssetId", title: "Cloudinary Asset ID", type: "string", hidden: true }),
          ],
        },
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "overview",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "botanicalName", media: "image" },
  },
});
