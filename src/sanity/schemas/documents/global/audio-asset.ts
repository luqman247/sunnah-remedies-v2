/**
 * Audio Asset — future seam for podcasts and article narration (Ch. 13).
 * Dormant until content exists; schema ready for Cloudinary audio delivery.
 */

import { defineType, defineField } from "sanity";

export default defineType({
  name: "audioAsset",
  title: "Audio Asset",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "cloudinary",
      title: "Cloudinary Audio",
      type: "cloudinaryRef",
    }),
    defineField({
      name: "originalFilename",
      title: "Original Filename",
      type: "string",
    }),
    defineField({
      name: "fileSizeBytes",
      title: "File Size (bytes)",
      type: "number",
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: "uploadedAt",
      title: "Upload Date",
      type: "datetime",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "transcript",
      title: "Transcript",
      type: "array",
      of: [{ type: "block" }],
      description: "Full text transcript for accessibility",
    }),
    defineField({
      name: "narrator",
      title: "Narrator",
      type: "reference",
      to: [{ type: "person" }],
    }),
    defineField({
      name: "credit",
      title: "Credit",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title, subtitle: "Audio" };
    },
  },
});
