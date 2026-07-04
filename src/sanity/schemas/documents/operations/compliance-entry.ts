import { defineField, defineType } from "sanity";

/**
 * Compliance Entry — A single regulatory obligation in the institution's
 * live compliance register.
 *
 * The Standards Council owns this register. Nothing regulated goes live
 * without its entry showing green. Each entry tracks: the obligation,
 * who owns it, what evidence is held, and when it must be renewed.
 *
 * @see Phase 4, Chapter 04.2 — The compliance map
 * @see Phase 4, Chapter 12 — Governance
 */
export const complianceEntry = defineType({
  name: "complianceEntry",
  title: "Compliance Entry",
  type: "document",
  fields: [
    defineField({
      name: "obligation",
      title: "Obligation",
      type: "string",
      description: "The regulatory requirement or licence.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Health & Safety", value: "health-safety" },
          { title: "Clinical Governance", value: "clinical" },
          { title: "Special Treatment Licence", value: "special-treatment" },
          { title: "Food Safety & Hygiene", value: "food-safety" },
          { title: "Waste Management", value: "waste" },
          { title: "Data Protection", value: "data-protection" },
          { title: "Safeguarding", value: "safeguarding" },
          { title: "Insurance", value: "insurance" },
          { title: "Consumer / Advertising / Labelling", value: "consumer" },
          { title: "Employment", value: "employment" },
          { title: "Fire Safety", value: "fire" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "owner",
      title: "Owner",
      type: "string",
      description: "The role or person accountable for maintaining this obligation.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Green — Compliant", value: "green" },
          { title: "Amber — Renewal Due", value: "amber" },
          { title: "Red — Non-Compliant / Expired", value: "red" },
          { title: "Pending — Not Yet Obtained", value: "pending" },
        ],
        layout: "radio",
      },
      initialValue: "pending",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "evidenceHeld",
      title: "Evidence Held",
      type: "text",
      rows: 2,
      description: "What documentation or proof is on file.",
    }),
    defineField({
      name: "renewalDate",
      title: "Renewal / Review Date",
      type: "date",
      description: "When this obligation must be renewed or reviewed.",
    }),
    defineField({
      name: "obtainedDate",
      title: "Date Obtained",
      type: "date",
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: "obligation",
      status: "status",
      renewal: "renewalDate",
      category: "category",
    },
    prepare({ title, status, renewal, category }) {
      const statusIcons: Record<string, string> = {
        green: "●",
        amber: "◐",
        red: "○",
        pending: "…",
      };
      return {
        title: `${statusIcons[status] || "?"} ${title}`,
        subtitle: `${category || ""} · Renewal: ${renewal || "Not set"}`,
      };
    },
  },
  orderings: [
    {
      title: "Renewal Date (Soonest)",
      name: "renewalAsc",
      by: [{ field: "renewalDate", direction: "asc" }],
    },
    {
      title: "Category",
      name: "categoryAsc",
      by: [{ field: "category", direction: "asc" }],
    },
  ],
});
