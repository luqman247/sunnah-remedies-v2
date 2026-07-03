import { defineField, defineType } from "sanity";

export const footerSettings = defineType({
  name: "footerSettings",
  title: "Footer",
  type: "document",
  fields: [
    defineField({
      name: "preFooterStatement",
      title: "Pre-Footer Statement",
      type: "string",
      description: "The closing statement displayed above the footer.",
      initialValue: "Begin where you are. Whether you seek a remedy, wish to study, or are preparing for pilgrimage — the institution is open.",
    }),
    defineField({
      name: "preFooterAction",
      title: "Pre-Footer Action",
      type: "object",
      fields: [
        defineField({ name: "label", title: "Label", type: "string" }),
        defineField({ name: "href", title: "Path", type: "string" }),
      ],
    }),
    defineField({
      name: "columns",
      title: "Footer Columns",
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
                    defineField({ name: "label", title: "Label", type: "string", validation: (rule) => rule.required() }),
                    defineField({ name: "href", title: "Path", type: "string", validation: (rule) => rule.required() }),
                  ],
                  preview: {
                    select: { title: "label", subtitle: "href" },
                  },
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
      name: "closingStatement",
      title: "Closing Statement",
      type: "string",
      initialValue: "Knowledge before commerce. Service before profit. Trust before growth.",
    }),
    defineField({
      name: "colophon",
      title: "Colophon",
      type: "string",
      initialValue: "Sunnah Remedies · Est. MMXXV · Healing is from Allah · the remedy is a means",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Footer Settings" }),
  },
});
