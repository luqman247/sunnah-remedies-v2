/**
 * Shared Cloudinary delivery reference — binary CDN facts only.
 * Editorial ownership lives on mediaAsset / videoAsset / audioAsset documents.
 */

import { defineField, defineType } from "sanity";

export const cloudinaryRef = defineType({
  name: "cloudinaryRef",
  title: "Cloudinary Reference",
  type: "object",
  fields: [
    defineField({
      name: "public_id",
      title: "Public ID",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "secure_url",
      title: "Secure URL",
      type: "url",
    }),
    defineField({
      name: "format",
      title: "Format",
      type: "string",
      description: "e.g. jpg, webp, mp4, webm",
    }),
    defineField({
      name: "width",
      title: "Width (px)",
      type: "number",
    }),
    defineField({
      name: "height",
      title: "Height (px)",
      type: "number",
    }),
    defineField({
      name: "bytes",
      title: "File Size (bytes)",
      type: "number",
    }),
    defineField({
      name: "duration",
      title: "Duration (seconds)",
      type: "number",
      description: "Video / audio only",
    }),
    defineField({
      name: "resource_type",
      title: "Resource Type",
      type: "string",
      options: {
        list: [
          { title: "Image", value: "image" },
          { title: "Video", value: "video" },
          { title: "Raw", value: "raw" },
        ],
      },
    }),
  ],
  preview: {
    select: { title: "public_id", subtitle: "format" },
  },
});
