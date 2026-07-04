import { defineField, defineType } from "sanity";
import { requiredWhenSlowLane } from "@/sanity/validation/governance";

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
          { title: "Slow Lane (Hold)", value: "slow-lane" },
          { title: "Published", value: "published" },
          { title: "Scheduled", value: "scheduled" },
          { title: "Archived", value: "archived" },
        ],
        layout: "radio",
      },
      initialValue: "draft",
    }),
    defineField({
      name: "slowLaneReason",
      title: "Slow Lane Reason",
      type: "text",
      rows: 2,
      description: "Why this item is held. Required when status is Slow Lane.",
      hidden: ({ parent }) => parent?.status !== "slow-lane",
      validation: (rule) => rule.custom(requiredWhenSlowLane),
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
      hidden: ({ parent }) => parent?.status !== "scheduled",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as Record<string, unknown> | undefined;
          if (parent?.status === "scheduled" && !value) {
            return "A publish date is required when status is Scheduled.";
          }
          return true;
        }),
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
    defineField({
      name: "boardApprovals",
      title: "Board Approvals",
      type: "array",
      description: "Required sign-offs per the approval matrix (Ch 12).",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "board",
              title: "Board / Authority",
              type: "string",
              options: {
                list: [
                  { title: "Scholarly Review Board", value: "scholarly" },
                  { title: "Clinical Review Board", value: "clinical" },
                  { title: "Editorial", value: "editorial" },
                  { title: "Head of Apothecary", value: "apothecary" },
                  { title: "Head of Media", value: "media" },
                  { title: "Standards Council", value: "standards-council" },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "approved",
              title: "Approved",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "approver",
              title: "Approver Name",
              type: "string",
            }),
            defineField({
              name: "date",
              title: "Date",
              type: "date",
            }),
          ],
          preview: {
            select: { board: "board", approved: "approved", approver: "approver" },
            prepare({ board, approved, approver }) {
              return {
                title: board || "Unknown",
                subtitle: approved ? `Approved by ${approver || "—"}` : "Pending",
              };
            },
          },
        },
      ],
    }),
  ],
});
