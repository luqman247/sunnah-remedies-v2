import { defineField, defineType } from "sanity";

export const navigation = defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  fields: [
    defineField({
      name: "mainNavigation",
      title: "Main Navigation",
      type: "array",
      of: [
        {
          type: "object",
          name: "navItem",
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
              name: "highlighted",
              title: "Highlighted",
              type: "boolean",
              description: "Visually accent this item (e.g. Clinical Consultations).",
              initialValue: false,
            }),
            defineField({
              name: "hidden",
              title: "Hidden",
              type: "boolean",
              description: "Hide from navigation without deleting.",
              initialValue: false,
            }),
            defineField({
              name: "children",
              title: "Dropdown Items",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({ name: "label", title: "Label", type: "string" }),
                    defineField({ name: "href", title: "Path", type: "string" }),
                    defineField({ name: "description", title: "Description", type: "string" }),
                  ],
                },
              ],
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "href" },
          },
        },
      ],
    }),
    defineField({
      name: "announcementBar",
      title: "Announcement Bar",
      type: "object",
      fields: [
        defineField({
          name: "enabled",
          title: "Enabled",
          type: "boolean",
          initialValue: false,
        }),
        defineField({
          name: "message",
          title: "Message",
          type: "string",
        }),
        defineField({
          name: "link",
          title: "Link",
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "href", title: "Path", type: "string" }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Navigation" }),
  },
});
