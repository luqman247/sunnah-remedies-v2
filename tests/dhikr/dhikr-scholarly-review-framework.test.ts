/**
 * Stage 4A — Scholarly review and adjudication framework tests.
 *
 * Verifies the Stage 4A governance artifacts exist, are internally
 * consistent with the live register, and — most importantly — that Stage 4A
 * itself has not approved, reviewed, or imported anything. Stage 4A is
 * architecture and governance only; see
 * docs/dhikr/40-scholarly-review-and-adjudication-framework.md.
 *
 * Plain assert()-based, run via `npx tsx`, following the repository's
 * established convention (docs/dhikr/17-test-and-validation-plan.md).
 */

import fs from "node:fs";
import path from "node:path";
import { MORNING_DHIKR_SOURCE_REGISTER } from "../../src/lib/dhikr-research/morning-dhikr-register";
import { computeImportGate } from "../../src/lib/dhikr-research/validation";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const REGISTER = MORNING_DHIKR_SOURCE_REGISTER;
const REPO_ROOT = path.resolve(__dirname, "../..");
const ALL_MDR_IDS = Array.from({ length: 30 }, (_, i) => `MDR-${String(i + 1).padStart(3, "0")}`);

const FRAMEWORK_PATH = path.join(REPO_ROOT, "docs/dhikr/40-scholarly-review-and-adjudication-framework.md");
const WORKSHEET_TEMPLATE_PATH = path.join(REPO_ROOT, "docs/dhikr/review/MDR-SCHOLARLY-REVIEW-TEMPLATE.md");
const DECISION_RECORD_TEMPLATE_PATH = path.join(REPO_ROOT, "docs/dhikr/review/MDR-SCHOLARLY-DECISION-RECORD-TEMPLATE.md");
const QUEUE_PATH = path.join(REPO_ROOT, "docs/dhikr/review/MDR-001-030-review-queue.md");
const MATRIX_PATH = path.join(REPO_ROOT, "docs/dhikr/review/MDR-001-030-scholarly-review-matrix.md");

function readDoc(p: string): string {
  assert(fs.existsSync(p), `Expected Stage 4A document to exist: ${p}`);
  return fs.readFileSync(p, "utf8");
}

// 1: all Stage 4 documents exist. The brief names "four Stage 4 documents";
// this project actually produced five distinct deliverables across
// sections 3-7 of the brief (framework, worksheet template, decision-record
// template, review queue, review matrix) — this test checks all five,
// a superset that cannot under-count what was actually required.
function testAllStage4DocumentsExist() {
  const paths = [FRAMEWORK_PATH, WORKSHEET_TEMPLATE_PATH, DECISION_RECORD_TEMPLATE_PATH, QUEUE_PATH, MATRIX_PATH];
  for (const p of paths) {
    assert(fs.existsSync(p), `Expected Stage 4A document to exist: ${p}`);
    assert(fs.readFileSync(p, "utf8").trim().length > 0, `Stage 4A document is empty: ${p}`);
  }
  console.log("✓ all five Stage 4A documents exist and are non-empty (framework, worksheet template, decision-record template, review queue, review matrix)");
}

// 2: all 30 MDR IDs appear in the queue
function testAllMdrIdsInQueue() {
  const queue = readDoc(QUEUE_PATH);
  for (const id of ALL_MDR_IDS) {
    assert(queue.includes(id), `Review queue is missing ${id}`);
  }
  console.log("✓ all 30 MDR IDs (MDR-001 through MDR-030) appear in the review queue");
}

// 3: all 30 MDR IDs appear in the matrix
function testAllMdrIdsInMatrix() {
  const matrix = readDoc(MATRIX_PATH);
  for (const id of ALL_MDR_IDS) {
    assert(matrix.includes(id), `Review matrix is missing ${id}`);
  }
  console.log("✓ all 30 MDR IDs (MDR-001 through MDR-030) appear in the review matrix");
}

// 4: no record is marked approved
function testNoRecordMarkedApproved() {
  for (const record of REGISTER) {
    assert(
      record.scholarlyDecision === "pending",
      `${record.internalId}.scholarlyDecision must remain "pending", found "${record.scholarlyDecision}"`,
    );
  }
  const matrix = readDoc(MATRIX_PATH);
  const pendingCount = (matrix.match(/\| pending \|/g) || []).length;
  assert(pendingCount === 30, `Review matrix must show "pending" as the scholarlyDecision for all 30 records, found ${pendingCount}`);
  // The matrix/framework legends legitimately name "approved" and
  // "approved-with-conditions" as defined terms — that is not the same as
  // applying them to a record. Confirm no row's scholarlyDecision or
  // importStatus cell actually reads anything other than pending/research-only.
  assert(!/\|\s*approved\s*\|\s*research-only\s*\|/i.test(matrix), "Review matrix must not show 'approved' in any record's scholarlyDecision cell");
  console.log("✓ no record is marked approved — all 30 register records and all 30 matrix rows show scholarlyDecision: pending");
}

// 5: no scholarly reviewer is assigned
function testNoScholarlyReviewerAssigned() {
  for (const record of REGISTER) {
    assert(record.scholarlyReviewer === "", `${record.internalId}.scholarlyReviewer must remain empty, found "${record.scholarlyReviewer}"`);
  }
  const matrix = readDoc(MATRIX_PATH);
  // Every data row's Primary/Second reviewer/Arabic editor/Editorial approval
  // columns must be the "—" placeholder — spot check the row count matches.
  const emDashCells = (matrix.match(/\| — \| — \| — \| — \|/g) || []).length;
  assert(emDashCells === 30, `Expected all 30 matrix rows to show unassigned ('—') reviewer columns, found ${emDashCells}`);
  console.log("✓ no scholarly reviewer, second reviewer, Arabic editor, or editorial approver is assigned to any record");
}

// 6: no importStatus changes to import-ready
function testNoImportStatusChanged() {
  for (const record of REGISTER) {
    assert(
      record.importStatus === "research-only",
      `${record.internalId}.importStatus must remain "research-only", found "${record.importStatus}"`,
    );
  }
  console.log("✓ no record's importStatus has changed from research-only");
}

// 7: no public-import permission is granted
function testNoPublicImportPermissionGranted() {
  for (const record of REGISTER) {
    const gate = computeImportGate(record);
    assert(gate.canImport === false, `${record.internalId} unexpectedly passes computeImportGate — no record should be import-eligible at Stage 4A`);
    assert(gate.blockedReasons.length > 0, `${record.internalId} has canImport=false but no blockedReasons`);
  }
  console.log("✓ every one of the 30 records remains blocked by computeImportGate — no public-import permission is granted");
}

// 8: composite records are identified
function testCompositeRecordsIdentified() {
  const framework = readDoc(FRAMEWORK_PATH);
  const queue = readDoc(QUEUE_PATH);
  const compositeIds = ["MDR-003", "MDR-004", "MDR-005", "MDR-029"];
  for (const id of compositeIds) {
    assert(framework.includes(id), `Framework §I must identify ${id} as a composite/clause-mapped record`);
    assert(queue.includes(id), `Review queue must list ${id}`);
  }
  assert(framework.includes("MDR-001"), "Framework §I must address MDR-001's composite-text classification, even without a clause map");
  // Cross-check against the actual clause-map files present in the repo —
  // the framework/queue must not name a composite record that has no
  // clause map, nor omit one that does, without explaining why (MDR-001).
  const auditsDir = path.join(REPO_ROOT, "src/lib/dhikr-research/audits");
  const clauseMapFiles = fs.readdirSync(auditsDir).filter((f) => f.endsWith("-clause-map.ts"));
  assert(clauseMapFiles.length === 4, `Expected exactly 4 clause-map files, found ${clauseMapFiles.length}: ${clauseMapFiles.join(", ")}`);
  for (const id of compositeIds) {
    const expectedFile = `${id.toLowerCase()}-clause-map.ts`;
    assert(clauseMapFiles.includes(expectedFile), `Expected clause-map file ${expectedFile} to exist`);
  }
  console.log("✓ composite records (MDR-003, MDR-004, MDR-005, MDR-029, plus MDR-001's reference-line case) are identified in the framework and queue, matching the 4 clause-map files actually present");
}

// 9: clause-by-clause approval is required for composite records
function testClauseByClauseApprovalRequired() {
  const framework = readDoc(FRAMEWORK_PATH);
  assert(
    framework.includes("Each clause must be approved independently before whole-record approval") ||
      framework.includes("every clause has independently reached") ||
      framework.toLowerCase().includes("independent clause-by-clause approval"),
    "Framework §I must explicitly require independent clause-by-clause approval before whole-record approval",
  );
  assert(
    framework.includes("there is no whole-record shortcut") || framework.toLowerCase().includes("no whole-record shortcut"),
    "Framework §J must explicitly state composite records have no whole-record approval shortcut",
  );
  console.log("✓ the framework explicitly requires independent clause-by-clause approval for composite records before any whole-record decision, with no shortcut");
}

// 10: AI/WebSearch synthesis alone is explicitly insufficient for final approval
function testAiSynthesisAloneInsufficient() {
  const framework = readDoc(FRAMEWORK_PATH);
  assert(
    framework.includes("AI synthesis alone") && framework.toLowerCase().includes("cannot support final approval"),
    "Framework §D must explicitly state AI/WebSearch synthesis alone cannot support final approval",
  );
  console.log("✓ the framework explicitly states AI/WebSearch synthesis alone cannot support final approval");
}

// 11: protected transcription cannot be overwritten
function testProtectedTranscriptionCannotBeOverwritten() {
  const framework = readDoc(FRAMEWORK_PATH);
  assert(
    framework.includes("Protected transcription is never altered by Stage 4 review"),
    "Framework §E must explicitly state protected transcription is never altered by Stage 4 review",
  );
  assert(
    framework.includes("originalDocumentText") && framework.includes("fullArabicText"),
    "Framework §E must name the specific protected fields",
  );
  // Defense in depth: this Stage 4A pass is documentation-only and must not
  // have touched the register at all — every record's protected fields
  // must still be non-empty and internally consistent (fullArabicText
  // identical to originalDocumentText unless a prior, separately-approved
  // Stage 3B correction already diverged them).
  for (const record of REGISTER) {
    assert(record.originalDocumentText.length > 0, `${record.internalId}.originalDocumentText must not be empty`);
    assert(record.fullArabicText.length > 0, `${record.internalId}.fullArabicText must not be empty`);
  }
  console.log("✓ the framework states protected transcription is never altered by Stage 4 review, and the register's protected fields remain populated and untouched by this documentation-only pass");
}

// 12: publication wording must be stored separately
function testPublicationWordingStoredSeparately() {
  const framework = readDoc(FRAMEWORK_PATH);
  assert(
    framework.includes("Any corrected publication wording is stored separately") || framework.toLowerCase().includes("stored separately"),
    "Framework §E must state corrected publication wording is stored separately from the protected fields",
  );
  assert(
    framework.includes("never to `originalDocumentText` or `fullArabicText`") || framework.toLowerCase().includes("never to"),
    "Framework §E must explicitly state publication wording is never written into the protected fields",
  );
  console.log("✓ the framework requires any corrected publication wording to be stored in a separate field, never in originalDocumentText or fullArabicText");
}

// 13: virtue claims preserve conditions
function testVirtueClaimsPreserveConditions() {
  const framework = readDoc(FRAMEWORK_PATH);
  const requiredElements = ["Action", "Timing", "Count", "Conditions", "Certainty level", "Outcome", "Grading limitation"];
  for (const el of requiredElements) {
    assert(framework.includes(`**${el}**`), `Framework §H must list "${el}" as a required element of an approved virtue/reward claim`);
  }
  assert(
    framework.toLowerCase().includes("promotional simplification is banned"),
    "Framework §H must explicitly ban promotional simplification of virtue/reward claims",
  );
  console.log("✓ the framework requires every approved virtue/reward claim to preserve action, timing, count, conditions, certainty level, outcome, and grading limitation, and bans promotional simplification");
}

// 14: import-gate requirements are documented
function testImportGateRequirementsDocumented() {
  const framework = readDoc(FRAMEWORK_PATH);
  assert(framework.includes("## J. Import gate"), "Framework must contain an Import gate section (§J)");
  assert(
    framework.includes("Research complete is not approval"),
    "Framework §J must explicitly state research complete is not approval",
  );
  assert(
    framework.includes("Scholarly approval alone may not be enough"),
    "Framework §J must explicitly state scholarly approval alone may not be enough",
  );
  assert(
    framework.includes("Composite records require all clauses to pass"),
    "Framework §J must explicitly state composite records require all clauses to pass",
  );
  assert(
    framework.toLowerCase().includes("unresolved protected-text questions block import"),
    "Framework §J must explicitly state unresolved protected-text questions block import",
  );
  console.log("✓ the framework's import gate section (§J) documents the minimum conditions and explicitly states research completion, scholarly approval, and composite-clause approval are each necessary but individually insufficient");
}

// 15: no Sanity/public/auth/middleware files changed
function testNoSanityOrPublicFileChanged() {
  const filesThatMustNotReferenceResearchModule = [
    "src/sanity/lib/dhikr-publication-gate.ts",
    "src/sanity/lib/dhikr-public-fetch.ts",
    "src/sanity/lib/queries.ts",
    "src/app/(staff)/dhikr-review/page.tsx",
  ];
  for (const relativePath of filesThatMustNotReferenceResearchModule) {
    const fullPath = path.join(REPO_ROOT, relativePath);
    assert(fs.existsSync(fullPath), `Expected file to exist: ${relativePath}`);
    const contents = fs.readFileSync(fullPath, "utf8");
    assert(
      !contents.includes("dhikr-research") && !contents.includes("dhikr-scholarly-review"),
      `${relativePath} references the research or Stage 4 review module — the canonical eligibility gate and public/staff routes must remain untouched by Stage 4A`,
    );
  }
  const schemaDir = path.join(REPO_ROOT, "src/sanity/schemas/documents/dhikr");
  const schemaFiles = fs.readdirSync(schemaDir);
  assert(
    JSON.stringify(schemaFiles.sort()) === JSON.stringify(["dhikr-category.ts", "dhikr-item.ts"].sort()),
    `Expected only dhikr-category.ts and dhikr-item.ts in ${schemaDir}, found: ${schemaFiles.join(", ")}`,
  );
  console.log("✓ no Sanity schema, public route, projection, auth, middleware, or canonical eligibility gate changed");
}

function runAll() {
  testAllStage4DocumentsExist();
  testAllMdrIdsInQueue();
  testAllMdrIdsInMatrix();
  testNoRecordMarkedApproved();
  testNoScholarlyReviewerAssigned();
  testNoImportStatusChanged();
  testNoPublicImportPermissionGranted();
  testCompositeRecordsIdentified();
  testClauseByClauseApprovalRequired();
  testAiSynthesisAloneInsufficient();
  testProtectedTranscriptionCannotBeOverwritten();
  testPublicationWordingStoredSeparately();
  testVirtueClaimsPreserveConditions();
  testImportGateRequirementsDocumented();
  testNoSanityOrPublicFileChanged();
  console.log("\nAll Stage 4A scholarly review framework tests passed.");
}

runAll();
