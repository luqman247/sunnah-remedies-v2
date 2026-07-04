import { defineField, defineType } from "sanity";

/**
 * Condition entity — a health condition addressable by the tradition.
 */
export const condition = defineType({
  name: "condition",
  title: "Condition",
  type: "document",
  groups: [
    { name: "overview", title: "Overview", default: true },
    { name: "knowledge", title: "Knowledge Graph" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "name", title: "Name", type: "string", group: "overview", validation: (r) => r.required() }),
    defineField({ name: "nameAr", title: "Arabic Name", type: "string", group: "overview" }),
    defineField({ name: "slug", title: "Slug", type: "slug", group: "overview", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "aliases", title: "Aliases", type: "array", group: "overview", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({ name: "definition", title: "One-line Definition", type: "string", group: "overview", description: "Concise definition for AI/snippet surfaces." }),
    defineField({ name: "description", title: "Description", type: "text", group: "overview", rows: 4 }),
    defineField({ name: "body", title: "Full Content", type: "array", group: "overview", of: [{ type: "block" }] }),
    defineField({ name: "mainImage", title: "Main Image", type: "image", group: "overview", options: { hotspot: true } }),
    defineField({ name: "symptoms", title: "Signs & Symptoms", type: "array", group: "overview", of: [{ type: "string" }] }),
    defineField({ name: "bodySystem", title: "Body System", type: "reference", group: "knowledge", to: [{ type: "bodySystem" }] }),
    defineField({ name: "relationships", title: "Relationships", type: "array", group: "knowledge", of: [{ type: "relationship" }] }),
    defineField({ name: "faqs", title: "FAQs", type: "array", group: "knowledge", of: [{ type: "object", fields: [
      defineField({ name: "question", type: "string", title: "Question" }),
      defineField({ name: "answer", type: "text", title: "Answer" }),
    ] }] }),
    defineField({ name: "featuredSnippetAnswer", title: "Featured Snippet Answer", type: "text", group: "seo", rows: 3 }),
    defineField({ name: "author", title: "Author", type: "reference", group: "knowledge", to: [{ type: "faculty" }] }),
    defineField({ name: "reviewer", title: "Reviewer", type: "reference", group: "knowledge", to: [{ type: "faculty" }] }),
    defineField({ name: "reviewDate", title: "Review Date", type: "date", group: "knowledge" }),
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { title: "name", media: "mainImage" },
  },
});

/**
 * Body System entity — anatomical/physiological system.
 */
export const bodySystem = defineType({
  name: "bodySystem",
  title: "Body System",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "mainImage", title: "Main Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: {
    select: { title: "name", media: "mainImage" },
  },
});
