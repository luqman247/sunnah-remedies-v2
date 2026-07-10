/**
 * Video Asset — central library document for product and editorial video.
 *
 * Sanity owns metadata and references; Cloudinary (or approved external URL)
 * owns binary delivery. Never autoplay with sound.
 *
 * @see docs/apothecary/MEDIA_SOURCE_OF_TRUTH.md
 */

import { defineType, defineField } from "sanity";

const ACCEPTED_VIDEO_FORMATS = ["mp4", "webm", "mov"];
const MAX_VIDEO_BYTES = 500 * 1024 * 1024; // 500 MB guidance for editors

export default defineType({
  name: "videoAsset",
  title: "Video Asset",
  type: "document",
  groups: [
    { name: "essentials", title: "Essentials", default: true },
    { name: "file", title: "File & Delivery" },
    { name: "accessibility", title: "Accessibility" },
    { name: "playback", title: "Playback" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "essentials",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      group: "essentials",
      rows: 3,
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      group: "essentials",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Apothecary", value: "pillar:apothecary" },
          { title: "Product Demonstration", value: "type:product-demonstration" },
          { title: "Sourcing Story", value: "type:sourcing-story" },
          { title: "Ingredient Story", value: "type:ingredient-story" },
          { title: "Preparation Guide", value: "type:preparation-guide" },
          { title: "Hero", value: "type:hero" },
          { title: "Academy", value: "pillar:academy" },
          { title: "Journeys", value: "pillar:journeys" },
        ],
      },
    }),
    defineField({
      name: "videoRole",
      title: "Default Video Role",
      type: "string",
      group: "essentials",
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

    // ── File & Delivery ──
    defineField({
      name: "cloudinary",
      title: "Cloudinary Video",
      type: "cloudinaryRef",
      group: "file",
      description: "Preferred production delivery. Formats: mp4, webm.",
      validation: (rule) =>
        rule.custom((value) => {
          const ref = value as { format?: string; bytes?: number; public_id?: string } | undefined;
          if (!ref?.public_id) return true;
          if (ref.format && !ACCEPTED_VIDEO_FORMATS.includes(ref.format.toLowerCase())) {
            return `Unsupported format "${ref.format}". Accepted: ${ACCEPTED_VIDEO_FORMATS.join(", ")}.`;
          }
          if (typeof ref.bytes === "number" && ref.bytes > MAX_VIDEO_BYTES) {
            return "File exceeds the 500 MB editorial maximum. Compress or host externally.";
          }
          return true;
        }),
    }),
    defineField({
      name: "externalUrl",
      title: "Approved External URL",
      type: "url",
      group: "file",
      description: "YouTube, Vimeo, or direct video URL when not using Cloudinary.",
    }),
    defineField({
      name: "file",
      title: "Uploaded File (Studio)",
      type: "file",
      group: "file",
      options: {
        accept: "video/mp4,video/webm,video/quicktime",
      },
      description: "Optional Sanity upload for review. Prefer Cloudinary for public delivery.",
    }),
    defineField({
      name: "originalFilename",
      title: "Original Filename",
      type: "string",
      group: "file",
    }),
    defineField({
      name: "fileSizeBytes",
      title: "File Size (bytes)",
      type: "number",
      group: "file",
      validation: (rule) =>
        rule.min(0).integer().custom((bytes) => {
          if (typeof bytes === "number" && bytes > MAX_VIDEO_BYTES) {
            return "File exceeds the 500 MB editorial maximum.";
          }
          return true;
        }),
    }),
    defineField({
      name: "uploadedAt",
      title: "Upload Date",
      type: "datetime",
      group: "file",
    }),
    defineField({
      name: "poster",
      title: "Poster Image",
      type: "reference",
      group: "file",
      to: [{ type: "mediaAsset" }],
      description: "Required for player mode. Shown before play (LCP candidate).",
    }),
    defineField({
      name: "contentHash",
      title: "Content Hash",
      type: "string",
      group: "file",
      description: "Optional fingerprint for duplicate detection.",
    }),

    // ── Accessibility ──
    defineField({
      name: "alt",
      title: "Description / Alt",
      type: "string",
      group: "accessibility",
      description: "Accessible description of the video content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "transcript",
      title: "Transcript",
      type: "text",
      group: "accessibility",
      rows: 6,
      description: "Full text transcript where appropriate",
    }),
    defineField({
      name: "captionsVtt",
      title: "Captions (WebVTT URL)",
      type: "url",
      group: "accessibility",
      description: "Required for player mode (narrative video)",
    }),
    defineField({
      name: "credit",
      title: "Credit",
      type: "string",
      group: "accessibility",
    }),
    defineField({
      name: "copyright",
      title: "Copyright",
      type: "string",
      group: "accessibility",
    }),

    // ── Playback ──
    defineField({
      name: "mode",
      title: "Mode",
      type: "string",
      group: "playback",
      options: {
        list: [
          { title: "Ambient (muted, looping, decorative)", value: "ambient" },
          { title: "Player (full controls, narrative)", value: "player" },
        ],
      },
      validation: (rule) => rule.required(),
      initialValue: "ambient",
    }),
    defineField({
      name: "autoplay",
      title: "Autoplay",
      type: "boolean",
      group: "playback",
      initialValue: false,
      description: "If enabled, muted must be true. Never autoplay with sound.",
    }),
    defineField({
      name: "muted",
      title: "Muted",
      type: "boolean",
      group: "playback",
      initialValue: true,
    }),
    defineField({
      name: "loop",
      title: "Loop",
      type: "boolean",
      group: "playback",
      initialValue: false,
    }),
    defineField({
      name: "controls",
      title: "Show Controls",
      type: "boolean",
      group: "playback",
      initialValue: true,
    }),
    defineField({
      name: "chapters",
      title: "Chapters",
      type: "array",
      group: "playback",
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
  ],
  validation: (rule) =>
    rule.custom((doc) => {
      const video = doc as {
        cloudinary?: { public_id?: string };
        externalUrl?: string;
        file?: unknown;
        mode?: string;
        poster?: unknown;
        captionsVtt?: string;
        autoplay?: boolean;
        muted?: boolean;
      } | undefined;
      if (!video) return true;

      if (!video.cloudinary?.public_id && !video.externalUrl && !video.file) {
        return "Provide Cloudinary delivery, an approved external URL, or an uploaded file.";
      }
      if (video.mode === "player" && !video.poster) {
        return "Player mode requires a poster image from the Media Library.";
      }
      if (video.mode === "player" && !video.captionsVtt) {
        return "Player mode should include captions (WebVTT). Add a captions URL before publishing narrative video.";
      }
      if (video.autoplay && video.muted === false) {
        return "Autoplay requires muted playback. Never autoplay with sound.";
      }
      return true;
    }),
  preview: {
    select: {
      title: "title",
      mode: "mode",
      role: "videoRole",
    },
    prepare({ title, mode, role }) {
      return {
        title: title || "Untitled video",
        subtitle: ["Video", mode, role].filter(Boolean).join(" · "),
      };
    },
  },
  orderings: [
    {
      title: "Title",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
    {
      title: "Upload Date",
      name: "uploadedAtDesc",
      by: [{ field: "uploadedAt", direction: "desc" }],
    },
  ],
});
