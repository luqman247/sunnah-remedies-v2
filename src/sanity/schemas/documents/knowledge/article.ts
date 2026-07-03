import { defineField, defineType } from "sanity";

export const article = defineType({
  name: "article",
  title: "Article",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "metadata", title: "Metadata" },
    { name: "media", title: "Media" },
    { name: "seo", title: "SEO" },
    { name: "editorial", title: "Editorial" },
  ],
  fields: [
    defineField({ name: "title", title: "Title", type: "string", group: "content", validation: (rule) => rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", group: "content", options: { source: "title", maxLength: 96 }, validation: (rule) => rule.required() }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", group: "content", rows: 3, description: "Short summary for listings and search results." }),
    defineField({ name: "body", title: "Body", type: "richContent", group: "content" }),

    // ── Metadata ──
    defineField({ name: "author", title: "Author", type: "reference", group: "metadata", to: [{ type: "author" }, { type: "faculty" }] }),
    defineField({ name: "topics", title: "Topics", type: "array", group: "metadata", of: [{ type: "reference", to: [{ type: "topic" }] }] }),
    defineField({ name: "publishedAt", title: "Published Date", type: "datetime", group: "metadata" }),
    defineField({ name: "readingTime", title: "Reading Time (minutes)", type: "number", group: "metadata" }),
    defineField({
      name: "contentType",
      title: "Content Type",
      type: "string",
      group: "metadata",
      options: {
        list: [
          { title: "Article", value: "article" },
          { title: "Research Paper", value: "research" },
          { title: "Clinical Guide", value: "clinical-guide" },
          { title: "Patient Guide", value: "patient-guide" },
          { title: "Book Review", value: "book-review" },
          { title: "Case Study", value: "case-study" },
          { title: "Classical Source", value: "classical-source" },
        ],
      },
      initialValue: "article",
    }),
    defineField({ name: "featured", title: "Featured", type: "boolean", group: "metadata", initialValue: false }),
    defineField({ name: "relatedArticles", title: "Related Articles", type: "array", group: "metadata", of: [{ type: "reference", to: [{ type: "article" }] }] }),

    // ── Media ──
    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      group: "media",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt Text", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "caption", title: "Caption", type: "string" }),
        defineField({ name: "cloudinaryAssetId", title: "Cloudinary Asset ID", type: "string", hidden: true }),
      ],
    }),
    defineField({ name: "downloads", title: "Downloads", type: "array", group: "media", of: [{ type: "downloadFile" }] }),

    // ── SEO & Editorial ──
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
    defineField({ name: "editorial", title: "Editorial Workflow", type: "editorialWorkflow", group: "editorial" }),
  ],
  preview: {
    select: { title: "title", subtitle: "contentType", media: "mainImage" },
  },
  orderings: [
    { title: "Published Date (Newest)", name: "publishedDesc", by: [{ field: "publishedAt", direction: "desc" }] },
  ],
});
