import { defineField, defineType } from "sanity";

export const practitionerResource = defineType({
  name: "practitionerResource",
  title: "Practitioner Resource",
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
      name: "resourceType",
      title: "Resource Type",
      type: "string",
      options: {
        list: [
          { title: "Download", value: "download" },
          { title: "Template", value: "template" },
          { title: "Patient Resource", value: "patient-resource" },
          { title: "Case Study", value: "case-study" },
          { title: "Treatment Guide", value: "treatment-guide" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "downloadFile",
      title: "File",
      type: "downloadFile",
    }),
    defineField({
      name: "version",
      title: "Version",
      type: "string",
    }),
    defineField({
      name: "reviewStatus",
      title: "Review Status",
      type: "string",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Approved", value: "approved" },
        ],
      },
      initialValue: "draft",
    }),
    defineField({
      name: "reviewedBy",
      title: "Reviewed By",
      type: "reference",
      to: [{ type: "faculty" }],
    }),
    defineField({
      name: "reviewedAt",
      title: "Reviewed At",
      type: "datetime",
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
    select: { title: "title", subtitle: "resourceType" },
  },
});
