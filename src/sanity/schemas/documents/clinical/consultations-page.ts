import { defineField, defineType } from "sanity";

export const consultationsPage = defineType({
  name: "consultationsPage",
  title: "Consultations Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      initialValue: "Clinical Consultations",
    }),
    defineField({
      name: "statement",
      title: "Hero Statement",
      type: "string",
    }),
    defineField({
      name: "qualifier",
      title: "Hero Qualifier",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "introduction",
      title: "Introduction",
      type: "array",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "consultationTypes",
      title: "Consultation Types",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required() }),
          defineField({ name: "description", title: "Description", type: "text" }),
          defineField({ name: "duration", title: "Duration", type: "string" }),
          defineField({ name: "fee", title: "Fee", type: "string" }),
          defineField({ name: "availability", title: "Availability", type: "string" }),
        ],
        preview: { select: { title: "name", subtitle: "fee" } },
      }],
    }),
    defineField({
      name: "practitioners",
      title: "Practitioners",
      type: "array",
      of: [{ type: "reference", to: [{ type: "faculty" }] }],
    }),
    defineField({
      name: "patientInformation",
      title: "Patient Information",
      type: "array",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "bookingInformation",
      title: "Booking Information",
      type: "array",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "policies",
      title: "Policies",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
          defineField({ name: "body", title: "Body", type: "array", of: [{ type: "text" }] }),
        ],
        preview: { select: { title: "title" } },
      }],
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "question", title: "Question", type: "string", validation: (rule) => rule.required() }),
          defineField({ name: "answer", title: "Answer", type: "text", validation: (rule) => rule.required() }),
        ],
        preview: { select: { title: "question" } },
      }],
    }),
    defineField({ name: "downloads", title: "Downloads", type: "array", of: [{ type: "downloadFile" }] }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  preview: {
    prepare: () => ({ title: "Consultations Page" }),
  },
});
