import { defineField, defineType } from "sanity";

export const footerSettings = defineType({
  name: "footerSettings",
  title: "Footer",
  type: "document",
  fields: [
    defineField({
      name: "columns",
      title: "Link Columns",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Column Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "links",
              title: "Links",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({ name: "label", title: "Label", type: "string" }),
                    defineField({ name: "href", title: "Path", type: "string" }),
                  ],
                },
              ],
            }),
          ],
          preview: {
            select: { title: "title" },
          },
        },
      ],
    }),
    defineField({
      name: "preFooter",
      title: "Pre-Footer Section",
      type: "object",
      fields: [
        defineField({
          name: "statement",
          title: "Statement",
          type: "text",
          rows: 2,
        }),
        defineField({
          name: "actionLabel",
          title: "Action Label",
          type: "string",
        }),
        defineField({
          name: "actionHref",
          title: "Action Path",
          type: "string",
        }),
        defineField({
          name: "image",
          title: "Background Image",
          type: "image",
          options: { hotspot: true },
        }),
      ],
    }),
    defineField({
      name: "closingStatement",
      title: "Closing Statement",
      type: "string",
      description: "The philosophical closing line.",
    }),
    defineField({
      name: "colophon",
      title: "Colophon",
      type: "string",
      description: "e.g. Sunnah Remedies · Est. MMXXV · Healing is from Allah · the remedy is a means",
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "platform", title: "Platform", type: "string" }),
            defineField({ name: "url", title: "URL", type: "url" }),
          ],
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Footer Settings" }),
  },
});
