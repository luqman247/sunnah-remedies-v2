import { defineType, defineField } from "sanity";

export default defineType({
  name: "mediaAsset",
  title: "Media Asset",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Brief (placeholder)", value: "brief" },
          { title: "Interim (early photography)", value: "interim" },
          { title: "Final (production)", value: "final" },
        ],
      },
      validation: (Rule) => Rule.required(),
      initialValue: "brief",
    }),
    defineField({
      name: "purpose",
      title: "Purpose",
      type: "string",
      description: "Why this image exists",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "composition",
      title: "Composition",
      type: "string",
      description: "Framing direction",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "lens",
      title: "Lens",
      type: "string",
      description: "e.g. 50mm, shallow",
    }),
    defineField({
      name: "lighting",
      title: "Lighting",
      type: "string",
      description: "e.g. single north window, morning",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "grade",
      title: "Grade",
      type: "string",
      description: "Colour grade / mood direction",
    }),
    defineField({
      name: "mood",
      title: "Mood",
      type: "string",
      description: "One word or phrase",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "subject",
      title: "Subject",
      type: "string",
    }),
    defineField({
      name: "props",
      title: "Props",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.status === "brief",
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Editorial caption for final state",
    }),
    defineField({
      name: "alt",
      title: "Alt Text",
      type: "string",
      description: "Required unless decorative",
    }),
    defineField({
      name: "decorative",
      title: "Decorative",
      type: "boolean",
      description: "If true, alt=\"\" (purely atmospheric)",
      initialValue: false,
    }),
    defineField({
      name: "credit",
      title: "Credit",
      type: "string",
    }),

    // ── QC & Rights (Phase 4) ──
    defineField({
      name: "qcStatus",
      title: "QC Status",
      type: "string",
      options: {
        list: [
          { title: "Not Yet Reviewed", value: "pending" },
          { title: "QC Passed", value: "passed" },
          { title: "QC Failed — Returned to Edit", value: "failed" },
        ],
      },
      initialValue: "pending",
    }),
    defineField({
      name: "qcPassedBy",
      title: "QC Passed By",
      type: "string",
      hidden: ({ parent }) => parent?.qcStatus !== "passed",
    }),
    defineField({
      name: "qcDate",
      title: "QC Date",
      type: "date",
      hidden: ({ parent }) => parent?.qcStatus !== "passed",
    }),
    defineField({
      name: "releaseOnFile",
      title: "Release on File",
      type: "string",
      options: {
        list: [
          { title: "Not Required", value: "not-required" },
          { title: "Model Release — On File", value: "model-release" },
          { title: "Property Release — On File", value: "property-release" },
          { title: "Required — NOT Yet Obtained", value: "missing" },
        ],
      },
      initialValue: "not-required",
    }),
    defineField({
      name: "rightsExpiry",
      title: "Rights / Licence Expiry",
      type: "date",
      description: "If this asset has a time-limited licence, set the expiry date here.",
    }),
    defineField({
      name: "accuracyApproval",
      title: "Product Accuracy Approval",
      type: "boolean",
      description: "For product shots: Apothecary team confirms colour, scale, and quantity are truthful.",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "title", status: "status", media: "image" },
    prepare({ title, status, media }) {
      return { title, subtitle: status, media };
    },
  },
});
