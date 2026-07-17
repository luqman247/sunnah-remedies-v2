/**
 * Duʿa & Dhikr — content preflight validator tests.
 *
 * All test data is synthetic, clearly non-religious placeholder text. No
 * Sanity access anywhere — src/lib/dua-dhikr/import/preflight.ts never
 * imports a Sanity client.
 */

import { runPreflight, formatPreflightReportText, formatPreflightReportJson } from "../../src/lib/dua-dhikr/import/preflight";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

function baseRow(overrides: Record<string, unknown> = {}) {
  return {
    importIdentifier: "PF-TEST-001",
    collectionSlug: "food-and-drink",
    titleEn: "[TEST DATA] Preflight entry",
    whatItIsFor: "[TEST DATA] Placeholder purpose",
    arabicText: "[TEST ARABIC PLACEHOLDER]",
    translationEn: "[TEST TRANSLATION PLACEHOLDER]",
    transliteration: "[test transliteration placeholder]",
    translationDa: "[TEST DANSK PLACEHOLDER]",
    references: [{ type: "other", citation: "[TEST SOURCE PLACEHOLDER]", verifiedStatus: "verified" }],
    ...overrides,
  };
}

function testFullyCompleteRowIsReadyToStage() {
  const report = runPreflight([baseRow()]);
  assert(report.entries[0].importEligibility === "ready-to-stage", `expected ready-to-stage, got ${report.entries[0].importEligibility}`);
  assert(report.summary.blockedEntries === 0, "a complete row must not be counted as blocked");
  console.log('✓ a fully complete, verified row is classified "ready-to-stage"');
}

function testReadyToStageIsNotPublicationEligible() {
  const report = runPreflight([baseRow()]);
  assert(
    report.entries[0].publicationEligibility === "not-eligible-pending-review",
    '"ready-to-stage" must never imply publication eligibility',
  );
  assert(
    report.entries[0].nextSteps.some((s) => s.toLowerCase().includes("not publication")),
    "the ready-to-stage next steps must explicitly say staging is not publication",
  );
  console.log('✓ "ready to stage" is explicitly distinguished from "ready to publish"');
}

function testMissingRequiredFieldIsBlocked() {
  const report = runPreflight([baseRow({ arabicText: "" })]);
  assert(report.entries[0].importEligibility === "blocked-from-import", "a row missing required Arabic text must be blocked");
  assert(report.summary.blockedEntries === 1, "summary must count exactly one blocked entry");
  console.log('✓ a row with a missing required field is classified "blocked-from-import"');
}

function testUnverifiedSourceRequiresVerification() {
  const report = runPreflight([baseRow({ references: [{ type: "other", citation: "[TEST SOURCE PLACEHOLDER]", verifiedStatus: "unverified" }] })]);
  assert(
    report.entries[0].importEligibility === "requires-source-verification",
    `expected requires-source-verification, got ${report.entries[0].importEligibility}`,
  );
  console.log('✓ an unverified source reference is classified "requires-source-verification"');
}

function testMissingOptionalFieldIsReadyAfterMinorCorrection() {
  const report = runPreflight([
    baseRow({ transliteration: undefined, references: [{ type: "other", citation: "[TEST SOURCE PLACEHOLDER]", verifiedStatus: "verified" }] }),
  ]);
  assert(
    report.entries[0].importEligibility === "ready-after-minor-correction",
    `expected ready-after-minor-correction, got ${report.entries[0].importEligibility}`,
  );
  console.log('✓ a row missing only an optional field is classified "ready-after-minor-correction"');
}

function testDuplicateWithinBatchIsDuplicateCandidate() {
  const report = runPreflight([
    baseRow({ importIdentifier: "PF-A", arabicText: "[TEST ARABIC — SAME TEXT]" }),
    baseRow({ importIdentifier: "PF-B", arabicText: "[TEST ARABIC — SAME TEXT]" }),
  ]);
  assert(
    report.entries.every((e) => e.importEligibility === "duplicate-candidate"),
    "both rows sharing identical Arabic must be classified duplicate-candidate",
  );
  assert(report.summary.duplicateCandidateGroups >= 1, "summary must report at least one duplicate-candidate group");
  console.log('✓ two rows with identical Arabic are both classified "duplicate-candidate"');
}

function testSameImportIdentifierIsBlockedAsDuplicate() {
  const report = runPreflight([
    baseRow({ importIdentifier: "PF-SAME", arabicText: "[TEST ARABIC A]" }),
    baseRow({ importIdentifier: "PF-SAME", arabicText: "[TEST ARABIC B]" }),
  ]);
  assert(
    report.entries.every((e) => e.importEligibility === "blocked-from-import"),
    "two rows sharing the same importIdentifier must both be blocked",
  );
  console.log("✓ duplicate importIdentifiers within a batch are blocked, not merely flagged");
}

function testUnknownCollectionIsBlockedAndCounted() {
  const report = runPreflight([baseRow({ collectionSlug: "not-a-real-collection" })]);
  assert(report.entries[0].importEligibility === "blocked-from-import", "an unresolvable collection must block the row");
  assert(report.summary.invalidCategories === 1, "summary must count the invalid category");
  console.log('✓ an unresolvable collection is blocked and counted in the executive summary');
}

function testExecutiveSummaryTotalsAreConsistent() {
  const rows = [baseRow({ importIdentifier: "PF-1" }), baseRow({ importIdentifier: "PF-2", arabicText: "" })];
  const report = runPreflight(rows);
  assert(report.summary.totalEntries === 2, "totalEntries must equal the number of input rows");
  assert(report.summary.blockedEntries === 1, "exactly one row is invalid in this batch");
  assert(report.summary.validEntries === 1, "exactly one row is valid in this batch");
  console.log("✓ executive summary totals are internally consistent");
}

function testTextAndJsonFormattersRoundTrip() {
  const report = runPreflight([baseRow(), baseRow({ importIdentifier: "PF-2", arabicText: "" })]);
  const text = formatPreflightReportText(report);
  assert(text.includes("Executive summary") && text.includes("Row 0") && text.includes("Row 1"), "text report must include the summary and every row");
  assert(!text.includes("undefined"), "text report must never render literal \"undefined\"");
  const json = formatPreflightReportJson(report);
  const parsed = JSON.parse(json);
  assert(parsed.summary.totalEntries === 2, "JSON report must round-trip through JSON.parse with the same totals");
  console.log("✓ text and JSON report formatters both render correctly");
}

function runAll() {
  testFullyCompleteRowIsReadyToStage();
  testReadyToStageIsNotPublicationEligible();
  testMissingRequiredFieldIsBlocked();
  testUnverifiedSourceRequiresVerification();
  testMissingOptionalFieldIsReadyAfterMinorCorrection();
  testDuplicateWithinBatchIsDuplicateCandidate();
  testSameImportIdentifierIsBlockedAsDuplicate();
  testUnknownCollectionIsBlockedAndCounted();
  testExecutiveSummaryTotalsAreConsistent();
  testTextAndJsonFormattersRoundTrip();
  console.log("\nAll Duʿa & Dhikr preflight-validator tests passed.");
}

runAll();
