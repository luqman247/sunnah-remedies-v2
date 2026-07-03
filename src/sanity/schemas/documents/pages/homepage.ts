import { defineField, defineType } from "sanity";

export const homepage = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  groups: [
    { name: "threshold", title: "Threshold" },
    { name: "hero", title: "Hero" },
    { name: "institution", title: "Institution" },
    { name: "tradition", title: "Tradition" },
    { name: "departments", title: "Departments" },
    { name: "pillars", title: "Three Pillars" },
    { name: "trust", title: "Trust" },
    { name: "apothecary", title: "Featured Remedies" },
    { name: "academy", title: "Academy" },
    { name: "knowledge", title: "Knowledge Library" },
    { name: "journeys", title: "Sacred Journeys" },
    { name: "founding", title: "Founding Statement" },
    { name: "correspondence", title: "Correspondence" },
    { name: "invitation", title: "Invitation" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // ── Threshold (v2) ──
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      group: "threshold",
      validation: (Rule) => Rule.max(48),
    }),
    defineField({
      name: "foundingYear",
      title: "Founding Year",
      type: "number",
      group: "threshold",
    }),
    defineField({
      name: "arrivalArabic",
      title: "Arrival Arabic",
      type: "string",
      group: "threshold",
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: "arrivalEnglish",
      title: "Arrival English",
      type: "string",
      group: "threshold",
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: "arrivalStandfirst",
      title: "Arrival Standfirst",
      type: "text",
      group: "threshold",
      validation: (Rule) => Rule.max(240),
    }),
    defineField({
      name: "enterLabel",
      title: "Enter Label",
      type: "string",
      group: "threshold",
      validation: (Rule) => Rule.max(32),
      initialValue: "Enter the institution",
    }),
    defineField({
      name: "enterHref",
      title: "Enter Href",
      type: "string",
      group: "threshold",
      initialValue: "#departments",
    }),
    defineField({
      name: "thresholdPlate",
      title: "Threshold Plate",
      type: "reference",
      to: [{ type: "mediaAsset" }],
      group: "threshold",
    }),

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

    // ── Tradition (v2) ──
    defineField({
      name: "tradition",
      title: "Tradition",
      type: "object",
      group: "tradition",
      fields: [
        defineField({ name: "stamp", title: "Stamp", type: "string" }),
        defineField({ name: "arabicEpigraph", title: "Arabic Epigraph", type: "string" }),
        defineField({ name: "standfirst", title: "Standfirst", type: "text" }),
        defineField({
          name: "body",
          title: "Body",
          type: "array",
          of: [{ type: "block" }],
        }),
        defineField({
          name: "pullQuote",
          title: "Pull Quote",
          type: "object",
          fields: [
            defineField({ name: "text", title: "Text", type: "text" }),
            defineField({ name: "attribution", title: "Attribution", type: "string" }),
            defineField({ name: "source", title: "Source", type: "string" }),
          ],
        }),
      ],
    }),

    // ── Departments (v2) ──
    defineField({
      name: "departmentCards",
      title: "Department Cards",
      type: "array",
      group: "departments",
      of: [{ type: "reference", to: [{ type: "departmentCard" }] }],
      validation: (Rule) => Rule.max(4),
    }),

    // ── Authority Signals (v2) ──
    defineField({
      name: "authoritySignals",
      title: "Authority Signals",
      type: "array",
      group: "trust",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "value", title: "Value", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "note", title: "Note", type: "string" }),
          ],
          preview: {
            select: { title: "label", subtitle: "value" },
          },
        },
      ],
      validation: (Rule) => Rule.max(4),
    }),

    // ── Correspondence (v2) ──
    defineField({
      name: "correspondence",
      title: "Correspondence",
      type: "object",
      group: "correspondence",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "body", title: "Body", type: "text" }),
        defineField({ name: "placeholder", title: "Placeholder", type: "string" }),
        defineField({ name: "consentText", title: "Consent Text", type: "string" }),
        defineField({ name: "successText", title: "Success Text", type: "string" }),
      ],
    }),

    // ── Institution Statement (v2) ──
    defineField({
      name: "institutionStatement",
      title: "Institution Statement",
      type: "text",
      group: "founding",
      validation: (Rule) => Rule.max(200),
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
