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
              name: "description",
              title: "Description",
              type: "string",
              description: "Short description for dropdown menus.",
            }),
            defineField({
              name: "highlighted",
              title: "Highlighted",
              type: "boolean",
              description: "Display as accent/highlighted link.",
              initialValue: false,
            }),
            defineField({
              name: "hidden",
              title: "Hidden",
              type: "boolean",
              description: "Temporarily hide this item without deleting it.",
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
                    defineField({ name: "label", title: "Label", type: "string", validation: (rule) => rule.required() }),
                    defineField({ name: "href", title: "Path", type: "string", validation: (rule) => rule.required() }),
                    defineField({ name: "description", title: "Description", type: "string" }),
                  ],
                  preview: {
                    select: { title: "label", subtitle: "href" },
                  },
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
        defineField({ name: "active", title: "Active", type: "boolean", initialValue: false }),
        defineField({ name: "message", title: "Message", type: "string" }),
        defineField({ name: "link", title: "Link", type: "string" }),
        defineField({ name: "linkLabel", title: "Link Label", type: "string" }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Navigation" }),
  },
});
