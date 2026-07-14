import type { DocumentBadgeComponent, DocumentBadgeDescription } from "sanity";
import {
  getDhikrEligibilityConditions,
  type DhikrItemEligibilityInput,
} from "@/sanity/lib/dhikr-publication-gate";

/**
 * Dhikr Item — document badge (Stage 2B).
 *
 * Read-only. Registered in sanity.config.ts, scoped to dhikrItem only.
 * Never mutates reviewStatus, boardApprovals, or any other field — a badge
 * component in Sanity Studio has no write access by construction, it only
 * renders a label/colour derived from the document state it's given.
 *
 * All condition checks come from getDhikrEligibilityConditions()
 * (src/sanity/lib/dhikr-publication-gate.ts) — the seven canonical
 * conditions are never re-implemented here. reviewStatus itself is read
 * directly from the document, exactly as stored (no renamed/invented values).
 *
 * Exactly one badge is returned per document, so no two badges can ever
 * show simultaneously or contradict each other.
 *
 * Precedence (first matching rule wins):
 *   1. Blocked                    — reviewStatus is "approved" or "published",
 *                                    but at least one of the six non-status
 *                                    canonical conditions is not met (an
 *                                    inconsistent state: the document claims
 *                                    a late stage its own content/approvals
 *                                    don't support).
 *   2. Published                  — reviewStatus === "published" (and, since
 *                                    rule 1 didn't match, every condition is
 *                                    genuinely met).
 *   3. Approved                   — reviewStatus === "approved" (and every
 *                                    condition is genuinely met).
 *   4. Awaiting editorial review  — reviewStatus === "editorial-review".
 *   5. Awaiting scholarly review  — reviewStatus === "scholarly-review".
 *   6. Awaiting sources           — reviewStatus === "sourced" AND Arabic
 *                                    text is present AND no source
 *                                    reference is present yet.
 *   7. Draft                      — reviewStatus === "sourced" and Arabic
 *                                    text is not yet present (the default
 *                                    state for a newly created document).
 *
 * @see docs/dhikr/21-decision-log.md
 */

const NON_STATUS_CONDITION_KEYS = [
  "arabic-present",
  "english-translation-present",
  "danish-translation-present",
  "valid-source-reference-present",
  "scholarly-approval-present",
  "editorial-approval-present",
] as const;

function met(conditions: ReturnType<typeof getDhikrEligibilityConditions>, key: string): boolean {
  return conditions.find((c) => c.key === key)?.met === true;
}

export const dhikrItemReadinessBadge: DocumentBadgeComponent = (props) => {
  const doc = props.draft ?? props.published;
  if (!doc) return null;

  const eligibilityInput = doc as DhikrItemEligibilityInput;
  const conditions = getDhikrEligibilityConditions(eligibilityInput);
  const reviewStatus = (doc as { reviewStatus?: string }).reviewStatus;

  const nonStatusConditionsAllMet = NON_STATUS_CONDITION_KEYS.every((key) => met(conditions, key));

  const badge = (label: string, title: string, color: DocumentBadgeDescription["color"]): DocumentBadgeDescription => ({
    label,
    title,
    color,
  });

  if ((reviewStatus === "approved" || reviewStatus === "published") && !nonStatusConditionsAllMet) {
    return badge(
      "Blocked",
      `reviewStatus is "${reviewStatus}" but not every canonical publication condition is met — review the Publication Readiness tab.`,
      "danger",
    );
  }
  if (reviewStatus === "published") {
    return badge("Published", "Publicly visible — reviewStatus is \"published\" and every canonical condition is met.", "success");
  }
  if (reviewStatus === "approved") {
    return badge("Approved", "Every canonical condition is met; not yet published.", "primary");
  }
  if (reviewStatus === "editorial-review") {
    return badge("Awaiting editorial review", "reviewStatus is \"editorial-review\".", "warning");
  }
  if (reviewStatus === "scholarly-review") {
    return badge("Awaiting scholarly review", "reviewStatus is \"scholarly-review\".", "warning");
  }
  if (reviewStatus === "sourced") {
    if (met(conditions, "arabic-present") && !met(conditions, "valid-source-reference-present")) {
      return badge("Awaiting sources", "Arabic text is present but no source reference has been added yet.", "warning");
    }
    return badge("Draft", "reviewStatus is \"sourced\" and Arabic text has not yet been entered.", "primary");
  }

  return null;
};

/**
 * document.badges resolver — registered as-is in sanity.config.ts. Exported
 * separately (rather than defined inline in sanity.config.ts) so its
 * scoping behaviour is directly unit-testable: for any schemaType other
 * than "dhikrItem" it must return `prev` completely unchanged, identity,
 * so every other document type's existing badges are unaffected.
 */
export const dhikrItemBadgesResolver = (
  prev: DocumentBadgeComponent[],
  context: { schemaType: string },
): DocumentBadgeComponent[] =>
  context.schemaType === "dhikrItem" ? [...prev, dhikrItemReadinessBadge] : prev;
