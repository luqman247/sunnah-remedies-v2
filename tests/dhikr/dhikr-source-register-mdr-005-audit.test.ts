/**
 * Stage 3B — MDR-005 source-audit tests.
 *
 * Verifies the Stage 3B research pass touched only MDR-005's research
 * fields, left MDR-001 through MDR-004 and MDR-006 through MDR-030
 * unchanged from checkpoint 3729062, and proves the clause-map's
 * reconstruction integrity. All other records are checked against a
 * fixture snapshot captured from checkpoint 3729062 — see
 * tests/dhikr/fixtures/mdr-001-004-006-030-3729062-baseline.json.
 *
 * Plain assert()-based, run via `npx tsx`, following the repository's
 * established convention (docs/dhikr/17-test-and-validation-plan.md).
 */

import fs from "node:fs";
import path from "node:path";
import { MORNING_DHIKR_SOURCE_REGISTER } from "../../src/lib/dhikr-research/morning-dhikr-register";
import { computeImportGate } from "../../src/lib/dhikr-research/validation";
import { MDR_005_CLAUSE_MAP, reconstructMdr005FromClauses } from "../../src/lib/dhikr-research/audits/mdr-005-clause-map";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const REGISTER = MORNING_DHIKR_SOURCE_REGISTER;
const MDR_005 = REGISTER.find((r) => r.internalId === "MDR-005")!;

function loadBaselineFixture() {
  const fixturePath = path.resolve(__dirname, "fixtures/mdr-001-004-006-030-3729062-baseline.json");
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
}

function loadAuditReport(): string {
  const repoRoot = path.resolve(__dirname, "../..");
  const reportPath = path.join(repoRoot, "docs/dhikr/research/MDR-005-source-audit.md");
  assert(fs.existsSync(reportPath), "docs/dhikr/research/MDR-005-source-audit.md does not exist");
  return fs.readFileSync(reportPath, "utf8");
}

function testOnlyMdr005ResearchFieldsChanged() {
  // MDR-006 through MDR-008 are excluded from this comparison: each was
  // legitimately researched in a later stage and is no longer expected to
  // match this checkpoint's baseline. Those later changes are verified by
  // their own dedicated files, tests/dhikr/dhikr-source-register-mdr-006-audit.test.ts,
  // -mdr-007-audit.test.ts, and -mdr-008-audit.test.ts.
  const excludedIds = new Set(["MDR-006", "MDR-007", "MDR-008"]);
  const baseline = loadBaselineFixture().filter((r: { internalId: string }) => !excludedIds.has(r.internalId));
  const otherRecords = REGISTER.filter((r) => r.internalId !== "MDR-005" && !excludedIds.has(r.internalId));
  assert(
    otherRecords.length === baseline.length,
    `Expected ${baseline.length} records besides MDR-005/MDR-006/MDR-007/MDR-008, found ${otherRecords.length}`,
  );
  for (let i = 0; i < otherRecords.length; i++) {
    assert(
      JSON.stringify(otherRecords[i]) === JSON.stringify(baseline[i]),
      `${otherRecords[i].internalId} differs from its checkpoint 3729062 baseline — this Stage 3B pass must only touch MDR-005`,
    );
  }
  console.log(
    "✓ only MDR-005 changed in this stage; MDR-001 through MDR-004 and MDR-009 through MDR-030 match checkpoint 3729062 exactly (MDR-006 through MDR-008 verified separately)",
  );
}

function testMdr001Through004RemainUnchangedFromCheckpoint() {
  const baseline = loadBaselineFixture();
  for (const id of ["MDR-001", "MDR-002", "MDR-003", "MDR-004"]) {
    const baselineRecord = baseline.find((r: { internalId: string }) => r.internalId === id);
    const currentRecord = REGISTER.find((r) => r.internalId === id);
    assert(!!baselineRecord && !!currentRecord, `${id} missing from baseline or current register`);
    assert(
      JSON.stringify(currentRecord) === JSON.stringify(baselineRecord),
      `${id} changed during the MDR-005 audit — its prior Stage 3B research (checkpoint 3729062) must remain untouched`,
    );
  }
  console.log("✓ MDR-001 through MDR-004 remain unchanged from checkpoint 3729062");
}

function testMdr009Through030RemainUnchanged() {
  // MDR-006 through MDR-008 are excluded: each was legitimately researched
  // in a later stage (verified separately by their own dedicated test
  // files against their own later checkpoint baselines).
  const baseline = loadBaselineFixture();
  const expectedIds = Array.from({ length: 22 }, (_, i) => `MDR-${String(i + 9).padStart(3, "0")}`);
  for (const id of expectedIds) {
    const baselineRecord = baseline.find((r: { internalId: string }) => r.internalId === id);
    const currentRecord = REGISTER.find((r) => r.internalId === id);
    assert(!!baselineRecord && !!currentRecord, `${id} missing from baseline or current register`);
    assert(
      JSON.stringify(currentRecord) === JSON.stringify(baselineRecord),
      `${id} changed during the MDR-005 audit — it must remain Stage-3A transcription-only`,
    );
  }
  console.log("✓ MDR-009 through MDR-030 remain unchanged (22 records checked; MDR-006 through MDR-008 verified separately)");
}

function testMdr005ProtectedTranscriptionFieldsUnchanged() {
  const expected = {
    sequenceNumber: 5,
    internalId: "MDR-005",
    openingArabicWords: "أَصْبَحْنَا وَأَصْبَحَ الْمَلِكُ لِلَّهِ وَالْكِبْرِيَاءِ",
    sourceDocumentAnnotations: [],
    transcriptionStatus: "exact",
    scholarlyReviewer: "",
    scholarlyDecision: "pending",
    importStatus: "research-only",
  };
  for (const [field, value] of Object.entries(expected)) {
    assert(
      JSON.stringify((MDR_005 as unknown as Record<string, unknown>)[field]) === JSON.stringify(value),
      `MDR-005.${field} was altered by the Stage 3B research pass — this field must remain untouched`,
    );
  }
  assert(
    MDR_005.originalDocumentText.length === 324,
    `MDR-005.originalDocumentText length changed — expected 324, found ${MDR_005.originalDocumentText.length}`,
  );
  assert(
    MDR_005.originalDocumentText === MDR_005.fullArabicText,
    "MDR-005.originalDocumentText and fullArabicText should remain identical to each other (no correction applied)",
  );
  console.log(
    "✓ MDR-005's protected transcription fields (sequenceNumber, internalId, openingArabicWords, originalDocumentText, fullArabicText, sourceDocumentAnnotations, transcriptionStatus, scholarlyReviewer, scholarlyDecision, importStatus) are unchanged",
  );
}

function testClauseIdsAreUniqueAndOrdered() {
  const ids = MDR_005_CLAUSE_MAP.map((c) => c.clauseId);
  const expectedOrder = ["MDR-005-A", "MDR-005-B"];
  assert(JSON.stringify(ids) === JSON.stringify(expectedOrder), `Clause IDs are not in the expected order: ${ids.join(", ")}`);
  assert(new Set(ids).size === ids.length, "Clause IDs are not unique");
  const sequences = MDR_005_CLAUSE_MAP.map((c) => c.sequenceWithinRecord);
  assert(
    JSON.stringify(sequences) === JSON.stringify([1, 2]),
    `sequenceWithinRecord values are not 1..2 in order: ${sequences.join(", ")}`,
  );
  console.log("✓ clause IDs are unique, in order (A, B), with sequenceWithinRecord 1..2");
}

function testClauseReconstructionReproducesMdr005Exactly() {
  const reconstructed = reconstructMdr005FromClauses();
  assert(
    reconstructed === MDR_005.originalDocumentText,
    "Concatenating both clauses does not reproduce MDR-005.originalDocumentText exactly",
  );
  console.log("✓ clause reconstruction reproduces MDR-005.originalDocumentText exactly (including the documented comma-boundary rule)");
}

function testNoArabicIsOmittedOrDuplicated() {
  const totalClauseLength = MDR_005_CLAUSE_MAP.reduce((sum, c) => sum + c.exactArabicClause.length, 0);
  assert(
    totalClauseLength === MDR_005.originalDocumentText.length,
    `Sum of clause lengths (${totalClauseLength}) does not equal originalDocumentText length (${MDR_005.originalDocumentText.length})`,
  );
  for (const clause of MDR_005_CLAUSE_MAP) {
    assert(clause.exactArabicClause.length > 0, `${clause.clauseId} has zero length`);
  }
  console.log("✓ no Arabic is omitted or duplicated across the two clauses");
}

function testNoWholeRecordSourceClaimedFromPartialMatch() {
  assert(
    MDR_005.primaryReference.includes("No single confirmed hadith or entry number"),
    "MDR-005.primaryReference must explicitly state no single hadith/entry number is confirmed",
  );
  assert(
    MDR_005.primaryCollection.includes("No primary hadith collection page was directly inspected"),
    "MDR-005.primaryCollection must describe sourcing as indexed leads only, not a confirmed primary collection",
  );
  console.log("✓ no whole-record source is claimed from a partial match; sourcing is explicitly indexed/provisional");
}

function testSourceHierarchyCorrectlyLabelled() {
  const report = loadAuditReport();
  assert(
    report.includes("| Candidate/reported item | Hierarchy label |"),
    "Audit report is missing the source-hierarchy table",
  );
  assert(
    report.includes("Indexed primary page located but inaccessible"),
    "Audit report must label indexed-but-inaccessible primary pages precisely",
  );
  console.log("✓ source hierarchy is correctly labelled in the audit report");
}

function testLaterCompilationNotCalledPrimarySource() {
  const report = loadAuditReport();
  assert(
    !/islamweb\.net.{0,40}(is|as) the primary/i.test(report) && !/dorar\.net.{0,40}(is|as) the primary/i.test(report),
    "Audit report must not call islamweb.net or dorar.net a primary source",
  );
  assert(
    report.includes("Directly inspected recognised secondary discussion") || report.includes("Contextual resemblance only"),
    "Audit report must label islamweb.net/dorar.net as secondary/contextual, not primary",
  );
  console.log("✓ later compilations/fatwa articles are not called the primary source");
}

function testOriginalSourceInspectionNotOverstated() {
  const report = loadAuditReport();
  assert(
    report.includes("no primary hadith or classical-compilation page was itself directly opened and read in this pass"),
    "Audit report must explicitly state no primary/classical page was directly inspected",
  );
  assert(
    MDR_005.sourceArabicWording === "",
    "MDR-005.sourceArabicWording must remain empty given no directly-inspected primary text was obtained",
  );
  const overclaimPatterns = [/directly inspected primary Arabic/i, /(?<!no )original collection (is|was) directly inspected/i];
  for (const pattern of overclaimPatterns) {
    assert(!pattern.test(report), `Audit report overstates original-source inspection, matching ${pattern}`);
  }
  console.log("✓ original-source inspection is not overstated; sourceArabicWording remains empty");
}

function testPropheticAttributionQualifiedWhereWeakOrUnresolved() {
  assert(
    MDR_005.narrator.includes("not a directly-inspected or confirmed narrator chain") || MDR_005.narrator.includes("reported"),
    "MDR-005.narrator must qualify attribution as reported, not directly confirmed",
  );
  const report = loadAuditReport();
  assert(
    report.includes("No Prophetic attribution is treated as authenticated in this report"),
    "Audit report must explicitly state no Prophetic attribution is treated as authenticated",
  );
  console.log("✓ Prophetic attribution is qualified as reported, weak, or unresolved throughout");
}

function testRepetitionEvidenceNotDerivedFromAnnotationAlone() {
  assert(
    JSON.stringify(MDR_005.sourceDocumentAnnotations) === "[]",
    "MDR-005.sourceDocumentAnnotations should be empty (no repetition marker in the source document)",
  );
  assert(MDR_005.repetitionCount === undefined, "MDR-005.repetitionCount should remain unset — no repetition evidence was found");
  assert(MDR_005.repetitionEvidence === "", "MDR-005.repetitionEvidence should remain empty");
  console.log("✓ repetition evidence is not derived from source-document annotation alone (there is none, and none was invented)");
}

function testVirtueEvidenceNotInferredFromPetition() {
  assert(MDR_005.virtueOrRewardClaim === "", "MDR-005.virtueOrRewardClaim must remain empty");
  assert(
    MDR_005.virtueEvidence.includes("Not populated") && MDR_005.virtueEvidence.includes("content of the petition itself"),
    "MDR-005.virtueEvidence should explain why no claim was inferred from the petition's own content",
  );
  console.log("✓ no virtue/reward claim is inferred from clause B's petition content");
}

function testGradingAppliesOnlyToEvidenceItActuallyCovers() {
  assert(MDR_005.hadithGrading === "", "MDR-005.hadithGrading must remain empty at the record level");
  assert(MDR_005.gradingAuthority === "", "MDR-005.gradingAuthority must remain empty at the record level");
  assert(
    MDR_005.gradingNotes.includes("does not address MDR-005's closing phrase") ||
      MDR_005.gradingNotes.includes("remains unsourced and ungraded"),
    "MDR-005.gradingNotes must record that the one located grading does not cover the closing phrase",
  );
  console.log("✓ grading is not applied uniformly across the whole record; record-level grading stays empty");
}

function testSourceResearchStatusMatchesActualEvidence() {
  assert(
    MDR_005.sourceResearchStatus === "in-progress",
    `MDR-005.sourceResearchStatus is "${MDR_005.sourceResearchStatus}", expected "in-progress" — no primary or classical-compilation page was directly inspected in this pass`,
  );
  assert(MDR_005.sourceResearchStatus !== "verified", "MDR-005.sourceResearchStatus must not be \"verified\"");
  assert(
    MDR_005.sourceResearchStatus !== "scholarly-review-required",
    "MDR-005.sourceResearchStatus must not be \"scholarly-review-required\" until key source texts are directly inspected",
  );
  console.log('✓ MDR-005.sourceResearchStatus ("in-progress") matches the actual, limited direct-inspection evidence');
}

function testAllClauseLevelStatusesAreInProgress() {
  for (const clause of MDR_005_CLAUSE_MAP) {
    assert(
      clause.sourceResearchStatus === "in-progress",
      `${clause.clauseId}.sourceResearchStatus is "${clause.sourceResearchStatus}", expected "in-progress" (no clause has directly-inspected evidence justifying a stronger status)`,
    );
  }
  console.log("✓ all two clause-level sourceResearchStatus values are \"in-progress\"");
}

function testNoClauseClaimsDirectlyInspectedArabic() {
  for (const clause of MDR_005_CLAUSE_MAP) {
    assert(
      clause.directlyInspectedArabic === false,
      `${clause.clauseId}.directlyInspectedArabic is true — no clause has directly-inspected Arabic in this pass`,
    );
  }
  console.log("✓ no clause claims directlyInspectedArabic: true");
}

function testTimingDescribedAsReportedUnverified() {
  const report = loadAuditReport();
  assert(
    report.includes("This conclusion rests specifically on **direct timing wording within the transcribed document text**"),
    "Audit report must explicitly ground timing conclusions in direct document-text wording, not a reported narrator-frame",
  );
  assert(
    report.includes("no evening-parallel") && report.includes("was not exhaustively verified"),
    "Audit report must not overclaim that no evening-parallel version exists",
  );
  assert(
    !/timing.{0,40}confirmed/i.test(report),
    "Audit report must not describe timing as confirmed anywhere",
  );
  console.log("✓ timing is described precisely (direct document-text wording, not a confirmed absence of an evening twin)");
}

function testGradingDescribedAsReportedUnverified() {
  assert(
    MDR_005.gradingNotes.includes("only a modern fatwa's relay of it") || MDR_005.gradingNotes.includes("relaying al-Hafiz al-'Iraqi's"),
    "MDR-005.gradingNotes must describe the grading as relayed via a modern fatwa, not directly inspected in its primary source",
  );
  const report = loadAuditReport();
  assert(
    report.includes("no grading below is treated as directly verified in its primary source"),
    "Audit report must explicitly state no grading is treated as directly verified in its primary source",
  );
  console.log("✓ grading is described as reported/relayed, not directly verified, throughout");
}

function testClosingPhraseRemainsUnsourced() {
  const clauseB = MDR_005_CLAUSE_MAP.find((c) => c.clauseId === "MDR-005-B")!;
  assert(
    clauseB.unresolvedIssues.some((issue) => issue.includes("remains unsourced")),
    "Clause B's unresolvedIssues must record that the closing phrase remains unsourced",
  );
  assert(
    clauseB.gradingNotes.includes("does not mention or corroborate this clause's further closing phrase"),
    "Clause B's gradingNotes must state the located grading does not cover the closing phrase",
  );
  console.log("✓ clause B's closing phrase remains explicitly unsourced and outside the located grading's scope");
}

function testContentClassificationIsNoLongerCompositeText() {
  assert(
    MDR_005.contentClassification !== "composite-text",
    `MDR-005.contentClassification is "${MDR_005.contentClassification}" — composite-text must not be used unless at least two independently-sourced components are actually established`,
  );
  assert(
    MDR_005.contentClassification === "unclassified",
    `MDR-005.contentClassification is "${MDR_005.contentClassification}", expected "unclassified" (the closest existing controlled value — "uncertain" and "general-remembrance" are not members of ContentClassification, and no new enum member was added)`,
  );
  console.log('✓ MDR-005.contentClassification is "unclassified", not "composite-text" — composite sourcing is not established');
}

function testSelectedClassificationIsAnExistingEnumValue() {
  const validValues = [
    "unclassified",
    "quranic-recitation",
    "prophetic-morning-dhikr",
    "prophetic-evening-dhikr",
    "morning-and-evening",
    "general-prophetic-supplication",
    "composite-text",
    "scholarly-advice",
    "action-reminder",
  ];
  assert(
    validValues.includes(MDR_005.contentClassification),
    `MDR-005.contentClassification ("${MDR_005.contentClassification}") is not one of the existing ContentClassification enum values — no new enum member may be created`,
  );
  console.log("✓ the selected contentClassification is an existing enum value in ContentClassification (types.ts) — no new enum member was created");
}

function testReportStatesSourceUnityUnresolved() {
  const report = loadAuditReport();
  assert(
    /source unity (remains|is) unresolved/i.test(report),
    'Audit report must explicitly state source unity remains unresolved',
  );
  assert(
    report.includes("Composite sourcing (independently-sourced components) is not established"),
    "Audit report must explicitly state composite sourcing is not established",
  );
  console.log("✓ audit report explicitly states source unity remains unresolved and composite sourcing is not established");
}

function testReportAcknowledgesCombinedNarrationLead() {
  const report = loadAuditReport();
  assert(
    report.includes("Combined narration lead located"),
    "Audit report status heading must acknowledge the combined narration lead",
  );
  assert(
    /a combined declaration-plus-petition lead exists/i.test(report) || /combined.{0,20}wording with one reported narration/i.test(report),
    "Audit report must explicitly acknowledge that one reported combined narration is a significant lead",
  );
  console.log("✓ audit report acknowledges the combined narration lead as significant, without treating it as proof of composite sourcing");
}

function testClauseBDoesNotAutomaticallyBecomeSeparateNarration() {
  const clauseB = MDR_005_CLAUSE_MAP.find((c) => c.clauseId === "MDR-005-B")!;
  assert(
    clauseB.unresolvedIssues.some((issue) => issue.includes("does not, by itself, establish that clause B combines two independently-sourced texts")),
    "Clause B's unresolvedIssues must state the unsourced closing phrase does not by itself prove two independently-sourced texts",
  );
  const report = loadAuditReport();
  assert(
    !/clause B (is|has been shown to be|is confirmed as) (a )?separate narration/i.test(report),
    "Audit report must not claim clause B is a separate narration merely because its closing phrase is unsourced",
  );
  console.log("✓ clause B's unsourced closing phrase does not automatically make it a separate narration");
}

function testMorningStatusBasedOnDocumentWordingNotAuthentication() {
  assert(
    MDR_005.morningSpecificStatus === "morning-only",
    `MDR-005.morningSpecificStatus is "${MDR_005.morningSpecificStatus}", expected "morning-only"`,
  );
  const report = loadAuditReport();
  assert(
    report.includes("not on authentication of the reported narration"),
    "Audit report must state morning-only is based on document wording, not on authentication of the reported narration",
  );
  assert(
    MDR_005.editorialNotes.includes("not authentication of the reported narration"),
    "MDR-005.editorialNotes must state morningSpecificStatus does not authenticate the reported narration",
  );
  console.log("✓ morningSpecificStatus remains morning-only, explicitly based on document wording, not authentication");
}

function testOverclaimingCompositeLanguageAbsent() {
  const report = loadAuditReport();
  const overclaimPatterns = [
    /affirmatively evidenced composite/i,
    /composite hypothesis is proven/i,
    /confirmed to be two (separate|distinct) narrations/i,
    /MDR-005 is provisionally classified as composite-text/i,
  ];
  for (const pattern of overclaimPatterns) {
    assert(!pattern.test(report), `Audit report contains overclaiming composite-certainty language matching ${pattern}`);
  }
  assert(
    report.includes('No phrase in this report says "source located," "confirmed source," "confirmed narration,"'),
    "Audit report should explicitly disclaim the banned overclaim phrases in its source-hierarchy section",
  );
  console.log("✓ audit report avoids overclaiming composite-certainty language");
}

function testReportDistinguishesSegmentationFromProofOfSeparateOrigins() {
  const report = loadAuditReport();
  assert(
    report.includes("segmentation is structurally reliable"),
    "Audit report must state segmentation is structurally reliable",
  );
  assert(
    report.includes("not itself treated as evidence of two separate origins") ||
      report.includes("not itself treated as proof of a single verified origin") ||
      report.includes("is not itself treated as evidence"),
    "Audit report must explicitly distinguish grammatical segmentation from proof of separate source origins",
  );
  console.log("✓ audit report distinguishes segmentation, source attribution, and proof of separate origins");
}

function testWordingMatchStatusMatchesComparison() {
  assert(
    MDR_005.wordingMatchStatus === "unresolved",
    `MDR-005.wordingMatchStatus is "${MDR_005.wordingMatchStatus}", expected "unresolved" (no directly-inspected primary comparison text was obtained, and indexed leads disagree with each other)`,
  );
  console.log('✓ MDR-005.wordingMatchStatus ("unresolved") matches the absence of any directly-inspected comparison text');
}

function testScholarlyDecisionRemainsPending() {
  assert(MDR_005.scholarlyDecision === "pending", `MDR-005.scholarlyDecision is "${MDR_005.scholarlyDecision}", expected "pending"`);
  console.log('✓ MDR-005.scholarlyDecision remains "pending"');
}

function testImportStatusRemainsResearchOnly() {
  assert(MDR_005.importStatus === "research-only", `MDR-005.importStatus is "${MDR_005.importStatus}", expected "research-only"`);
  console.log("✓ MDR-005.importStatus remains research-only");
}

function testComputeImportGateRemainsFalse() {
  const gate = computeImportGate(MDR_005);
  assert(gate.canImport === false, "MDR-005 unexpectedly passed computeImportGate");
  assert(
    gate.blockedReasons.length === 5,
    `MDR-005 should remain blocked by exactly five independent conditions, found ${gate.blockedReasons.length}: ${gate.blockedReasons.join(" | ")}`,
  );
  const expectedFragments = [
    /source research is not verified/i,
    /wording match is not resolved/i,
    /required hadith grading is absent/i,
    /scholarly approval is absent/i,
    /research-only/i,
  ];
  for (const fragment of expectedFragments) {
    assert(
      gate.blockedReasons.some((r) => fragment.test(r)),
      `computeImportGate(MDR-005) is missing an expected blocker matching ${fragment}`,
    );
  }
  console.log(`✓ computeImportGate(MDR-005) remains false with exactly five blockers (source research, wording, grading, scholarly approval, research-only status) — the classification correction did not alter the canonical gate`);
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
  testOnlyMdr005ResearchFieldsChanged();
  testMdr001Through004RemainUnchangedFromCheckpoint();
  testMdr009Through030RemainUnchanged();
  testMdr005ProtectedTranscriptionFieldsUnchanged();
  testClauseIdsAreUniqueAndOrdered();
  testClauseReconstructionReproducesMdr005Exactly();
  testNoArabicIsOmittedOrDuplicated();
  testNoWholeRecordSourceClaimedFromPartialMatch();
  testSourceHierarchyCorrectlyLabelled();
  testLaterCompilationNotCalledPrimarySource();
  testOriginalSourceInspectionNotOverstated();
  testPropheticAttributionQualifiedWhereWeakOrUnresolved();
  testRepetitionEvidenceNotDerivedFromAnnotationAlone();
  testVirtueEvidenceNotInferredFromPetition();
  testGradingAppliesOnlyToEvidenceItActuallyCovers();
  testSourceResearchStatusMatchesActualEvidence();
  testAllClauseLevelStatusesAreInProgress();
  testNoClauseClaimsDirectlyInspectedArabic();
  testTimingDescribedAsReportedUnverified();
  testGradingDescribedAsReportedUnverified();
  testClosingPhraseRemainsUnsourced();
  testContentClassificationIsNoLongerCompositeText();
  testSelectedClassificationIsAnExistingEnumValue();
  testReportStatesSourceUnityUnresolved();
  testReportAcknowledgesCombinedNarrationLead();
  testClauseBDoesNotAutomaticallyBecomeSeparateNarration();
  testMorningStatusBasedOnDocumentWordingNotAuthentication();
  testOverclaimingCompositeLanguageAbsent();
  testReportDistinguishesSegmentationFromProofOfSeparateOrigins();
  testWordingMatchStatusMatchesComparison();
  testScholarlyDecisionRemainsPending();
  testImportStatusRemainsResearchOnly();
  testComputeImportGateRemainsFalse();
  testNoSanityOrPublicFileChanged();
  testAuditReportContainsManualVerificationChecklist();
  testAuditReportDoesNotOverstateAuthenticityCertaintyOrNonExistence();
  console.log("\nAll MDR-005 source-audit tests passed.");
}

runAll();
