/**
 * Product image — gallery item with institutional role metadata.
 * Prefer selecting from the Media Library; inline upload remains for one-offs.
 */

import { defineField, defineType } from "sanity";

export const productImage = defineType({
  name: "productImage",
  title: "Product Image",
  type: "object",
  fields: [
    defineField({
      name: "libraryAsset",
      title: "From Media Library",
      type: "reference",
      to: [{ type: "mediaAsset" }],
      description:
        "Preferred. Reuse a library asset — do not upload the same binary twice.",
      options: {
        filter: 'status in ["interim", "final"]',
      },
    }),
    defineField({
      name: "image",
      title: "Inline Image",
      type: "image",
      options: { hotspot: true },
      description: "Use only when the asset is not yet in the Media Library.",
      hidden: ({ parent }) => Boolean(parent?.libraryAsset),
    }),
    defineField({
      name: "role",
      title: "Image Role",
      type: "string",
      options: {
        list: [
          { title: "Primary", value: "primary" },
          { title: "Packaging", value: "packaging" },
          { title: "Ingredient", value: "ingredient" },
          { title: "Lifestyle", value: "lifestyle" },
          { title: "Detail", value: "detail" },
          { title: "Editorial", value: "editorial" },
        ],
        layout: "radio",
      },
      initialValue: "editorial",
    }),
    defineField({
      name: "alt",
      title: "Alt Text Override",
      type: "string",
      description: "Optional. Falls back to the library asset alt when empty.",
    }),
    defineField({
      name: "caption",
      title: "Caption Override",
      type: "string",
    }),
    defineField({
      name: "credit",
      title: "Credit Override",
      type: "string",
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
    }),
    defineField({
      name: "backgroundPreference",
      title: "Background Preference",
      type: "string",
      options: {
        list: [
          { title: "Default", value: "default" },
          { title: "Light", value: "light" },
          { title: "Dark", value: "dark" },
          { title: "Neutral", value: "neutral" },
        ],
      },
      initialValue: "default",
    }),
    defineField({
      name: "cloudinaryAssetId",
      title: "Cloudinary Asset ID",
      type: "string",
      hidden: true,
    }),
  ],
  validation: (rule) =>
    rule.custom((value) => {
      const item = value as { libraryAsset?: unknown; image?: unknown } | undefined;
      if (!item?.libraryAsset && !item?.image) {
        return "Select a Media Library asset or upload an inline image.";
      }
      return true;
    }),
  preview: {
    select: {
      title: "alt",
      role: "role",
      media: "image",
      libraryTitle: "libraryAsset.title",
      order: "displayOrder",
    },
    prepare({ title, role, media, libraryTitle, order }) {
      return {
        title: title || libraryTitle || "Untitled image",
        subtitle: [
          role,
          libraryTitle ? "Library" : "Inline",
          typeof order === "number" ? `Order ${order}` : null,
        ]
          .filter(Boolean)
          .join(" · "),
        media,
      };
    },
  },
});
