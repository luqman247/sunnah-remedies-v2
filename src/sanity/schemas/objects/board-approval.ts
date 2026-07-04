import { defineField, defineType } from "sanity";

/**
 * Board Approval object — reusable approval record.
 *
 * Used by the editorial workflow and governance schemas to record
 * sign-offs from institutional boards per the approval matrix.
 *
 * @see Phase 4, Chapter 12.3 — The approval matrix
 */
export const boardApproval = defineType({
  name: "boardApproval",
  title: "Board Approval",
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
    defineField({
      name: "notes",
      title: "Notes",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    select: { board: "board", approved: "approved", approver: "approver", date: "date" },
    prepare({ board, approved, approver, date }) {
      return {
        title: board || "Unknown Board",
        subtitle: approved
          ? `Approved by ${approver || "—"} on ${date || "—"}`
          : "Pending approval",
      };
    },
  },
});
