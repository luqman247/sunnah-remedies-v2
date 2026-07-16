/**
 * Stage 2 — Approved Publishing tests.
 *
 * Covers: the strengthened computeImportGate approval-gate rules, the
 * approved-only import script's safety properties, the public
 * getMorningDhikrItemsPublic() projection, the Morning Dhikr page's static
 * empty-state behaviour, protected-transcription immutability, and the
 * absence of secrets in every new Stage 2 file.
 *
 * Plain assert()-based, run via `npx tsx`, following the repository's
 * established convention (docs/dhikr/17-test-and-validation-plan.md).
 */

import fs from "node:fs";
import path from "node:path";
import { MORNING_DHIKR_SOURCE_REGISTER } from "../../src/lib/dhikr-research/morning-dhikr-register";
import { computeImportGate, COMPOSITE_RECORD_IDS_WITH_CLAUSE_MAPS } from "../../src/lib/dhikr-research/validation";
import type { DhikrSourceResearchRecord } from "../../src/lib/dhikr-research/types";
import { runApprovedDhikrImport } from "../../src/lib/dhikr-research/import/import-approved-records";
import { getMorningDhikrItemsPublic } from "../../src/sanity/lib/dhikr-public-fetch";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const REPO_ROOT = path.resolve(__dirname, "../..");

/* ── Isolated test fixture — never part of the live register ─────────── */

function makeCompleteApprovedFixture(overrides: Partial<DhikrSourceResearchRecord> = {}): DhikrSourceResearchRecord {
  const base: DhikrSourceResearchRecord = {
    sequenceNumber: 999,
    internalId: "MDR-TEST-999",
    openingArabicWords: "test",
    fullArabicText: "نَصّ تجريبي مَحمِيّ",
    originalDocumentText: "نَصّ تجريبي مَحمِيّ",
    sourceDocumentAnnotations: [],
    transcriptionStatus: "exact",
    transcriptionNotes: "",
    proposedCategory: "",
    contentClassification: "prophetic-morning-dhikr",
    morningSpecificStatus: "morning-only",
    sourceResearchStatus: "verified",
    primaryCollection: "Test Collection",
    primaryReference: "Test 1:1",
    secondaryReferences: [],
    narrator: "Test Narrator",
    sourceArabicWording: "نَصّ تجريبي مَحمِيّ",
    wordingMatchStatus: "exact-match",
    hadithGrading: "sahih",
    gradingAuthority: "Test Authority",
    gradingNotes: "",
    repetitionEvidence: "",
    virtueOrRewardClaim: "",
    virtueEvidence: "",
    sourceUrls: [],
    usulAiResearchNotes: "",
    scholarlyReviewer: "Test Reviewer",
    scholarlyReviewerQualification: "Test Institution",
    scholarlyReviewDate: "2026-01-01",
    scholarlyDecision: "approved",
    scholarlyNotes: "",
    approvedArabicText: "نَصّ تجريبي مَحمِيّ",
    approvedEnglishText: "Test approved English text",
    approvedSourceReference: "Test 1:1, Test Collection",
    approvedTiming: "morning-only",
    approvedVirtueText: "",
    editorialReviewer: "Test Editor",
    editorialApproval: "approved",
    editorialApprovalDate: "2026-01-02",
    publicationReviewStatus: "not-published",
    editorialNotes: "",
    importStatus: "import-ready",
  };
  return { ...base, ...overrides };
}

/* ── 1. All 30 current records remain pending and blocked ────────────── */

/**
 * Two records (MDR-002, MDR-011) have a real, named editorial reviewer and
 * editorialApproval: "approved" via the SEPARATE editorial-publication
 * pathway (see docs/dhikr/40-... and
 * tests/dhikr/dhikr-editorial-publication-model.test.ts) — this is
 * intentional, not a regression. Three further candidates originally
 * considered (MDR-006, MDR-008, MDR-015) were withdrawn after a stricter
 * evidence-tier review found genuine unresolved wording points on each and
 * were reverted to their pre-launch state — see each record's scholarlyNotes.
 * scholarlyDecision, scholarlyReviewer, and importStatus are unaffected and
 * remain pending/empty/research-only for all 30, and every record —
 * including these two — must still fail the SCHOLARLY pathway
 * (computeImportGate), which never reads editorialApproval as a substitute
 * for a real scholarly decision.
 */
const EDITORIALLY_APPROVED_RECORD_IDS = new Set(["MDR-002", "MDR-011"]);

function testAll30RecordsRemainPendingAndBlocked() {
  assert(MORNING_DHIKR_SOURCE_REGISTER.length === 30, `Expected 30 records, found ${MORNING_DHIKR_SOURCE_REGISTER.length}`);
  for (const record of MORNING_DHIKR_SOURCE_REGISTER) {
    assert(record.scholarlyDecision === "pending", `${record.internalId}.scholarlyDecision must remain "pending", found "${record.scholarlyDecision}"`);
    if (EDITORIALLY_APPROVED_RECORD_IDS.has(record.internalId)) {
      assert(record.editorialApproval === "approved", `${record.internalId} is expected to have editorialApproval "approved" via the editorial-publication pathway, found "${record.editorialApproval}"`);
    } else {
      assert(record.editorialApproval === "pending", `${record.internalId}.editorialApproval must remain "pending", found "${record.editorialApproval}"`);
    }
    assert(record.importStatus === "research-only", `${record.internalId}.importStatus must remain "research-only", found "${record.importStatus}"`);
    assert(record.scholarlyReviewer === "", `${record.internalId}.scholarlyReviewer must remain empty`);
    const gate = computeImportGate(record);
    assert(gate.canImport === false, `${record.internalId} unexpectedly passes the SCHOLARLY computeImportGate`);
  }
  console.log(`✓ all 30 current records remain scholarlyDecision-pending, unassigned, research-only, and blocked from the scholarly pathway (${EDITORIALLY_APPROVED_RECORD_IDS.size} legitimately editorially-approved via the separate pathway)`);
}

/* ── 2. Approved-only gate requirements work (happy path) ─────────────── */

function testApprovedCompleteFixturePassesGate() {
  const fixture = makeCompleteApprovedFixture();
  const gate = computeImportGate(fixture);
  assert(gate.canImport === true, `Complete approved fixture unexpectedly blocked: ${gate.blockedReasons.join(" | ")}`);
  console.log("✓ a fully approved, isolated test fixture passes computeImportGate");
}

/* ── 3–7. Individually missing conditions block import ────────────────── */

function testMissingReviewerBlocksImport() {
  const gate = computeImportGate(makeCompleteApprovedFixture({ scholarlyReviewer: "" }));
  assert(gate.canImport === false, "Missing scholarlyReviewer must block import");
  assert(gate.blockedReasons.some((r) => /no scholarly reviewer is recorded/i.test(r)), "Missing-reviewer blocker message not found");
  console.log("✓ missing scholarly reviewer blocks import");
}

function testMissingReviewDateBlocksImport() {
  const gate = computeImportGate(makeCompleteApprovedFixture({ scholarlyReviewDate: "" }));
  assert(gate.canImport === false, "Missing scholarlyReviewDate must block import");
  assert(gate.blockedReasons.some((r) => /no scholarly review date is recorded/i.test(r)), "Missing-review-date blocker message not found");
  console.log("✓ missing scholarly review date blocks import");
}

function testMissingApprovedArabicBlocksImport() {
  const gate = computeImportGate(makeCompleteApprovedFixture({ approvedArabicText: "" }));
  assert(gate.canImport === false, "Missing approvedArabicText must block import");
  assert(gate.blockedReasons.some((r) => /no approved arabic publication text is recorded/i.test(r)), "Missing-approved-Arabic blocker message not found");
  console.log("✓ missing approved Arabic text blocks import");
}

function testMissingApprovedSourceBlocksImport() {
  const gate = computeImportGate(makeCompleteApprovedFixture({ approvedSourceReference: "" }));
  assert(gate.canImport === false, "Missing approvedSourceReference must block import");
  assert(gate.blockedReasons.some((r) => /no approved source reference is recorded/i.test(r)), "Missing-approved-source blocker message not found");
  console.log("✓ missing approved source reference blocks import");
}

function testMissingEditorialApprovalBlocksImport() {
  const gate = computeImportGate(makeCompleteApprovedFixture({ editorialApproval: "pending" }));
  assert(gate.canImport === false, "Missing editorial approval must block import");
  assert(gate.blockedReasons.some((r) => /editorial approval is not granted/i.test(r)), "Missing-editorial-approval blocker message not found");
  console.log("✓ missing editorial approval blocks import");
}

/* ── 8. Deferred and rejected records cannot import ────────────────────── */

function testDeferredAndRejectedCannotImport() {
  const deferred = computeImportGate(makeCompleteApprovedFixture({ scholarlyDecision: "deferred" }));
  assert(deferred.canImport === false, "A deferred decision must not pass the gate");
  assert(deferred.blockedReasons.some((r) => /deferred/i.test(r)), "Deferred blocker message not found");

  const rejected = computeImportGate(makeCompleteApprovedFixture({ scholarlyDecision: "rejected" }));
  assert(rejected.canImport === false, "A rejected decision must not pass the gate");
  assert(rejected.blockedReasons.some((r) => /rejected/i.test(r)), "Rejected blocker message not found");
  console.log("✓ deferred and rejected scholarly decisions cannot pass the import gate");
}

/* ── 9. Incomplete composite records cannot import ─────────────────────── */

function testIncompleteCompositeRecordsCannotImport() {
  assert(COMPOSITE_RECORD_IDS_WITH_CLAUSE_MAPS.length > 0, "Expected at least one composite record ID");
  const compositeId = COMPOSITE_RECORD_IDS_WITH_CLAUSE_MAPS[0];

  const incomplete = computeImportGate(makeCompleteApprovedFixture({ internalId: compositeId, compositeClausesApproved: false }));
  assert(incomplete.canImport === false, `${compositeId} with compositeClausesApproved: false must not pass the gate`);
  assert(
    incomplete.blockedReasons.some((r) => /composite record and not every clause has been independently approved/i.test(r)),
    "Composite-incomplete blocker message not found",
  );

  const unset = computeImportGate(makeCompleteApprovedFixture({ internalId: compositeId }));
  assert(unset.canImport === false, `${compositeId} with compositeClausesApproved unset must not pass the gate`);

  const complete = computeImportGate(makeCompleteApprovedFixture({ internalId: compositeId, compositeClausesApproved: true }));
  assert(complete.canImport === true, `${compositeId} with every clause approved should pass the gate: ${complete.blockedReasons.join(" | ")}`);
  console.log("✓ composite records are blocked until every clause is independently approved, and pass once they are");
}

/* ── 10. Approved complete records can pass — isolated fixtures only ──── */

function testApprovedFixtureIsIsolatedFromLiveRegister() {
  const fixture = makeCompleteApprovedFixture();
  const liveIds = new Set(MORNING_DHIKR_SOURCE_REGISTER.map((r) => r.internalId));
  assert(!liveIds.has(fixture.internalId), "Test fixture's internalId must not collide with any live register record");
  console.log("✓ the passing-gate test fixture is isolated from the live register (no real record is used to prove a pass)");
}

/* ── 11. Import is idempotent ───────────────────────────────────────────── */

async function testImportIsIdempotentInDryRun() {
  const first = await runApprovedDhikrImport({ dryRun: true });
  const second = await runApprovedDhikrImport({ dryRun: true });
  assert(first.dryRun === true && second.dryRun === true, "Both runs must be dry runs");
  assert(first.totalRecords === second.totalRecords, "Repeated dry runs must evaluate the same total record count");
  assert(first.updated === 0, "A dry run must never report an 'updated' outcome (that requires a live Sanity read, which dry-run mode skips)");
  assert(
    first.imported === second.imported,
    "Repeated dry runs against unchanged data must report the same imported count",
  );
  assert(
    JSON.stringify(first.entries.map((e) => e.outcome)) === JSON.stringify(second.entries.map((e) => e.outcome)),
    "Repeated dry runs against unchanged data must produce identical per-record outcomes",
  );
  console.log("✓ the import script is idempotent — repeated dry runs against unchanged data produce identical results");
}

/* ── 12 & 13. Public fetch returns approved records only ────────────────── */

function testMorningFetchDelegatesToCanonicalGate() {
  const fetchSource = fs.readFileSync(path.join(REPO_ROOT, "src/sanity/lib/dhikr-public-fetch.ts"), "utf8");
  assert(
    fetchSource.includes("export async function getMorningDhikrItemsPublic") &&
      /getMorningDhikrItemsPublic[\s\S]*?getDhikrItemsPublic\(\)/.test(fetchSource),
    "getMorningDhikrItemsPublic must be implemented in terms of getDhikrItemsPublic, not a separate query",
  );
  assert(
    !/\bimport\s*\{[^}]*\bpreviewClient\b[^}]*\}/.test(fetchSource) && !/from\s+["'][^"']*dhikr-research/.test(fetchSource),
    "dhikr-public-fetch.ts must not import previewClient or the research register",
  );
  console.log("✓ [static check] getMorningDhikrItemsPublic delegates to the canonical-eligibility-gated getDhikrItemsPublic — research-only/unapproved records cannot reach it");
}

async function testMorningFetchReturnsArray() {
  const items = await getMorningDhikrItemsPublic();
  assert(Array.isArray(items), "getMorningDhikrItemsPublic must return an array");
  for (const item of items) {
    assert(item.timingLabel === "morning-only" || item.timingLabel === "morning-and-evening", `Unexpected timingLabel on a morning-page item: ${item.timingLabel}`);
  }
  console.log(`✓ getMorningDhikrItemsPublic resolves to an array (${items.length} item(s) currently), every item timing-scoped to morning`);
}

/* ── 14. Public page renders the empty state when no records are approved ── */

function testPageRendersEmptyStateWhenNoItems() {
  const pageSource = fs.readFileSync(
    path.join(REPO_ROOT, "src/app/[locale]/knowledge/dhikr/morning/page.tsx"),
    "utf8",
  );
  assert(pageSource.includes("items.length === 0"), "Page must branch on items.length === 0 for the empty state");
  assert(pageSource.includes('t("emptyState.heading")') && pageSource.includes('t("emptyState.body")'), "Page must render the empty-state translation keys");
  const en = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, "src/messages/en.json"), "utf8"));
  assert(
    en.dhikrMorning.emptyState.body === "Morning Dhikr is currently undergoing scholarly review and will be available soon.",
    "Empty-state copy must match the specified wording",
  );
  console.log("✓ [static check] the Morning Dhikr page renders the specified empty state when no records are approved");
}

/* ── 15. Protected transcription fields remain unchanged ───────────────── */

function testProtectedTranscriptionFieldsUnchanged() {
  const protectedKeys: (keyof DhikrSourceResearchRecord)[] = [
    "originalDocumentText",
    "fullArabicText",
    "openingArabicWords",
    "sourceDocumentAnnotations",
    "transcriptionStatus",
    "sequenceNumber",
    "internalId",
  ];
  for (const record of MORNING_DHIKR_SOURCE_REGISTER) {
    for (const key of protectedKeys) {
      assert(record[key] !== undefined, `${record.internalId}.${String(key)} must remain populated`);
    }
    assert(
      record.fullArabicText === record.originalDocumentText,
      `${record.internalId}: fullArabicText has diverged from originalDocumentText — Stage 2 must never write a correction into either protected field`,
    );
  }
  const importModuleSource = fs.readFileSync(
    path.join(REPO_ROOT, "src/lib/dhikr-research/import/import-approved-records.ts"),
    "utf8",
  );
  const importModuleCode = importModuleSource.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
  assert(
    !importModuleCode.includes("record.originalDocumentText") && !importModuleCode.includes("record.fullArabicText"),
    "The import module's code (outside comments) must never read or write originalDocumentText/fullArabicText",
  );
  console.log("✓ every protected transcription field remains populated and unmodified; the import module never touches them");
}

/* ── 16. No secrets are exposed ─────────────────────────────────────────── */

function testNoSecretsExposed() {
  const filesToCheck = [
    "src/lib/dhikr-research/import/import-approved-records.ts",
    "scripts/dhikr-import-approved.ts",
    "src/app/(staff)/dhikr-mdr-review/page.tsx",
    "src/app/(staff)/dhikr-mdr-review/MdrReviewWorkbench.tsx",
    "src/app/[locale]/knowledge/dhikr/morning/page.tsx",
    "src/sanity/lib/dhikr-public-fetch.ts",
  ];
  const secretPatterns = [/\bsk_(live|test)_[A-Za-z0-9]{10,}/, /SANITY_API_TOKEN\s*=\s*["'][^"']+["']/, /Bearer [A-Za-z0-9._-]{20,}/];
  for (const relPath of filesToCheck) {
    const fullPath = path.join(REPO_ROOT, relPath);
    assert(fs.existsSync(fullPath), `Expected file to exist: ${relPath}`);
    const contents = fs.readFileSync(fullPath, "utf8");
    for (const pattern of secretPatterns) {
      assert(!pattern.test(contents), `${relPath} appears to contain a hardcoded secret matching ${pattern}`);
    }
  }
  console.log("✓ no Stage 2 file contains a hardcoded secret/token");
}

/* ── 17. No real production import runs during tests ───────────────────── */

async function testNoRealImportRunsDuringTests() {
  const cliSource = fs.readFileSync(path.join(REPO_ROOT, "scripts/dhikr-import-approved.ts"), "utf8");
  assert(
    cliSource.includes('process.argv.includes("--live")') && cliSource.includes("dryRun: !isLive"),
    "The CLI script must default to dry-run unless --live is explicitly passed",
  );
  const report = await runApprovedDhikrImport();
  assert(report.dryRun === true, "Calling runApprovedDhikrImport() with no arguments must default to dry-run");
  assert(report.updated === 0, "A dry run must never report an 'updated' outcome — no live Sanity read/write occurs");
  console.log(`✓ the import defaults to dry-run (${report.imported} record(s) would import, 0 actually written), and no real import occurred while running this test suite`);
}

async function runAll() {
  testAll30RecordsRemainPendingAndBlocked();
  testApprovedCompleteFixturePassesGate();
  testMissingReviewerBlocksImport();
  testMissingReviewDateBlocksImport();
  testMissingApprovedArabicBlocksImport();
  testMissingApprovedSourceBlocksImport();
  testMissingEditorialApprovalBlocksImport();
  testDeferredAndRejectedCannotImport();
  testIncompleteCompositeRecordsCannotImport();
  testApprovedFixtureIsIsolatedFromLiveRegister();
  await testImportIsIdempotentInDryRun();
  testMorningFetchDelegatesToCanonicalGate();
  await testMorningFetchReturnsArray();
  testPageRendersEmptyStateWhenNoItems();
  testProtectedTranscriptionFieldsUnchanged();
  testNoSecretsExposed();
  await testNoRealImportRunsDuringTests();
  console.log("\nAll Stage 2 approved-publishing tests passed.");
}

runAll();
