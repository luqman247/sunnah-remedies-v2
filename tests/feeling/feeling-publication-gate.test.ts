/**
 * "I am feeling…" — publication-gate eligibility tests.
 *
 * Pure checks against src/sanity/lib/feeling-publication-gate.ts — no live
 * Sanity access. No religious content in any fixture.
 */

import {
  isFeelingStateEnglishPubliclyEligible,
  isFeelingStateDanishPubliclyEligible,
  isFeelingStatePubliclyEligibleForLocale,
  hasApprovedFeelingBoard,
  type FeelingStateEligibilityInput,
} from "../../src/sanity/lib/feeling-publication-gate";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

const baseStandard: FeelingStateEligibilityInput = {
  launchStatus: "launch",
  reviewStatus: "published",
  labelEn: "Anxious or Worried",
  labelDa: "Ængstelig eller bekymret",
  introductionEn: "fixture intro",
  introductionDa: "fixture intro da",
  practicalNextStepEn: "fixture step",
  practicalNextStepDa: "fixture step da",
  safeguardingLevel: "standard",
  featuredEntries: [{}],
  boardApprovals: [],
};

function testStandardStateEligibleWithoutClinicalApproval() {
  assert(isFeelingStateEnglishPubliclyEligible(baseStandard), "a standard-tone state must not require clinical approval");
  assert(isFeelingStateDanishPubliclyEligible(baseStandard), "a standard-tone state must not require clinical approval (Danish)");
  console.log("✓ standard safeguarding level does not require a clinical board approval");
}

function testLaunchStatusGateBlocksDeferredStates() {
  const deferred: FeelingStateEligibilityInput = { ...baseStandard, launchStatus: "deferred" };
  assert(!isFeelingStateEnglishPubliclyEligible(deferred), "launchStatus \"deferred\" must never be publicly eligible, regardless of other fields");
  console.log("✓ launchStatus gate blocks deferred states even when every other field is complete");
}

function testHeightenedStateRequiresProfessionalNoteAndClinicalApproval() {
  const heightenedMissingBoth: FeelingStateEligibilityInput = { ...baseStandard, safeguardingLevel: "heightened" };
  assert(!isFeelingStateEnglishPubliclyEligible(heightenedMissingBoth), "heightened state without note/approval must be ineligible");

  const heightenedMissingApproval: FeelingStateEligibilityInput = {
    ...baseStandard,
    safeguardingLevel: "heightened",
    professionalSupportNoteEn: "fixture note",
    professionalSupportNoteDa: "fixture note da",
  };
  assert(!isFeelingStateEnglishPubliclyEligible(heightenedMissingApproval), "heightened state without clinical approval must be ineligible even with a note present");

  const heightenedComplete: FeelingStateEligibilityInput = {
    ...heightenedMissingApproval,
    boardApprovals: [{ board: "clinical", approved: true }],
  };
  assert(isFeelingStateEnglishPubliclyEligible(heightenedComplete), "heightened state with note + approved clinical board must be eligible");
  console.log("✓ heightened safeguarding level requires both a professional-support note and an approved clinical board approval");
}

function testCrisisAdjacentAlsoRequiresStandardsCouncil() {
  const crisisAdjacentMissingCouncil: FeelingStateEligibilityInput = {
    ...baseStandard,
    safeguardingLevel: "crisis-adjacent",
    professionalSupportNoteEn: "fixture",
    professionalSupportNoteDa: "fixture",
    boardApprovals: [{ board: "clinical", approved: true }],
  };
  assert(!isFeelingStateEnglishPubliclyEligible(crisisAdjacentMissingCouncil), "crisis-adjacent must additionally require standards-council approval");

  const complete: FeelingStateEligibilityInput = {
    ...crisisAdjacentMissingCouncil,
    boardApprovals: [
      { board: "clinical", approved: true },
      { board: "standards-council", approved: true },
    ],
  };
  assert(isFeelingStateEnglishPubliclyEligible(complete), "crisis-adjacent with both approvals must be eligible");
  console.log("✓ crisis-adjacent requires clinical AND standards-council approval (no launch state currently uses this tier)");
}

function testDanishNeverFallsBackToEnglish() {
  const englishOnly: FeelingStateEligibilityInput = { ...baseStandard, labelDa: undefined, introductionDa: undefined, practicalNextStepDa: undefined };
  assert(isFeelingStateEnglishPubliclyEligible(englishOnly), "English-only fixture must still be English-eligible");
  assert(!isFeelingStateDanishPubliclyEligible(englishOnly), "Danish must never silently fall back to English copy");
  console.log("✓ Danish eligibility never silently falls back to English copy");
}

function testFeaturedEntriesRequired() {
  const noEntries: FeelingStateEligibilityInput = { ...baseStandard, featuredEntries: [] };
  assert(!isFeelingStateEnglishPubliclyEligible(noEntries), "a state with zero featured entries must not be eligible");
  console.log("✓ at least one featured entry is required for eligibility");
}

function testConvenienceLocaleWrapperMatchesDirectCalls() {
  assert(
    isFeelingStatePubliclyEligibleForLocale(baseStandard, "en") === isFeelingStateEnglishPubliclyEligible(baseStandard),
    "locale wrapper must match direct English call",
  );
  assert(
    isFeelingStatePubliclyEligibleForLocale(baseStandard, "da") === isFeelingStateDanishPubliclyEligible(baseStandard),
    "locale wrapper must match direct Danish call",
  );
  console.log("✓ isFeelingStatePubliclyEligibleForLocale delegates correctly for both locales");
}

function testHasApprovedFeelingBoardIgnoresUnapproved() {
  assert(!hasApprovedFeelingBoard([{ board: "clinical", approved: false }], "clinical"), "an unapproved board entry must not count");
  assert(hasApprovedFeelingBoard([{ board: "clinical", approved: true }], "clinical"), "an approved board entry must count");
  console.log("✓ hasApprovedFeelingBoard distinguishes approved from merely-present board entries");
}

async function runAll() {
  testStandardStateEligibleWithoutClinicalApproval();
  testLaunchStatusGateBlocksDeferredStates();
  testHeightenedStateRequiresProfessionalNoteAndClinicalApproval();
  testCrisisAdjacentAlsoRequiresStandardsCouncil();
  testDanishNeverFallsBackToEnglish();
  testFeaturedEntriesRequired();
  testConvenienceLocaleWrapperMatchesDirectCalls();
  testHasApprovedFeelingBoardIgnoresUnapproved();
  console.log("\nAll feeling-publication-gate tests passed.");
}

runAll();
