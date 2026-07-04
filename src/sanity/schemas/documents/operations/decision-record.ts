import { defineField, defineType } from "sanity";

/**
 * Decision Record — Logs Tier 2 and Tier 3 governance decisions.
 *
 * Builds institutional memory: what was decided, by whom, why, and which
 * standard it set or applied. Enables a successor to understand the
 * rationale behind institutional choices without meeting the decision-makers.
 *
 * @see Phase 4, Chapter 12 — Governance, Approvals & Escalation
 * @see Phase 4, Chapter 12.8 — Decision log
 */
export const decisionRecord = defineType({
  name: "decisionRecord",
  title: "Decision Record",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Decision Title",
      type: "string",
      description: "A clear, short description of the decision.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tier",
      title: "Tier",
      type: "string",
      options: {
        list: [
          { title: "Tier 2 — Judgement", value: "tier-2" },
          { title: "Tier 3 — Precedent", value: "tier-3" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date of Decision",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "decidedBy",
      title: "Decided By",
      type: "array",
      of: [{ type: "string" }],
      description: "Names and roles of those who made the decision.",
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "context",
      title: "Context",
      type: "text",
      rows: 4,
      description: "What prompted the decision — the question or situation.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "decision",
      title: "Decision",
      type: "text",
      rows: 4,
      description: "What was decided.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "rationale",
      title: "Rationale",
      type: "text",
      rows: 4,
      description: "Why this decision was made — the reasoning.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "standardSet",
      title: "Standard Set or Applied",
      type: "text",
      rows: 2,
      description: "If this decision creates or applies a standard, state it here.",
    }),
    defineField({
      name: "domain",
      title: "Domain",
      type: "string",
      options: {
        list: [
          { title: "Editorial / Scholarly", value: "editorial" },
          { title: "Clinical", value: "clinical" },
          { title: "Product / Apothecary", value: "product" },
          { title: "Academy / Teaching", value: "academy" },
          { title: "Sacred Journeys", value: "journeys" },
          { title: "Technology / Systems", value: "technology" },
          { title: "Brand / Voice", value: "brand" },
          { title: "People / Operations", value: "people" },
          { title: "Governance", value: "governance" },
        ],
      },
    }),
    defineField({
      name: "relatedDocuments",
      title: "Related Documents",
      type: "array",
      of: [
        { type: "reference", to: [{ type: "article" }, { type: "product" }, { type: "programme" }] },
      ],
      description: "Any documents this decision directly affects.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      tier: "tier",
      date: "date",
      domain: "domain",
    },
    prepare({ title, tier, date, domain }) {
      const tierLabel = tier === "tier-3" ? "T3" : "T2";
      return {
        title: `[${tierLabel}] ${title}`,
        subtitle: `${date || "No date"}${domain ? ` · ${domain}` : ""}`,
      };
    },
  },
  orderings: [
    {
      title: "Date (Newest)",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
});
