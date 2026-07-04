import { defineType, defineField } from "sanity";

export default defineType({
  name: "videoAsset",
  title: "Video Asset",
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
      title: "Cloudinary Video",
      type: "object",
      fields: [
        defineField({ name: "public_id", title: "Public ID", type: "string" }),
        defineField({ name: "secure_url", title: "Secure URL", type: "url" }),
        defineField({ name: "format", title: "Format", type: "string" }),
        defineField({ name: "width", title: "Width", type: "number" }),
        defineField({ name: "height", title: "Height", type: "number" }),
        defineField({ name: "duration", title: "Duration (seconds)", type: "number" }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "poster",
      title: "Poster Image",
      type: "reference",
      to: [{ type: "mediaAsset" }],
      description: "Poster shown before video plays (LCP candidate)",
    }),
    defineField({
      name: "mode",
      title: "Mode",
      type: "string",
      options: {
        list: [
          { title: "Ambient (muted, looping, decorative)", value: "ambient" },
          { title: "Player (full controls, narrative)", value: "player" },
        ],
      },
      validation: (Rule) => Rule.required(),
      initialValue: "ambient",
    }),
    defineField({
      name: "captionsVtt",
      title: "Captions (WebVTT URL)",
      type: "url",
      description: "Required for player mode (narrative video)",
      hidden: ({ parent }) => parent?.mode !== "player",
    }),
    defineField({
      name: "chapters",
      title: "Chapters",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "start", title: "Start (seconds)", type: "number" }),
          ],
        },
      ],
      hidden: ({ parent }) => parent?.mode !== "player",
    }),
    defineField({
      name: "alt",
      title: "Description / Alt",
      type: "string",
      description: "Accessible description of the video content",
    }),
    defineField({
      name: "credit",
      title: "Credit",
      type: "string",
    }),
    defineField({
      name: "copyright",
      title: "Copyright",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "title", mode: "mode" },
    prepare({ title, mode }) {
      return { title, subtitle: `Video · ${mode}` };
    },
  },
});
