import { defineField, defineType } from "sanity";

export const homepage = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "institution", title: "Institution" },
    { name: "pillars", title: "Three Pillars" },
    { name: "trust", title: "Trust" },
    { name: "apothecary", title: "Featured Remedies" },
    { name: "academy", title: "Academy" },
    { name: "knowledge", title: "Knowledge Library" },
    { name: "journeys", title: "Sacred Journeys" },
    { name: "founding", title: "Founding Statement" },
    { name: "invitation", title: "Invitation" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // ── Hero ──
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      group: "hero",
      fields: [
        defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", title: "Alt Text", type: "string", validation: (rule) => rule.required() })] }),
        defineField({ name: "statement", title: "Statement", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "qualifier", title: "Qualifier", type: "text", rows: 2 }),
      ],
    }),

    // ── Institution ──
    defineField({
      name: "institutionSection",
      title: "Institution Section",
      type: "object",
      group: "institution",
      fields: [
        defineField({ name: "numeral", title: "Numeral", type: "string", initialValue: "I" }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "body", title: "Body", type: "array", of: [{ type: "text" }] }),
      ],
    }),

    // ── Three Pillars ──
    defineField({
      name: "pillars",
      title: "Three Pillars",
      type: "array",
      group: "pillars",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
          defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
          defineField({ name: "body", title: "Body", type: "text" }),
          defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", title: "Alt Text", type: "string", validation: (rule) => rule.required() })] }),
          defineField({ name: "caption", title: "Caption", type: "string" }),
          defineField({ name: "link", title: "Link", type: "object", fields: [defineField({ name: "label", title: "Label", type: "string" }), defineField({ name: "href", title: "Path", type: "string" })] }),
          defineField({ name: "reverse", title: "Reverse Layout", type: "boolean", initialValue: false }),
        ],
        preview: { select: { title: "eyebrow", subtitle: "title" } },
      }],
    }),

    // ── Trust ──
    defineField({
      name: "trustSection",
      title: "Trust Section",
      type: "object",
      group: "trust",
      fields: [
        defineField({ name: "numeral", title: "Numeral", type: "string", initialValue: "III" }),
        defineField({ name: "label", title: "Label", type: "string" }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({
          name: "items",
          title: "Trust Items",
          type: "array",
          of: [{
            type: "object",
            fields: [
              defineField({ name: "numeral", title: "Numeral", type: "string" }),
              defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
              defineField({ name: "text", title: "Text", type: "text" }),
            ],
            preview: { select: { title: "title" } },
          }],
        }),
      ],
    }),

    // ── Featured Remedies ──
    defineField({
      name: "featuredRemedies",
      title: "Featured Remedies",
      type: "array",
      group: "apothecary",
      of: [{
        type: "object",
        fields: [
          defineField({ name: "eyebrow", title: "Eyebrow", type: "string", initialValue: "Monograph" }),
          defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
          defineField({ name: "body", title: "Body", type: "text" }),
          defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", title: "Alt Text", type: "string", validation: (rule) => rule.required() })] }),
          defineField({ name: "link", title: "Link", type: "object", fields: [defineField({ name: "label", title: "Label", type: "string" }), defineField({ name: "href", title: "Path", type: "string" })] }),
          defineField({ name: "reverse", title: "Reverse Layout", type: "boolean", initialValue: false }),
        ],
        preview: { select: { title: "title" } },
      }],
    }),

    // ── Academy ──
    defineField({
      name: "academySection",
      title: "Academy Section",
      type: "object",
      group: "academy",
      fields: [
        defineField({ name: "numeral", title: "Numeral", type: "string", initialValue: "V" }),
        defineField({ name: "label", title: "Label", type: "string" }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "body", title: "Body", type: "text" }),
        defineField({ name: "pullQuote", title: "Pull Quote", type: "string" }),
        defineField({ name: "link", title: "Link", type: "object", fields: [defineField({ name: "label", title: "Label", type: "string" }), defineField({ name: "href", title: "Path", type: "string" })] }),
      ],
    }),

    // ── Knowledge Library ──
    defineField({
      name: "knowledgeSection",
      title: "Knowledge Library Section",
      type: "object",
      group: "knowledge",
      fields: [
        defineField({ name: "numeral", title: "Numeral", type: "string", initialValue: "VI" }),
        defineField({ name: "label", title: "Label", type: "string" }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "body", title: "Body", type: "text" }),
        defineField({ name: "link", title: "Link", type: "object", fields: [defineField({ name: "label", title: "Label", type: "string" }), defineField({ name: "href", title: "Path", type: "string" })] }),
      ],
    }),

    // ── Sacred Journeys ──
    defineField({
      name: "journeysSection",
      title: "Sacred Journeys Section",
      type: "object",
      group: "journeys",
      fields: [
        defineField({ name: "numeral", title: "Numeral", type: "string", initialValue: "VII" }),
        defineField({ name: "label", title: "Label", type: "string" }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "body", title: "Body", type: "text" }),
        defineField({ name: "pullQuote", title: "Pull Quote", type: "string" }),
        defineField({ name: "link", title: "Link", type: "object", fields: [defineField({ name: "label", title: "Label", type: "string" }), defineField({ name: "href", title: "Path", type: "string" })] }),
        defineField({ name: "editorialPhoto", title: "Section Photo", type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", title: "Alt Text", type: "string" }), defineField({ name: "caption", title: "Caption", type: "string" })] }),
      ],
    }),

    // ── Founding Statement ──
    defineField({
      name: "foundingStatement",
      title: "Founding Statement",
      type: "object",
      group: "founding",
      fields: [
        defineField({ name: "numeral", title: "Numeral", type: "string", initialValue: "VIII" }),
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "body", title: "Body", type: "array", of: [{ type: "text" }] }),
        defineField({ name: "link", title: "Link", type: "object", fields: [defineField({ name: "label", title: "Label", type: "string" }), defineField({ name: "href", title: "Path", type: "string" })] }),
      ],
    }),

    // ── Invitation ──
    defineField({
      name: "invitation",
      title: "Invitation",
      type: "object",
      group: "invitation",
      fields: [
        defineField({ name: "numeral", title: "Numeral", type: "string", initialValue: "IX" }),
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "body", title: "Body", type: "text" }),
        defineField({
          name: "actions",
          title: "Actions",
          type: "array",
          of: [{ type: "internalLink" }],
        }),
      ],
    }),

    // ── SEO ──
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  preview: {
    prepare: () => ({ title: "Homepage" }),
  },
});
