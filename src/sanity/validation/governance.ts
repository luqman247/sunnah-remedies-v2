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
