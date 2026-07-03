import { defineType, defineField } from "sanity";

export default defineType({
  name: "departmentCard",
  title: "Department Card",
  type: "document",
  fields: [
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "1-4, drives Roman numeral and reading order",
      validation: (Rule) => Rule.required().min(1).max(4),
    }),
    defineField({
      name: "nameEn",
      title: "Name (English)",
      type: "string",
      validation: (Rule) => Rule.required().max(40),
    }),
    defineField({
      name: "nameAr",
      title: "Name (Arabic)",
      type: "string",
      validation: (Rule) => Rule.required().max(40),
    }),
    defineField({
      name: "standfirst",
      title: "Standfirst",
      type: "text",
      rows: 2,
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: "href",
      title: "Link",
      type: "string",
      description: "Internal path e.g. /the-apothecary",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "plate",
      title: "Plate",
      type: "reference",
      to: [{ type: "mediaAsset" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "size",
      title: "Size",
      type: "string",
      options: {
        list: [
          { title: "Standard", value: "standard" },
          { title: "Feature", value: "feature" },
        ],
      },
      validation: (Rule) => Rule.required(),
      initialValue: "standard",
    }),
  ],
  orderings: [
    { title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "nameEn", order: "order", size: "size" },
    prepare({ title, order, size }) {
      return { title: `${order}. ${title}`, subtitle: size };
    },
  },
});
