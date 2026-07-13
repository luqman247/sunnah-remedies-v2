/**
 * Governance validation rules for Sanity documents.
 *
 * These functions return Sanity custom validation callbacks suitable for
 * use with the `validation: (rule) => rule.custom(...)` pattern.
 *
 * @see Phase 4, Chapter 12.3 — Approval matrix
 * @see Phase 4, Chapter 12.4 — The slow lane
 * @see Phase 4, Chapter 09.2 — Editorial desk SOP (provenance required)
 */

import { hasApprovedDhikrBoard } from "@/sanity/lib/dhikr-publication-gate";

/**
 * Validates that a value exists when the document's editorial status is "published".
 * Used for fields that must be filled before publishing.
 */
export function requiredWhenPublished(message: string) {
  return (value: unknown, context: { document?: Record<string, unknown> }) => {
    const editorial = context.document?.editorial as { status?: string } | undefined;
    if (editorial?.status === "published" && !value) {
      return message;
    }
    return true;
  };
}

/**
 * Validates that a slow-lane hold has a reason provided.
 */
export function requiredWhenSlowLane(value: unknown, context: { parent?: unknown }) {
  const parent = context.parent as Record<string, unknown> | undefined;
  if (parent?.status === "slow-lane" && (!value || (typeof value === "string" && value.trim() === ""))) {
    return "A reason is required when holding content in the slow lane.";
  }
  return true;
}

/**
 * Validates that a Dhikr item field is populated before its reviewStatus can
 * be "published". Mirrors the mandatory-field arm of the canonical rule in
 * src/sanity/lib/dhikr-publication-gate.ts — if that rule changes, this must
 * change too.
 *
 * @see docs/dhikr/03-authenticity-and-scholarly-review-policy.md
 */
export function requiredWhenDhikrPublished(message: string) {
  return (value: unknown, context: { document?: Record<string, unknown> }) => {
    const reviewStatus = context.document?.reviewStatus as string | undefined;
    if (reviewStatus === "published" && !value) {
      return message;
    }
    return true;
  };
}

/**
 * Validates that a Dhikr item has at least one source reference before its
 * reviewStatus can be "published".
 *
 * @see docs/dhikr/03-authenticity-and-scholarly-review-policy.md
 */
export function requiredDhikrSourceReferences(value: unknown, context: { document?: Record<string, unknown> }) {
  const reviewStatus = context.document?.reviewStatus as string | undefined;
  if (reviewStatus === "published" && (!Array.isArray(value) || value.length === 0)) {
    return "At least one source reference is required before publishing.";
  }
  return true;
}

/**
 * Validates that both the required scholarly and required editorial board
 * approvals are present and approved before a Dhikr item's reviewStatus can
 * be "published". A single board approval of either kind is not sufficient —
 * both roles must independently sign off (see docs/dhikr/03: the editorial
 * reviewer cannot approve on authenticity grounds, and the scholarly reviewer
 * is not a substitute for the editorial/presentation pass).
 *
 * Reuses hasApprovedDhikrBoard from dhikr-publication-gate.ts so this check
 * cannot drift out of sync with the canonical eligibility rule.
 *
 * @see src/sanity/lib/dhikr-publication-gate.ts
 * @see docs/dhikr/03-authenticity-and-scholarly-review-policy.md
 * @see docs/dhikr/20-risk-register.md (R-01)
 */
export function requiredDhikrBoardApprovals(value: unknown, context: { document?: Record<string, unknown> }) {
  const reviewStatus = context.document?.reviewStatus as string | undefined;
  if (reviewStatus !== "published") return true;

  const approvals = Array.isArray(value) ? (value as { board?: string; approved?: boolean }[]) : [];
  const hasScholarly = hasApprovedDhikrBoard(approvals, "scholarly");
  const hasEditorial = hasApprovedDhikrBoard(approvals, "editorial");

  if (!hasScholarly && !hasEditorial) {
    return "Both scholarly and editorial board approval are required before publishing.";
  }
  if (!hasScholarly) {
    return "Scholarly Review Board approval is required before publishing.";
  }
  if (!hasEditorial) {
    return "Editorial approval is required before publishing.";
  }
  return true;
}
