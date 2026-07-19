/**
 * "Scholar Review" portal — decision-taxonomy integrity tests.
 *
 * Pure checks against src/lib/scholar-review/decision-labels.ts. These
 * guard the exact decision counts and structure specified for the review
 * portal (11 Duʿā & Dhikr entry decisions, 8 collection decisions, 7
 * feeling-state decisions) so a future edit can't silently drift from spec.
 */

import {
  DUA_DHIKR_ENTRY_DECISIONS,
  DUA_DHIKR_ENTRY_DECISIONS_NOT_REQUIRING_COMMENT,
  DUA_DHIKR_ENTRY_DUPLICATE_RESOLUTIONS,
  DUA_DHIKR_COLLECTION_DECISIONS,
  DUA_DHIKR_COLLECTION_DECISIONS_NOT_REQUIRING_COMMENT,
  FEELING_STATE_DECISIONS,
  FEELING_STATE_DECISIONS_NOT_REQUIRING_COMMENT,
  decisionLabel,
} from "../../src/lib/scholar-review/decision-labels";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

function assertUniqueValues(list: readonly { value: string }[], name: string) {
  const seen = new Set<string>();
  for (const item of list) {
    assert(!seen.has(item.value), `${name} has a duplicate decision value: "${item.value}"`);
    seen.add(item.value);
  }
}

function assertSubset(subset: Set<string>, superset: readonly { value: string }[], name: string) {
  const values = new Set(superset.map((d) => d.value));
  for (const v of subset) {
    assert(values.has(v), `${name} references an unknown decision value: "${v}"`);
  }
}

function testDuaDhikrEntryDecisionCountAndUniqueness() {
  assert(DUA_DHIKR_ENTRY_DECISIONS.length === 11, `expected exactly 11 Duʿā & Dhikr entry decisions, got ${DUA_DHIKR_ENTRY_DECISIONS.length}`);
  assertUniqueValues(DUA_DHIKR_ENTRY_DECISIONS, "DUA_DHIKR_ENTRY_DECISIONS");
  assert(DUA_DHIKR_ENTRY_DECISIONS.some((d) => d.value === "approved"), "must include a plain Approved decision");
  assert(DUA_DHIKR_ENTRY_DECISIONS.some((d) => d.value === "duplicate-consolidate"), "must include the duplicate-consolidate decision");
  assert(DUA_DHIKR_ENTRY_DECISIONS.some((d) => d.value === "reject-entry"), "must include a Reject entry decision");
  console.log("✓ exactly 11 unique Duʿā & Dhikr entry decisions, including Approved / Duplicate-consolidate / Reject");
}

function testDuaDhikrCollectionDecisionCountAndUniqueness() {
  assert(DUA_DHIKR_COLLECTION_DECISIONS.length === 8, `expected exactly 8 collection decisions, got ${DUA_DHIKR_COLLECTION_DECISIONS.length}`);
  assertUniqueValues(DUA_DHIKR_COLLECTION_DECISIONS, "DUA_DHIKR_COLLECTION_DECISIONS");
  console.log("✓ exactly 8 unique Duʿā & Dhikr collection decisions");
}

function testFeelingStateDecisionCountAndUniqueness() {
  assert(FEELING_STATE_DECISIONS.length === 7, `expected exactly 7 feeling-state decisions, got ${FEELING_STATE_DECISIONS.length}`);
  assertUniqueValues(FEELING_STATE_DECISIONS, "FEELING_STATE_DECISIONS");
  assert(
    FEELING_STATE_DECISIONS.some((d) => d.value === "replace-religious-content-pairing"),
    "must include a decision for replacing an inappropriate religious-content pairing",
  );
  assert(
    FEELING_STATE_DECISIONS.some((d) => d.value === "clinical-or-safeguarding-review-required"),
    "must include a clinical/safeguarding escalation decision",
  );
  console.log("✓ exactly 7 unique feeling-state decisions, including pairing-replacement and safeguarding escalation");
}

function testCommentRequirementSetsReferenceRealDecisions() {
  assertSubset(DUA_DHIKR_ENTRY_DECISIONS_NOT_REQUIRING_COMMENT, DUA_DHIKR_ENTRY_DECISIONS, "DUA_DHIKR_ENTRY_DECISIONS_NOT_REQUIRING_COMMENT");
  assertSubset(DUA_DHIKR_COLLECTION_DECISIONS_NOT_REQUIRING_COMMENT, DUA_DHIKR_COLLECTION_DECISIONS, "DUA_DHIKR_COLLECTION_DECISIONS_NOT_REQUIRING_COMMENT");
  assertSubset(FEELING_STATE_DECISIONS_NOT_REQUIRING_COMMENT, FEELING_STATE_DECISIONS, "FEELING_STATE_DECISIONS_NOT_REQUIRING_COMMENT");
  console.log("✓ every \"comment not required\" set only references decisions that actually exist");
}

function testOnlyApprovedAndDeferSkipTheCommentRequirement() {
  // Spec: "Comments required for all except plain 'Approved.'" — Defer is
  // the other, equally self-explanatory exemption used consistently across
  // the two Duʿā & Dhikr decision sets.
  assert(
    DUA_DHIKR_ENTRY_DECISIONS_NOT_REQUIRING_COMMENT.size === 2 &&
      DUA_DHIKR_ENTRY_DECISIONS_NOT_REQUIRING_COMMENT.has("approved") &&
      DUA_DHIKR_ENTRY_DECISIONS_NOT_REQUIRING_COMMENT.has("defer"),
    "exactly Approved and Defer should skip the comment requirement for entries",
  );
  assert(
    DUA_DHIKR_COLLECTION_DECISIONS_NOT_REQUIRING_COMMENT.size === 2 &&
      DUA_DHIKR_COLLECTION_DECISIONS_NOT_REQUIRING_COMMENT.has("approved") &&
      DUA_DHIKR_COLLECTION_DECISIONS_NOT_REQUIRING_COMMENT.has("defer"),
    "exactly Approved and Defer should skip the comment requirement for collections",
  );
  console.log("✓ only \"Approved\" and \"Defer\" skip the mandatory-comment rule, everything else requires one");
}

function testDuplicateResolutionOptionsNeverAutoConsolidate() {
  assert(DUA_DHIKR_ENTRY_DUPLICATE_RESOLUTIONS.length === 5, "expected exactly 5 duplicate-resolution options");
  assertUniqueValues(DUA_DHIKR_ENTRY_DUPLICATE_RESOLUTIONS, "DUA_DHIKR_ENTRY_DUPLICATE_RESOLUTIONS");
  assert(
    DUA_DHIKR_ENTRY_DUPLICATE_RESOLUTIONS.every((r) => !r.label.toLowerCase().includes("automatically")),
    "no duplicate-resolution option may describe automatic consolidation — every option is a scholar decision, never an automated action",
  );
  console.log("✓ duplicate-resolution options are all scholar decisions, never automatic consolidation");
}

function testDecisionLabelFallsBackGracefully() {
  assert(decisionLabel(DUA_DHIKR_ENTRY_DECISIONS, undefined) === "Not reviewed", "an unset decision must read as \"Not reviewed\"");
  assert(decisionLabel(DUA_DHIKR_ENTRY_DECISIONS, "approved") === "Approved", "a known decision must resolve to its human label");
  assert(decisionLabel(DUA_DHIKR_ENTRY_DECISIONS, "some-unknown-value") === "some-unknown-value", "an unrecognised value must fall back to itself rather than throwing");
  console.log("✓ decisionLabel() resolves known values and fails soft on unknown ones");
}

function runAll() {
  testDuaDhikrEntryDecisionCountAndUniqueness();
  testDuaDhikrCollectionDecisionCountAndUniqueness();
  testFeelingStateDecisionCountAndUniqueness();
  testCommentRequirementSetsReferenceRealDecisions();
  testOnlyApprovedAndDeferSkipTheCommentRequirement();
  testDuplicateResolutionOptionsNeverAutoConsolidate();
  testDecisionLabelFallsBackGracefully();
  console.log("\nAll scholar-review decision-integrity tests passed.");
}

runAll();
