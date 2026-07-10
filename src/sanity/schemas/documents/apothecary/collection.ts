/**
 * Collection — editorial framing for a range.
 * Distinct from Shopify commerce collections (membership is a Shopify fact).
 *
 * @see Phase 4 Part 2, Spec 09 §9.6
 */

import { defineField, defineType } from "sanity";

export const collection = defineType({
  name: "collection",
  title: "Collection",
  type: "document",
  groups: [
    { name: "editorial", title: "Editorial", default: true },
    { name: "commerce", title: "Commerce" },
    { name: "curation", title: "Curation" },
    { name: "seo", title: "SEO" },
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
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "products",
      title: "Products (editorial list)",
      type: "array",
      group: "editorial",
      of: [{ type: "reference", to: [{ type: "product" }] }],
      description:
        "Optional editorial list. Live commerce membership comes from Shopify via the collection reference — do not treat this as the full shop catalogue.",
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      group: "editorial",
      of: [{ type: "faqItem" }],
    }),

    // ── Commerce ──
    defineField({
      name: "shopifyCollectionRef",
      title: "Shopify Collection Reference",
      type: "object",
      group: "commerce",
      description:
        "Optional link to a Shopify commerce collection for live membership. Membership is a Shopify fact.",
      fields: [
        defineField({
          name: "shopifyCollectionId",
          title: "Shopify Collection ID",
          type: "string",
          validation: (rule) =>
            rule.custom((value) => {
              if (!value) return true;
              if (!/^gid:\/\/shopify\/Collection\/\d+$/.test(value)) {
                return "Must be a valid Shopify Collection GID (gid://shopify/Collection/{digits}).";
              }
              return true;
            }),
        }),
        defineField({
          name: "handle",
          title: "Handle",
          type: "string",
          description: "Convenience handle. Collection ID is authoritative.",
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
      description:
        "Editorially featured items (curation layered on Shopify membership).",
      validation: (rule) =>
        rule.max(6).warning("Prefer at most six featured products."),
    }),
    defineField({
      name: "season",
      title: "Season Window",
      type: "seasonWindow",
      group: "curation",
      description:
        "Editorial time-bounding for seasonal collections — never for manufactured urgency.",
    }),
    defineField({
      name: "curationNote",
      title: "Curation Note",
      type: "text",
      group: "curation",
      rows: 3,
      description:
        "Internal note on the honest logic of the grouping (tradition/use — never margin).",
    }),

    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
      shopifyId: "shopifyCollectionRef.shopifyCollectionId",
      seasonal: "season.isSeasonal",
    },
    prepare({ title, media, shopifyId, seasonal }) {
      const linked = typeof shopifyId === "string" && shopifyId.length > 0;
      return {
        title: title || "Untitled collection",
        subtitle: [
          linked ? "Shopify linked" : "Editorial only",
          seasonal ? "Seasonal" : null,
        ]
          .filter(Boolean)
          .join(" · "),
        media,
      };
    },
  },
  orderings: [
    {
      title: "Name",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
  ],
});
