/**
 * Stage 3B — MDR-007 source-audit tests.
 *
 * Verifies the Stage 3B research pass touched only MDR-007's research
 * fields, left MDR-001 through MDR-006 (already researched, checkpoint
 * 8cc2e73) and MDR-008 through MDR-030 (still Stage 3A transcription-only)
 * unchanged. MDR-007 was not segmented (see docs/dhikr/research/MDR-007-source-audit.md,
 * "Segmentation decision") — the text has no internal punctuation and no
 * boundary indicator, so no clause-map file exists for this record. All
 * other records are checked against a fixture snapshot captured from
 * checkpoint 8cc2e73 — see
 * tests/dhikr/fixtures/mdr-001-006-008-030-8cc2e73-baseline.json.
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
const MDR_007 = REGISTER.find((r) => r.internalId === "MDR-007")!;

function loadBaselineFixture() {
  const fixturePath = path.resolve(__dirname, "fixtures/mdr-001-006-008-030-8cc2e73-baseline.json");
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
}

function loadAuditReport(): string {
  const repoRoot = path.resolve(__dirname, "../..");
  const reportPath = path.join(repoRoot, "docs/dhikr/research/MDR-007-source-audit.md");
  assert(fs.existsSync(reportPath), "docs/dhikr/research/MDR-007-source-audit.md does not exist");
  return fs.readFileSync(reportPath, "utf8");
}

function testOnlyMdr007ResearchFieldsChanged() {
  const baseline = loadBaselineFixture();
  const otherRecords = REGISTER.filter((r) => r.internalId !== "MDR-007");
  assert(
    otherRecords.length === baseline.length,
    `Expected ${baseline.length} records besides MDR-007, found ${otherRecords.length}`,
  );
  for (let i = 0; i < otherRecords.length; i++) {
    assert(
      JSON.stringify(otherRecords[i]) === JSON.stringify(baseline[i]),
      `${otherRecords[i].internalId} differs from its checkpoint 8cc2e73 baseline — this Stage 3B pass must only touch MDR-007`,
    );
  }
  console.log(
    "✓ only MDR-007 changed in this stage; MDR-001 through MDR-006 and MDR-008 through MDR-030 match checkpoint 8cc2e73 exactly",
  );
}

function testMdr001Through006RemainUnchangedFromCheckpoint() {
  const baseline = loadBaselineFixture();
  for (const id of ["MDR-001", "MDR-002", "MDR-003", "MDR-004", "MDR-005", "MDR-006"]) {
    const baselineRecord = baseline.find((r: { internalId: string }) => r.internalId === id);
    const currentRecord = REGISTER.find((r) => r.internalId === id);
    assert(!!baselineRecord && !!currentRecord, `${id} missing from baseline or current register`);
    assert(
      JSON.stringify(currentRecord) === JSON.stringify(baselineRecord),
      `${id} changed during the MDR-007 audit — its prior Stage 3B research (checkpoint 8cc2e73) must remain untouched`,
    );
  }
  console.log("✓ MDR-001 through MDR-006 remain unchanged from checkpoint 8cc2e73");
}

function testMdr008Through030RemainUnchanged() {
  const baseline = loadBaselineFixture();
  const expectedIds = Array.from({ length: 23 }, (_, i) => `MDR-${String(i + 8).padStart(3, "0")}`);
  for (const id of expectedIds) {
    const baselineRecord = baseline.find((r: { internalId: string }) => r.internalId === id);
    const currentRecord = REGISTER.find((r) => r.internalId === id);
    assert(!!baselineRecord && !!currentRecord, `${id} missing from baseline or current register`);
    assert(
      JSON.stringify(currentRecord) === JSON.stringify(baselineRecord),
      `${id} changed during the MDR-007 audit — it must remain Stage-3A transcription-only`,
    );
  }
  console.log("✓ MDR-008 through MDR-030 remain unchanged (23 records checked)");
}

function testMdr007ProtectedTranscriptionFieldsUnchanged() {
  const expected = {
    sequenceNumber: 7,
    internalId: "MDR-007",
    openingArabicWords: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا",
    sourceDocumentAnnotations: [],
    transcriptionStatus: "exact",
    scholarlyReviewer: "",
    scholarlyDecision: "pending",
    importStatus: "research-only",
  };
  for (const [field, value] of Object.entries(expected)) {
    assert(
      JSON.stringify((MDR_007 as unknown as Record<string, unknown>)[field]) === JSON.stringify(value),
      `MDR-007.${field} was altered by the Stage 3B research pass — this field must remain untouched`,
    );
  }
  assert(
    MDR_007.originalDocumentText.length === 98,
    `MDR-007.originalDocumentText length changed — expected 98, found ${MDR_007.originalDocumentText.length}`,
  );
  assert(
    MDR_007.originalDocumentText === MDR_007.fullArabicText,
    "MDR-007.originalDocumentText and fullArabicText should remain identical to each other (no correction applied)",
  );
  console.log(
    "✓ MDR-007's protected transcription fields (sequenceNumber, internalId, openingArabicWords, originalDocumentText, fullArabicText, sourceDocumentAnnotations, transcriptionStatus, scholarlyReviewer, scholarlyDecision, importStatus) are unchanged",
  );
}

function testNoClauseMapFileWasNeeded() {
  const repoRoot = path.resolve(__dirname, "../..");
  const clauseMapPath = path.join(repoRoot, "src/lib/dhikr-research/audits/mdr-007-clause-map.ts");
  assert(
    !fs.existsSync(clauseMapPath),
    "src/lib/dhikr-research/audits/mdr-007-clause-map.ts should not exist — MDR-007 was not segmented (see audit report, 'Segmentation decision')",
  );
  const report = loadAuditReport();
  assert(
    report.includes("MDR-007 was **not** segmented into clauses"),
    "Audit report must explicitly state MDR-007 was not segmented",
  );
  assert(
    report.includes("MDR-007 is not segmented merely because it contains four parallel"),
    "Audit report must explain non-segmentation without treating parallel structure alone as a boundary",
  );
  console.log("✓ no clause-map file was created; the audit report documents why segmentation was unnecessary");
}

function testNoArabicWasAlteredOrDuplicated() {
  const text = MDR_007.originalDocumentText;
  assert(text.length === 98, "MDR-007.originalDocumentText length must remain 98");
  assert((text.match(/،/g) || []).length === 0, "MDR-007.originalDocumentText must retain zero commas");
  assert(text.startsWith("اللَّهُمَّ") && text.endsWith("النَّشُورُ"), "MDR-007.originalDocumentText must retain its exact opening and closing words");
  console.log("✓ no Arabic is omitted, duplicated, or altered in MDR-007.originalDocumentText");
}

function testNoWholeRecordSourceClaimedFromPartialMatch() {
  const report = loadAuditReport();
  assert(
    report.includes("was checked to contain the full content of MDR-007"),
    "Audit report must state the source match covers the full content, not merely the opening",
  );
  assert(
    !/matches based (solely|only) on (the |its )?opening/i.test(report),
    "Audit report must not claim a whole-record match based solely on the opening",
  );
  console.log("✓ no whole-record source is claimed from a partial match alone");
}

function testSourceHierarchyCorrectlyLabelled() {
  const report = loadAuditReport();
  assert(
    report.includes("| Candidate/reported item | Hierarchy label |"),
    "Audit report is missing the source-hierarchy table",
  );
  assert(
    report.includes("A directly fetched recognised hosting of Jami' al-Tirmidhi's collection text"),
    "Audit report must label the islamweb.net Tirmidhi fetch precisely, distinguishing the webpage being opened from exact textual inspection",
  );
  assert(
    report.includes("Directly inspected modern scholarly discussion"),
    "Audit report must label islamqa.info as a modern scholarly discussion, not the primary hadith source",
  );
  assert(
    report.includes("Not inspected — fetch attempt interrupted by the user; not relied upon"),
    "Audit report must record that the hadithprophet.com fetch was interrupted and not relied upon",
  );
  console.log("✓ source hierarchy is correctly labelled in the audit report, including the interrupted fetch");
}

function testDirectSourceInspectionNotOverstated() {
  const report = loadAuditReport();
  assert(
    report.includes("opening the page is not the same as exact textual inspection") ||
      report.includes("is not the same as exact textual inspection"),
    "Audit report must distinguish opening the webpage from exact textual inspection",
  );
  assert(
    MDR_007.primaryCollection.includes("Opening the webpage is not the same as exact textual inspection"),
    "MDR-007.primaryCollection must record that opening the webpage is not the same as exact textual inspection",
  );
  console.log("✓ direct-source inspection is not overstated; webpage access is distinguished from exact textual inspection");
}

function testToolMediatedArabicNotCalledRawPrimaryText() {
  assert(
    MDR_007.sourceArabicWording.startsWith("Tool-mediated Arabic quotation returned from a directly fetched hosting of Jami' al-Tirmidhi"),
    "MDR-007.sourceArabicWording must open by declaring itself a tool-mediated quotation, not raw primary text",
  );
  assert(
    MDR_007.sourceArabicWording.includes("Not a raw transcription, not exact primary Arabic, not a character-for-character primary text, and not definitive Tirmidhi wording"),
    "MDR-007.sourceArabicWording must explicitly disclaim being a raw/exact/character-for-character/definitive text",
  );
  const report = loadAuditReport();
  assert(
    report.includes("This is not a raw transcription, not exact primary Arabic, not a character-for-character primary text, and not definitive Tirmidhi wording"),
    "Audit report must explicitly disclaim raw/exact/character-for-character/definitive status for the quoted Arabic",
  );
  console.log("✓ tool-mediated Arabic is explicitly not called raw primary text anywhere");
}

function testPropheticAttributionQualified() {
  assert(
    MDR_007.narrator.includes("not independently confirmed by directly reading the matn's own introductory frame"),
    "MDR-007.narrator must qualify Prophetic attribution as reported, not independently confirmed",
  );
  const report = loadAuditReport();
  assert(
    report.includes("per WebSearch synthesis, not independently confirmed by directly reading the matn's own introductory frame in this pass"),
    "Audit report must qualify Prophetic attribution as reported via synthesis, not independently confirmed",
  );
  console.log("✓ Prophetic attribution is qualified as reported, not independently confirmed");
}

function testTimingNotInferredFromChapterPlacementAlone() {
  const report = loadAuditReport();
  assert(
    report.includes("not the sole basis"),
    "Audit report must state chapter placement is not the sole basis for the timing conclusion",
  );
  assert(
    report.includes("both appear directly in the transcribed text, not merely in a reported narrator-frame or chapter heading"),
    "Audit report must ground timing in direct text wording, not chapter placement alone",
  );
  console.log("✓ timing is not inferred from chapter placement alone");
}

function testMorningEveningPairingNotAssumedWithoutEvidence() {
  const report = loadAuditReport();
  assert(
    report.includes("shared vocabulary is not treated as evidence of a shared hadith"),
    "Audit report must state shared morning/evening vocabulary is not treated as evidence of a shared hadith",
  );
  assert(
    report.includes("the *pairing itself* is well evidenced; the *exact match* is not"),
    "Audit report must distinguish the well-evidenced pairing from the unresolved exact wording match",
  );
  console.log("✓ morning/evening pairing is evidenced from the narration itself, not assumed from shared vocabulary");
}

function testRepetitionNotInvented() {
  assert(
    JSON.stringify(MDR_007.sourceDocumentAnnotations) === "[]",
    "MDR-007.sourceDocumentAnnotations should be empty (no repetition marker in the source document)",
  );
  assert(MDR_007.repetitionCount === undefined, "MDR-007.repetitionCount should remain unset — no repetition evidence was found");
  assert(MDR_007.repetitionEvidence === "", "MDR-007.repetitionEvidence should remain empty");
  console.log("✓ repetition is not invented — no count is populated for MDR-007");
}

function testVirtueOrProtectionNotInferredFromDeclarativeWording() {
  assert(MDR_007.virtueOrRewardClaim === "", "MDR-007.virtueOrRewardClaim must remain empty");
  assert(
    MDR_007.virtueEvidence.includes("Not populated") && MDR_007.virtueEvidence.includes("declarative statement of dependence"),
    "MDR-007.virtueEvidence should explain why no claim was inferred from declarative wording",
  );
  console.log("✓ no virtue or protection claim is inferred from MDR-007's declarative wording");
}

function testGradingAppliesOnlyToIdentifiedNarration() {
  assert(
    MDR_007.hadithGrading.includes("reportedly classified") &&
      MDR_007.hadithGrading.includes("hasan") &&
      MDR_007.hadithGrading.includes("does not resolve MDR-007's exact wording, the النشور/المصير assignment"),
    "MDR-007.hadithGrading must scope the reported hasan grading to the identified narration, not the unresolved closing-word question",
  );
  assert(
    MDR_007.gradingNotes.includes("Neither the tool-mediated Tirmidhi quotation's assignment nor islamqa.info's preferred assignment is treated as established over the other in this pass"),
    "MDR-007.gradingNotes must state neither closing-word assignment is treated as established over the other",
  );
  console.log("✓ grading applies only to the identified narration having a reported collection grading, not to the unresolved closing-word question");
}

function testUnderlyingNarrationIdentifiedAsTirmidhi() {
  assert(
    MDR_007.hadithGrading.includes("Jami' al-Tirmidhi 3391"),
    "MDR-007.hadithGrading must identify Jami' al-Tirmidhi 3391 as the underlying narration",
  );
  const report = loadAuditReport();
  assert(
    report.includes("Jami' al-Tirmidhi 3391, Abu Hurayrah, reportedly graded hasan"),
    "Audit report status heading must identify the underlying narration precisely",
  );
  console.log("✓ the underlying narration is identified as Jami' al-Tirmidhi 3391 (Abu Hurayrah)");
}

function testTwoSourcesClaimsDistinguishedNotConflated() {
  const report = loadAuditReport();
  assert(
    report.includes("Before calling this a direct contradiction, five distinct levels of claim are separated"),
    "Audit report must distinguish the levels of claim rather than simplistically conflating the two sources",
  );
  assert(
    report.includes("is **not confirmed to be a direct, mutually exclusive contradiction**"),
    "Audit report must state the apparent disagreement is not confirmed to be a direct, mutually exclusive contradiction",
  );
  console.log("✓ the two sources' claims are distinguished by analytical level rather than simplistically conflated");
}

function testBroadTimingUsageSeparatedFromExactEndingAssignment() {
  const report = loadAuditReport();
  assert(
    report.includes("this classification concerns broad paired usage, not exact wording"),
    "Audit report must separate broad morning/evening usage from the exact ending assignment",
  );
  assert(
    MDR_007.editorialNotes.includes("this classification concerns broad paired usage, not exact wording"),
    "MDR-007.editorialNotes must separate broad morning/evening usage from the exact ending assignment",
  );
  console.log("✓ broad morning/evening usage is explicitly separated from the exact closing-word assignment");
}

function testNoRecognisedNarrationVariantLabelUsedWithoutEvidence() {
  const report = loadAuditReport();
  assert(
    !/(is|as)\s+(a\s+)?recognised.transmission.variant/i.test(report) && !/confirmed as a (recognised )?variant/i.test(report),
    "Audit report must not label the النشور/المصير disagreement a recognised transmission variant without evidence",
  );
  assert(
    report.includes("No explanation is selected without directly inspected, raw Arabic evidence"),
    "Audit report must state no explanation is selected without raw Arabic evidence",
  );
  console.log("✓ no wording difference is labelled a recognised variant without raw evidence");
}

function testNoExactCharacterLevelMatchClaimed() {
  const report = loadAuditReport();
  assert(
    MDR_007.wordingMatchStatus !== "exact-match",
    "MDR-007.wordingMatchStatus must not be exact-match",
  );
  const overclaimPatterns = [/is an exact match/i, /matches character[- ]for[- ]character/i, /confirmed identical wording/i];
  for (const pattern of overclaimPatterns) {
    assert(!pattern.test(report), `Audit report contains an exact-match overclaim matching ${pattern}`);
  }
  console.log("✓ no exact character-level match between MDR-007 and either reported Tirmidhi form is claimed");
}

function testSourceResearchStatusMatchesActualEvidence() {
  assert(
    MDR_007.sourceResearchStatus === "in-progress",
    `MDR-007.sourceResearchStatus is "${MDR_007.sourceResearchStatus}", expected "in-progress" — corrected on review from an initial "scholarly-review-required" because the apparent النشور/المصير disagreement may stem from WebFetch summarisation, incomplete extraction, or uncertainty over whether both sources quote the same route/edition, not merely from a remaining scholarly judgment call`,
  );
  assert(MDR_007.sourceResearchStatus !== "verified", "MDR-007.sourceResearchStatus must not be \"verified\" while the wording question remains");
  // Note: "conflicting-evidence" is not a member of the SourceResearchStatus
  // type (src/lib/dhikr-research/types.ts) — it does not exist as an
  // assignable value in this codebase, so no runtime comparison against it
  // is possible or necessary here; this is documented in the completion
  // report as a discrepancy between the review request and the actual enum.
  console.log('✓ MDR-007.sourceResearchStatus ("in-progress") matches the final evidence-status decision, with scholarly-review-required explicitly ruled out ("conflicting-evidence" is not a member of SourceResearchStatus in this codebase)');
}

function testStatusDecisionRationaleDocumented() {
  assert(
    MDR_007.editorialNotes.includes("'conflicting-evidence' was considered and rejected") &&
      MDR_007.editorialNotes.includes("'scholarly-review-required' was considered and rejected"),
    "MDR-007.editorialNotes must document why conflicting-evidence and scholarly-review-required were both considered and rejected",
  );
  const report = loadAuditReport();
  assert(
    report.includes("**Status-decision rationale**"),
    "Audit report must contain an explicit status-decision rationale section",
  );
  console.log("✓ the status-decision rationale (why in-progress, not conflicting-evidence or scholarly-review-required) is documented in both the register and the report");
}

function testWordingMatchStatusMatchesComparison() {
  assert(
    MDR_007.wordingMatchStatus === "unresolved",
    `MDR-007.wordingMatchStatus is "${MDR_007.wordingMatchStatus}", expected "unresolved"`,
  );
  console.log('✓ MDR-007.wordingMatchStatus ("unresolved") reflects the unresolved disagreement between directly-fetched sources');
}

function testScholarlyDecisionRemainsPending() {
  assert(MDR_007.scholarlyDecision === "pending", `MDR-007.scholarlyDecision is "${MDR_007.scholarlyDecision}", expected "pending"`);
  console.log('✓ MDR-007.scholarlyDecision remains "pending"');
}

function testImportStatusRemainsResearchOnly() {
  assert(MDR_007.importStatus === "research-only", `MDR-007.importStatus is "${MDR_007.importStatus}", expected "research-only"`);
  console.log("✓ MDR-007.importStatus remains research-only");
}

function testComputeImportGateRemainsFalse() {
  const gate = computeImportGate(MDR_007);
  assert(gate.canImport === false, "MDR-007 unexpectedly passed computeImportGate");
  assert(
    gate.blockedReasons.length === 4,
    `MDR-007 should remain blocked by exactly four independent conditions, found ${gate.blockedReasons.length}: ${gate.blockedReasons.join(" | ")}`,
  );
  const expectedFragments = [
    /source research is not verified/i,
    /wording match is not resolved/i,
    /scholarly approval is absent/i,
    /research-only/i,
  ];
  for (const fragment of expectedFragments) {
    assert(
      gate.blockedReasons.some((r) => fragment.test(r)),
      `computeImportGate(MDR-007) is missing an expected blocker matching ${fragment}`,
    );
  }
  assert(
    !gate.blockedReasons.some((r) => /hadith grading is absent/i.test(r)),
    "computeImportGate(MDR-007) must not cite absent grading — hadithGrading is populated and identifies the underlying narration",
  );
  console.log(`✓ computeImportGate(MDR-007) remains false with exactly four blockers (source research, wording, scholarly approval, research-only status)`);
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
    report.includes("## 25. Manual verification checklist"),
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
    /is (definitely|certainly) (sahih|authentic|hasan)/i,
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
  testOnlyMdr007ResearchFieldsChanged();
  testMdr001Through006RemainUnchangedFromCheckpoint();
  testMdr008Through030RemainUnchanged();
  testMdr007ProtectedTranscriptionFieldsUnchanged();
  testNoClauseMapFileWasNeeded();
  testNoArabicWasAlteredOrDuplicated();
  testNoWholeRecordSourceClaimedFromPartialMatch();
  testSourceHierarchyCorrectlyLabelled();
  testDirectSourceInspectionNotOverstated();
  testToolMediatedArabicNotCalledRawPrimaryText();
  testPropheticAttributionQualified();
  testTimingNotInferredFromChapterPlacementAlone();
  testMorningEveningPairingNotAssumedWithoutEvidence();
  testRepetitionNotInvented();
  testVirtueOrProtectionNotInferredFromDeclarativeWording();
  testGradingAppliesOnlyToIdentifiedNarration();
  testUnderlyingNarrationIdentifiedAsTirmidhi();
  testTwoSourcesClaimsDistinguishedNotConflated();
  testBroadTimingUsageSeparatedFromExactEndingAssignment();
  testNoRecognisedNarrationVariantLabelUsedWithoutEvidence();
  testNoExactCharacterLevelMatchClaimed();
  testSourceResearchStatusMatchesActualEvidence();
  testStatusDecisionRationaleDocumented();
  testWordingMatchStatusMatchesComparison();
  testScholarlyDecisionRemainsPending();
  testImportStatusRemainsResearchOnly();
  testComputeImportGateRemainsFalse();
  testNoSanityOrPublicFileChanged();
  testAuditReportContainsManualVerificationChecklist();
  testAuditReportDoesNotOverstateAuthenticityCertaintyOrNonExistence();
  console.log("\nAll MDR-007 source-audit tests passed.");
}

runAll();
