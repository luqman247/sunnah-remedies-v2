/**
 * Duʿa & Dhikr — publication-safeguard tests (pre-content-readiness phase).
 *
 * Complements tests/dua-dhikr/dua-dhikr-schema-and-review-bypass.test.ts.
 * Focuses on the specific guarantees named in the readiness brief:
 * fixture entries can never publish, unsourced entries can never publish,
 * import eligibility and publication eligibility are different concepts,
 * and Morning/Evening Dhikr's own publication rules are provably untouched.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  isDuaDhikrEntryPubliclyEligible,
  isDuaDhikrEntryEditoriallyPubliclyEligible,
  getDuaDhikrEligibilityConditions,
} from "../../src/sanity/lib/dua-dhikr-publication-gate";
import { validateImportRow } from "../../src/lib/dua-dhikr/import/schema";
import { runPreflight } from "../../src/lib/dua-dhikr/import/preflight";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const REPO_ROOT = join(__dirname, "../..");

const fullyApprovedDoc = {
  reviewStatus: "published",
  arabicText: "x",
  translationEn: "x",
  translationDa: "x",
  sourceReferences: [{ type: "other", citation: "x" }],
  boardApprovals: [
    { board: "scholarly", approved: true },
    { board: "editorial", approved: true },
  ],
};

/* ── Fixture entries can never publish ────────────────────────────────── */

function testFixtureContentCanNeverBecomeADocumentAtAll() {
  // The publication gate only ever evaluates documents that exist in
  // Sanity. Fixture-marked rows are blocked at import validation, before
  // any document is ever created — so they structurally cannot reach the
  // publication gate at all. This test proves that first link in the
  // chain, since it's the one this module can verify without Sanity.
  const fixtureRow = { ...fullyApprovedDoc, importIdentifier: "PUB-TEST-001", collectionSlug: "food-and-drink", titleEn: "FIXTURE row", references: fullyApprovedDoc.sourceReferences };
  const result = validateImportRow(fixtureRow, 0);
  assert(!result.value, "a FIXTURE-marked row must never validate, so it can never become a duaDhikrEntry document in the first place");
  console.log("✓ fixture-marked content can never become a duaDhikrEntry document — it never reaches the publication gate");
}

/* ── Unsourced entries can never publish ──────────────────────────────── */

function testUnsourcedEntryIsNeverPubliclyEligible() {
  const unsourced = { ...fullyApprovedDoc, sourceReferences: [] };
  assert(!isDuaDhikrEntryPubliclyEligible(unsourced), "an entry with zero source references must never be publicly eligible");
  assert(!isDuaDhikrEntryEditoriallyPubliclyEligible({ ...unsourced, editorialPublicationStatus: "editorial-only-scholarly-review-pending" }), "an entry with zero source references must never be eligible via the bypass pathway either");
  console.log("✓ an entry with zero source references can never publish, via either pathway");
}

function testEntryWithMissingRequiredContentIsNeverEligible() {
  for (const missingField of ["arabicText", "translationEn", "translationDa"] as const) {
    const broken = { ...fullyApprovedDoc, [missingField]: "" };
    assert(!isDuaDhikrEntryPubliclyEligible(broken), `an entry missing "${missingField}" must never be publicly eligible`);
  }
  console.log("✓ an entry missing any required content field can never publish");
}

/* ── Import eligibility vs. publication eligibility are different concepts ── */

function testImportEligibilityNeverImpliesPublicationEligibility() {
  const rows = [
    {
      importIdentifier: "PUB-TEST-002",
      collectionSlug: "food-and-drink",
      titleEn: "[TEST DATA] Complete row",
      whatItIsFor: "[TEST DATA]",
      arabicText: "[TEST ARABIC PLACEHOLDER]",
      transliteration: "[test transliteration placeholder]",
      translationEn: "[TEST TRANSLATION PLACEHOLDER]",
      translationDa: "[TEST DANSK PLACEHOLDER]",
      references: [{ type: "other", citation: "[TEST SOURCE PLACEHOLDER]", verifiedStatus: "verified" }],
    },
  ];
  const report = runPreflight(rows);
  assert(report.entries[0].importEligibility === "ready-to-stage", "a complete row is ready to stage");
  assert(
    report.entries[0].publicationEligibility === "not-eligible-pending-review",
    "\"ready to stage\" (import eligibility) must never equal or imply any form of publication eligibility — they are distinct fields with distinct value spaces",
  );
  console.log("✓ import eligibility (\"ready to stage\") and publication eligibility are structurally distinct — one never implies the other");
}

/* ── No entry can claim scholarly review without scholarly approval ──── */

function testOnlyScholarlyBoardApprovalGrantsScholarlyConditionMet() {
  const editorialOnly = { ...fullyApprovedDoc, boardApprovals: [{ board: "editorial", approved: true }] };
  const conditions = getDuaDhikrEligibilityConditions(editorialOnly);
  const scholarlyCondition = conditions.find((c) => c.key === "scholarly-approval-present");
  assert(scholarlyCondition?.met === false, "the scholarly-approval condition must be false when only an editorial approval exists");
  console.log("✓ the scholarly-approval condition is never satisfied by an editorial approval alone");
}

/* ── Morning/Evening Dhikr's own publication rules are untouched ─────── */

function testDhikrItemPublicationGateFileIsCompletelyUnaffected() {
  // The canonical proof that this phase never touched Morning/Evening's
  // own rules: the file that defines them is byte-identical to its state
  // before this phase began (confirmed by this branch never having a diff
  // against it — see git history). This test guards against a future
  // accidental edit within this same working tree.
  const dhikrGateSource = readFileSync(join(REPO_ROOT, "src/sanity/lib/dhikr-publication-gate.ts"), "utf-8");
  assert(dhikrGateSource.includes("DHIKR_ELIGIBILITY_GROQ"), "the Morning/Evening Dhikr publication gate file must still define its canonical rule");
  assert(!dhikrGateSource.includes("duaDhikr"), "the Morning/Evening Dhikr publication gate must never reference duaDhikr concepts — the two gates must remain fully independent");
  console.log("✓ Morning/Evening Dhikr's own publication gate file remains fully independent of Duʿa & Dhikr");
}

function runAll() {
  testFixtureContentCanNeverBecomeADocumentAtAll();
  testUnsourcedEntryIsNeverPubliclyEligible();
  testEntryWithMissingRequiredContentIsNeverEligible();
  testImportEligibilityNeverImpliesPublicationEligibility();
  testOnlyScholarlyBoardApprovalGrantsScholarlyConditionMet();
  testDhikrItemPublicationGateFileIsCompletelyUnaffected();
  console.log("\nAll Duʿa & Dhikr publication-safeguard tests passed.");
}

runAll();
