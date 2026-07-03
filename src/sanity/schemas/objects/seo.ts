import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO & Social",
  type: "object",
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      description: "Overrides the default page title for search engines. Keep under 60 characters.",
      validation: (rule) => rule.max(70),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
      description: "Appears in search results. Keep between 120-160 characters.",
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: "canonicalUrl",
      title: "Canonical URL",
      type: "url",
      description: "Set only if this content exists at another URL.",
    }),
    defineField({
      name: "ogImage",
      title: "Social Sharing Image",
      type: "image",
      description: "Recommended: 1200x630px. Falls back to the page hero image.",
      options: { hotspot: true },
    }),
    defineField({
      name: "ogTitle",
      title: "Social Title",
      type: "string",
      description: "Overrides meta title for social platforms.",
    }),
    defineField({
      name: "ogDescription",
      title: "Social Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "keywords",
      title: "Keywords",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "noIndex",
      title: "Hide from Search Engines",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "structuredData",
      title: "Structured Data (JSON-LD)",
      type: "text",
      description: "Advanced: custom JSON-LD for rich search results.",
    }),
  ],
});
