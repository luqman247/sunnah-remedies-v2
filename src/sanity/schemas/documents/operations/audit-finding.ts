import { defineField, defineType } from "sanity";

/**
 * Audit Finding — Records the outcome of an operational or content audit.
 *
 * Feeds the continuous-improvement loop: every audit finding is recorded,
 * actioned, and tracked to resolution. Recurring themes escalate to the
 * Standards Council and become versioned standard changes.
 *
 * @see Phase 4, Chapter 13 — Quality Standards & the QA Library
 * @see Phase 4, Chapter 13.5 — Continuous improvement
 */
export const auditFinding = defineType({
  name: "auditFinding",
  title: "Audit Finding",
  type: "document",
  fields: [
    defineField({
      name: "auditType",
      title: "Audit Type",
      type: "string",
      options: {
        list: [
          { title: "Content Audit — Quarterly Sample", value: "content-quarterly" },
          { title: "Content Audit — Annual Full", value: "content-annual" },
          { title: "Media Audit", value: "media" },
          { title: "Dispensary Audit", value: "dispensary" },
          { title: "Clinical Audit", value: "clinical" },
          { title: "Access Review", value: "access" },
          { title: "Safety Review", value: "safety" },
          { title: "Brand Review", value: "brand" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Audit Date",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "auditor",
      title: "Audited By",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "finding",
      title: "Finding",
      type: "text",
      rows: 4,
      description: "What was found — factual, specific.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "severity",
      title: "Severity",
      type: "string",
      options: {
        list: [
          { title: "Critical — immediate action required", value: "critical" },
          { title: "Major — action required before next audit", value: "major" },
          { title: "Minor — improvement opportunity", value: "minor" },
          { title: "Observation — noted, no action required", value: "observation" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "actionRequired",
      title: "Action Required",
      type: "text",
      rows: 3,
      description: "What must be done to resolve this finding.",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as Record<string, unknown> | undefined;
          const severity = parent?.severity as string | undefined;
          if ((severity === "critical" || severity === "major") && (!value || (typeof value === "string" && value.trim() === ""))) {
            return "An action is required for critical and major findings.";
          }
          return true;
        }),
    }),
    defineField({
      name: "actionOwner",
      title: "Action Owner",
      type: "string",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as Record<string, unknown> | undefined;
          const severity = parent?.severity as string | undefined;
          if ((severity === "critical" || severity === "major") && (!value || (typeof value === "string" && value.trim() === ""))) {
            return "An action owner is required for critical and major findings.";
          }
          return true;
        }),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Open", value: "open" },
          { title: "In Progress", value: "in-progress" },
          { title: "Resolved", value: "resolved" },
          { title: "Accepted (no action)", value: "accepted" },
        ],
      },
      initialValue: "open",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "resolvedDate",
      title: "Date Resolved / Accepted",
      type: "date",
      hidden: ({ parent }) => parent?.status !== "resolved" && parent?.status !== "accepted",
    }),
    defineField({
      name: "resolutionNotes",
      title: "Resolution / Acceptance Notes",
      type: "text",
      rows: 2,
      hidden: ({ parent }) => parent?.status !== "resolved" && parent?.status !== "accepted",
    }),
    defineField({
      name: "relatedDocuments",
      title: "Related Documents",
      type: "array",
      of: [
        { type: "reference", to: [{ type: "article" }, { type: "product" }, { type: "mediaAsset" }] },
      ],
    }),
  ],
  preview: {
    select: {
      finding: "finding",
      severity: "severity",
      status: "status",
      date: "date",
      auditType: "auditType",
    },
    prepare({ finding, severity, status, date, auditType }) {
      const severityLabels: Record<string, string> = {
        critical: "CRITICAL",
        major: "Major",
        minor: "Minor",
        observation: "Obs",
      };
      const truncated = finding && finding.length > 60
        ? finding.substring(0, 60) + "…"
        : finding;
      return {
        title: `[${severityLabels[severity] || severity}] ${truncated || "No description"}`,
        subtitle: `${auditType || ""} · ${date || ""} · ${status || ""}`,
      };
    },
  },
  orderings: [
    {
      title: "Date (Newest)",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
    {
      title: "Severity",
      name: "severityAsc",
      by: [{ field: "severity", direction: "asc" }],
    },
  ],
});
