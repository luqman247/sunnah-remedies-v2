import { defineField, defineType } from "sanity";

export const charter = defineType({
  name: "charter",
  title: "Founding Charter",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "The Founding Charter",
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
    }),
    defineField({
      name: "preamble",
      title: "Preamble",
      type: "text",
    }),
    defineField({
      name: "body",
      title: "Charter Body",
      type: "richContent",
    }),
    defineField({
      name: "articles",
      title: "Charter Articles",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "number", title: "Article Number", type: "string" }),
          defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
          defineField({ name: "body", title: "Body", type: "array", of: [{ type: "text" }] }),
        ],
        preview: {
          select: { title: "title", subtitle: "number" },
          prepare: ({ title, subtitle }) => ({ title: `Article ${subtitle}: ${title}` }),
        },
      }],
    }),
    defineField({
      name: "principles",
      title: "Core Principles",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
          defineField({ name: "body", title: "Body", type: "text" }),
        ],
        preview: { select: { title: "title" } },
      }],
    }),
    defineField({
      name: "vision",
      title: "Vision",
      type: "text",
    }),
    defineField({
      name: "mission",
      title: "Mission",
      type: "text",
    }),
    defineField({
      name: "governance",
      title: "Governance",
      type: "array",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "timeline",
      title: "Institutional Timeline",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "year", title: "Year", type: "string" }),
          defineField({ name: "event", title: "Event", type: "string", validation: (rule) => rule.required() }),
        ],
        preview: { select: { title: "event", subtitle: "year" } },
      }],
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: {
    prepare: () => ({ title: "Founding Charter" }),
  },
});
