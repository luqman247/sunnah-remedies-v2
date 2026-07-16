import { defineField, defineType } from "sanity";

/**
 * Dhikr MDR Review Draft — staff-only scholarly-review capture.
 *
 * Deliberately a SEPARATE document type from `dhikrItem` (see
 * ../dhikr/dhikr-item.ts) and entirely disconnected from the canonical
 * publication gate (src/sanity/lib/dhikr-publication-gate.ts) and from
 * every public query. This document exists only so a qualified scholar can
 * review a research-register record (src/lib/dhikr-research/
 * morning-dhikr-register.ts) in a browser, save a draft, and submit a final
 * recommendation — for later, separate, human-controlled transcription into
 * the register via this project's standing checkpoint discipline. Nothing
 * here ever changes the live register, importStatus, computeImportGate, or
 * any public route, by itself.
 *
 * One document per MDR ID (`_id` is deterministic — see
 * src/app/(staff)/dhikr-mdr-review/actions.ts), so saving a draft always
 * updates in place rather than creating duplicates.
 *
 * @see docs/dhikr/40-scholarly-review-and-adjudication-framework.md
 * @see docs/dhikr/review/MDR-SCHOLARLY-DECISION-RECORD-TEMPLATE.md
 */

const DECISION_VALUES = ["", "approved", "approved-with-corrections", "deferred", "rejected"] as const;
const STATUS_VALUES = ["draft", "submitted"] as const;
const TIMING_VALUES = ["", "morning-only", "evening-only", "morning-and-evening", "not-time-specific", "uncertain"] as const;

export const dhikrMdrReviewDraft = defineType({
  name: "dhikrMdrReviewDraft",
  title: "Dhikr MDR Review Draft (staff-only)",
  type: "document",
  fields: [
    defineField({
      name: "mdrId",
      title: "MDR ID",
      type: "string",
      readOnly: true,
      validation: (rule) => rule.required().regex(/^MDR-\d{3}$/, { name: "MDR ID format" }),
    }),
    defineField({
      name: "sequenceNumber",
      title: "Sequence number",
      type: "number",
      readOnly: true,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: { list: STATUS_VALUES.map((v) => ({ title: v, value: v })) },
      initialValue: "draft",
    }),
    defineField({
      name: "decision",
      title: "Decision",
      type: "string",
      options: {
        list: [
          { title: "(not yet decided)", value: "" },
          { title: "Approve", value: "approved" },
          { title: "Approve with corrections", value: "approved-with-corrections" },
          { title: "Defer", value: "deferred" },
          { title: "Reject", value: "rejected" },
        ],
      },
      initialValue: "",
    }),
    defineField({ name: "correctedArabicText", title: "Corrected/approved Arabic text", type: "text" }),
    defineField({ name: "correctedEnglishText", title: "Corrected/approved English text", type: "text" }),
    defineField({ name: "approvedSourceReference", title: "Approved source reference", type: "text" }),
    defineField({
      name: "approvedTiming",
      title: "Approved timing",
      type: "string",
      options: { list: TIMING_VALUES.map((v) => ({ title: v || "(not set)", value: v })) },
    }),
    defineField({ name: "approvedRepetitionCount", title: "Approved repetition count", type: "number" }),
    defineField({ name: "approvedVirtueText", title: "Approved virtue/reward text", type: "text" }),
    defineField({
      name: "compositeClausesApproved",
      title: "All clauses independently approved (composite records only)",
      type: "boolean",
      initialValue: false,
    }),
    defineField({ name: "reviewerNotes", title: "Reviewer notes", type: "text" }),
    defineField({ name: "reviewerName", title: "Reviewer full name", type: "string" }),
    defineField({ name: "reviewerQualification", title: "Reviewer qualification", type: "string" }),
    defineField({ name: "reviewDate", title: "Review date", type: "date" }),
    defineField({
      name: "signedConfirmation",
      title: "Reviewer confirms this is their own signed decision",
      type: "boolean",
      initialValue: false,
    }),
    defineField({ name: "updatedAt", title: "Last updated", type: "datetime", readOnly: true }),
  ],
  preview: {
    select: { title: "mdrId", decision: "decision", status: "status" },
    prepare({ title, decision, status }) {
      return { title, subtitle: `${status}${decision ? ` — ${decision}` : ""}` };
    },
  },
});

export type DecisionValue = (typeof DECISION_VALUES)[number];
export type DraftStatus = (typeof STATUS_VALUES)[number];
