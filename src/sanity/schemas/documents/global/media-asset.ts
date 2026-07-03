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
  ],
  preview: {
    select: { title: "title", status: "status", media: "image" },
    prepare({ title, status, media }) {
      return { title, subtitle: status, media };
    },
  },
});
