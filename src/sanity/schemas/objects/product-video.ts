/**
 * Product video — demonstration / sourcing / preparation media.
 * Never autoplay with sound (enforced in validation).
 */

import { defineField, defineType } from "sanity";

export const productVideo = defineType({
  name: "productVideo",
  title: "Product Video",
  type: "object",
  fields: [
    defineField({
      name: "libraryVideo",
      title: "From Media Library",
      type: "reference",
      to: [{ type: "videoAsset" }],
      description:
        "Preferred. Reuse a library video — do not upload the same binary twice.",
    }),
    defineField({
      name: "title",
      title: "Title Override",
      type: "string",
      description: "Optional. Falls back to the library video title when empty.",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      hidden: ({ parent }) => Boolean(parent?.libraryVideo),
    }),
    defineField({
      name: "file",
      title: "Uploaded File",
      type: "file",
      options: {
        accept: "video/mp4,video/webm,video/quicktime",
      },
      description: "Use only when the video is not yet in the Media Library.",
      hidden: ({ parent }) => Boolean(parent?.libraryVideo),
    }),
    defineField({
      name: "externalUrl",
      title: "External Video URL",
      type: "url",
      description: "Approved YouTube, Vimeo, or direct video URL.",
      hidden: ({ parent }) => Boolean(parent?.libraryVideo),
    }),
    defineField({
      name: "poster",
      title: "Poster Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
    defineField({
      name: "transcript",
      title: "Transcript",
      type: "text",
      rows: 4,
      description: "Accessibility transcript where appropriate.",
    }),
    defineField({
      name: "accessibilityDescription",
      title: "Accessibility Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "role",
      title: "Video Role",
      type: "string",
      options: {
        list: [
          { title: "Hero", value: "hero" },
          { title: "Product Demonstration", value: "product-demonstration" },
          { title: "Sourcing Story", value: "sourcing-story" },
          { title: "Ingredient Story", value: "ingredient-story" },
          { title: "Preparation Guide", value: "preparation-guide" },
        ],
      },
      initialValue: "product-demonstration",
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
    }),
    defineField({
      name: "autoplay",
      title: "Autoplay",
      type: "boolean",
      initialValue: false,
      description: "If enabled, video must be muted. Never autoplay with sound.",
    }),
    defineField({
      name: "muted",
      title: "Muted",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "loop",
      title: "Loop",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "controls",
      title: "Show Controls",
      type: "boolean",
      initialValue: true,
    }),
  ],
  validation: (rule) =>
    rule.custom((value) => {
      const video = value as
        | {
            libraryVideo?: unknown;
            file?: unknown;
            externalUrl?: string;
            autoplay?: boolean;
            muted?: boolean;
            title?: string;
          }
        | undefined;
      if (!video) return true;
      if (!video.libraryVideo && !video.file && !video.externalUrl) {
        return "Select a Media Library video, upload a file, or provide an external URL.";
      }
      if (!video.libraryVideo && !video.title) {
        return "Title is required for inline videos.";
      }
      if (video.autoplay && video.muted === false) {
        return "Autoplay requires muted playback. Never autoplay with sound.";
      }
      return true;
    }),
  preview: {
    select: {
      title: "title",
      role: "role",
      media: "poster",
      libraryTitle: "libraryVideo.title",
      order: "displayOrder",
    },
    prepare({ title, role, media, libraryTitle, order }) {
      return {
        title: title || libraryTitle || "Untitled video",
        subtitle: [
          role,
          libraryTitle ? "Library" : "Inline",
          typeof order === "number" ? `Order ${order}` : null,
        ]
          .filter(Boolean)
          .join(" · "),
        media,
      };
    },
  },
});
