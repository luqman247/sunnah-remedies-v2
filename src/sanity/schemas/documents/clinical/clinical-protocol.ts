import { defineField, defineType } from "sanity";

export const clinicalProtocol = defineType({
  name: "clinicalProtocol",
  title: "Clinical Protocol",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "version",
      title: "Version",
      type: "string",
      description: "Semantic version or revision label (e.g. 2.1)",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Hijama / Wet Cupping", value: "hijama" },
          { title: "Infection Control", value: "infection-control" },
          { title: "Patient Assessment", value: "patient-assessment" },
          { title: "Contraindications", value: "contraindications" },
          { title: "Aftercare", value: "aftercare" },
          { title: "General Clinical", value: "general" },
        ],
      },
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "body",
      title: "Protocol Body",
      type: "array",
      of: [{ type: "block" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sourceReferences",
      title: "Source References",
      type: "array",
      of: [{ type: "sourceReference" }],
    }),
    defineField({
      name: "reviewStatus",
      title: "Review Status",
      type: "string",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "In Clinical Review", value: "in-clinical-review" },
          { title: "Approved", value: "approved" },
        ],
      },
      initialValue: "draft",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "reviewedBy",
      title: "Last Reviewed By",
      type: "reference",
      to: [{ type: "faculty" }],
      hidden: ({ parent }) => parent?.reviewStatus !== "approved",
    }),
    defineField({
      name: "reviewedAt",
      title: "Last Reviewed At",
      type: "datetime",
      hidden: ({ parent }) => parent?.reviewStatus !== "approved",
    }),
    defineField({
      name: "accessLevel",
      title: "Access Level",
      type: "string",
      options: {
        list: [
          { title: "Practitioner Portal", value: "practitioner" },
          { title: "Faculty Only", value: "faculty" },
        ],
      },
      initialValue: "practitioner",
    }),
    defineField({
      name: "downloadFile",
      title: "Downloadable PDF",
      type: "downloadFile",
    }),
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: {
        list: [
          { title: "English", value: "en" },
          { title: "Danish", value: "da" },
        ],
      },
      initialValue: "en",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "version", status: "reviewStatus" },
    prepare({ title, subtitle, status }) {
      return {
        title,
        subtitle: [subtitle, status].filter(Boolean).join(" · "),
      };
    },
  },
});
