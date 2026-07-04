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
      type: "object",
      fields: [
        defineField({ name: "public_id", title: "Public ID", type: "string" }),
        defineField({ name: "secure_url", title: "Secure URL", type: "url" }),
        defineField({ name: "format", title: "Format", type: "string" }),
        defineField({ name: "duration", title: "Duration (seconds)", type: "number" }),
      ],
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
