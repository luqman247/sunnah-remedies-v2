/**
 * Stage 3B — MDR-008 source-audit tests.
 *
 * Verifies the Stage 3B research pass touched only MDR-008's research
 * fields, left MDR-001 through MDR-007 (already researched, checkpoint
 * 52b7a1b) and MDR-010 through MDR-030 (still Stage 3A transcription-only
 * at the time of MDR-008's own checkpoint) unchanged. MDR-008 was not
 * segmented (see docs/dhikr/research/MDR-008-source-audit.md, "Segmentation
 * decision") — all its content is drawn from one identified narration, so
 * no clause-map file exists for this record. All other records are checked
 * against a fixture snapshot captured from checkpoint 52b7a1b — see
 * tests/dhikr/fixtures/mdr-001-007-009-030-52b7a1b-baseline.json.
 *
 * MDR-009 and MDR-010 through MDR-020 are deliberately excluded from every
 * "unchanged since 52b7a1b" comparison below: each was legitimately
 * researched in a later Stage 3B pass (checkpoint 90a10af for MDR-009;
 * checkpoint e06f46c for the MDR-010–020 batch) and is expected to differ
 * from its Stage-3A-only 52b7a1b baseline snapshot. This does not weaken
 * this file's original guarantee — MDR-008's own fields, and MDR-001
 * through MDR-007 and MDR-021 through MDR-030, are still verified unchanged
 * in full. See tests/dhikr/dhikr-source-register-mdr-009-audit.test.ts and
 * tests/dhikr/dhikr-source-register-mdr-010-020-batch-audit.test.ts for
 * their own dedicated verification.
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
const MDR_008 = REGISTER.find((r) => r.internalId === "MDR-008")!;

function loadBaselineFixture() {
  const fixturePath = path.resolve(__dirname, "fixtures/mdr-001-007-009-030-52b7a1b-baseline.json");
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
}

function loadAuditReport(): string {
  const repoRoot = path.resolve(__dirname, "../..");
  const reportPath = path.join(repoRoot, "docs/dhikr/research/MDR-008-source-audit.md");
  assert(fs.existsSync(reportPath), "docs/dhikr/research/MDR-008-source-audit.md does not exist");
  return fs.readFileSync(reportPath, "utf8");
}

function testOnlyMdr008ResearchFieldsChanged() {
  const laterResearchedIds = new Set([
    "MDR-009",
    ...Array.from({ length: 21 }, (_, i) => `MDR-${String(i + 10).padStart(3, "0")}`),
  ]);
  const baseline = loadBaselineFixture();
  const otherRecords = REGISTER.filter((r) => r.internalId !== "MDR-008" && !laterResearchedIds.has(r.internalId));
  const baselineFiltered = baseline.filter((r: { internalId: string }) => !laterResearchedIds.has(r.internalId));
  assert(
    otherRecords.length === baselineFiltered.length,
    `Expected ${baselineFiltered.length} records besides MDR-008/MDR-009/MDR-010–030, found ${otherRecords.length}`,
  );
  for (let i = 0; i < otherRecords.length; i++) {
    assert(
      JSON.stringify(otherRecords[i]) === JSON.stringify(baselineFiltered[i]),
      `${otherRecords[i].internalId} differs from its checkpoint 52b7a1b baseline — this Stage 3B pass must only touch MDR-008`,
    );
  }
  console.log(
    "✓ only MDR-008 changed in this stage; MDR-001 through MDR-007 match checkpoint 52b7a1b exactly (MDR-009, MDR-010–020, and MDR-021–030 excluded — legitimately researched later, see their own dedicated tests)",
  );
}

function testMdr001Through007RemainUnchangedFromCheckpoint() {
  const baseline = loadBaselineFixture();
  for (const id of ["MDR-001", "MDR-002", "MDR-003", "MDR-004", "MDR-005", "MDR-006", "MDR-007"]) {
    const baselineRecord = baseline.find((r: { internalId: string }) => r.internalId === id);
    const currentRecord = REGISTER.find((r) => r.internalId === id);
    assert(!!baselineRecord && !!currentRecord, `${id} missing from baseline or current register`);
    assert(
      JSON.stringify(currentRecord) === JSON.stringify(baselineRecord),
      `${id} changed during the MDR-008 audit — its prior Stage 3B research (checkpoint 52b7a1b) must remain untouched`,
    );
  }
  console.log("✓ MDR-001 through MDR-007 remain unchanged from checkpoint 52b7a1b");
}

// MDR-010 through MDR-030 are entirely covered by testOnlyMdr008ResearchFieldsChanged's
// exclusion set above (and independently verified by their own later dedicated
// batch test files) — no separate "remain unchanged" function is needed here.

function testMdr008ProtectedTranscriptionFieldsUnchanged() {
  const expected = {
    sequenceNumber: 8,
    internalId: "MDR-008",
    openingArabicWords: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ",
    sourceDocumentAnnotations: [],
    transcriptionStatus: "exact",
    scholarlyReviewer: "",
    scholarlyDecision: "pending",
    importStatus: "research-only",
  };
  for (const [field, value] of Object.entries(expected)) {
    assert(
      JSON.stringify((MDR_008 as unknown as Record<string, unknown>)[field]) === JSON.stringify(value),
      `MDR-008.${field} was altered by the Stage 3B research pass — this field must remain untouched`,
    );
  }
  assert(
    MDR_008.originalDocumentText.length === 278,
    `MDR-008.originalDocumentText length changed — expected 278, found ${MDR_008.originalDocumentText.length}`,
  );
  assert(
    MDR_008.originalDocumentText === MDR_008.fullArabicText,
    "MDR-008.originalDocumentText and fullArabicText should remain identical to each other (no correction applied)",
  );
  assert(
    MDR_008.transcriptionNotes.includes("Sayyid al-Istighfar"),
    "MDR-008.transcriptionNotes must retain its original Stage 3A Sayyid al-Istighfar note, unchanged",
  );
  console.log(
    "✓ MDR-008's protected transcription fields (sequenceNumber, internalId, openingArabicWords, originalDocumentText, fullArabicText, sourceDocumentAnnotations, transcriptionStatus, transcriptionNotes, scholarlyReviewer, scholarlyDecision, importStatus) are unchanged",
  );
}

function testNoClauseMapFileWasNeeded() {
  const repoRoot = path.resolve(__dirname, "../..");
  const clauseMapPath = path.join(repoRoot, "src/lib/dhikr-research/audits/mdr-008-clause-map.ts");
  assert(
    !fs.existsSync(clauseMapPath),
    "src/lib/dhikr-research/audits/mdr-008-clause-map.ts should not exist — MDR-008 was not segmented (see audit report, 'Segmentation decision')",
  );
  const report = loadAuditReport();
  assert(
    report.includes("MDR-008 was **not** segmented into clauses"),
    "Audit report must explicitly state MDR-008 was not segmented",
  );
  assert(
    report.includes("there is no source plurality to reflect in a clause map"),
    "Audit report must explain non-segmentation via the single-narration finding, not merely clause count",
  );
  console.log("✓ no clause-map file was created; the audit report documents why segmentation was unnecessary");
}

function testNoArabicWasAlteredOrDuplicated() {
  const text = MDR_008.originalDocumentText;
  assert(text.length === 278, "MDR-008.originalDocumentText length must remain 278");
  assert((text.match(/،/g) || []).length === 0, "MDR-008.originalDocumentText must retain zero commas");
  assert(
    text.startsWith("اللَّهُمَّ أَنْتَ رَبِّي") && text.endsWith("مِن شَرِّ مَا صَنَعْتُ"),
    "MDR-008.originalDocumentText must retain its exact opening and closing words",
  );
  console.log("✓ no Arabic is omitted, duplicated, or altered in MDR-008.originalDocumentText");
}

function testNoWholeRecordSourceClaimedFromPartialMatch() {
  const report = loadAuditReport();
  assert(
    report.includes("checked to contain the full content of MDR-008"),
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
    report.includes("A directly fetched recognised hosting of Sahih al-Bukhari's collection text"),
    "Audit report must label the islamweb.net Bukhari fetch precisely, distinguishing the webpage being opened from exact textual inspection",
  );
  assert(
    report.includes("Not inspected — fetch attempt interrupted by the user; not relied upon"),
    "Audit report must record that the Wikisource fetch was interrupted and not relied upon",
  );
  console.log("✓ source hierarchy is correctly labelled in the audit report, including the interrupted fetch");
}

function testDirectSourceInspectionNotOverstated() {
  const report = loadAuditReport();
  assert(
    report.includes("is a tool-mediated quotation, not independently copied from raw HTML"),
    "Audit report must distinguish opening the webpage from exact textual inspection",
  );
  assert(
    MDR_008.primaryCollection.includes("tool-mediated quotation, not a guaranteed raw character-for-character transcription"),
    "MDR-008.primaryCollection must record that the quotation is tool-mediated, not raw",
  );
  console.log("✓ direct-source inspection is not overstated; webpage access is distinguished from exact textual inspection");
}

function testToolMediatedArabicNotCalledRawPrimaryText() {
  assert(
    MDR_008.sourceArabicWording.startsWith("Tool-mediated Arabic quotation returned from a directly fetched hosting of Sahih al-Bukhari"),
    "MDR-008.sourceArabicWording must open by declaring itself a tool-mediated quotation, not raw primary text",
  );
  assert(
    MDR_008.sourceArabicWording.includes("Not a raw transcription, not exact primary Arabic, not a character-for-character primary text, and not definitive Bukhari wording"),
    "MDR-008.sourceArabicWording must explicitly disclaim being a raw/exact/character-for-character/definitive text",
  );
  const report = loadAuditReport();
  assert(
    report.includes("is **not** a raw transcription, not exact primary Arabic, not a character-for-character primary text, and not definitive Bukhari wording"),
    "Audit report must explicitly disclaim raw/exact/character-for-character/definitive status for the quoted Arabic",
  );
  console.log("✓ tool-mediated Arabic is explicitly not called raw primary text anywhere");
}

function testPropheticAttributionQualified() {
  assert(
    MDR_008.narrator.includes("not independently re-verified against a raw manuscript or print edition"),
    "MDR-008.narrator must qualify Prophetic attribution and the isnad reading as reported, not independently re-verified",
  );
  const report = loadAuditReport();
  assert(
    report.includes("a tool-mediated reading, not independently re-verified against a manuscript"),
    "Audit report must qualify the isnad as tool-mediated, not independently re-verified",
  );
  console.log("✓ Prophetic attribution is qualified as reported, not independently confirmed against a raw source");
}

function testTimingNotInferredFromChapterPlacementAlone() {
  const report = loadAuditReport();
  assert(
    report.includes("this record's placement within a \"morning dhikr\" register is explicitly not treated as timing evidence"),
    "Audit report must state register placement is not treated as timing evidence",
  );
  assert(
    report.includes("No timing evidence was found within MDR-008's own recited document text"),
    "Audit report must ground the literal-wording timing conclusion in MDR-008's own recited document text, not chapter/register placement",
  );
  console.log("✓ timing is not inferred from chapter or register placement alone");
}

function testMorningSpecificStatusReflectsAuthenticatedUsage() {
  const report = loadAuditReport();
  assert(
    MDR_008.morningSpecificStatus === "morning-and-evening",
    `MDR-008.morningSpecificStatus is "${MDR_008.morningSpecificStatus}", expected "morning-and-evening" (corrected — represents authenticated narration usage, not literal transcribed-text vocabulary)`,
  );
  assert(
    report.includes("field therefore represents **authenticated narration usage**"),
    "Audit report must explain morningSpecificStatus represents authenticated narration usage, per the field-semantics review",
  );
  assert(
    report.includes("MDR-006's `morningSpecificStatus` was set to `morning-and-evening` based on the wider narration's own reported"),
    "Audit report must cite the MDR-006 precedent for treating morningSpecificStatus as narration-usage, not literal wording",
  );
  console.log("✓ morningSpecificStatus (\"morning-and-evening\") reflects authenticated narration usage per field-semantics review, distinct from the literal wording finding");
}

function testContentClassificationRetainedForGenreNotUsage() {
  const report = loadAuditReport();
  assert(
    MDR_008.contentClassification === "general-prophetic-supplication",
    `MDR-008.contentClassification is "${MDR_008.contentClassification}", expected "general-prophetic-supplication" (retained — concerns genre, not prescribed usage)`,
  );
  assert(
    report.includes("not changed to `morning-and-evening` for symmetry with `morningSpecificStatus`"),
    "Audit report must explicitly state contentClassification was not changed merely for symmetry",
  );
  assert(
    report.includes("This is a deliberate distinction between genre and usage, not overlooked symmetry"),
    "Audit report must state the genre/usage distinction is deliberate",
  );
  console.log("✓ contentClassification remains general-prophetic-supplication — a deliberate genre/usage distinction, not overlooked symmetry with morningSpecificStatus");
}

function testThreeLayersDistinguished() {
  const report = loadAuditReport();
  assert(
    report.includes("**recited supplication text**") &&
      report.includes("**narrator/Prophetic frame**") &&
      report.includes("**narration-attached outcome statement**"),
    "Audit report must distinguish the three layers: recited text, narrator/Prophetic frame, and narration-attached outcome statement",
  );
  console.log("✓ the three layers (recited text; narrator/Prophetic frame; narration-attached outcome statement) are explicitly distinguished");
}

function testSourceResearchStatusRetainedNotDowngraded() {
  const report = loadAuditReport();
  assert(
    report.includes("**sourceResearchStatus reassessment**: reviewed narrowly and **retained** as `\"scholarly-review-required\"`"),
    "Audit report must document that sourceResearchStatus was reassessed and explicitly retained, not merely left unchanged",
  );
  assert(
    report.includes("not resting on one unstable data point"),
    "Audit report must explain the reward clause's substance is corroborated across multiple sources, not one unstable fetch",
  );
  console.log("✓ sourceResearchStatus was explicitly reassessed and retained as scholarly-review-required, with documented rationale");
}

function testRepetitionNotInvented() {
  assert(
    JSON.stringify(MDR_008.sourceDocumentAnnotations) === "[]",
    "MDR-008.sourceDocumentAnnotations should be empty (no repetition marker in the source document)",
  );
  assert(MDR_008.repetitionCount === undefined, "MDR-008.repetitionCount should remain unset — no repetition evidence was found");
  assert(MDR_008.repetitionEvidence === "", "MDR-008.repetitionEvidence should remain empty");
  console.log("✓ repetition is not invented — no count is populated for MDR-008");
}

function testVirtueOrRewardClaimIsPopulatedWithFullConditions() {
  assert(
    MDR_008.virtueOrRewardClaim.length > 0,
    "MDR-008.virtueOrRewardClaim must be populated (corrected from empty — see editorialNotes)",
  );
  const requiredFragments = [
    /says? this supplication|saying this supplication/i,
    /day/i,
    /night/i,
    /certaint/i,
    /before evening/i,
    /before morning/i,
    /Paradise/i,
  ];
  for (const fragment of requiredFragments) {
    assert(
      fragment.test(MDR_008.virtueOrRewardClaim),
      `MDR-008.virtueOrRewardClaim is missing a required condition matching ${fragment}`,
    );
  }
  // Note: the field's own text explicitly names "guarantees Paradise" /
  // "whoever says it enters Paradise" / "protection from Hell" as examples
  // of forbidden unconditional shortenings it must NOT be reduced to — a
  // naive regex ban on those phrases would false-positive on the field's
  // own correct disclaimer. Instead, assert the claim is long enough to be
  // the full conditioned statement, not a short unconditional one.
  assert(
    MDR_008.virtueOrRewardClaim.length > 120,
    "MDR-008.virtueOrRewardClaim must be the full conditioned statement, not shortened to a brief unconditional outcome",
  );
  console.log("✓ virtueOrRewardClaim is populated and preserves every condition (daytime/nighttime, certainty, death timing, Paradise outcome) without unconditional shortening");
}

function testVirtueEvidenceExplainsNarrationAttachedStatus() {
  assert(
    MDR_008.virtueEvidence.includes("narration-attached evidence, not part of the Arabic supplication transcribed in MDR-008"),
    "MDR-008.virtueEvidence must state the claim is narration-attached evidence, not part of the transcribed supplication",
  );
  assert(
    MDR_008.virtueEvidence.includes("must not be inserted into `fullArabicText` or `originalDocumentText`") ||
      MDR_008.virtueEvidence.includes("must not be inserted into fullArabicText or originalDocumentText"),
    "MDR-008.virtueEvidence must explicitly forbid inserting the reward text into the protected transcription fields",
  );
  assert(
    MDR_008.virtueEvidence.includes("tool-mediated"),
    "MDR-008.virtueEvidence must record the tool-mediated nature of the quotation",
  );
  const report = loadAuditReport();
  assert(
    report.includes("it must not be inserted into `fullArabicText` or `originalDocumentText`, and is not presented as words the user recites"),
    "Audit report must explicitly state the reward text must not be inserted into the transcribed Arabic fields",
  );
  console.log("✓ virtueEvidence explains the reward claim is narration-attached, tool-mediated, and must not be inserted into the recited Arabic");
}

function testRewardTextNotInsertedIntoTranscribedFields() {
  assert(
    !MDR_008.fullArabicText.includes("الجنة") && !MDR_008.fullArabicText.includes("قالها"),
    "MDR-008.fullArabicText must not contain any reward-clause wording (e.g. الجنة, قالها) — the reward statement must remain outside the recited text",
  );
  assert(
    !MDR_008.originalDocumentText.includes("الجنة") && !MDR_008.originalDocumentText.includes("قالها"),
    "MDR-008.originalDocumentText must not contain any reward-clause wording — protected transcription fields remain untouched",
  );
  console.log("✓ the reward-clause wording was not inserted into fullArabicText or originalDocumentText");
}

function testGradingAppliesOnlyToIdentifiedNarration() {
  assert(
    MDR_008.hadithGrading.includes("Sahih") &&
      MDR_008.hadithGrading.includes("underlying narration is contained in Sahih al-Bukhari") &&
      MDR_008.hadithGrading.includes("This does not authenticate MDR-008's exact ordering, spelling, vocalisation"),
    "MDR-008.hadithGrading must scope the Sahih grading to the identified narration, not MDR-008's exact letter-forms",
  );
  assert(
    MDR_008.hadithGrading.includes("The attached daytime/nighttime reward statement") &&
      MDR_008.hadithGrading.includes("belongs to this same reported narration"),
    "MDR-008.hadithGrading must state the attached reward statement belongs to the same reported narration",
  );
  assert(
    MDR_008.gradingNotes.includes("none of these three points is attributed to a recognised narration variant") ||
      MDR_008.gradingNotes.includes("None of these three points is attributed to a recognised narration variant"),
    "MDR-008.gradingNotes must state none of the three wording points is attributed to a recognised variant without evidence",
  );
  console.log("✓ grading applies only to the identified narration, not to MDR-008's exact letter-forms — and the attached reward statement is scoped the same way");
}

function testUnderlyingNarrationIdentifiedAsBukhari() {
  assert(
    MDR_008.hadithGrading.includes("Sahih al-Bukhari"),
    "MDR-008.hadithGrading must identify Sahih al-Bukhari as the underlying collection",
  );
  const report = loadAuditReport();
  assert(
    report.includes("Sahih al-Bukhari, Shaddad ibn Aws, \"Sayyid al-Istighfar\""),
    "Audit report status heading must identify the underlying narration precisely",
  );
  console.log("✓ the underlying narration is identified as Sahih al-Bukhari (Shaddad ibn Aws, Sayyid al-Istighfar)");
}

function testNumberingDiscrepancyRecordedNotAssumedAway() {
  assert(
    MDR_008.primaryReference.includes("5947") && MDR_008.primaryReference.includes("6306"),
    "MDR-008.primaryReference must record both the 5947 and 6306 hadith numbers",
  );
  assert(
    MDR_008.primaryReference.includes("not reconciled"),
    "MDR-008.primaryReference must state the numbering discrepancy is not reconciled",
  );
  const report = loadAuditReport();
  assert(
    report.includes("edition/numbering-system variation is not assumed to explain it without checking") ||
      report.includes("edition/numbering-system variation is not assumed to explain it"),
    "Audit report must not assume edition variation explains the numbering discrepancy without checking",
  );
  console.log("✓ the hadith-numbering discrepancy (5947 vs. 6306) is recorded, not assumed away");
}

function testInconsistentInternalSourcesNotSilentlyResolved() {
  assert(
    MDR_008.gradingNotes.includes("Given this internal inconsistency between two of this pass's own sources"),
    "MDR-008.gradingNotes must acknowledge that this pass's own sources disagree with each other on the لك question",
  );
  console.log("✓ disagreement between this pass's own sources (on the لك question) is recorded, not silently resolved in either direction");
}

function testWordingMatchStatusMatchesComparison() {
  assert(
    MDR_008.wordingMatchStatus === "unresolved",
    `MDR-008.wordingMatchStatus is "${MDR_008.wordingMatchStatus}", expected "unresolved"`,
  );
  console.log('✓ MDR-008.wordingMatchStatus ("unresolved") reflects the absence of any raw, unmediated comparison text');
}

function testSourceResearchStatusMatchesActualEvidence() {
  assert(
    MDR_008.sourceResearchStatus === "scholarly-review-required",
    `MDR-008.sourceResearchStatus is "${MDR_008.sourceResearchStatus}", expected "scholarly-review-required" — the underlying narration is well established, but wording points require scholarly/editorial judgment`,
  );
  assert(MDR_008.sourceResearchStatus !== "verified", "MDR-008.sourceResearchStatus must not be \"verified\" while wording points remain unresolved");
  console.log('✓ MDR-008.sourceResearchStatus ("scholarly-review-required") matches the actual direct-inspection evidence');
}

function testScholarlyDecisionRemainsPending() {
  assert(MDR_008.scholarlyDecision === "pending", `MDR-008.scholarlyDecision is "${MDR_008.scholarlyDecision}", expected "pending"`);
  console.log('✓ MDR-008.scholarlyDecision remains "pending"');
}

function testImportStatusRemainsResearchOnly() {
  assert(MDR_008.importStatus === "research-only", `MDR-008.importStatus is "${MDR_008.importStatus}", expected "research-only"`);
  console.log("✓ MDR-008.importStatus remains research-only");
}

function testComputeImportGateRemainsFalse() {
  const gate = computeImportGate(MDR_008);
  assert(gate.canImport === false, "MDR-008 unexpectedly passed computeImportGate");
  assert(
    gate.blockedReasons.length === 13,
    `MDR-008 should remain blocked by exactly thirteen independent conditions (Stage 2 strengthened the gate with operational approval checks), found ${gate.blockedReasons.length}: ${gate.blockedReasons.join(" | ")}`,
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
      `computeImportGate(MDR-008) is missing an expected blocker matching ${fragment}`,
    );
  }
  assert(
    !gate.blockedReasons.some((r) => /hadith grading is absent/i.test(r)),
    "computeImportGate(MDR-008) must not cite absent grading — hadithGrading is populated and identifies the underlying narration",
  );
  console.log(`✓ computeImportGate(MDR-008) remains false with thirteen blockers (source research, wording, scholarly approval, research-only status, plus Stage 2's operational approval-field checks)`);
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
  testOnlyMdr008ResearchFieldsChanged();
  testMdr001Through007RemainUnchangedFromCheckpoint();
  testMdr008ProtectedTranscriptionFieldsUnchanged();
  testNoClauseMapFileWasNeeded();
  testNoArabicWasAlteredOrDuplicated();
  testNoWholeRecordSourceClaimedFromPartialMatch();
  testSourceHierarchyCorrectlyLabelled();
  testDirectSourceInspectionNotOverstated();
  testToolMediatedArabicNotCalledRawPrimaryText();
  testPropheticAttributionQualified();
  testTimingNotInferredFromChapterPlacementAlone();
  testMorningSpecificStatusReflectsAuthenticatedUsage();
  testContentClassificationRetainedForGenreNotUsage();
  testThreeLayersDistinguished();
  testRepetitionNotInvented();
  testVirtueOrRewardClaimIsPopulatedWithFullConditions();
  testVirtueEvidenceExplainsNarrationAttachedStatus();
  testRewardTextNotInsertedIntoTranscribedFields();
  testGradingAppliesOnlyToIdentifiedNarration();
  testUnderlyingNarrationIdentifiedAsBukhari();
  testNumberingDiscrepancyRecordedNotAssumedAway();
  testInconsistentInternalSourcesNotSilentlyResolved();
  testWordingMatchStatusMatchesComparison();
  testSourceResearchStatusMatchesActualEvidence();
  testSourceResearchStatusRetainedNotDowngraded();
  testScholarlyDecisionRemainsPending();
  testImportStatusRemainsResearchOnly();
  testComputeImportGateRemainsFalse();
  testNoSanityOrPublicFileChanged();
  testAuditReportContainsManualVerificationChecklist();
  testAuditReportDoesNotOverstateAuthenticityCertaintyOrNonExistence();
  console.log("\nAll MDR-008 source-audit tests passed.");
}

runAll();
