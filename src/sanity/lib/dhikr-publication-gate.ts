/**
 * Dhikr Publication Gate — single canonical eligibility rule.
 *
 * "Publicly eligible" means all of the following, together:
 *   - reviewStatus is "published" (not merely "approved" — approved means
 *     reviews passed, not that publication has been authorised/activated)
 *   - mandatory content fields are present: arabicText, translationEn,
 *     translationDa, at least one sourceReference
 *   - a "scholarly" board approval is recorded with approved == true
 *   - an "editorial" board approval is recorded with approved == true
 *
 * This is the ONE place this rule is expressed. The public GROQ query
 * (queries.ts), the Studio publish-time validator (validation/governance.ts),
 * and the test suite (tests/dhikr/) all import from here so the safeguard
 * cannot drift out of sync across call sites.
 *
 * @see docs/dhikr/03-authenticity-and-scholarly-review-policy.md
 * @see docs/dhikr/12-sanity-integration-plan.md
 * @see docs/dhikr/20-risk-register.md (R-01)
 */

/** GROQ fragment — interpolate into any query that must only surface eligible items. */
export const DHIKR_ELIGIBILITY_GROQ = `
  reviewStatus == "published"
  && defined(arabicText) && arabicText != ""
  && defined(translationEn) && translationEn != ""
  && defined(translationDa) && translationDa != ""
  && count(sourceReferences) > 0
  && count(boardApprovals[board == "scholarly" && approved == true]) > 0
  && count(boardApprovals[board == "editorial" && approved == true]) > 0
`.trim();

export interface DhikrBoardApprovalLike {
  board?: string;
  approved?: boolean;
}

export interface DhikrItemEligibilityInput {
  reviewStatus?: string;
  arabicText?: string;
  translationEn?: string;
  translationDa?: string;
  sourceReferences?: unknown[];
  boardApprovals?: DhikrBoardApprovalLike[];
}

/** Shared by the TS predicate below and by governance.ts's Studio validators. */
export function hasApprovedDhikrBoard(
  approvals: DhikrBoardApprovalLike[] | undefined,
  board: "scholarly" | "editorial",
): boolean {
  return Array.isArray(approvals) && approvals.some((a) => a?.board === board && a?.approved === true);
}

/**
 * TypeScript mirror of DHIKR_ELIGIBILITY_GROQ, for use in Studio publish-time
 * validation and in behavioural tests. Must stay logically identical to the
 * GROQ fragment above — if you change one, change both.
 */
export function isDhikrItemPubliclyEligible(doc: DhikrItemEligibilityInput): boolean {
  return (
    doc.reviewStatus === "published" &&
    !!doc.arabicText &&
    !!doc.translationEn &&
    !!doc.translationDa &&
    Array.isArray(doc.sourceReferences) &&
    doc.sourceReferences.length > 0 &&
    hasApprovedDhikrBoard(doc.boardApprovals, "scholarly") &&
    hasApprovedDhikrBoard(doc.boardApprovals, "editorial")
  );
}
