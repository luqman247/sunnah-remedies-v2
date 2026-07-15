/**
 * Morning Dhikr Source Register — Stage 3A content-integrity tests.
 *
 * Plain assert()-based checks run via `npx tsx`, following the repository's
 * established convention for Dhikr checks (see
 * docs/dhikr/17-test-and-validation-plan.md). These tests verify the
 * research register's structural integrity and import-gating behaviour.
 * They do not touch Sanity, any public route, or the approved dhikrItem
 * schema — the register under test is a plain TypeScript array that has no
 * relationship to any of those until a separate, later, approved stage.
 */

import fs from "node:fs";
import path from "node:path";
import { MORNING_DHIKR_SOURCE_REGISTER } from "../../src/lib/dhikr-research/morning-dhikr-register";
import {
  assertCompleteSequence,
  assertRegisterStoredInAuthoritativeOrder,
  computeImportGate,
  getOrderedRegisterView,
} from "../../src/lib/dhikr-research/validation";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const REGISTER = MORNING_DHIKR_SOURCE_REGISTER;

function testExactlyThirtyRecordsExist() {
  assert(REGISTER.length === 30, `Expected exactly 30 records, found ${REGISTER.length}`);
  console.log("✓ exactly 30 records exist");
}

function testAllSequenceNumbersExistExactlyOnce() {
  assertCompleteSequence(REGISTER);
  console.log("✓ sequence numbers 1-30 each exist exactly once");
}

function testPhysicalArrayOrderIsExactlyOneToThirty() {
  assertRegisterStoredInAuthoritativeOrder(REGISTER);
  console.log("✓ physical array order is exactly 1-30");
}

function testInternalIdsUniqueAndAlignedWithSequenceNumbers() {
  const ids = new Set<string>();
  for (const record of REGISTER) {
    const expected = `MDR-${String(record.sequenceNumber).padStart(3, "0")}`;
    assert(
      record.internalId === expected,
      `internalId "${record.internalId}" does not align with sequenceNumber ${record.sequenceNumber} (expected "${expected}")`,
    );
    assert(!ids.has(record.internalId), `Duplicate internalId found: ${record.internalId}`);
    ids.add(record.internalId);
  }
  assert(ids.size === 30, `Expected 30 unique internal IDs, found ${ids.size}`);
  console.log("✓ internal IDs MDR-001..MDR-030 unique and aligned with sequence numbers");
}

function testOriginalAndFullArabicTextNonEmptyForEveryRecord() {
  for (const record of REGISTER) {
    assert(
      record.originalDocumentText.trim().length > 0,
      `originalDocumentText is empty for ${record.internalId}`,
    );
    assert(record.fullArabicText.trim().length > 0, `fullArabicText is empty for ${record.internalId}`);
  }
  console.log("✓ originalDocumentText and fullArabicText are non-empty for every record");
}

// Records whose sourceResearchStatus is still "not-started" have had no Stage
// 3B (or later) research pass applied — these fields must remain fully
// unclaimed for them. A record that has moved past "not-started" (currently
// only MDR-001, researched in Stage 3B) is deliberately excluded here and is
// covered instead by its own dedicated audit test file, e.g.
// tests/dhikr/dhikr-source-register-mdr-001-audit.test.ts.
const UNRESEARCHED_RECORDS = REGISTER.filter((r) => r.sourceResearchStatus === "not-started");

function testNoRecordContainsASourceReferenceYet() {
  assert(UNRESEARCHED_RECORDS.length > 0, "Expected at least one unresearched record");
  for (const record of UNRESEARCHED_RECORDS) {
    assert(record.primaryCollection === "", `primaryCollection is populated for ${record.internalId}`);
    assert(record.primaryReference === "", `primaryReference is populated for ${record.internalId}`);
    assert(
      record.secondaryReferences.length === 0,
      `secondaryReferences is populated for ${record.internalId}`,
    );
    assert(record.sourceUrls.length === 0, `sourceUrls is populated for ${record.internalId}`);
    assert(record.narrator === "", `narrator is populated for ${record.internalId}`);
    assert(record.sourceArabicWording === "", `sourceArabicWording is populated for ${record.internalId}`);
  }
  console.log(
    `✓ no unresearched record (${UNRESEARCHED_RECORDS.length}/${REGISTER.length}) contains a source reference yet`,
  );
}

function testNoRecordContainsAGradingYet() {
  for (const record of UNRESEARCHED_RECORDS) {
    assert(record.hadithGrading === "", `hadithGrading is populated for ${record.internalId}`);
    assert(record.gradingAuthority === "", `gradingAuthority is populated for ${record.internalId}`);
    assert(record.gradingNotes === "", `gradingNotes is populated for ${record.internalId}`);
  }
  console.log(`✓ no unresearched record (${UNRESEARCHED_RECORDS.length}/${REGISTER.length}) contains a grading yet`);
}

function testNoRecordClaimsScholarlyApproval() {
  for (const record of REGISTER) {
    assert(
      record.scholarlyDecision === "pending",
      `scholarlyDecision is not "pending" for ${record.internalId}: "${record.scholarlyDecision}"`,
    );
    assert(record.scholarlyReviewer === "", `scholarlyReviewer is populated for ${record.internalId}`);
  }
  console.log("✓ no record claims scholarly approval");
}

function testEveryRecordRemainsResearchOnly() {
  for (const record of REGISTER) {
    assert(
      record.importStatus === "research-only",
      `importStatus is not "research-only" for ${record.internalId}: "${record.importStatus}"`,
    );
  }
  console.log("✓ every record remains research-only");
}

function testNoRecordIsImportReady() {
  for (const record of REGISTER) {
    const gate = computeImportGate(record);
    assert(
      gate.canImport === false,
      `Record ${record.internalId} unexpectedly passed the import gate with no blocking reasons`,
    );
    assert(
      gate.blockedReasons.length > 0,
      `Record ${record.internalId} has canImport=false but no blockedReasons`,
    );
  }
  console.log("✓ no record is import-ready (all 30 blocked by computeImportGate)");
}

function testSourceDocumentRepetitionAnnotationsDoNotCountAsEvidence() {
  // Scoped to unresearched records only. A record that has since been
  // researched (currently only MDR-001) may legitimately have cited
  // repetitionEvidence — that is verified separately, alongside proof that
  // the record still remains blocked overall, in
  // tests/dhikr/dhikr-source-register-mdr-001-audit.test.ts.
  const withVisibleRepetition = UNRESEARCHED_RECORDS.filter((r) => r.repetitionCount !== undefined);
  assert(withVisibleRepetition.length > 0, "Expected at least one unresearched record with a visible repetition count");
  for (const record of withVisibleRepetition) {
    assert(
      record.repetitionEvidence === "",
      `repetitionEvidence is populated for ${record.internalId}, which would treat a document-supplied count as authenticated`,
    );
    const gate = computeImportGate(record);
    assert(
      gate.blockedReasons.some((reason) => reason.toLowerCase().includes("repetition")),
      `Record ${record.internalId} has an unauthenticated repetition count but the import gate does not cite it as a blocking reason`,
    );
  }
  console.log(
    `✓ source-document repetition annotations on unresearched records (${withVisibleRepetition.length} records) do not count as evidence`,
  );
}

function testGetOrderedRegisterViewDoesNotMutateSourceArray() {
  const beforeOrder = REGISTER.map((r) => r.sequenceNumber);
  const beforeIdentity = REGISTER;
  const view = getOrderedRegisterView(REGISTER);
  const afterOrder = REGISTER.map((r) => r.sequenceNumber);

  assert(view !== beforeIdentity, "getOrderedRegisterView returned the same array reference instead of a copy");
  assert(
    JSON.stringify(beforeOrder) === JSON.stringify(afterOrder),
    "REGISTER's physical order changed after calling getOrderedRegisterView",
  );
  assert(
    view.every((r, i) => r.sequenceNumber === i + 1),
    "getOrderedRegisterView did not return records ordered by sequenceNumber",
  );
  console.log("✓ getOrderedRegisterView does not mutate the source array");
}

function testNoPublicRouteProjectionOrCanonicalGateChanges() {
  const repoRoot = path.resolve(__dirname, "../..");
  const filesThatMustNotReferenceResearchModule = [
    "src/sanity/lib/dhikr-publication-gate.ts",
    "src/sanity/lib/dhikr-public-fetch.ts",
    "src/sanity/lib/queries.ts",
    "src/app/(staff)/dhikr-review/page.tsx",
  ];
  for (const relativePath of filesThatMustNotReferenceResearchModule) {
    const fullPath = path.join(repoRoot, relativePath);
    assert(fs.existsSync(fullPath), `Expected file to exist: ${relativePath}`);
    const contents = fs.readFileSync(fullPath, "utf8");
    assert(
      !contents.includes("dhikr-research"),
      `${relativePath} references the dhikr-research module — the canonical eligibility gate and public/staff routes must remain untouched by Stage 3A`,
    );
  }
  console.log("✓ no public route, projection, or canonical eligibility gate references the research register");
}

function testNoSanityDocumentIsCreated() {
  const repoRoot = path.resolve(__dirname, "../..");
  const schemaDir = path.join(repoRoot, "src/sanity/schemas/documents/dhikr");
  const schemaFiles = fs.readdirSync(schemaDir);
  assert(
    JSON.stringify(schemaFiles.sort()) === JSON.stringify(["dhikr-category.ts", "dhikr-item.ts"].sort()),
    `Expected only dhikr-category.ts and dhikr-item.ts in ${schemaDir}, found: ${schemaFiles.join(", ")}`,
  );

  const schemaIndexPath = path.join(repoRoot, "src/sanity/schemas/index.ts");
  if (fs.existsSync(schemaIndexPath)) {
    const contents = fs.readFileSync(schemaIndexPath, "utf8");
    assert(
      !contents.includes("dhikr-research") && !contents.includes("morning-dhikr-register"),
      "src/sanity/schemas/index.ts references the research register — no Sanity schema may be created in Stage 3A",
    );
  }
  console.log("✓ no Sanity document type was created for the research register");
}

function runAll() {
  testExactlyThirtyRecordsExist();
  testAllSequenceNumbersExistExactlyOnce();
  testPhysicalArrayOrderIsExactlyOneToThirty();
  testInternalIdsUniqueAndAlignedWithSequenceNumbers();
  testOriginalAndFullArabicTextNonEmptyForEveryRecord();
  testNoRecordContainsASourceReferenceYet();
  testNoRecordContainsAGradingYet();
  testNoRecordClaimsScholarlyApproval();
  testEveryRecordRemainsResearchOnly();
  testNoRecordIsImportReady();
  testSourceDocumentRepetitionAnnotationsDoNotCountAsEvidence();
  testGetOrderedRegisterViewDoesNotMutateSourceArray();
  testNoPublicRouteProjectionOrCanonicalGateChanges();
  testNoSanityDocumentIsCreated();
  console.log("\nAll Dhikr source-register tests passed.");
}

runAll();
