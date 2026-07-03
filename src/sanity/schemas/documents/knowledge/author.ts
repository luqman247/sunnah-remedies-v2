import { defineField, defineType } from "sanity";

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name", maxLength: 96 }, validation: (rule) => rule.required() }),
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "biography", title: "Biography", type: "text", rows: 4 }),
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
  ],
  preview: {
    select: { title: "name", subtitle: "title", media: "portrait" },
  },
});
