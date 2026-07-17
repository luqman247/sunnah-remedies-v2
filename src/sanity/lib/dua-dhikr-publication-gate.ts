/**
 * Duʿa & Dhikr Publication Gate — single canonical eligibility rule for
 * `duaDhikrEntry` documents.
 *
 * Deliberately mirrors src/sanity/lib/dhikr-publication-gate.ts (the
 * Morning/Evening Dhikr gate) rather than importing from it, because the
 * two content types are independent: a change to one gate must never
 * silently change the other's behaviour. See docs/dua-dhikr/REVIEW_BYPASS.md
 * for the full explanation of both pathways below and exactly what the
 * "temporary scholarly-review bypass" does and does not do.
 *
 * "Publicly eligible" (canonical, scholarly-approved pathway) means all of:
 *   - reviewStatus is "published"
 *   - arabicText, translationEn, translationDa are present
 *   - at least one sourceReference is present
 *   - an approved "scholarly" board approval is recorded
 *   - an approved "editorial" board approval is recorded
 *
 * @see docs/dua-dhikr/CONTENT_MODEL.md
 * @see docs/dua-dhikr/REVIEW_BYPASS.md
 * @see docs/dua-dhikr/SOURCE_POLICY.md
 */

export const DUA_DHIKR_ELIGIBILITY_GROQ = `
  reviewStatus == "published"
  && defined(arabicText) && arabicText != ""
  && defined(translationEn) && translationEn != ""
  && defined(translationDa) && translationDa != ""
  && count(sourceReferences) > 0
  && count(boardApprovals[board == "scholarly" && approved == true]) > 0
  && count(boardApprovals[board == "editorial" && approved == true]) > 0
`.trim();

export interface DuaDhikrBoardApprovalLike {
  board?: string;
  approved?: boolean;
}

export interface DuaDhikrEntryEligibilityInput {
  reviewStatus?: string;
  arabicText?: string;
  translationEn?: string;
  translationDa?: string;
  sourceReferences?: unknown[];
  boardApprovals?: DuaDhikrBoardApprovalLike[];
}

export function hasApprovedDuaDhikrBoard(
  approvals: DuaDhikrBoardApprovalLike[] | undefined,
  board: "scholarly" | "editorial",
): boolean {
  return Array.isArray(approvals) && approvals.some((a) => a?.board === board && a?.approved === true);
}

export interface DuaDhikrEligibilityCondition {
  key:
    | "review-status-published"
    | "arabic-present"
    | "english-translation-present"
    | "danish-translation-present"
    | "valid-source-reference-present"
    | "scholarly-approval-present"
    | "editorial-approval-present";
  label: string;
  met: boolean;
}

export function getDuaDhikrEligibilityConditions(
  doc: DuaDhikrEntryEligibilityInput,
): DuaDhikrEligibilityCondition[] {
  return [
    { key: "review-status-published", label: 'reviewStatus is "published"', met: doc.reviewStatus === "published" },
    { key: "arabic-present", label: "Arabic text is present", met: !!doc.arabicText },
    { key: "english-translation-present", label: "English translation is present", met: !!doc.translationEn },
    { key: "danish-translation-present", label: "Danish translation is present", met: !!doc.translationDa },
    {
      key: "valid-source-reference-present",
      label: "At least one source reference is present",
      met: Array.isArray(doc.sourceReferences) && doc.sourceReferences.length > 0,
    },
    {
      key: "scholarly-approval-present",
      label: "An approved scholarly board approval is present",
      met: hasApprovedDuaDhikrBoard(doc.boardApprovals, "scholarly"),
    },
    {
      key: "editorial-approval-present",
      label: "An approved editorial board approval is present",
      met: hasApprovedDuaDhikrBoard(doc.boardApprovals, "editorial"),
    },
  ];
}

export function isDuaDhikrEntryPubliclyEligible(doc: DuaDhikrEntryEligibilityInput): boolean {
  return getDuaDhikrEligibilityConditions(doc).every((condition) => condition.met);
}

/**
 * Editorial-publication pathway — the temporary, reversible scholarly-review
 * bypass for THIS Duʿa & Dhikr expansion phase only (see docs/dua-dhikr/
 * REVIEW_BYPASS.md). A SEPARATE, additive rule from DUA_DHIKR_ELIGIBILITY_GROQ
 * above — never touches or weakens it. Requires only an EDITORIAL board
 * approval (never scholarly) plus editorialPublicationStatus explicitly set
 * by a human editorial reviewer. Any route surfacing content eligible only
 * through this rule MUST display a neutral "scholarly review pending" note —
 * never a claim of scholarly approval or "scholarly reviewed" status.
 */
export const DUA_DHIKR_EDITORIAL_ELIGIBILITY_GROQ = `
  editorialPublicationStatus == "editorial-only-scholarly-review-pending"
  && defined(arabicText) && arabicText != ""
  && defined(translationEn) && translationEn != ""
  && defined(translationDa) && translationDa != ""
  && count(sourceReferences) > 0
  && count(boardApprovals[board == "editorial" && approved == true]) > 0
`.trim();

export interface DuaDhikrEntryEditorialEligibilityInput {
  editorialPublicationStatus?: string;
  arabicText?: string;
  translationEn?: string;
  translationDa?: string;
  sourceReferences?: unknown[];
  boardApprovals?: DuaDhikrBoardApprovalLike[];
}

export interface DuaDhikrEditorialEligibilityCondition {
  key:
    | "editorial-publication-status-set"
    | "arabic-present"
    | "english-translation-present"
    | "danish-translation-present"
    | "valid-source-reference-present"
    | "editorial-approval-present";
  label: string;
  met: boolean;
}

export function getDuaDhikrEditorialEligibilityConditions(
  doc: DuaDhikrEntryEditorialEligibilityInput,
): DuaDhikrEditorialEligibilityCondition[] {
  return [
    {
      key: "editorial-publication-status-set",
      label: 'editorialPublicationStatus is "editorial-only-scholarly-review-pending"',
      met: doc.editorialPublicationStatus === "editorial-only-scholarly-review-pending",
    },
    { key: "arabic-present", label: "Arabic text is present", met: !!doc.arabicText },
    { key: "english-translation-present", label: "English translation is present", met: !!doc.translationEn },
    { key: "danish-translation-present", label: "Danish translation is present", met: !!doc.translationDa },
    {
      key: "valid-source-reference-present",
      label: "At least one source reference is present",
      met: Array.isArray(doc.sourceReferences) && doc.sourceReferences.length > 0,
    },
    {
      key: "editorial-approval-present",
      label: "An approved editorial board approval is present",
      met: hasApprovedDuaDhikrBoard(doc.boardApprovals, "editorial"),
    },
  ];
}

export function isDuaDhikrEntryEditoriallyPubliclyEligible(
  doc: DuaDhikrEntryEditorialEligibilityInput,
): boolean {
  return getDuaDhikrEditorialEligibilityConditions(doc).every((condition) => condition.met);
}
