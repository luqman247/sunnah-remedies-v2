import { defineField, defineType } from "sanity";

export const editorialWorkflow = defineType({
  name: "editorialWorkflow",
  title: "Editorial Workflow",
  type: "object",
  fields: [
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "In Review", value: "in-review" },
          { title: "Published", value: "published" },
          { title: "Scheduled", value: "scheduled" },
          { title: "Archived", value: "archived" },
        ],
        layout: "radio",
      },
      initialValue: "draft",
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "faculty" }],
    }),
    defineField({
      name: "reviewer",
      title: "Reviewer",
      type: "string",
    }),
    defineField({
      name: "approvalDate",
      title: "Approval Date",
      type: "datetime",
    }),
    defineField({
      name: "scheduledPublishDate",
      title: "Scheduled Publish Date",
      type: "datetime",
    }),
    defineField({
      name: "revisionNotes",
      title: "Revision Notes",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "versionNumber",
      title: "Version Number",
      type: "string",
    }),
    defineField({
      name: "lastUpdated",
      title: "Last Updated",
      type: "datetime",
    }),
  ],
});
