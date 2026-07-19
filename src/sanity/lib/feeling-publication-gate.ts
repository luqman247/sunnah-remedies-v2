/**
 * "I am feeling…" Publication Gate — single canonical eligibility rule for
 * `feelingState` documents.
 *
 * Deliberately independent of src/sanity/lib/dua-dhikr-publication-gate.ts
 * (never imports from it) — a change to one gate must never silently change
 * the other's behaviour. This gate governs only a feelingState document's
 * OWN curatorial copy and whether its page exists publicly at all; whether
 * a given featured duaDhikrEntry itself renders is decided completely
 * independently by isDuaDhikrEntryPubliclyEligibleForLocale (imported,
 * never reimplemented) — see docs/i-am-feeling/SPEC.md §6.
 *
 * "Publicly eligible" (English) means all of:
 *   - launchStatus is "launch" (deferred/not-suitable states never publish,
 *     regardless of reviewStatus — this is what keeps "Troubled by Doubts"
 *     off the live site even if every other field were somehow complete)
 *   - reviewStatus is "published"
 *   - labelEn, introductionEn, practicalNextStepEn are present
 *   - at least one featuredEntries item is present
 *   - if safeguardingLevel is not "standard": professionalSupportNoteEn is
 *     present AND an approved "clinical" board approval is recorded
 *
 * Danish eligibility additionally requires labelDa, introductionDa,
 * practicalNextStepDa, and (when non-standard safeguarding) professionalSupportNoteDa —
 * no silent fallback to English copy (SPEC §2, §6).
 *
 * Uses length(field) > 0 rather than defined(field) && field != "" — GROQ's
 * filter-stage defined() has previously shown reproducible false negatives
 * for long, real text fields in this exact codebase (see the equivalent
 * note in dua-dhikr-publication-gate.ts). Written with length() from the
 * start rather than rediscovering that bug here.
 */

export interface FeelingBoardApprovalLike {
  board?: string;
  approved?: boolean;
}

export function hasApprovedFeelingBoard(
  approvals: FeelingBoardApprovalLike[] | undefined,
  board: "clinical" | "scholarly" | "standards-council" | "editorial",
): boolean {
  return Array.isArray(approvals) && approvals.some((a) => a?.board === board && a?.approved === true);
}

export interface FeelingStateEligibilityInput {
  launchStatus?: string;
  reviewStatus?: string;
  labelEn?: string;
  labelDa?: string;
  introductionEn?: string;
  introductionDa?: string;
  practicalNextStepEn?: string;
  practicalNextStepDa?: string;
  professionalSupportNoteEn?: string;
  professionalSupportNoteDa?: string;
  safeguardingLevel?: string;
  featuredEntries?: unknown[];
  boardApprovals?: FeelingBoardApprovalLike[];
}

function requiresElevatedSafeguarding(safeguardingLevel: string | undefined): boolean {
  return safeguardingLevel === "heightened" || safeguardingLevel === "crisis-adjacent";
}

export interface FeelingEligibilityCondition {
  key: string;
  label: string;
  met: boolean;
}

/** Shared conditions independent of locale (launch status, review status, featured entries, safeguarding gate). */
function baseConditions(doc: FeelingStateEligibilityInput): FeelingEligibilityCondition[] {
  const elevated = requiresElevatedSafeguarding(doc.safeguardingLevel);
  const clinicalApproved = hasApprovedFeelingBoard(doc.boardApprovals, "clinical");
  const standardsCouncilApproved = hasApprovedFeelingBoard(doc.boardApprovals, "standards-council");
  const conditions: FeelingEligibilityCondition[] = [
    { key: "launch-status", label: 'launchStatus is "launch"', met: doc.launchStatus === "launch" },
    { key: "review-status-published", label: 'reviewStatus is "published"', met: doc.reviewStatus === "published" },
    {
      key: "featured-entries-present",
      label: "At least one featured duʿā is present",
      met: Array.isArray(doc.featuredEntries) && doc.featuredEntries.length > 0,
    },
  ];
  if (elevated) {
    conditions.push({
      key: "clinical-approval-present",
      label: "An approved clinical board approval is present",
      met: clinicalApproved,
    });
    if (doc.safeguardingLevel === "crisis-adjacent") {
      conditions.push({
        key: "standards-council-approval-present",
        label: "An approved standards-council board approval is present",
        met: standardsCouncilApproved,
      });
    }
  }
  return conditions;
}

export function getFeelingEnglishEligibilityConditions(
  doc: FeelingStateEligibilityInput,
): FeelingEligibilityCondition[] {
  const elevated = requiresElevatedSafeguarding(doc.safeguardingLevel);
  const conditions = [
    ...baseConditions(doc),
    { key: "label-en-present", label: "English label is present", met: !!doc.labelEn },
    { key: "introduction-en-present", label: "English introduction is present", met: !!doc.introductionEn },
    {
      key: "practical-next-step-en-present",
      label: "English practical next step is present",
      met: !!doc.practicalNextStepEn,
    },
  ];
  if (elevated) {
    conditions.push({
      key: "professional-support-note-en-present",
      label: "English professional-support note is present",
      met: !!doc.professionalSupportNoteEn,
    });
  }
  return conditions;
}

export function getFeelingDanishEligibilityConditions(
  doc: FeelingStateEligibilityInput,
): FeelingEligibilityCondition[] {
  const elevated = requiresElevatedSafeguarding(doc.safeguardingLevel);
  const conditions = [
    ...baseConditions(doc),
    { key: "label-da-present", label: "Danish label is present", met: !!doc.labelDa },
    { key: "introduction-da-present", label: "Danish introduction is present", met: !!doc.introductionDa },
    {
      key: "practical-next-step-da-present",
      label: "Danish practical next step is present",
      met: !!doc.practicalNextStepDa,
    },
  ];
  if (elevated) {
    conditions.push({
      key: "professional-support-note-da-present",
      label: "Danish professional-support note is present",
      met: !!doc.professionalSupportNoteDa,
    });
  }
  return conditions;
}

export function isFeelingStateEnglishPubliclyEligible(doc: FeelingStateEligibilityInput): boolean {
  return getFeelingEnglishEligibilityConditions(doc).every((c) => c.met);
}

export function isFeelingStateDanishPubliclyEligible(doc: FeelingStateEligibilityInput): boolean {
  return getFeelingDanishEligibilityConditions(doc).every((c) => c.met);
}

export type FeelingLocale = "en" | "da";

/** Convenience single entry point matching the `(doc, locale)` shape — no ambiguous fallback locale. */
export function isFeelingStatePubliclyEligibleForLocale(
  doc: FeelingStateEligibilityInput,
  locale: FeelingLocale,
): boolean {
  return locale === "en" ? isFeelingStateEnglishPubliclyEligible(doc) : isFeelingStateDanishPubliclyEligible(doc);
}

/**
 * GROQ fragment for the English eligibility query. Elevated-safeguarding
 * conditions are applied via a `select()` so a "standard" state is never
 * blocked by fields it was never required to fill in.
 */
export const FEELING_STATE_ENGLISH_ELIGIBILITY_GROQ = `
  launchStatus == "launch"
  && reviewStatus == "published"
  && length(labelEn) > 0
  && length(introductionEn) > 0
  && length(practicalNextStepEn) > 0
  && count(featuredEntries) > 0
  && (
    safeguardingLevel == "standard"
    || (
      length(professionalSupportNoteEn) > 0
      && count(boardApprovals[board == "clinical" && approved == true]) > 0
      && (safeguardingLevel != "crisis-adjacent" || count(boardApprovals[board == "standards-council" && approved == true]) > 0)
    )
  )
`.trim();

export const FEELING_STATE_DANISH_ELIGIBILITY_GROQ = `
  launchStatus == "launch"
  && reviewStatus == "published"
  && length(labelDa) > 0
  && length(introductionDa) > 0
  && length(practicalNextStepDa) > 0
  && count(featuredEntries) > 0
  && (
    safeguardingLevel == "standard"
    || (
      length(professionalSupportNoteDa) > 0
      && count(boardApprovals[board == "clinical" && approved == true]) > 0
      && (safeguardingLevel != "crisis-adjacent" || count(boardApprovals[board == "standards-council" && approved == true]) > 0)
    )
  )
`.trim();
