/**
 * Media Asset — central library document for still images.
 *
 * Source of truth decision:
 * - Sanity owns metadata, rights, QC, and references (DAM)
 * - Cloudinary owns binary delivery for interim/final assets
 * - Products select library assets by reference — they do not own the binary
 *
 * @see docs/apothecary/MEDIA_SOURCE_OF_TRUTH.md
 */

import { defineType, defineField } from "sanity";

const LIBRARY_TAGS = [
  { title: "Apothecary", value: "pillar:apothecary" },
  { title: "Academy", value: "pillar:academy" },
  { title: "Journeys", value: "pillar:journeys" },
  { title: "Library", value: "pillar:library" },
  { title: "Clinical", value: "pillar:clinical" },
  { title: "Brand", value: "pillar:brand" },
  { title: "Hero", value: "type:hero" },
  { title: "Ingredient", value: "type:ingredient" },
  { title: "Product", value: "type:product" },
  { title: "Packaging", value: "type:packaging" },
  { title: "Portrait", value: "type:portrait" },
  { title: "Architecture", value: "type:architecture" },
  { title: "Manuscript", value: "type:manuscript" },
  { title: "Equipment", value: "type:equipment" },
  { title: "Environment", value: "type:environment" },
  { title: "Detail", value: "type:detail" },
  { title: "Lifestyle", value: "type:lifestyle" },
  { title: "Natural Light", value: "light:natural" },
  { title: "Low Light", value: "light:low" },
  { title: "Studio Light", value: "light:studio" },
  { title: "Landscape", value: "orientation:landscape" },
  { title: "Portrait Orientation", value: "orientation:portrait" },
  { title: "Square", value: "orientation:square" },
];

export default defineType({
  name: "mediaAsset",
  title: "Media Asset",
  type: "document",
  groups: [
    { name: "essentials", title: "Essentials", default: true },
    { name: "file", title: "File & Delivery" },
    { name: "brief", title: "Photography Brief" },
    { name: "rights", title: "Rights & QC" },
  ],
  fieldsets: [
    {
      name: "fileMeta",
      title: "File metadata",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "duplicate",
      title: "Duplicate detection",
      options: { collapsible: true, collapsed: true },
    },
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
      name: "assetClass",
      title: "Asset Class",
      type: "string",
      group: "essentials",
      options: {
        list: [
          { title: "Photography (commissioned)", value: "photography" },
          { title: "Product", value: "product" },
          { title: "Editorial", value: "editorial" },
          { title: "Archival", value: "archival" },
        ],
        layout: "radio",
      },
      initialValue: "photography",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "essentials",
      options: {
        list: [
          { title: "Brief (placeholder)", value: "brief" },
          { title: "Interim (early photography)", value: "interim" },
          { title: "Final (production)", value: "final" },
        ],
      },
      validation: (rule) => rule.required(),
      initialValue: "brief",
    }),
    defineField({
      name: "alt",
      title: "Alt Text",
      type: "string",
      group: "essentials",
      description: "Required unless decorative",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { decorative?: boolean } | undefined;
          if (parent?.decorative) return true;
          if (!value) return "Alt text is required unless the asset is marked decorative.";
          return true;
        }),
    }),
    defineField({
      name: "decorative",
      title: "Decorative",
      type: "boolean",
      group: "essentials",
      description: "If true, alt is empty (purely atmospheric)",
      initialValue: false,
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      group: "essentials",
    }),
    defineField({
      name: "credit",
      title: "Credit",
      type: "string",
      group: "essentials",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      group: "essentials",
      of: [{ type: "string" }],
      description: "Controlled vocabulary for library search and filtering",
      options: { list: LIBRARY_TAGS },
    }),
    defineField({
      name: "searchKeywords",
      title: "Search Keywords",
      type: "array",
      group: "essentials",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: "Freeform keywords for Studio search",
    }),

    // ── File & Delivery ──
    defineField({
      name: "cloudinary",
      title: "Cloudinary Asset",
      type: "cloudinaryRef",
      group: "file",
      description: "Canonical binary delivery for interim/final assets",
      hidden: ({ parent }) => parent?.status === "brief",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.document as { status?: string } | undefined;
          if (parent?.status === "brief") return true;
          if (parent?.status === "final" && !(value as { public_id?: string } | undefined)?.public_id) {
            return "Final assets require a Cloudinary public ID for delivery.";
          }
          return true;
        }),
    }),
    defineField({
      name: "image",
      title: "Sanity Image (fallback / preview)",
      type: "image",
      group: "file",
      options: { hotspot: true },
      description:
        "Optional Sanity-hosted preview. Prefer Cloudinary for production delivery.",
      hidden: ({ parent }) => parent?.status === "brief",
    }),
    defineField({
      name: "originalFilename",
      title: "Original Filename",
      type: "string",
      group: "file",
      fieldset: "fileMeta",
    }),
    defineField({
      name: "fileSizeBytes",
      title: "File Size (bytes)",
      type: "number",
      group: "file",
      fieldset: "fileMeta",
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: "uploadedAt",
      title: "Upload Date",
      type: "datetime",
      group: "file",
      fieldset: "fileMeta",
    }),
    defineField({
      name: "dimensionsLabel",
      title: "Dimensions Label",
      type: "string",
      group: "file",
      fieldset: "fileMeta",
      description: "e.g. 2400×1600 — mirrors Cloudinary width/height when set",
    }),
    defineField({
      name: "contentHash",
      title: "Content Hash",
      type: "string",
      group: "file",
      fieldset: "duplicate",
      description:
        "Optional fingerprint (e.g. SHA-256) for duplicate detection. Same hash = likely duplicate binary.",
    }),
    defineField({
      name: "duplicateOf",
      title: "Duplicate Of",
      type: "reference",
      group: "file",
      fieldset: "duplicate",
      to: [{ type: "mediaAsset" }],
      description: "If this is a known duplicate, point to the canonical asset.",
    }),
    defineField({
      name: "focalOverride",
      title: "Manual Focal Point",
      type: "boolean",
      group: "file",
      description: "If true, uses editor-set hotspot instead of auto-gravity",
      initialValue: false,
    }),

    // ── Photography Brief ──
    defineField({
      name: "purpose",
      title: "Purpose",
      type: "string",
      group: "brief",
      description: "Why this image exists",
      validation: (rule) =>
        rule.custom((value, context) => {
          const doc = context.document as { assetClass?: string } | undefined;
          if (doc?.assetClass === "product" || doc?.assetClass === "archival") return true;
          if (!value) return "Purpose is required for photography and editorial assets.";
          return true;
        }),
    }),
    defineField({
      name: "composition",
      title: "Composition",
      type: "string",
      group: "brief",
      description: "Framing direction",
      validation: (rule) =>
        rule.custom((value, context) => {
          const doc = context.document as { assetClass?: string } | undefined;
          if (doc?.assetClass === "product" || doc?.assetClass === "archival") return true;
          if (!value) return "Composition is required for photography and editorial assets.";
          return true;
        }),
    }),
    defineField({
      name: "lens",
      title: "Lens",
      type: "string",
      group: "brief",
      description: "e.g. 50mm, shallow",
    }),
    defineField({
      name: "lighting",
      title: "Lighting",
      type: "string",
      group: "brief",
      description: "e.g. single north window, morning",
      validation: (rule) =>
        rule.custom((value, context) => {
          const doc = context.document as { assetClass?: string } | undefined;
          if (doc?.assetClass === "product" || doc?.assetClass === "archival") return true;
          if (!value) return "Lighting is required for photography and editorial assets.";
          return true;
        }),
    }),
    defineField({
      name: "grade",
      title: "Grade",
      type: "string",
      group: "brief",
      description: "Colour grade / mood direction",
    }),
    defineField({
      name: "mood",
      title: "Mood",
      type: "string",
      group: "brief",
      description: "One word or phrase",
      validation: (rule) =>
        rule.custom((value, context) => {
          const doc = context.document as { assetClass?: string } | undefined;
          if (doc?.assetClass === "product" || doc?.assetClass === "archival") return true;
          if (!value) return "Mood is required for photography and editorial assets.";
          return true;
        }),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      group: "brief",
    }),
    defineField({
      name: "subject",
      title: "Subject",
      type: "string",
      group: "brief",
    }),
    defineField({
      name: "props",
      title: "Props",
      type: "array",
      group: "brief",
      of: [{ type: "string" }],
    }),

    // ── Rights & QC ──
    defineField({
      name: "copyright",
      title: "Copyright",
      type: "string",
      group: "rights",
      description: "Falls back to Cloudinary structured metadata if unset",
    }),
    defineField({
      name: "qcStatus",
      title: "QC Status",
      type: "string",
      group: "rights",
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
      group: "rights",
      hidden: ({ parent }) => parent?.qcStatus !== "passed",
    }),
    defineField({
      name: "qcDate",
      title: "QC Date",
      type: "date",
      group: "rights",
      hidden: ({ parent }) => parent?.qcStatus !== "passed",
    }),
    defineField({
      name: "releaseOnFile",
      title: "Release on File",
      type: "string",
      group: "rights",
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
      group: "rights",
      description: "If this asset has a time-limited licence, set the expiry date here.",
    }),
    defineField({
      name: "accuracyApproval",
      title: "Product Accuracy Approval",
      type: "boolean",
      group: "rights",
      description:
        "For product shots: Apothecary team confirms colour, scale, and quantity are truthful.",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "title",
      status: "status",
      assetClass: "assetClass",
      media: "image",
      alt: "alt",
    },
    prepare({ title, status, assetClass, media, alt }) {
      return {
        title: title || alt || "Untitled asset",
        subtitle: [assetClass, status].filter(Boolean).join(" · "),
        media,
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
    {
      title: "Status",
      name: "statusAsc",
      by: [{ field: "status", direction: "asc" }],
    },
  ],
});
