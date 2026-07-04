import { defineField, defineType } from "sanity";

export const collection = defineType({
  name: "collection",
  title: "Collection",
  type: "document",
  groups: [
    { name: "editorial", title: "Editorial", default: true },
    { name: "commerce", title: "Commerce" },
    { name: "curation", title: "Curation" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Collection Name",
      type: "string",
      group: "editorial",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "editorial",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      group: "editorial",
      rows: 3,
    }),
    defineField({
      name: "intro",
      title: "Introduction",
      type: "array",
      group: "editorial",
      of: [{ type: "block" }],
      description: "Narrative framing of the range.",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      group: "editorial",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt Text", type: "string" }),
      ],
    }),
    defineField({
      name: "products",
      title: "Products",
      type: "array",
      group: "editorial",
      of: [{ type: "reference", to: [{ type: "product" }] }],
    }),

    // ── Commerce ──
    defineField({
      name: "shopifyCollectionRef",
      title: "Shopify Collection Reference",
      type: "object",
      group: "commerce",
      description: "Optional link to a Shopify commerce collection for live membership.",
      fields: [
        defineField({
          name: "shopifyCollectionId",
          title: "Shopify Collection ID",
          type: "string",
          validation: (rule) =>
            rule.custom((value) => {
              if (!value) return true;
              if (!/^gid:\/\/shopify\/Collection\/\d+$/.test(value)) {
                return "Must be a valid Shopify Collection GID.";
              }
              return true;
            }),
        }),
        defineField({
          name: "handle",
          title: "Handle",
          type: "string",
        }),
      ],
    }),

    // ── Curation ──
    defineField({
      name: "featuredProducts",
      title: "Featured Products",
      type: "array",
      group: "curation",
      of: [{ type: "reference", to: [{ type: "product" }] }],
      description: "Editorially featured items (curation layered on Shopify membership).",
    }),
    defineField({
      name: "season",
      title: "Season Window",
      type: "seasonWindow",
      group: "curation",
      description: "Editorial time-bounding for seasonal collections.",
    }),
    defineField({
      name: "curationNote",
      title: "Curation Note",
      type: "text",
      group: "curation",
      rows: 3,
      description: "Internal note on the honest logic of the grouping.",
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      group: "editorial",
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

    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "editorial",
    }),
  ],
  preview: {
    select: { title: "name", media: "image" },
  },
});
