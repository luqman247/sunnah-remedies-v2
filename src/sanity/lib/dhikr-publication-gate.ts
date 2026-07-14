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

/** One named, gate condition — see getDhikrEligibilityConditions. */
export interface DhikrEligibilityCondition {
  /** Stable identifier — do not rename without updating every consumer. */
  key:
    | "review-status-published"
    | "arabic-present"
    | "english-translation-present"
    | "danish-translation-present"
    | "valid-source-reference-present"
    | "scholarly-approval-present"
    | "editorial-approval-present";
  /** Human-readable description of what this condition checks. */
  label: string;
  /** Whether this specific condition is satisfied by the given document. */
  met: boolean;
}

/**
 * Granular breakdown of the canonical eligibility rule — the exact same
 * seven conditions expressed in DHIKR_ELIGIBILITY_GROQ and (previously)
 * inline in isDhikrItemPubliclyEligible, now factored out once so both the
 * boolean predicate and any UI that needs to explain *why* a document is
 * ineligible read from the same seven checks. Adding, removing, or
 * reordering a condition here changes public eligibility — do not add a
 * condition that is not already expressed in DHIKR_ELIGIBILITY_GROQ.
 *
 * Deliberately excludes several fields that are gated elsewhere but are not
 * part of THIS compound rule today (see docs/dhikr/21-decision-log.md for
 * the ADR recording this explicitly): category and titleEn are required to
 * *save* a document at all (schema-level `rule.required()`); the item's
 * public URL segment field is required only when saving reviewStatus as
 * "published" (a separate, field-specific Studio validator); transliteration,
 * recommendedRepetitions, and audioAsset are never required by anything.
 * None of that is the same thing as this compound public-eligibility rule,
 * and this function does not conflate them with it.
 */
export function getDhikrEligibilityConditions(
  doc: DhikrItemEligibilityInput,
): DhikrEligibilityCondition[] {
  return [
    {
      key: "review-status-published",
      label: 'reviewStatus is "published"',
      met: doc.reviewStatus === "published",
    },
    {
      key: "arabic-present",
      label: "Arabic text is present",
      met: !!doc.arabicText,
    },
    {
      key: "english-translation-present",
      label: "English translation is present",
      met: !!doc.translationEn,
    },
    {
      key: "danish-translation-present",
      label: "Danish translation is present",
      met: !!doc.translationDa,
    },
    {
      key: "valid-source-reference-present",
      label: "At least one source reference is present",
      met: Array.isArray(doc.sourceReferences) && doc.sourceReferences.length > 0,
    },
    {
      key: "scholarly-approval-present",
      label: "An approved scholarly board approval is present",
      met: hasApprovedDhikrBoard(doc.boardApprovals, "scholarly"),
    },
    {
      key: "editorial-approval-present",
      label: "An approved editorial board approval is present",
      met: hasApprovedDhikrBoard(doc.boardApprovals, "editorial"),
    },
  ];
}

/**
 * TypeScript mirror of DHIKR_ELIGIBILITY_GROQ, for use in Studio publish-time
 * validation and in behavioural tests. Must stay logically identical to the
 * GROQ fragment above — if you change one, change both. Implemented in terms
 * of getDhikrEligibilityConditions so the boolean predicate and the granular
 * breakdown can never drift apart — there is exactly one list of conditions.
 */
export function isDhikrItemPubliclyEligible(doc: DhikrItemEligibilityInput): boolean {
  return getDhikrEligibilityConditions(doc).every((condition) => condition.met);
}
