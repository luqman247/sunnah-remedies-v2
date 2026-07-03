import { defineField, defineType, defineArrayMember } from "sanity";

export const richContent = defineType({
  name: "richContent",
  title: "Rich Content",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Heading 4", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
          { title: "Superscript", value: "sup" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              defineField({
                name: "href",
                type: "url",
                title: "URL",
                validation: (rule) =>
                  rule.uri({ allowRelative: true, scheme: ["http", "https", "mailto"] }),
              }),
              defineField({
                name: "openInNewTab",
                type: "boolean",
                title: "Open in new tab",
                initialValue: false,
              }),
            ],
          },
          {
            name: "internalLink",
            type: "object",
            title: "Internal Link",
            fields: [
              defineField({
                name: "reference",
                type: "reference",
                title: "Reference",
                to: [
                  { type: "product" },
                  { type: "programme" },
                  { type: "journey" },
                  { type: "article" },
                ],
              }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt text",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "caption",
          type: "string",
          title: "Caption",
        }),
      ],
    }),
    defineArrayMember({ type: "arabicText" }),
    defineArrayMember({ type: "quranReference" }),
    defineArrayMember({ type: "hadithReference" }),
    defineArrayMember({ type: "footnote" }),
    defineArrayMember({ type: "academicCitation" }),
    defineArrayMember({ type: "evidencePanel" }),
    defineArrayMember({ type: "clinicalNote" }),
    defineArrayMember({ type: "scholarNote" }),
    defineArrayMember({ type: "calloutBox" }),
    defineArrayMember({ type: "warningBlock" }),
    defineArrayMember({ type: "downloadFile" }),
  ],
});

export const arabicText = defineType({
  name: "arabicText",
  title: "Arabic Text",
  type: "object",
  fields: [
    defineField({
      name: "arabic",
      title: "Arabic",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "transliteration",
      title: "Transliteration",
      type: "string",
    }),
    defineField({
      name: "translation",
      title: "Translation",
      type: "text",
    }),
  ],
  preview: {
    select: { title: "transliteration", subtitle: "arabic" },
  },
});

export const quranReference = defineType({
  name: "quranReference",
  title: "Qur'an Reference",
  type: "object",
  fields: [
    defineField({
      name: "arabic",
      title: "Arabic Text",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "translation",
      title: "Translation",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "surah",
      title: "Surah",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "ayah",
      title: "Ayah",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "translator",
      title: "Translator",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "surah", subtitle: "ayah" },
    prepare: ({ title, subtitle }) => ({
      title: `${title}:${subtitle}`,
      subtitle: "Qur'an Reference",
    }),
  },
});

export const hadithReference = defineType({
  name: "hadithReference",
  title: "Hadith Reference",
  type: "object",
  fields: [
    defineField({
      name: "arabic",
      title: "Arabic Text",
      type: "text",
    }),
    defineField({
      name: "translation",
      title: "Translation",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      description: "e.g. Sahih al-Bukhari, Hadith 5688",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "grade",
      title: "Grade",
      type: "string",
      options: {
        list: [
          { title: "Sahih (Authentic)", value: "sahih" },
          { title: "Hasan (Good)", value: "hasan" },
          { title: "Da'if (Weak)", value: "daif" },
        ],
      },
    }),
    defineField({
      name: "narrator",
      title: "Narrator",
      type: "string",
    }),
    defineField({
      name: "grader",
      title: "Graded by",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "source", subtitle: "grade" },
  },
});

export const footnote = defineType({
  name: "footnote",
  title: "Footnote",
  type: "object",
  fields: [
    defineField({
      name: "number",
      title: "Note Number",
      type: "number",
    }),
    defineField({
      name: "text",
      title: "Note Text",
      type: "text",
      validation: (rule) => rule.required(),
    }),
  ],
});

export const academicCitation = defineType({
  name: "academicCitation",
  title: "Academic Citation",
  type: "object",
  fields: [
    defineField({
      name: "authors",
      title: "Authors",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publication",
      title: "Publication / Journal",
      type: "string",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
    }),
    defineField({
      name: "doi",
      title: "DOI",
      type: "string",
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
    }),
  ],
  preview: {
    select: { title: "authors", subtitle: "title" },
  },
});

export const evidencePanel = defineType({
  name: "evidencePanel",
  title: "Evidence Panel",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "level",
      title: "Evidence Level",
      type: "string",
      options: {
        list: [
          { title: "Established", value: "established" },
          { title: "Emerging", value: "emerging" },
          { title: "Traditional", value: "traditional" },
          { title: "Preliminary", value: "preliminary" },
        ],
      },
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sources",
      title: "Sources",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
});

export const clinicalNote = defineType({
  name: "clinicalNote",
  title: "Clinical Note",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "severity",
      title: "Severity",
      type: "string",
      options: {
        list: [
          { title: "Information", value: "info" },
          { title: "Caution", value: "caution" },
          { title: "Warning", value: "warning" },
        ],
      },
      initialValue: "info",
    }),
  ],
});

export const scholarNote = defineType({
  name: "scholarNote",
  title: "Scholar Note",
  type: "object",
  fields: [
    defineField({
      name: "scholar",
      title: "Scholar",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "text",
      title: "Text",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
    }),
  ],
});

export const calloutBox = defineType({
  name: "calloutBox",
  title: "Callout Box",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "variant",
      title: "Variant",
      type: "string",
      options: {
        list: [
          { title: "Default", value: "default" },
          { title: "Scholarly", value: "scholarly" },
          { title: "Clinical", value: "clinical" },
          { title: "Prophetic", value: "prophetic" },
        ],
      },
      initialValue: "default",
    }),
  ],
});

export const warningBlock = defineType({
  name: "warningBlock",
  title: "Warning",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Important",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      validation: (rule) => rule.required(),
    }),
  ],
});

export const internalLink = defineType({
  name: "internalLink",
  title: "Internal Link",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "href",
      title: "Path",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "primary",
      title: "Primary Action",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
