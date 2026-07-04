import { defineField, defineType } from "sanity";

export const announcement = defineType({
  name: "announcement",
  title: "Announcement",
  type: "document",
  fields: [
    defineField({
      name: "message",
      title: "Message",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      initialValue: false,
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
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "datetime",
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "datetime",
    }),
    defineField({
      name: "department",
      title: "Department",
      type: "string",
      options: {
        list: [
          { title: "All", value: "all" },
          { title: "Apothecary", value: "apothecary" },
          { title: "Academy", value: "academy" },
          { title: "Sacred Journeys", value: "sacred-journeys" },
          { title: "Knowledge Library", value: "knowledge-library" },
          { title: "Practitioner Portal", value: "practitioner" },
          { title: "Student Campus", value: "student" },
        ],
      },
      initialValue: "all",
    }),
  ],
  preview: {
    select: { title: "message", subtitle: "active" },
    prepare: ({ title, subtitle }) => ({
      title,
      subtitle: subtitle ? "Active" : "Inactive",
    }),
  },
});
