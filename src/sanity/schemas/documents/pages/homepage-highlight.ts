import { defineField, defineType } from "sanity";

/**
 * Editorial homepage “Latest additions” highlight.
 *
 * Publication is deliberate: editors must enable “Show on homepage”,
 * supply complete locale copy and a destination, and publish. Drafts and
 * incomplete promotions never reach the public rail.
 */
export const homepageHighlight = defineType({
  name: "homepageHighlight",
  title: "Homepage highlight",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "destination", title: "Destination" },
    { name: "publishing", title: "Publishing" },
    { name: "presentation", title: "Presentation" },
  ],
  fields: [
    defineField({
      name: "internalName",
      title: "Internal editorial name",
      type: "string",
      description: "Studio-only label — not shown on the website",
      group: "content",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "enabled",
      title: "Show on homepage",
      type: "boolean",
      description:
        "Editorial gate. When off, this highlight never appears on the homepage — even if published",
      group: "publishing",
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      description:
        "Restrained uppercase label, e.g. NEW IN THE KNOWLEDGE LIBRARY",
      group: "content",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      group: "content",
      validation: (rule) => rule.required().max(240),
    }),
    defineField({
      name: "image",
      title: "Editorial image",
      type: "image",
      options: { hotspot: true },
      group: "content",
      description:
        "Landscape ~16:10 or 3:2. Leave empty only when a brand-safe visual theme fallback is set",
    }),
    defineField({
      name: "imageAlt",
      title: "Image alt text",
      type: "string",
      group: "content",
      description: "Describe the actual image for assistive technology",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { image?: { asset?: unknown } };
          if (parent?.image?.asset && !value?.trim()) {
            return "Alt text is required when an image is set";
          }
          return true;
        }),
    }),
    defineField({
      name: "contentArea",
      title: "Department or content area",
      type: "string",
      group: "content",
      options: {
        list: [
          { title: "Knowledge Library", value: "knowledge-library" },
          { title: "The Academy", value: "academy" },
          { title: "The Apothecary", value: "apothecary" },
          { title: "Sacred Journeys", value: "sacred-journeys" },
          { title: "The Institute", value: "institution" },
          { title: "Clinical", value: "clinical" },
          { title: "Programmes", value: "programmes" },
          { title: "Guides & publications", value: "publications" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "contentAreaLabel",
      title: "Content-area label override",
      type: "string",
      group: "content",
      description:
        "Optional display label. When empty, the site uses the localised department label",
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: "destinationType",
      title: "Destination type",
      type: "string",
      group: "destination",
      options: {
        list: [
          { title: "Internal pathname", value: "pathname" },
          { title: "Internal content reference", value: "reference" },
        ],
        layout: "radio",
      },
      initialValue: "pathname",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "pathname",
      title: "Internal pathname",
      type: "string",
      group: "destination",
      description:
        "Locale-unprefixed path, e.g. /knowledge-library/dua-dhikr — never include /en or /dk",
      hidden: ({ parent }) => parent?.destinationType === "reference",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { destinationType?: string };
          if (parent?.destinationType === "reference") return true;
          if (!value?.trim())
            return "Pathname is required for pathname destinations";
          const trimmed = value.trim();
          if (!trimmed.startsWith("/")) return "Pathname must start with /";
          if (trimmed.startsWith("/en/") || trimmed === "/en") {
            return "Do not include an /en prefix — English routes are unprefixed";
          }
          if (
            trimmed.startsWith("/dk/") ||
            trimmed === "/dk" ||
            trimmed.startsWith("/da/")
          ) {
            return "Do not include a locale prefix — Danish /dk is applied by the router";
          }
          return true;
        }),
    }),
    defineField({
      name: "destinationReference",
      title: "Internal content reference",
      type: "reference",
      group: "destination",
      to: [
        { type: "article" },
        { type: "product" },
        { type: "programme" },
        { type: "journey" },
        { type: "duaDhikrCollection" },
      ],
      hidden: ({ parent }) => parent?.destinationType !== "reference",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { destinationType?: string };
          if (parent?.destinationType !== "reference") return true;
          if (!value) return "Select a published content reference";
          return true;
        }),
    }),
    defineField({
      name: "ctaLabel",
      title: "CTA label",
      type: "string",
      group: "content",
      description:
        "Optional. When empty, the site uses the default Explore label",
      validation: (rule) => rule.max(48),
    }),
    defineField({
      name: "publishedAt",
      title: "Publication date",
      type: "datetime",
      group: "publishing",
      description:
        "Editorial publication date — used for ordering when not pinned",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "displayFrom",
      title: "Display from",
      type: "datetime",
      group: "publishing",
      description: "Optional. Hide until this moment",
    }),
    defineField({
      name: "displayUntil",
      title: "Display until",
      type: "datetime",
      group: "publishing",
      description: "Optional. Hide after this moment",
    }),
    defineField({
      name: "pinned",
      title: "Pinned",
      type: "boolean",
      group: "publishing",
      description: "Pinned items appear before unpinned items",
      initialValue: false,
    }),
    defineField({
      name: "priority",
      title: "Editorial priority",
      type: "number",
      group: "publishing",
      description:
        "Higher values appear first within pinned / unpinned groups (0–100)",
      initialValue: 50,
      validation: (rule) => rule.min(0).max(100).integer(),
    }),
    defineField({
      name: "showNewMarker",
      title: "Show “New” marker",
      type: "boolean",
      group: "presentation",
      description: "Only enable when the addition is truthfully new",
      initialValue: true,
    }),
    defineField({
      name: "visualTheme",
      title: "Visual theme fallback",
      type: "string",
      group: "presentation",
      description:
        "Brand-safe compositional fallback when no editorial photograph is approved yet",
      options: {
        list: [
          { title: "None", value: "none" },
          { title: "Duʿā & Dhikr", value: "dua-dhikr" },
          { title: "Knowledge Library", value: "knowledge-library" },
          { title: "Institution", value: "institution" },
        ],
      },
      initialValue: "none",
    }),
  ],
  orderings: [
    {
      title: "Priority",
      name: "priorityDesc",
      by: [
        { field: "pinned", direction: "desc" },
        { field: "priority", direction: "desc" },
        { field: "publishedAt", direction: "desc" },
      ],
    },
    {
      title: "Publication date",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      contentArea: "contentArea",
      enabled: "enabled",
      media: "image",
      publishedAt: "publishedAt",
      displayFrom: "displayFrom",
      internalName: "internalName",
    },
    prepare({
      title,
      contentArea,
      enabled,
      media,
      publishedAt,
      displayFrom,
      internalName,
    }) {
      const date = displayFrom || publishedAt;
      const dateLabel = date
        ? new Date(date).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "No date";
      return {
        title: title || internalName || "Untitled highlight",
        subtitle: `${enabled ? "Enabled" : "Disabled"} · ${contentArea || "—"} · ${dateLabel}`,
        media,
      };
    },
  },
});
