/**
 * Duʿā & Dhikr — schema shape and review-bypass scope tests.
 *
 * Static source inspection (schema files, index registration) plus direct
 * unit tests of the publication-gate functions. No Sanity client, no
 * network.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  DUA_DHIKR_EDITORIAL_ELIGIBILITY_GROQ,
  isDuaDhikrEntryPubliclyEligible,
  isDuaDhikrEntryEditoriallyPubliclyEligible,
} from "../../src/sanity/lib/dua-dhikr-publication-gate";
import { DHIKR_EDITORIAL_ELIGIBILITY_GROQ } from "../../src/sanity/lib/dhikr-publication-gate";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const REPO_ROOT = join(__dirname, "../..");
const collectionSchemaSource = readFileSync(
  join(REPO_ROOT, "src/sanity/schemas/documents/dua-dhikr/dua-dhikr-collection.ts"),
  "utf-8",
);
const entrySchemaSource = readFileSync(
  join(REPO_ROOT, "src/sanity/schemas/documents/dua-dhikr/dua-dhikr-entry.ts"),
  "utf-8",
);
const schemaIndexSource = readFileSync(join(REPO_ROOT, "src/sanity/schemas/index.ts"), "utf-8");
const structureIndexSource = readFileSync(join(REPO_ROOT, "src/sanity/structure/index.ts"), "utf-8");
const duaDhikrGateSource = readFileSync(join(REPO_ROOT, "src/sanity/lib/dua-dhikr-publication-gate.ts"), "utf-8");

function entrySchemaSourceDoesNotImportDhikrPublicationGate(): boolean {
  const importLines = duaDhikrGateSource.split("\n").filter((line) => /^\s*import\b/.test(line));
  return !importLines.some((line) => line.includes("dhikr-publication-gate") && !line.includes("dua-dhikr-publication-gate"));
}

/* ── Schema field presence ────────────────────────────────────────────── */

function testEntrySchemaHasRequiredContentFields() {
  const requiredFieldNames = [
    "arabicText",
    "translationEn",
    "translationDa",
    "sourceReferences",
    "collections",
    "reviewStatus",
    "boardApprovals",
    "editorialPublicationStatus",
    "importIdentifier",
    "contentProvenance",
  ];
  for (const field of requiredFieldNames) {
    assert(entrySchemaSource.includes(`name: "${field}"`), `duaDhikrEntry schema must define a "${field}" field`);
  }
  console.log("✓ duaDhikrEntry schema defines every required content/governance field");
}

function testEntrySchemaReusesSharedObjects() {
  assert(entrySchemaSource.includes('type: "sourceReference"'), "duaDhikrEntry must reuse the sourceReference object");
  assert(entrySchemaSource.includes('type: "boardApproval"'), "duaDhikrEntry must reuse the boardApproval object");
  assert(entrySchemaSource.includes('type: "provenanceNote"'), "duaDhikrEntry must reuse the provenanceNote object");
  console.log("✓ duaDhikrEntry reuses sourceReference, boardApproval, and provenanceNote rather than redefining them");
}

function testCollectionSchemaValidatesAgainstCanonicalTaxonomy() {
  assert(
    collectionSchemaSource.includes("CANONICAL_COLLECTION_SLUGS"),
    "duaDhikrCollection's slug field must validate against CANONICAL_COLLECTION_SLUGS to prevent duplicate categories",
  );
  console.log("✓ duaDhikrCollection slug validation references the canonical taxonomy (duplicate-category prevention)");
}

function testBothSchemasRegisteredInSchemaIndex() {
  assert(schemaIndexSource.includes("duaDhikrCollection"), "duaDhikrCollection must be registered in schemas/index.ts");
  assert(schemaIndexSource.includes("duaDhikrEntry"), "duaDhikrEntry must be registered in schemas/index.ts");
  console.log("✓ duaDhikrCollection and duaDhikrEntry are registered in src/sanity/schemas/index.ts");
}

function testBothSchemasRegisteredInStudioStructure() {
  assert(structureIndexSource.includes("duaDhikrCollection"), "duaDhikrCollection must appear in the Studio structure");
  assert(structureIndexSource.includes("duaDhikrEntry"), "duaDhikrEntry must appear in the Studio structure");
  console.log("✓ Duʿā & Dhikr document types are reachable from the Studio structure");
}

/* ── Review-bypass scope ─────────────────────────────────────────────── */

const baseEligibleDoc = {
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

function testCanonicalGateRequiresBothApprovals() {
  assert(isDuaDhikrEntryPubliclyEligible(baseEligibleDoc), "a fully-approved document must be eligible via the canonical gate");
  assert(
    !isDuaDhikrEntryPubliclyEligible({ ...baseEligibleDoc, boardApprovals: [{ board: "editorial", approved: true }] }),
    "the canonical gate must require a scholarly approval, not just editorial",
  );
  assert(
    !isDuaDhikrEntryPubliclyEligible({ ...baseEligibleDoc, boardApprovals: [{ board: "scholarly", approved: true }] }),
    "the canonical gate must require an editorial approval, not just scholarly",
  );
  console.log("✓ the canonical Duʿā & Dhikr gate requires BOTH scholarly and editorial approval");
}

function testBypassNeverRequiresScholarlyApproval() {
  const bypassDoc = {
    editorialPublicationStatus: "editorial-only-scholarly-review-pending",
    arabicText: "x",
    translationEn: "x",
    translationDa: "x",
    sourceReferences: [{ type: "other", citation: "x" }],
    boardApprovals: [{ board: "editorial", approved: true }],
  };
  assert(isDuaDhikrEntryEditoriallyPubliclyEligible(bypassDoc), "a document with editorial approval + bypass flag must be eligible via the bypass");
  console.log("✓ the bypass pathway is satisfiable with ONLY an editorial approval (never requires scholarly)");
}

function testBypassRequiresExplicitFlag() {
  const almostBypassDoc = {
    editorialPublicationStatus: "",
    arabicText: "x",
    translationEn: "x",
    translationDa: "x",
    sourceReferences: [{ type: "other", citation: "x" }],
    boardApprovals: [{ board: "editorial", approved: true }],
  };
  assert(
    !isDuaDhikrEntryEditoriallyPubliclyEligible(almostBypassDoc),
    "the bypass must never apply when editorialPublicationStatus is not explicitly set",
  );
  console.log("✓ the bypass never applies without an explicit editorialPublicationStatus flag");
}

function testBypassNeverWeakensCanonicalGate() {
  // A document satisfying the bypass but NOT the canonical rule (no
  // scholarly approval) must still fail the canonical gate.
  const bypassOnlyDoc = {
    reviewStatus: "editorial-review",
    editorialPublicationStatus: "editorial-only-scholarly-review-pending",
    arabicText: "x",
    translationEn: "x",
    translationDa: "x",
    sourceReferences: [{ type: "other", citation: "x" }],
    boardApprovals: [{ board: "editorial", approved: true }],
  };
  assert(
    !isDuaDhikrEntryPubliclyEligible(bypassOnlyDoc),
    "a document eligible only via the bypass must NOT be reported eligible by the canonical (scholarly-approved) gate",
  );
  console.log("✓ the bypass never makes a document eligible under the canonical, scholarly-approved gate");
}

function testDuaDhikrGateIsIndependentFromDhikrGate() {
  // Both canonical rules deliberately express the SAME shape of condition
  // (same field names, same board-approval logic) since duaDhikrEntry
  // mirrors dhikrItem's content model — so identical string content here is
  // expected, not a sign of accidental reuse. What matters is that they are
  // two independently defined, independently importable constants (see the
  // two distinct import statements at the top of this file) rather than one
  // being an alias/re-export of the other — a source-level check for that:
  assert(
    entrySchemaSourceDoesNotImportDhikrPublicationGate(),
    "dua-dhikr-publication-gate.ts must not import from dhikr-publication-gate.ts (must be fully independent, not layered on top of it)",
  );
  // The bypass rules, by contrast, use different status string values by
  // design (see docs/dua-dhikr/REVIEW_BYPASS.md) and so must differ:
  assert(
    DUA_DHIKR_EDITORIAL_ELIGIBILITY_GROQ !== DHIKR_EDITORIAL_ELIGIBILITY_GROQ,
    "the Duʿā & Dhikr bypass gate must use its own status string, not the Dhikr bypass gate's",
  );
  assert(
    DUA_DHIKR_EDITORIAL_ELIGIBILITY_GROQ.includes("editorial-only-scholarly-review-pending"),
    "the Duʿā & Dhikr bypass must use its own status string, distinct from dhikrItem's",
  );
  assert(
    !DUA_DHIKR_EDITORIAL_ELIGIBILITY_GROQ.includes("editorially-published-pending-scholarly-review"),
    "the Duʿā & Dhikr bypass must not reuse dhikrItem's bypass status string",
  );
  console.log("✓ the Duʿā & Dhikr publication gate (canonical and bypass) is fully independent from the Dhikr (Morning/Evening) gate");
}

function runAll() {
  testEntrySchemaHasRequiredContentFields();
  testEntrySchemaReusesSharedObjects();
  testCollectionSchemaValidatesAgainstCanonicalTaxonomy();
  testBothSchemasRegisteredInSchemaIndex();
  testBothSchemasRegisteredInStudioStructure();
  testCanonicalGateRequiresBothApprovals();
  testBypassNeverRequiresScholarlyApproval();
  testBypassRequiresExplicitFlag();
  testBypassNeverWeakensCanonicalGate();
  testDuaDhikrGateIsIndependentFromDhikrGate();
  console.log("\nAll Duʿā & Dhikr schema/review-bypass tests passed.");
}

runAll();
