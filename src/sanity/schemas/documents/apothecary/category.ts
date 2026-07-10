/**
 * Category — editorial taxonomy for the Apothecary.
 * Not a Shopify commerce fact.
 */

import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  groups: [
    { name: "editorial", title: "Editorial", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Category Name",
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
      description: "Short editorial description of this taxonomy node.",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "description" },
    prepare({ title, subtitle }) {
      return {
        title: title || "Untitled category",
        subtitle:
          typeof subtitle === "string" && subtitle.length > 80
            ? `${subtitle.slice(0, 77)}…`
            : subtitle,
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
