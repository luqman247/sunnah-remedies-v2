/**
 * Stage 3B — MDR-004 source-audit tests.
 *
 * Verifies the Stage 3B research pass touched only MDR-004's research
 * fields, left MDR-001 through MDR-003 (already researched, checkpoint
 * b428838) and MDR-005 through MDR-030 (still Stage 3A transcription-only)
 * unchanged, and proves the clause-map's reconstruction integrity. All
 * other records are checked against a fixture snapshot captured from
 * checkpoint b428838 — see
 * tests/dhikr/fixtures/mdr-001-003-005-030-b428838-baseline.json.
 *
 * Plain assert()-based, run via `npx tsx`, following the repository's
 * established convention (docs/dhikr/17-test-and-validation-plan.md).
 */

import fs from "node:fs";
import path from "node:path";
import { MORNING_DHIKR_SOURCE_REGISTER } from "../../src/lib/dhikr-research/morning-dhikr-register";
import { computeImportGate } from "../../src/lib/dhikr-research/validation";
import { MDR_004_CLAUSE_MAP, reconstructMdr004FromClauses } from "../../src/lib/dhikr-research/audits/mdr-004-clause-map";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const REGISTER = MORNING_DHIKR_SOURCE_REGISTER;
const MDR_004 = REGISTER.find((r) => r.internalId === "MDR-004")!;

function loadBaselineFixture() {
  const fixturePath = path.resolve(__dirname, "fixtures/mdr-001-003-005-030-b428838-baseline.json");
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
}

function loadAuditReport(): string {
  const repoRoot = path.resolve(__dirname, "../..");
  const reportPath = path.join(repoRoot, "docs/dhikr/research/MDR-004-source-audit.md");
  assert(fs.existsSync(reportPath), "docs/dhikr/research/MDR-004-source-audit.md does not exist");
  return fs.readFileSync(reportPath, "utf8");
}

function testOnlyMdr004ResearchFieldsChanged() {
  // MDR-005 through MDR-009 are excluded from this comparison: each was
  // legitimately researched in a later stage and is no longer expected to
  // match this checkpoint's baseline. Those later changes are verified by
  // their own dedicated files, tests/dhikr/dhikr-source-register-mdr-005-audit.test.ts,
  // -mdr-006-audit.test.ts, -mdr-007-audit.test.ts, -mdr-008-audit.test.ts,
  // and -mdr-009-audit.test.ts.
  const excludedIds = new Set(["MDR-005", "MDR-006", "MDR-007", "MDR-008", "MDR-009"]);
  const baseline = loadBaselineFixture().filter((r: { internalId: string }) => !excludedIds.has(r.internalId));
  const otherRecords = REGISTER.filter((r) => r.internalId !== "MDR-004" && !excludedIds.has(r.internalId));
  assert(
    otherRecords.length === baseline.length,
    `Expected ${baseline.length} records besides MDR-004/MDR-005/MDR-006/MDR-007/MDR-008/MDR-009, found ${otherRecords.length}`,
  );
  for (let i = 0; i < otherRecords.length; i++) {
    assert(
      JSON.stringify(otherRecords[i]) === JSON.stringify(baseline[i]),
      `${otherRecords[i].internalId} differs from its checkpoint b428838 baseline — this Stage 3B pass must only touch MDR-004`,
    );
  }
  console.log(
    "✓ only MDR-004 changed in this stage; MDR-001 through MDR-003 and MDR-010 through MDR-030 match checkpoint b428838 exactly (MDR-005 through MDR-009 verified separately)",
  );
}

function testMdr001Through003RemainUnchangedFromCheckpoint() {
  const baseline = loadBaselineFixture();
  for (const id of ["MDR-001", "MDR-002", "MDR-003"]) {
    const baselineRecord = baseline.find((r: { internalId: string }) => r.internalId === id);
    const currentRecord = REGISTER.find((r) => r.internalId === id);
    assert(!!baselineRecord && !!currentRecord, `${id} missing from baseline or current register`);
    assert(
      JSON.stringify(currentRecord) === JSON.stringify(baselineRecord),
      `${id} changed during the MDR-004 audit — its prior Stage 3B research (checkpoint b428838) must remain untouched`,
    );
  }
  console.log("✓ MDR-001 through MDR-003 remain unchanged from checkpoint b428838");
}

function testMdr010Through030RemainUnchanged() {
  // MDR-005 through MDR-009 are excluded: each was legitimately researched
  // in a later stage (verified separately by their own dedicated test
  // files against their own later checkpoint baselines).
  const baseline = loadBaselineFixture();
  const expectedIds = Array.from({ length: 21 }, (_, i) => `MDR-${String(i + 10).padStart(3, "0")}`);
  for (const id of expectedIds) {
    const baselineRecord = baseline.find((r: { internalId: string }) => r.internalId === id);
    const currentRecord = REGISTER.find((r) => r.internalId === id);
    assert(!!baselineRecord && !!currentRecord, `${id} missing from baseline or current register`);
    assert(
      JSON.stringify(currentRecord) === JSON.stringify(baselineRecord),
      `${id} changed during the MDR-004 audit — it must remain Stage-3A transcription-only`,
    );
  }
  console.log("✓ MDR-010 through MDR-030 remain unchanged (21 records checked; MDR-005 through MDR-009 verified separately)");
}

function testMdr004ProtectedTranscriptionFieldsUnchanged() {
  const expected = {
    sequenceNumber: 4,
    internalId: "MDR-004",
    openingArabicWords: "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ",
    sourceDocumentAnnotations: [],
    transcriptionStatus: "exact",
    scholarlyReviewer: "",
    scholarlyDecision: "pending",
    importStatus: "research-only",
  };
  for (const [field, value] of Object.entries(expected)) {
    assert(
      JSON.stringify((MDR_004 as unknown as Record<string, unknown>)[field]) === JSON.stringify(value),
      `MDR-004.${field} was altered by the Stage 3B research pass — this field must remain untouched`,
    );
  }
  assert(
    MDR_004.originalDocumentText.length === 1697,
    `MDR-004.originalDocumentText length changed — expected 1697, found ${MDR_004.originalDocumentText.length}`,
  );
  assert(
    MDR_004.originalDocumentText === MDR_004.fullArabicText,
    "MDR-004.originalDocumentText and fullArabicText should remain identical to each other (no correction applied)",
  );
  console.log(
    "✓ MDR-004's protected transcription fields (sequenceNumber, internalId, openingArabicWords, originalDocumentText, fullArabicText, sourceDocumentAnnotations, transcriptionStatus, scholarlyReviewer, scholarlyDecision, importStatus) are unchanged",
  );
}

function testClauseIdsAreUniqueAndOrdered() {
  const ids = MDR_004_CLAUSE_MAP.map((c) => c.clauseId);
  const expectedOrder = ["MDR-004-A", "MDR-004-B", "MDR-004-C", "MDR-004-D", "MDR-004-E", "MDR-004-F"];
  assert(JSON.stringify(ids) === JSON.stringify(expectedOrder), `Clause IDs are not in the expected order: ${ids.join(", ")}`);
  assert(new Set(ids).size === ids.length, "Clause IDs are not unique");
  const sequences = MDR_004_CLAUSE_MAP.map((c) => c.sequenceWithinRecord);
  assert(
    JSON.stringify(sequences) === JSON.stringify([1, 2, 3, 4, 5, 6]),
    `sequenceWithinRecord values are not 1..6 in order: ${sequences.join(", ")}`,
  );
  console.log("✓ clause IDs are unique, in order (A through F), with sequenceWithinRecord 1..6");
}

function testClauseReconstructionReproducesMdr004Exactly() {
  const reconstructed = reconstructMdr004FromClauses();
  assert(
    reconstructed === MDR_004.originalDocumentText,
    "Concatenating all six clauses does not reproduce MDR-004.originalDocumentText exactly",
  );
  console.log("✓ clause reconstruction reproduces MDR-004.originalDocumentText exactly (including the documented leading-space rule)");
}

function testNoArabicIsOmittedOrDuplicated() {
  const totalClauseLength = MDR_004_CLAUSE_MAP.reduce((sum, c) => sum + c.exactArabicClause.length, 0);
  assert(
    totalClauseLength === MDR_004.originalDocumentText.length,
    `Sum of clause lengths (${totalClauseLength}) does not equal originalDocumentText length (${MDR_004.originalDocumentText.length})`,
  );
  for (const clause of MDR_004_CLAUSE_MAP) {
    assert(clause.exactArabicClause.length > 0, `${clause.clauseId} has zero length`);
  }
  console.log("✓ no Arabic is omitted or duplicated across the six clauses");
}

function testNoWholeRecordSourceClaimedFromPartialMatch() {
  assert(
    MDR_004.primaryReference.includes("No single source has been confirmed to contain the whole MDR-004 text"),
    "MDR-004.primaryReference must explicitly state no single source has been confirmed to cover the whole text",
  );
  assert(
    MDR_004.primaryCollection.includes("Provisional source leads only"),
    "MDR-004.primaryCollection must describe the structure as provisional source leads, not confirmed sources",
  );
  console.log("✓ no whole-record source is claimed from a partial match; sourcing is explicitly provisional");
}

function testSourceHierarchyCorrectlyLabelled() {
  const report = loadAuditReport();
  assert(
    report.includes("| Candidate/reported item | Hierarchy label |"),
    "Audit report is missing the source-hierarchy table",
  );
  assert(
    report.includes("Original collection lead, not inspected"),
    "Audit report must label reported collections as leads not directly inspected",
  );
  console.log("✓ source hierarchy is correctly labelled in the audit report");
}

function testLaterCompilationNotCalledPrimarySource() {
  const report = loadAuditReport();
  assert(
    !/dorar\.net.{0,40}(is|as) the primary/i.test(report) && !/alukah\.net.{0,40}(is|as) the primary/i.test(report),
    "Audit report must not call dorar.net or alukah.net a primary source",
  );
  assert(
    report.includes("Modern takhrij article, inaccessible") || report.includes("Indexed secondary discussion, inaccessible"),
    "Audit report must label dorar.net/alukah.net as secondary/inaccessible, not primary",
  );
  console.log("✓ later compilations/articles are not called the primary source");
}

function testOriginalSourceInspectionNotOverstated() {
  const report = loadAuditReport();
  assert(
    report.includes("no primary hadith collection's or classical compilation's own page was successfully opened and read in this pass") ||
      report.includes("No primary hadith collection's own page was successfully opened"),
    "Audit report must explicitly state no primary/classical page was directly inspected",
  );
  assert(
    MDR_004.sourceArabicWording === "",
    "MDR-004.sourceArabicWording must remain empty given no directly-inspected primary text was obtained",
  );
  const overclaimPatterns = [/directly inspected primary Arabic/i, /(?<!no )original collection (is|was) directly inspected/i];
  for (const pattern of overclaimPatterns) {
    assert(!pattern.test(report), `Audit report overstates original-source inspection, matching ${pattern}`);
  }
  console.log("✓ original-source inspection is not overstated; sourceArabicWording remains empty");
}

function testPropheticAttributionQualifiedWhereWeakOrUnresolved() {
  assert(
    MDR_004.narrator.includes("none directly inspected") || MDR_004.narrator.includes("reported"),
    "MDR-004.narrator must qualify attribution as reported, not directly confirmed",
  );
  const report = loadAuditReport();
  assert(
    report.includes("reported as attributed to the Prophet ﷺ"),
    "Audit report must qualify Prophetic attribution precisely (\"reported as attributed to the Prophet ﷺ\"), not assert it outright",
  );
  assert(
    report.includes("this is a search-indexed source lead, not a verified attribution"),
    "Audit report must explicitly distinguish a search-indexed source lead from a verified attribution",
  );
  console.log("✓ Prophetic attribution is qualified as reported, weak, or unresolved throughout");
}

function testRepetitionEvidenceNotDerivedFromAnnotationAlone() {
  assert(
    JSON.stringify(MDR_004.sourceDocumentAnnotations) === "[]",
    "MDR-004.sourceDocumentAnnotations should be empty (no repetition marker in the source document)",
  );
  assert(MDR_004.repetitionCount === undefined, "MDR-004.repetitionCount should remain unset — no repetition evidence was found");
  assert(MDR_004.repetitionEvidence === "", "MDR-004.repetitionEvidence should remain empty");
  console.log("✓ repetition evidence is not derived from source-document annotation alone (there is none, and none was invented)");
}

function testVirtueEvidenceNotInferredFromFirstPersonPetition() {
  assert(MDR_004.virtueOrRewardClaim === "", "MDR-004.virtueOrRewardClaim must remain empty");
  assert(
    MDR_004.virtueEvidence.includes("first-person petition") || MDR_004.virtueEvidence.includes("Not populated"),
    "MDR-004.virtueEvidence should explain why no claim was inferred from first-person petition wording",
  );
  console.log("✓ no virtue/reward claim is inferred from MDR-004's first-person petition and testimony wording");
}

function testGradingAppliesOnlyToEvidenceItActuallyCovers() {
  assert(MDR_004.hadithGrading === "", "MDR-004.hadithGrading must remain empty at the record level");
  assert(MDR_004.gradingAuthority === "", "MDR-004.gradingAuthority must remain empty at the record level");
  assert(
    MDR_004.gradingNotes.includes("recorded as a reported disagreement") && MDR_004.gradingNotes.includes("not harmonised into a single verdict"),
    "MDR-004.gradingNotes must record the Ibn al-Jawzi/al-Haythami disagreement as reported, without harmonising it",
  );
  console.log("✓ grading is not applied uniformly across independently-sourced components; record-level grading stays empty");
}

function testSourceResearchStatusMatchesActualEvidence() {
  assert(
    MDR_004.sourceResearchStatus === "in-progress",
    `MDR-004.sourceResearchStatus is "${MDR_004.sourceResearchStatus}", expected "in-progress" — no primary or classical-compilation page was directly inspected in this pass`,
  );
  assert(MDR_004.sourceResearchStatus !== "verified", "MDR-004.sourceResearchStatus must not be \"verified\"");
  assert(
    MDR_004.sourceResearchStatus !== "scholarly-review-required",
    "MDR-004.sourceResearchStatus must not be \"scholarly-review-required\" until key source texts are directly inspected",
  );
  console.log('✓ MDR-004.sourceResearchStatus ("in-progress") matches the actual, limited direct-inspection evidence');
}

function testAllClauseLevelStatusesAreInProgress() {
  for (const clause of MDR_004_CLAUSE_MAP) {
    assert(
      clause.sourceResearchStatus === "in-progress",
      `${clause.clauseId}.sourceResearchStatus is "${clause.sourceResearchStatus}", expected "in-progress" (no clause has directly-inspected evidence justifying a stronger status)`,
    );
  }
  console.log("✓ all six clause-level sourceResearchStatus values are \"in-progress\"");
}

function testNoClauseClaimsDirectlyInspectedArabic() {
  for (const clause of MDR_004_CLAUSE_MAP) {
    assert(
      clause.directlyInspectedArabic === false,
      `${clause.clauseId}.directlyInspectedArabic is true — no clause has directly-inspected Arabic in this pass`,
    );
  }
  console.log("✓ no clause claims directlyInspectedArabic: true");
}

function testPrimaryCollectionIsExplicitlyProvisional() {
  assert(
    MDR_004.primaryCollection.includes("Provisional source leads only"),
    "MDR-004.primaryCollection must explicitly state it holds provisional source leads only",
  );
  assert(
    MDR_004.primaryCollection.includes("None of these original entries was directly inspected"),
    "MDR-004.primaryCollection must explicitly state none of the original entries was directly inspected",
  );
  console.log("✓ primaryCollection is explicitly framed as provisional source leads, not established primary collections");
}

function testReportedNarratorsNotPresentedAsVerified() {
  assert(
    MDR_004.narrator.includes("none verified in an underlying collection") ||
      MDR_004.narrator.includes("not confirmed narrator chains"),
    "MDR-004.narrator must state that reported narrators are not verified in an underlying collection",
  );
  console.log("✓ reported narrators are not presented as verified");
}

function testTimingDescribedAsReportedUnverified() {
  const report = loadAuditReport();
  assert(
    report.includes("reported morning-specific wording; not directly verified") ||
      report.includes("reported morning-specific wording, not directly verified"),
    "Audit report must describe clauses A-C's timing as reported/unverified",
  );
  assert(
    report.includes("reported morning-and-evening wording; not directly verified") ||
      report.includes("reported morning-and-evening wording, not directly verified"),
    "Audit report must describe clause E's timing as reported/unverified",
  );
  assert(
    !/timing.{0,40}confirmed/i.test(report),
    "Audit report must not describe timing as confirmed anywhere",
  );
  console.log("✓ timing is described as reported/unverified, not confirmed, throughout the audit report");
}

function testGradingDescribedAsReportedUnverified() {
  assert(
    MDR_004.gradingNotes.includes("reported through an inaccessible or indexed secondary material") ||
      MDR_004.gradingNotes.includes("not direct inspection"),
    "MDR-004.gradingNotes must describe gradings as reported through inaccessible/indexed material, not direct inspection",
  );
  const report = loadAuditReport();
  assert(
    report.includes("no grading below is treated as directly verified"),
    "Audit report must explicitly state no grading is treated as directly verified",
  );
  console.log("✓ grading is described as reported/unverified throughout");
}

function testClauseFRemainsUnsourced() {
  const clauseF = MDR_004_CLAUSE_MAP.find((c) => c.clauseId === "MDR-004-F")!;
  assert(clauseF.sourceResearchStatus === "in-progress", "Clause F should be in-progress, not a settled unsourced-forever status");
  assert(
    !clauseF.proposedSources.some((s) => /^al-Tabarani/.test(s)),
    "Clause F must not be attributed to al-Tabarani based on the one unverified mirror lead",
  );
  assert(
    clauseF.proposedSources.every((s) => s.includes("Unconfirmed") || s.includes("unverified") || s.length === 0) ||
      clauseF.proposedSources.length === 0,
    "Clause F's proposedSources must contain only clearly labelled unconfirmed leads, or be empty",
  );
  console.log("✓ clause F remains unsourced and is not attributed to al-Tabarani based on the unverified mirror lead");
}

function testReportCallsCompositeConclusionProvisional() {
  const report = loadAuditReport();
  assert(
    report.includes("MDR-004 is provisionally classified as composite-text"),
    "Audit report must state the composite classification is provisional",
  );
  assert(
    report.includes("composite conclusion remains provisional until the named source texts are directly inspected"),
    "Audit report must state the composite conclusion remains provisional pending direct inspection",
  );
  // Note: "confirmed narration" is deliberately excluded from this list — the
  // report itself quotes that exact phrase in §7 as an example of language it
  // does NOT use ("No phrase in this report says ... 'confirmed narration' ..."),
  // which would otherwise false-positive against a naive substring/regex check.
  const overclaimPatterns = [
    /affirmatively evidenced composite/i,
    /combines at least three independently-sourced narrations/i,
    /composite hypothesis is proven/i,
  ];
  for (const pattern of overclaimPatterns) {
    assert(!pattern.test(report), `Audit report contains overclaiming composite-certainty language matching ${pattern}`);
  }
  assert(
    report.includes('No phrase in this report says "source located," "confirmed source," "confirmed narration,"'),
    "Audit report should explicitly disclaim the banned overclaim phrases in its source-hierarchy section",
  );
  console.log("✓ audit report explicitly calls the composite conclusion provisional and avoids overclaiming language");
}

function testReportDistinguishesSegmentationFromProofOfSeparateOrigins() {
  const report = loadAuditReport();
  assert(
    report.includes("segmentation is structurally reliable") || report.includes("Segmentation (verified exact by reconstruction)"),
    "Audit report must state segmentation is structurally reliable",
  );
  assert(
    report.includes("clause boundaries themselves are not equivalent to proven independent source origins") ||
      report.includes("A grammatical boundary does not itself prove a separate narration"),
    "Audit report must explicitly distinguish grammatical segmentation from proof of separate source origins",
  );
  assert(
    report.includes("provisional source-analysis boundary, not a verified hadith boundary"),
    "Audit report must describe the E-F boundary as provisional, not a verified hadith boundary",
  );
  console.log("✓ audit report distinguishes segmentation, source attribution, and proof of separate origins");
}

function testWordingMatchStatusMatchesComparison() {
  assert(
    MDR_004.wordingMatchStatus === "unresolved",
    `MDR-004.wordingMatchStatus is "${MDR_004.wordingMatchStatus}", expected "unresolved" (no directly-inspected comparison text was obtained for any clause)`,
  );
  console.log('✓ MDR-004.wordingMatchStatus ("unresolved") matches the absence of any directly-inspected comparison text');
}

function testScholarlyDecisionRemainsPending() {
  assert(MDR_004.scholarlyDecision === "pending", `MDR-004.scholarlyDecision is "${MDR_004.scholarlyDecision}", expected "pending"`);
  console.log('✓ MDR-004.scholarlyDecision remains "pending"');
}

function testImportStatusRemainsResearchOnly() {
  assert(MDR_004.importStatus === "research-only", `MDR-004.importStatus is "${MDR_004.importStatus}", expected "research-only"`);
  console.log("✓ MDR-004.importStatus remains research-only");
}

function testComputeImportGateRemainsFalse() {
  const gate = computeImportGate(MDR_004);
  assert(gate.canImport === false, "MDR-004 unexpectedly passed computeImportGate");
  assert(gate.blockedReasons.length >= 4, "MDR-004 should remain blocked by multiple independent conditions");
  console.log(`✓ computeImportGate(MDR-004) remains false (${gate.blockedReasons.length} reasons)`);
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
    report.includes("## 23. Manual verification checklist"),
    'Audit report is missing the "Manual verification checklist" section',
  );
  assert(
    (report.match(/^\- \[ \]/gm) || []).length >= 6,
    "Audit report's manual-verification checklist should have at least 6 items",
  );
  console.log("✓ audit report contains a manual verification checklist");
}

function testAuditReportDoesNotOverstateAuthenticityCertaintyOrNonExistence() {
  const report = loadAuditReport();
  const overclaimPatterns = [
    /confirmed not to exist/i,
    /definitively (proves|confirms|establishes)/i,
    /beyond (any )?doubt/i,
    /is authentic\b/i,
    /is (definitely|certainly) (sahih|authentic)/i,
    /proven to be/i,
  ];
  for (const pattern of overclaimPatterns) {
    assert(!pattern.test(report), `Audit report contains overclaiming language matching ${pattern}`);
  }
  assert(
    report.includes("not established") || report.includes("unresolved"),
    "Audit report should record genuine uncertainty rather than resolving everything",
  );
  console.log("✓ audit report does not overstate authenticity, certainty, or non-existence");
}

function runAll() {
  testOnlyMdr004ResearchFieldsChanged();
  testMdr001Through003RemainUnchangedFromCheckpoint();
  testMdr010Through030RemainUnchanged();
  testMdr004ProtectedTranscriptionFieldsUnchanged();
  testClauseIdsAreUniqueAndOrdered();
  testClauseReconstructionReproducesMdr004Exactly();
  testNoArabicIsOmittedOrDuplicated();
  testNoWholeRecordSourceClaimedFromPartialMatch();
  testSourceHierarchyCorrectlyLabelled();
  testLaterCompilationNotCalledPrimarySource();
  testOriginalSourceInspectionNotOverstated();
  testPropheticAttributionQualifiedWhereWeakOrUnresolved();
  testRepetitionEvidenceNotDerivedFromAnnotationAlone();
  testVirtueEvidenceNotInferredFromFirstPersonPetition();
  testGradingAppliesOnlyToEvidenceItActuallyCovers();
  testSourceResearchStatusMatchesActualEvidence();
  testAllClauseLevelStatusesAreInProgress();
  testNoClauseClaimsDirectlyInspectedArabic();
  testPrimaryCollectionIsExplicitlyProvisional();
  testReportedNarratorsNotPresentedAsVerified();
  testTimingDescribedAsReportedUnverified();
  testGradingDescribedAsReportedUnverified();
  testClauseFRemainsUnsourced();
  testReportCallsCompositeConclusionProvisional();
  testReportDistinguishesSegmentationFromProofOfSeparateOrigins();
  testWordingMatchStatusMatchesComparison();
  testScholarlyDecisionRemainsPending();
  testImportStatusRemainsResearchOnly();
  testComputeImportGateRemainsFalse();
  testNoSanityOrPublicFileChanged();
  testAuditReportContainsManualVerificationChecklist();
  testAuditReportDoesNotOverstateAuthenticityCertaintyOrNonExistence();
  console.log("\nAll MDR-004 source-audit tests passed.");
}

runAll();
