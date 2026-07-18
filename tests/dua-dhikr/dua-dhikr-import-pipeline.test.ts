/**
 * Duʿa & Dhikr — content-import validation and fixture-protection tests.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { validateImportRow, findDuplicateImportIdentifiers } from "../../src/lib/dua-dhikr/import/schema";
import { runDuaDhikrImport, canonicalCollectionIdFor, type CollectionResolution, type EntryCollisionResult } from "../../src/lib/dua-dhikr/import/import-content-document";

/** Network-free fake: every slug resolves as a clean, published canonical collection. */
async function fakeResolveAlwaysPublished(slug: string): Promise<CollectionResolution> {
  return { slug, status: "resolved", resolvedId: canonicalCollectionIdFor(slug) };
}

/** Network-free fake: no entry ever collides — every importIdentifier is free to create. */
async function fakeNoEntryCollision(importIdentifier: string): Promise<EntryCollisionResult> {
  return { importIdentifier, status: "no-collision" };
}

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const REPO_ROOT = join(__dirname, "../..");
const SAMPLE_PATH = join(REPO_ROOT, "docs/dua-dhikr/sample-import.json");

const validRow = {
  importIdentifier: "TEST-001",
  collectionSlug: "food-and-drink",
  titleEn: "Test title",
  arabicText: "test arabic",
  translationEn: "test translation",
  references: [{ type: "other", citation: "test citation" }],
};

function testValidRowPassesValidation() {
  const result = validateImportRow(validRow, 0);
  assert(result.issues.length === 0, `a fully valid row must produce zero issues, got: ${JSON.stringify(result.issues)}`);
  assert(!!result.value, "a valid row must return a typed value");
  console.log("✓ a fully valid import row passes validation with zero issues");
}

function testMissingArabicTextIsRejected() {
  const { titleEn: _titleEn, ...rest } = validRow;
  void _titleEn;
  const result = validateImportRow({ ...rest, titleEn: "x", arabicText: "" }, 0);
  assert(result.issues.some((i) => i.field === "arabicText"), "a row with empty arabicText must be rejected");
  assert(!result.value, "an invalid row must not return a value");
  console.log("✓ a row with missing/empty Arabic text is rejected, never silently accepted");
}

function testMissingTranslationIsRejected() {
  const result = validateImportRow({ ...validRow, translationEn: undefined }, 0);
  assert(result.issues.some((i) => i.field === "translationEn"), "a row with no English translation must be rejected");
  console.log("✓ a row with a missing English translation is rejected");
}

function testMissingSourceReferenceIsRejected() {
  const result = validateImportRow({ ...validRow, references: [] }, 0);
  assert(result.issues.some((i) => i.field === "references"), "a row with zero source references must be rejected");
  console.log("✓ a row with zero source references is rejected");
}

function testUnresolvableCollectionSlugIsRejected() {
  const result = validateImportRow({ ...validRow, collectionSlug: "not-a-real-collection" }, 0);
  assert(result.issues.some((i) => i.field === "collectionSlug"), "an unresolvable collectionSlug must be rejected");
  console.log("✓ a row referencing a non-canonical collection is rejected (duplicate-category prevention at import time)");
}

function testAliasCollectionSlugResolvesAtImportTime() {
  const result = validateImportRow({ ...validRow, collectionSlug: "eating" }, 0);
  assert(result.issues.length === 0, "an alias like \"eating\" must resolve to its canonical collection at import time");
  assert(result.value?.collectionSlug === "food-and-drink", `expected resolved slug "food-and-drink", got "${result.value?.collectionSlug}"`);
  console.log('✓ import rows using an alias ("eating") resolve to the canonical collection slug ("food-and-drink")');
}

function testDuplicateImportIdentifiersAreDetected() {
  const rows = [
    { ...validRow, importIdentifier: "DUP-1" },
    { ...validRow, importIdentifier: "DUP-1" },
    { ...validRow, importIdentifier: "UNIQUE-1" },
  ].map((r, i) => validateImportRow(r, i).value!);
  const duplicates = findDuplicateImportIdentifiers(rows);
  assert(duplicates.length === 1 && duplicates[0] === "DUP-1", `expected exactly one duplicate ("DUP-1"), got ${JSON.stringify(duplicates)}`);
  console.log("✓ duplicate importIdentifier values within one batch are detected");
}

async function testDryRunNeverWrites() {
  const rows = [validRow, { ...validRow, importIdentifier: "TEST-002" }];
  const report = await runDuaDhikrImport({ rows, dryRun: true, resolveCollectionId: fakeResolveAlwaysPublished, checkEntryCollision: fakeNoEntryCollision });
  assert(report.dryRun === true, "dry-run report must report dryRun: true");
  assert(
    report.entries.every((e) => e.outcome !== "written"),
    "a dry run must never report outcome \"written\"",
  );
  assert(report.valid === 2, `expected 2 valid rows in dry run, got ${report.valid}`);
  console.log("✓ dry-run mode reports what WOULD be written without ever writing");
}

async function testSampleFixtureFileIsWellFormedAndDryRunClean() {
  const raw = readFileSync(SAMPLE_PATH, "utf-8");
  const rows = JSON.parse(raw);
  assert(Array.isArray(rows) && rows.length > 0, "sample-import.json must contain a non-empty array");
  for (const row of rows) {
    assert(
      typeof row.arabicText === "string" && row.arabicText.toUpperCase().includes("FIXTURE"),
      "every sample-import.json row's arabicText must be an obviously-labelled fixture placeholder, never real content",
    );
  }
  const report = await runDuaDhikrImport({ rows, dryRun: true });
  // Updated in the pre-content-readiness phase: sample-import.json is
  // DELIBERATELY fixture-marked, and the importer now DELIBERATELY refuses
  // any row containing a "FIXTURE"/"NOT FOR PUBLICATION" marker (see
  // src/lib/dua-dhikr/import/schema.ts, containsFixtureMarker) as a
  // backstop against ever importing this file for real. So every row here
  // is expected to be reported invalid — that is the safety feature
  // working, not a regression. See
  // tests/dua-dhikr/dua-dhikr-import-safety.test.ts for the dedicated
  // fixture-rejection test suite.
  assert(rows.length > 0, "sample-import.json must contain at least one row for this test to mean anything");
  assert(
    report.invalid === rows.length,
    `every row in docs/dua-dhikr/sample-import.json must be rejected by fixture-marker validation (found ${report.invalid} of ${rows.length} rejected)`,
  );
  assert(
    report.entries.every((e) => e.issues.some((i) => i.message.includes("fixture/placeholder marker"))),
    "every rejected row must be rejected specifically for its fixture marker, not some other validation error",
  );
  console.log("✓ docs/dua-dhikr/sample-import.json is well-formed, clearly fixture-labelled, and is correctly refused in full by fixture-marker validation");
}

async function runAll() {
  testValidRowPassesValidation();
  testMissingArabicTextIsRejected();
  testMissingTranslationIsRejected();
  testMissingSourceReferenceIsRejected();
  testUnresolvableCollectionSlugIsRejected();
  testAliasCollectionSlugResolvesAtImportTime();
  testDuplicateImportIdentifiersAreDetected();
  await testDryRunNeverWrites();
  await testSampleFixtureFileIsWellFormedAndDryRunClean();
  console.log("\nAll Duʿa & Dhikr import-pipeline tests passed.");
}

runAll();
