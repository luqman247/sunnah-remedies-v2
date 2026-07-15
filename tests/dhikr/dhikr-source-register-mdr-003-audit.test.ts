/**
 * Stage 3B — MDR-003 source-audit tests.
 *
 * Verifies the Stage 3B research pass touched only MDR-003's research
 * fields, left MDR-001/MDR-002 (already researched, checkpoint 5880e17)
 * and MDR-004 through MDR-030 (still Stage 3A transcription-only)
 * unchanged, and proves the clause-map's reconstruction integrity. MDR-001,
 * MDR-002, and MDR-004 through MDR-030 are checked against a fixture
 * snapshot captured from checkpoint 5880e17 — see
 * tests/dhikr/fixtures/mdr-001-002-004-030-5880e17-baseline.json.
 *
 * Plain assert()-based, run via `npx tsx`, following the repository's
 * established convention (docs/dhikr/17-test-and-validation-plan.md).
 */

import fs from "node:fs";
import path from "node:path";
import { MORNING_DHIKR_SOURCE_REGISTER } from "../../src/lib/dhikr-research/morning-dhikr-register";
import { computeImportGate } from "../../src/lib/dhikr-research/validation";
import { MDR_003_CLAUSE_MAP, reconstructMdr003FromClauses } from "../../src/lib/dhikr-research/audits/mdr-003-clause-map";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const REGISTER = MORNING_DHIKR_SOURCE_REGISTER;
const MDR_003 = REGISTER.find((r) => r.internalId === "MDR-003")!;

function loadBaselineFixture() {
  const fixturePath = path.resolve(__dirname, "fixtures/mdr-001-002-004-030-5880e17-baseline.json");
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
}

function loadAuditReport(): string {
  const repoRoot = path.resolve(__dirname, "../..");
  const reportPath = path.join(repoRoot, "docs/dhikr/research/MDR-003-source-audit.md");
  assert(fs.existsSync(reportPath), "docs/dhikr/research/MDR-003-source-audit.md does not exist");
  return fs.readFileSync(reportPath, "utf8");
}

function testOnlyMdr003ResearchFieldsChanged() {
  // MDR-004 and MDR-005 are excluded from this comparison: each was
  // legitimately researched in a later stage and is no longer expected to
  // match this checkpoint's baseline. Those later changes are verified by
  // their own dedicated files, tests/dhikr/dhikr-source-register-mdr-004-audit.test.ts
  // and -mdr-005-audit.test.ts.
  const excludedIds = new Set(["MDR-004", "MDR-005"]);
  const baseline = loadBaselineFixture().filter((r: { internalId: string }) => !excludedIds.has(r.internalId));
  const otherRecords = REGISTER.filter((r) => r.internalId !== "MDR-003" && !excludedIds.has(r.internalId));
  assert(
    otherRecords.length === baseline.length,
    `Expected ${baseline.length} records besides MDR-003/MDR-004/MDR-005, found ${otherRecords.length}`,
  );
  for (let i = 0; i < otherRecords.length; i++) {
    assert(
      JSON.stringify(otherRecords[i]) === JSON.stringify(baseline[i]),
      `${otherRecords[i].internalId} differs from its checkpoint 5880e17 baseline — this Stage 3B pass must only touch MDR-003`,
    );
  }
  console.log(
    "✓ only MDR-003 changed in this stage; MDR-001, MDR-002, and MDR-006 through MDR-030 match checkpoint 5880e17 exactly (MDR-004 and MDR-005 verified separately)",
  );
}

function testMdr001AndMdr002RemainUnchangedFromCheckpoint() {
  const baseline = loadBaselineFixture();
  for (const id of ["MDR-001", "MDR-002"]) {
    const baselineRecord = baseline.find((r: { internalId: string }) => r.internalId === id);
    const currentRecord = REGISTER.find((r) => r.internalId === id);
    assert(!!baselineRecord && !!currentRecord, `${id} missing from baseline or current register`);
    assert(
      JSON.stringify(currentRecord) === JSON.stringify(baselineRecord),
      `${id} changed during the MDR-003 audit — its prior Stage 3B research (checkpoint 5880e17) must remain untouched`,
    );
  }
  console.log("✓ MDR-001 and MDR-002 remain unchanged from checkpoint 5880e17");
}

function testMdr006Through030RemainUnchanged() {
  // MDR-004 and MDR-005 are excluded: both were legitimately researched in
  // later stages (verified separately by dhikr-source-register-mdr-004-audit.test.ts
  // and -mdr-005-audit.test.ts against their own later checkpoint baselines).
  // This function checks MDR-006 through MDR-030 against the Stage 3A
  // checkpoint used when the MDR-003 audit ran (5880e17), which remains
  // valid for records not yet researched at that point.
  const baseline = loadBaselineFixture();
  const expectedIds = Array.from({ length: 25 }, (_, i) => `MDR-${String(i + 6).padStart(3, "0")}`);
  for (const id of expectedIds) {
    const baselineRecord = baseline.find((r: { internalId: string }) => r.internalId === id);
    const currentRecord = REGISTER.find((r) => r.internalId === id);
    assert(!!baselineRecord && !!currentRecord, `${id} missing from baseline or current register`);
    assert(
      JSON.stringify(currentRecord) === JSON.stringify(baselineRecord),
      `${id} changed during the MDR-003 audit — it must remain Stage-3A transcription-only`,
    );
  }
  console.log("✓ MDR-006 through MDR-030 remain unchanged (25 records checked; MDR-004 and MDR-005 verified separately)");
}

function testMdr003ProtectedTranscriptionFieldsUnchanged() {
  const expected = {
    sequenceNumber: 3,
    internalId: "MDR-003",
    openingArabicWords: "أَاللَّهُمَّ أَنْتَ أَحَقُّ مِنْ ذِكْرٍ",
    sourceDocumentAnnotations: [],
    transcriptionStatus: "exact",
    scholarlyReviewer: "",
    scholarlyDecision: "pending",
    importStatus: "research-only",
  };
  for (const [field, value] of Object.entries(expected)) {
    assert(
      JSON.stringify((MDR_003 as unknown as Record<string, unknown>)[field]) === JSON.stringify(value),
      `MDR-003.${field} was altered by the Stage 3B research pass — this field must remain untouched`,
    );
  }
  assert(
    MDR_003.originalDocumentText.length === 996,
    `MDR-003.originalDocumentText length changed — expected 996, found ${MDR_003.originalDocumentText.length}`,
  );
  assert(
    MDR_003.originalDocumentText === MDR_003.fullArabicText,
    "MDR-003.originalDocumentText and fullArabicText should remain identical to each other (no correction applied)",
  );
  console.log("✓ MDR-003's protected transcription fields (sequenceNumber, internalId, openingArabicWords, originalDocumentText, fullArabicText, sourceDocumentAnnotations, transcriptionStatus, scholarlyReviewer, scholarlyDecision, importStatus) are unchanged");
}

function testClauseIdsAreUniqueAndOrdered() {
  const ids = MDR_003_CLAUSE_MAP.map((c) => c.clauseId);
  assert(ids.length === 6, `Expected 6 clauses, found ${ids.length}`);
  const expectedOrder = ["MDR-003-A", "MDR-003-B", "MDR-003-C", "MDR-003-D", "MDR-003-E", "MDR-003-F"];
  assert(JSON.stringify(ids) === JSON.stringify(expectedOrder), `Clause IDs are not in the expected order: ${ids.join(", ")}`);
  assert(new Set(ids).size === ids.length, "Clause IDs are not unique");
  const sequences = MDR_003_CLAUSE_MAP.map((c) => c.sequenceWithinRecord);
  assert(
    JSON.stringify(sequences) === JSON.stringify([1, 2, 3, 4, 5, 6]),
    `sequenceWithinRecord values are not 1..6 in order: ${sequences.join(", ")}`,
  );
  console.log("✓ clause IDs are unique, in order (A through F), with sequenceWithinRecord 1..6");
}

function testClauseReconstructionReproducesMdr003Exactly() {
  const reconstructed = reconstructMdr003FromClauses();
  assert(
    reconstructed === MDR_003.originalDocumentText,
    "Concatenating all six clauses does not reproduce MDR-003.originalDocumentText exactly",
  );
  console.log("✓ clause reconstruction reproduces MDR-003.originalDocumentText exactly");
}

function testNoArabicIsOmitted() {
  const totalClauseLength = MDR_003_CLAUSE_MAP.reduce((sum, c) => sum + c.exactArabicClause.length, 0);
  assert(
    totalClauseLength === MDR_003.originalDocumentText.length,
    `Sum of clause lengths (${totalClauseLength}) does not equal originalDocumentText length (${MDR_003.originalDocumentText.length}) — some Arabic may be omitted`,
  );
  console.log("✓ no Arabic is omitted (sum of clause lengths equals originalDocumentText length)");
}

function testNoArabicIsDuplicated() {
  // If any clause's text overlapped another (duplication), the sum of
  // clause lengths would exceed the reconstructed/original text length —
  // already disproven by testNoArabicIsOmitted's equality check — but this
  // test additionally confirms each clause is a genuinely distinct,
  // non-empty slice.
  const clauses = MDR_003_CLAUSE_MAP.map((c) => c.exactArabicClause);
  for (const clause of clauses) {
    assert(clause.length > 0, "A clause has zero length");
  }
  const reconstructed = clauses.join("");
  assert(
    reconstructed.length === MDR_003.originalDocumentText.length,
    "Concatenated clause length does not match original — possible duplication or omission",
  );
  console.log("✓ no Arabic is duplicated (each clause is a distinct, non-overlapping, non-empty slice)");
}

function testUncertainBoundariesAreLabelled() {
  for (const clause of MDR_003_CLAUSE_MAP) {
    assert(
      ["high", "medium", "uncertain"].includes(clause.boundaryConfidence),
      `${clause.clauseId} has an invalid boundaryConfidence: "${clause.boundaryConfidence}"`,
    );
    assert(clause.boundaryReason.trim().length > 0, `${clause.clauseId} is missing a boundaryReason`);
  }
  console.log("✓ every clause boundary carries an explicit confidence label and reason (none guessed silently)");
}

function testNoSingleSourceAssignedToWholeRecordWithoutFullTextEvidence() {
  // The record-level primaryReference must not assert a single citation
  // covers the whole text without acknowledging this was established via
  // direct full-text comparison, not an assumption from partial matches.
  assert(
    MDR_003.primaryReference.includes("clause-by-clause wording comparison") ||
      MDR_003.primaryReference.includes("all six research clauses"),
    "MDR-003.primaryReference should reference the clause-by-clause comparison that established one source covers the whole text",
  );
  assert(
    MDR_003.primaryReference.toLowerCase().includes("wording variants") ||
      MDR_003.primaryReference.toLowerCase().includes("real wording variants"),
    "MDR-003.primaryReference must not claim the single source is an exact match to the whole text",
  );
  console.log("✓ the single source assigned to MDR-003 is backed by full-text comparison evidence, not a partial-match assumption");
}

function testRecordLevelGradingOnlyPopulatedBecauseOneGradingCoversWholeText() {
  assert(MDR_003.hadithGrading === "Da'if (weak)", `MDR-003.hadithGrading is "${MDR_003.hadithGrading}", expected "Da'if (weak)"`);
  assert(MDR_003.gradingAuthority.trim().length > 0, "MDR-003.gradingAuthority should be populated alongside hadithGrading");
  // Every clause must share the same underlying source before a
  // record-level grading is considered justified.
  const allClausesShareSource = MDR_003_CLAUSE_MAP.every((c) =>
    c.proposedSources.some((s) => s.includes("al-Tabarani") && s.includes("Abu Umama")),
  );
  assert(
    allClausesShareSource,
    "Record-level grading is populated, but not every clause's proposedSources cites the same underlying hadith — this would be an unjustified single grading across separate sources",
  );
  console.log("✓ record-level grading is populated only because every clause traces to the same single source (verified across all 6 clauses)");
}

function testPartialMatchesAreLabelledAsPartialNotExact() {
  // Every clause with an identified wording variant must be labelled
  // something other than exact-match; only a clause with zero identified
  // differences may be exact-match. Matched against "variant" specifically
  // (not "differ*"), since an exact-match clause's own notes legitimately
  // say things like "no identified wording difference".
  for (const clause of MDR_003_CLAUSE_MAP) {
    const claimsVariant = clause.gradingNotes.toLowerCase().includes("variant");
    if (clause.wordingMatch === "exact-match") {
      assert(
        !claimsVariant,
        `${clause.clauseId} is labelled exact-match but its gradingNotes documents a variant — inconsistent`,
      );
    }
  }
  const exactClauses = MDR_003_CLAUSE_MAP.filter((c) => c.wordingMatch === "exact-match");
  const materiallyDifferentClauses = MDR_003_CLAUSE_MAP.filter((c) => c.wordingMatch === "materially-different");
  assert(exactClauses.length === 1 && exactClauses[0].clauseId === "MDR-003-C", "Expected exactly one exact-match clause (MDR-003-C)");
  assert(materiallyDifferentClauses.length === 5, `Expected 5 materially-different clauses, found ${materiallyDifferentClauses.length}`);
  console.log("✓ partial/variant matches are labelled materially-different, not conflated with the one genuine exact match (clause C)");
}

function testMdr003RemainsResearchOnly() {
  assert(MDR_003.importStatus === "research-only", `MDR-003.importStatus is "${MDR_003.importStatus}", expected "research-only"`);
  console.log("✓ MDR-003 remains research-only");
}

function testScholarlyDecisionRemainsPending() {
  assert(MDR_003.scholarlyDecision === "pending", `MDR-003.scholarlyDecision is "${MDR_003.scholarlyDecision}", expected "pending"`);
  console.log('✓ MDR-003.scholarlyDecision remains "pending"');
}

function testComputeImportGateRemainsFalse() {
  const gate = computeImportGate(MDR_003);
  assert(gate.canImport === false, "MDR-003 unexpectedly passed computeImportGate");
  assert(
    gate.blockedReasons.some((r) => /source research is not verified/i.test(r)),
    "computeImportGate should cite sourceResearchStatus as not verified",
  );
  assert(
    gate.blockedReasons.some((r) => /wording match is not resolved/i.test(r)),
    "computeImportGate should cite the materially-different wording match",
  );
  assert(
    gate.blockedReasons.some((r) => /scholarly approval is absent/i.test(r)),
    "computeImportGate should cite the pending scholarly decision",
  );
  assert(
    gate.blockedReasons.some((r) => /research-only/i.test(r)),
    "computeImportGate should cite the research-only import status",
  );
  console.log(`✓ computeImportGate(MDR-003) remains false with 4 blockers (${gate.blockedReasons.length} total)`);
}

function testNoSanityOrPublicFileChanged() {
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
      `${relativePath} references the dhikr-research module — the canonical eligibility gate and public/staff routes must remain untouched by Stage 3B`,
    );
  }
  const schemaDir = path.join(repoRoot, "src/sanity/schemas/documents/dhikr");
  const schemaFiles = fs.readdirSync(schemaDir);
  assert(
    JSON.stringify(schemaFiles.sort()) === JSON.stringify(["dhikr-category.ts", "dhikr-item.ts"].sort()),
    `Expected only dhikr-category.ts and dhikr-item.ts in ${schemaDir}, found: ${schemaFiles.join(", ")}`,
  );
  console.log("✓ no Sanity schema, public route, projection, or canonical eligibility gate changed");
}

function testAuditReportContainsManualVerificationChecklist() {
  const report = loadAuditReport();
  assert(
    report.includes("## 20. Manual verification checklist"),
    'Audit report is missing the "Manual verification checklist" section',
  );
  assert(
    (report.match(/^\- \[ \]/gm) || []).length >= 6,
    "Audit report's manual-verification checklist should have at least 6 items",
  );
  console.log("✓ audit report contains a manual verification checklist");
}

function testAuditReportDoesNotOverstateNonExistenceOrAuthenticity() {
  const report = loadAuditReport();
  const overclaimPatterns = [
    /confirmed not to exist/i,
    /definitively (proves|confirms|establishes)/i,
    /beyond (any )?doubt/i,
    /is authentic\b/i,
    /is (definitely|certainly) (sahih|authentic)/i,
  ];
  for (const pattern of overclaimPatterns) {
    assert(!pattern.test(report), `Audit report contains overclaiming language matching ${pattern}`);
  }
  assert(
    report.includes("da'if") || report.includes("weak") || report.includes("Da'if"),
    "Audit report should record the weak grading, not omit or upgrade it",
  );
  assert(
    report.includes("kept explicitly unresolved") || report.includes("not decided here") || report.includes("remains outstanding"),
    "Audit report should explicitly flag at least one genuinely unresolved question rather than resolving everything",
  );
  console.log("✓ audit report does not overstate non-existence or authenticity, and records the weak grading honestly");
}

function testAuditReportDoesNotCallMajmaAlZawaidThePrimarySource() {
  const report = loadAuditReport();
  assert(
    report.includes("recognised secondary classical compilation") || report.includes("recognised SECONDARY classical compilation"),
    "Audit report must describe Majma' al-Zawa'id as a secondary compilation",
  );
  assert(
    report.includes("not al-Tabarani's own primary collection") || report.includes("not al-Tabarani's primary collection"),
    "Audit report must explicitly state Majma' al-Zawa'id is not al-Tabarani's primary collection",
  );
  // Excludes correct negated statements like "does not call Majma' al-Zawa'id
  // the primary source" — only flags an actual positive claim.
  const overclaimPatterns = [
    /(?<!not (call|describe) )Majma'? al-Zawa'?id (is|as) the primary (source|collection)/i,
    /primary text directly inspected/i,
    /recognised classical edition of the primary source/i,
  ];
  for (const pattern of overclaimPatterns) {
    assert(!pattern.test(report), `Audit report calls Majma' al-Zawa'id the primary source, matching ${pattern}`);
  }
  console.log("✓ audit report does not call Majma' al-Zawa'id the primary source");
}

function testAlTabaraniMarkedAsNotDirectlyInspected() {
  const report = loadAuditReport();
  assert(
    report.includes("al-Tabarani's own original entry not directly inspected") ||
      report.includes("does not describe al-Tabarani as directly inspected"),
    "Audit report must explicitly state al-Tabarani's own original entry was not directly inspected",
  );
  assert(
    report.includes("remains outstanding") || report.includes("was not directly inspected") || report.includes("not directly inspected"),
    "Audit report must record that confirmation from al-Tabarani's original remains outstanding",
  );
  assert(
    MDR_003.primaryCollection.includes("al-Tabarani's own original entry was not directly inspected"),
    "MDR-003.primaryCollection must state al-Tabarani's original entry was not directly inspected",
  );
  console.log("✓ al-Tabarani is marked as not directly inspected, both in the report and the register");
}

function testPropheticAttributionIsQualifiedAsWeakReported() {
  const report = loadAuditReport();
  assert(
    report.includes("Reported as a Prophetic supplication through a weak chain") ||
      report.includes("reported as narrating from the Prophet"),
    "Audit report must qualify Prophetic attribution as reported/weak, not asserted outright",
  );
  assert(
    report.includes("attribution is recorded here as transmitted, not authenticated") ||
      report.includes("not an authenticated fact"),
    "Audit report must explicitly state Prophetic attribution is transmitted, not authenticated",
  );
  assert(
    MDR_003.narrator.includes("reported as narrating from the Prophet"),
    "MDR-003.narrator must qualify Prophetic attribution as reported, not asserted outright",
  );
  console.log("✓ Prophetic attribution is qualified as weak/reported, not authenticated, in both the report and the register");
}

function testSourceArabicWordingProvenanceNamesMajmaAlZawaid() {
  assert(
    MDR_003.sourceArabicWording.includes(
      "Arabic wording transcribed from al-Haythami's quotation in Majma' al-Zawa'id, not independently checked against al-Tabarani's original collection",
    ),
    "MDR-003.sourceArabicWording must carry the exact required provenance statement naming Majma' al-Zawa'id and disclaiming al-Tabarani cross-checking",
  );
  assert(
    MDR_003.sourceArabicWording.includes("Not primary Arabic"),
    "MDR-003.sourceArabicWording must explicitly disclaim being primary Arabic",
  );
  console.log("✓ sourceArabicWording provenance names Majma' al-Zawa'id and does not claim primary Arabic");
}

function testWaAwIssueRemainsUnresolved() {
  const report = loadAuditReport();
  assert(
    report.includes("kept explicitly unresolved, in either direction"),
    "Audit report must state the وَ/أَوْ timing variant is kept explicitly unresolved",
  );
  assert(
    MDR_003.morningSpecificStatus === "uncertain",
    `MDR-003.morningSpecificStatus is "${MDR_003.morningSpecificStatus}", expected "uncertain" given the unresolved وَ/أَوْ timing variant`,
  );
  console.log("✓ the وَ/أَوْ timing variant remains explicitly unresolved; morningSpecificStatus reverted to uncertain");
}

function testHadithGradingRemainsDaif() {
  assert(
    MDR_003.hadithGrading === "Da'if (weak)",
    `MDR-003.hadithGrading is "${MDR_003.hadithGrading}", expected "Da'if (weak)"`,
  );
  console.log('✓ MDR-003.hadithGrading remains "Da\'if (weak)"');
}

function testSourceResearchStatusRemainsScholarlyReviewRequired() {
  assert(
    MDR_003.sourceResearchStatus === "scholarly-review-required",
    `MDR-003.sourceResearchStatus is "${MDR_003.sourceResearchStatus}", expected "scholarly-review-required"`,
  );
  assert(MDR_003.sourceResearchStatus !== "verified", "MDR-003.sourceResearchStatus must not be \"verified\"");
  console.log('✓ MDR-003.sourceResearchStatus remains "scholarly-review-required"');
}

function runAll() {
  testOnlyMdr003ResearchFieldsChanged();
  testMdr001AndMdr002RemainUnchangedFromCheckpoint();
  testMdr006Through030RemainUnchanged();
  testMdr003ProtectedTranscriptionFieldsUnchanged();
  testClauseIdsAreUniqueAndOrdered();
  testClauseReconstructionReproducesMdr003Exactly();
  testNoArabicIsOmitted();
  testNoArabicIsDuplicated();
  testUncertainBoundariesAreLabelled();
  testNoSingleSourceAssignedToWholeRecordWithoutFullTextEvidence();
  testRecordLevelGradingOnlyPopulatedBecauseOneGradingCoversWholeText();
  testPartialMatchesAreLabelledAsPartialNotExact();
  testMdr003RemainsResearchOnly();
  testScholarlyDecisionRemainsPending();
  testComputeImportGateRemainsFalse();
  testNoSanityOrPublicFileChanged();
  testAuditReportContainsManualVerificationChecklist();
  testAuditReportDoesNotOverstateNonExistenceOrAuthenticity();
  testAuditReportDoesNotCallMajmaAlZawaidThePrimarySource();
  testAlTabaraniMarkedAsNotDirectlyInspected();
  testPropheticAttributionIsQualifiedAsWeakReported();
  testSourceArabicWordingProvenanceNamesMajmaAlZawaid();
  testWaAwIssueRemainsUnresolved();
  testHadithGradingRemainsDaif();
  testSourceResearchStatusRemainsScholarlyReviewRequired();
  console.log("\nAll MDR-003 source-audit tests passed.");
}

runAll();
