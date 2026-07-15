/**
 * Stage 3B — MDR-009 source-audit tests.
 *
 * Verifies the Stage 3B research pass touched only MDR-009's research
 * fields, left MDR-001 through MDR-008 (already researched, checkpoint
 * 90a10af) and MDR-010 through MDR-030 (still Stage 3A transcription-only
 * at the time of MDR-009's own checkpoint) unchanged. MDR-009 was not
 * segmented (see docs/dhikr/research/MDR-009-source-audit.md, "Segmentation
 * decision") — all its content is drawn from one identified (if disputedly
 * graded) narration, so no clause-map file exists for this record. All
 * other records are checked against a fixture snapshot captured from
 * checkpoint 90a10af — see
 * tests/dhikr/fixtures/mdr-001-008-010-030-90a10af-baseline.json.
 *
 * MDR-010 through MDR-020 are deliberately excluded from every "unchanged
 * since 90a10af" comparison below: they were legitimately researched in a
 * later Stage 3B batch pass (checkpoint e06f46c) and are expected to differ
 * from their Stage-3A-only 90a10af baseline snapshot. This does not weaken
 * this file's original guarantee — see
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
const MDR_009 = REGISTER.find((r) => r.internalId === "MDR-009")!;

function loadBaselineFixture() {
  const fixturePath = path.resolve(__dirname, "fixtures/mdr-001-008-010-030-90a10af-baseline.json");
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
}

function loadAuditReport(): string {
  const repoRoot = path.resolve(__dirname, "../..");
  const reportPath = path.join(repoRoot, "docs/dhikr/research/MDR-009-source-audit.md");
  assert(fs.existsSync(reportPath), "docs/dhikr/research/MDR-009-source-audit.md does not exist");
  return fs.readFileSync(reportPath, "utf8");
}

function testOnlyMdr009ResearchFieldsChanged() {
  // MDR-010 through MDR-020 are excluded: each was legitimately researched
  // in a later batch pass (verified separately by
  // dhikr-source-register-mdr-010-020-batch-audit.test.ts against its own
  // later checkpoint baseline).
  const excludedIds = new Set(Array.from({ length: 11 }, (_, i) => `MDR-${String(i + 10).padStart(3, "0")}`));
  const baseline = loadBaselineFixture().filter((r: { internalId: string }) => !excludedIds.has(r.internalId));
  const otherRecords = REGISTER.filter((r) => r.internalId !== "MDR-009" && !excludedIds.has(r.internalId));
  assert(
    otherRecords.length === baseline.length,
    `Expected ${baseline.length} records besides MDR-009 and MDR-010–020, found ${otherRecords.length}`,
  );
  for (let i = 0; i < otherRecords.length; i++) {
    assert(
      JSON.stringify(otherRecords[i]) === JSON.stringify(baseline[i]),
      `${otherRecords[i].internalId} differs from its checkpoint 90a10af baseline — this Stage 3B pass must only touch MDR-009`,
    );
  }
  console.log(
    "✓ only MDR-009 changed in this stage; MDR-001 through MDR-008 and MDR-021 through MDR-030 match checkpoint 90a10af exactly (MDR-010–020 verified separately)",
  );
}

function testMdr001Through008RemainUnchangedFromCheckpoint() {
  const baseline = loadBaselineFixture();
  for (const id of ["MDR-001", "MDR-002", "MDR-003", "MDR-004", "MDR-005", "MDR-006", "MDR-007", "MDR-008"]) {
    const baselineRecord = baseline.find((r: { internalId: string }) => r.internalId === id);
    const currentRecord = REGISTER.find((r) => r.internalId === id);
    assert(!!baselineRecord && !!currentRecord, `${id} missing from baseline or current register`);
    assert(
      JSON.stringify(currentRecord) === JSON.stringify(baselineRecord),
      `${id} changed during the MDR-009 audit — its prior Stage 3B research (checkpoint 90a10af) must remain untouched`,
    );
  }
  console.log("✓ MDR-001 through MDR-008 remain unchanged from checkpoint 90a10af");
}

function testMdr021Through030RemainUnchanged() {
  // MDR-010 through MDR-020 are excluded: each was legitimately researched
  // in a later batch pass (verified separately by
  // dhikr-source-register-mdr-010-020-batch-audit.test.ts against its own
  // later checkpoint baseline).
  const baseline = loadBaselineFixture();
  const expectedIds = Array.from({ length: 10 }, (_, i) => `MDR-${String(i + 21).padStart(3, "0")}`);
  for (const id of expectedIds) {
    const baselineRecord = baseline.find((r: { internalId: string }) => r.internalId === id);
    const currentRecord = REGISTER.find((r) => r.internalId === id);
    assert(!!baselineRecord && !!currentRecord, `${id} missing from baseline or current register`);
    assert(
      JSON.stringify(currentRecord) === JSON.stringify(baselineRecord),
      `${id} changed during the MDR-009 audit — it must remain Stage-3A transcription-only`,
    );
  }
  console.log("✓ MDR-021 through MDR-030 remain unchanged (10 records checked; MDR-010–020 verified separately)");
}

function testMdr009ProtectedTranscriptionFieldsUnchanged() {
  const expected = {
    sequenceNumber: 9,
    internalId: "MDR-009",
    openingArabicWords: "اللَّهُمَّ إنِّي أصْبَحْتُ أُشْهِدُكَ",
    sourceDocumentAnnotations: ["4x"],
    transcriptionStatus: "exact",
    transcriptionNotes: "",
    proposedCategory: "",
    scholarlyReviewer: "",
    scholarlyDecision: "pending",
    importStatus: "research-only",
  };
  for (const [field, value] of Object.entries(expected)) {
    assert(
      JSON.stringify((MDR_009 as unknown as Record<string, unknown>)[field]) === JSON.stringify(value),
      `MDR-009.${field} was altered by the Stage 3B research pass — this field must remain untouched`,
    );
  }
  assert(
    MDR_009.originalDocumentText.length === 208,
    `MDR-009.originalDocumentText length changed — expected 208, found ${MDR_009.originalDocumentText.length}`,
  );
  assert(
    MDR_009.originalDocumentText === MDR_009.fullArabicText,
    "MDR-009.originalDocumentText and fullArabicText should remain identical to each other (no correction applied)",
  );
  console.log(
    "✓ MDR-009's protected transcription fields (sequenceNumber, internalId, openingArabicWords, originalDocumentText, fullArabicText, sourceDocumentAnnotations, transcriptionStatus, transcriptionNotes, proposedCategory, scholarlyReviewer, scholarlyDecision, importStatus) are unchanged",
  );
}

function testNoClauseMapFileWasNeeded() {
  const repoRoot = path.resolve(__dirname, "../..");
  const clauseMapPath = path.join(repoRoot, "src/lib/dhikr-research/audits/mdr-009-clause-map.ts");
  assert(
    !fs.existsSync(clauseMapPath),
    "src/lib/dhikr-research/audits/mdr-009-clause-map.ts should not exist — MDR-009 was not segmented (see audit report, 'Segmentation decision')",
  );
  const report = loadAuditReport();
  assert(
    report.includes("MDR-009 was **not** segmented into clauses"),
    "Audit report must explicitly state MDR-009 was not segmented",
  );
  assert(
    report.includes("there is no source plurality to reflect in a clause map"),
    "Audit report must explain non-segmentation via the single-narration finding, not merely clause count",
  );
  console.log("✓ no clause-map file was created; the audit report documents why segmentation was unnecessary");
}

function testNoArabicWasAlteredOrDuplicated() {
  const text = MDR_009.originalDocumentText;
  assert(text.length === 208, "MDR-009.originalDocumentText length must remain 208");
  assert((text.match(/،/g) || []).length === 5, "MDR-009.originalDocumentText must retain exactly five commas");
  assert(
    text.startsWith("اللَّهُمَّ إنِّي أصْبَحْتُ أُشْهِدُكَ") && text.endsWith("4x"),
    "MDR-009.originalDocumentText must retain its exact opening words and trailing 4x annotation",
  );
  console.log("✓ no Arabic is omitted, duplicated, or altered in MDR-009.originalDocumentText");
}

function testSourceHierarchyCorrectlyLabelled() {
  const report = loadAuditReport();
  assert(
    report.includes("| Candidate/reported item | Hierarchy label |"),
    "Audit report is missing the source-hierarchy table",
  );
  assert(
    report.includes("A directly fetched recognised hosting of Sunan Abi Dawud's collection text"),
    "Audit report must label the islamweb.net Abu Dawud fetch precisely, distinguishing the webpage being opened from exact textual inspection",
  );
  assert(
    report.includes("Not inspected — fetch attempt interrupted by the user; not relied upon"),
    "Audit report must record that the al-sunan.org fetch was interrupted and not relied upon",
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
    MDR_009.primaryCollection.includes("tool-mediated quotation returned is not a guaranteed raw character-for-character transcription"),
    "MDR-009.primaryCollection must record that the quotation is tool-mediated, not raw",
  );
  console.log("✓ direct-source inspection is not overstated; webpage access is distinguished from exact textual inspection");
}

function testToolMediatedArabicNotCalledRawPrimaryText() {
  assert(
    MDR_009.sourceArabicWording.startsWith("Tool-mediated Arabic quotations returned from"),
    "MDR-009.sourceArabicWording must open by declaring itself tool-mediated quotations, not raw primary text",
  );
  assert(
    MDR_009.sourceArabicWording.includes("None is a raw, character-for-character transcription independently verified against a print edition, scan, or PDF"),
    "MDR-009.sourceArabicWording must explicitly disclaim being a raw/character-for-character/independently-verified text",
  );
  console.log("✓ tool-mediated Arabic is explicitly not called raw primary text anywhere");
}

function testPropheticAttributionQualified() {
  assert(
    MDR_009.narrator.includes("not independently re-verified against a raw manuscript or print edition"),
    "MDR-009.narrator must qualify Prophetic attribution and the isnad reading as reported, not independently re-verified",
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
    report.includes("No timing evidence beyond the single word") && report.includes("was found within MDR-009's own recited document text"),
    "Audit report must ground the literal-wording timing conclusion in MDR-009's own recited document text, not chapter/register placement",
  );
  console.log("✓ timing is not inferred from chapter or register placement alone");
}

function testMorningSpecificStatusReflectsAuthenticatedUsage() {
  const report = loadAuditReport();
  assert(
    MDR_009.morningSpecificStatus === "morning-and-evening",
    `MDR-009.morningSpecificStatus is "${MDR_009.morningSpecificStatus}", expected "morning-and-evening"`,
  );
  assert(
    report.includes("directly analogous to MDR-006's precedent"),
    "Audit report must cite the MDR-006 precedent for treating this as narration-level wording alternation",
  );
  console.log("✓ morningSpecificStatus (\"morning-and-evening\") reflects authenticated narration usage, distinct from the literal wording finding (only 'أصْبَحْتُ' appears in MDR-009's own text)");
}

function testContentClassificationMatchesMorningEveningWordingAlternation() {
  const report = loadAuditReport();
  assert(
    MDR_009.contentClassification === "morning-and-evening",
    `MDR-009.contentClassification is "${MDR_009.contentClassification}", expected "morning-and-evening"`,
  );
  assert(
    report.includes("unlike MDR-008 (where the two fields were deliberately left different)"),
    "Audit report must explain why MDR-009's contentClassification matches morningSpecificStatus, unlike MDR-008",
  );
  console.log("✓ contentClassification (\"morning-and-evening\") matches morningSpecificStatus, justified by the narration's own opening-frame time-word substitution");
}

function testDisputedStatusExistsInEnumAndWasNotInvented() {
  const repoRoot = path.resolve(__dirname, "../..");
  const typesPath = path.join(repoRoot, "src/lib/dhikr-research/types.ts");
  const typesContents = fs.readFileSync(typesPath, "utf8");
  assert(
    /export type SourceResearchStatus =[\s\S]*?\|\s*"disputed"/.test(typesContents),
    "types.ts must actually contain 'disputed' as a SourceResearchStatus member — this test must fail if the enum ever changes without updating this record",
  );
  assert(
    MDR_009.sourceResearchStatus === "disputed",
    `MDR-009.sourceResearchStatus is "${MDR_009.sourceResearchStatus}", expected "disputed"`,
  );
  const report = loadAuditReport();
  assert(
    report.includes("no value was invented"),
    "Audit report must explicitly state no new enum value was invented for the 'disputed' status",
  );
  console.log("✓ sourceResearchStatus (\"disputed\") is an existing, directly-verified SourceResearchStatus enum member — not invented");
}

function testStatusDecisionRejectsAlternatives() {
  const report = loadAuditReport();
  const requiredRejections = [
    /`"not-started"` was rejected/,
    /`"in-progress"` was rejected/,
    /`"sourced"` was rejected/,
    /`"verified"` was rejected/,
    /`"scholarly-review-required"` was considered closely but rejected/,
  ];
  for (const pattern of requiredRejections) {
    assert(pattern.test(report), `Audit report must explicitly reject alternative status values matching ${pattern}`);
  }
  console.log("✓ audit report explicitly rejects each alternative sourceResearchStatus value with stated reasoning");
}

function testGradingDisputeNamesBothSides() {
  assert(
    MDR_009.hadithGrading.includes("al-Nawawi") &&
      MDR_009.hadithGrading.includes("Ibn al-Qayyim") &&
      MDR_009.hadithGrading.includes("Ibn Hajar") &&
      MDR_009.hadithGrading.includes("Ibn Baz") &&
      MDR_009.hadithGrading.includes("al-Albani"),
    "MDR-009.hadithGrading must name both the accepting authorities (al-Nawawi, Ibn al-Qayyim, Ibn Hajar, Ibn Baz) and the weakening authority (al-Albani)",
  );
  assert(
    MDR_009.hadithGrading.includes("jahala"),
    "MDR-009.hadithGrading must record al-Albani's specific stated reasoning (jahala) as reported, not merely 'weak'",
  );
  assert(
    MDR_009.hadithGrading.includes("genuine, named disagreement") || MDR_009.hadithGrading.includes("genuine authenticity disagreement"),
    "MDR-009.hadithGrading must characterise this as a genuine named disagreement, not a route/edition discrepancy",
  );
  console.log("✓ the grading dispute names both accepting and weakening authorities, and records al-Albani's specific stated reasoning");
}

function testGradingDisputeNotConflatedWithRouteOrEditionDiscrepancy() {
  assert(
    MDR_009.hadithGrading.includes("not merely a route or edition-numbering discrepancy"),
    "MDR-009.hadithGrading must explicitly distinguish the authenticity dispute from a route/edition-numbering discrepancy",
  );
  console.log("✓ the grading dispute is explicitly distinguished from a route/edition-numbering discrepancy");
}

function testTwoIsnadRoutesDistinguished() {
  assert(
    MDR_009.gradingNotes.includes("Baqiyyah ibn al-Walid") && MDR_009.gradingNotes.includes("Makhul"),
    "MDR-009.gradingNotes must distinguish the two reported isnad routes (Baqiyyah/Muslim ibn Ziyad, and Makhul)",
  );
  assert(
    MDR_009.gradingNotes.includes("was not traced to a specific route in this pass"),
    "MDR-009.gradingNotes must record that the al-Albani/majority dispute was not traced to a specific isnad route",
  );
  console.log("✓ the two reported isnad routes are distinguished, and the untraced route-specificity of the grading dispute is recorded");
}

function testRepetitionCountEvidenceBased() {
  assert(MDR_009.repetitionCount === 4, `MDR-009.repetitionCount is "${MDR_009.repetitionCount}", expected 4`);
  assert(
    MDR_009.repetitionEvidence.length > 0,
    "MDR-009.repetitionEvidence must be populated — the pre-populated Stage 3A repetitionCount required Stage 3B evidentiary evaluation",
  );
  assert(
    MDR_009.repetitionEvidence.includes("complete emancipation") && MDR_009.repetitionEvidence.includes("tier"),
    "MDR-009.repetitionEvidence must state that the source-document '4x' corresponds specifically to the narration's complete-emancipation tier",
  );
  assert(
    MDR_009.repetitionEvidence.includes("separate from and not dependent on the disputed isnad grading"),
    "MDR-009.repetitionEvidence must distinguish the repetition-count finding from the separately disputed isnad grading",
  );
  console.log("✓ repetitionCount (4) is evidence-based, distinguished from the source-document annotation and from the disputed isnad grading");
}

function testVirtueOrRewardClaimPreservesGraduatedLevels() {
  assert(
    MDR_009.virtueOrRewardClaim.length > 0,
    "MDR-009.virtueOrRewardClaim must be populated",
  );
  const requiredFragments = [
    /quarter/i,
    /one half|half/i,
    /three-quarters/i,
    /complete emancipation/i,
    /waking|retiring/i,
  ];
  for (const fragment of requiredFragments) {
    assert(
      fragment.test(MDR_009.virtueOrRewardClaim),
      `MDR-009.virtueOrRewardClaim is missing a required condition matching ${fragment}`,
    );
  }
  // Note: as with MDR-008, the field's own text explicitly names "protection
  // from Hell" / "guaranteed freedom from the Fire" / "say it four times and
  // you are saved" as forbidden unconditional shortenings it must NOT be
  // reduced to — a naive regex ban on those phrases would false-positive on
  // the field's own correct disclaimer. Instead assert the claim is long
  // enough to be the full graduated ladder, not a short unconditional one.
  assert(
    MDR_009.virtueOrRewardClaim.length > 150,
    "MDR-009.virtueOrRewardClaim must be the full graduated ladder, not shortened to a brief unconditional outcome",
  );
  console.log("✓ virtueOrRewardClaim preserves all four graduated repetition/reward levels (quarter/half/three-quarters/complete) without unconditional shortening");
}

function testVirtueEvidenceExplainsNarrationAttachedStatus() {
  assert(
    MDR_009.virtueEvidence.includes("narration-attached evidence, not part of the Arabic supplication transcribed in MDR-009"),
    "MDR-009.virtueEvidence must state the claim is narration-attached evidence, not part of the transcribed supplication",
  );
  assert(
    MDR_009.virtueEvidence.includes("must not be inserted into `fullArabicText` or `originalDocumentText`") ||
      MDR_009.virtueEvidence.includes("must not be inserted into fullArabicText or originalDocumentText"),
    "MDR-009.virtueEvidence must explicitly forbid inserting the reward text into the protected transcription fields",
  );
  console.log("✓ virtueEvidence explains the reward claim is narration-attached and must not be inserted into the recited Arabic");
}

function testRewardTextNotInsertedIntoTranscribedFields() {
  assert(
    !MDR_009.fullArabicText.includes("النار") && !MDR_009.fullArabicText.includes("أعتق"),
    "MDR-009.fullArabicText must not contain any reward-clause wording (e.g. النار, أعتق) — the reward statement must remain outside the recited text",
  );
  assert(
    !MDR_009.originalDocumentText.includes("النار") && !MDR_009.originalDocumentText.includes("أعتق"),
    "MDR-009.originalDocumentText must not contain any reward-clause wording — protected transcription fields remain untouched",
  );
  console.log("✓ the reward-ladder wording was not inserted into fullArabicText or originalDocumentText");
}

function testFourTimesNotInferredFromFamiliarityAlone() {
  const report = loadAuditReport();
  assert(
    report.includes("independently evaluated, not simply trusted"),
    "Audit report must state the pre-populated repetitionCount was independently evaluated, not simply trusted",
  );
  console.log("✓ the '4x' repetition count is not treated as self-evidently correct merely because it was pre-populated");
}

function testWordingDifferenceRecordedNotSilentlyResolved() {
  assert(
    MDR_009.sourceArabicWording.includes("وَحْدَكَ لَا شَرِيْكَ لَكَ"),
    "MDR-009.sourceArabicWording must record the وحدك لا شريك لك wording-difference finding",
  );
  assert(
    MDR_009.sourceArabicWording.includes("This must not be treated as a settled addition, omission, or recognised variant without a raw, unmediated source"),
    "MDR-009.sourceArabicWording must explicitly refuse to settle the wording difference without a raw source",
  );
  console.log("✓ the وحدك لا شريك لك wording difference is recorded, not silently resolved in either direction");
}

function testWordingMatchStatusMatchesComparison() {
  assert(
    MDR_009.wordingMatchStatus === "unresolved",
    `MDR-009.wordingMatchStatus is "${MDR_009.wordingMatchStatus}", expected "unresolved"`,
  );
  console.log('✓ MDR-009.wordingMatchStatus ("unresolved") reflects the absence of any raw, unmediated comparison text');
}

function testScholarlyDecisionRemainsPending() {
  assert(MDR_009.scholarlyDecision === "pending", `MDR-009.scholarlyDecision is "${MDR_009.scholarlyDecision}", expected "pending"`);
  console.log('✓ MDR-009.scholarlyDecision remains "pending"');
}

function testImportStatusRemainsResearchOnly() {
  assert(MDR_009.importStatus === "research-only", `MDR-009.importStatus is "${MDR_009.importStatus}", expected "research-only"`);
  console.log("✓ MDR-009.importStatus remains research-only");
}

function testComputeImportGateRemainsFalse() {
  const gate = computeImportGate(MDR_009);
  assert(gate.canImport === false, "MDR-009 unexpectedly passed computeImportGate");
  assert(
    gate.blockedReasons.length === 4,
    `MDR-009 should remain blocked by exactly four independent conditions, found ${gate.blockedReasons.length}: ${gate.blockedReasons.join(" | ")}`,
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
      `computeImportGate(MDR-009) is missing an expected blocker matching ${fragment}`,
    );
  }
  assert(
    !gate.blockedReasons.some((r) => /repetition count has no supporting evidence/i.test(r)),
    "computeImportGate(MDR-009) must not cite an unsupported repetition count — repetitionEvidence is populated",
  );
  assert(
    !gate.blockedReasons.some((r) => /virtue or reward claim has no supporting evidence/i.test(r)),
    "computeImportGate(MDR-009) must not cite an unsupported virtue claim — virtueEvidence is populated",
  );
  console.log(`✓ computeImportGate(MDR-009) remains false with exactly four blockers (source research, wording, scholarly approval, research-only status)`);
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
    report.includes("not established") || report.includes("unresolved") || report.includes("Disputed"),
    "Audit report should record genuine uncertainty rather than resolving everything",
  );
  console.log("✓ audit report does not overstate authenticity, certainty, or non-existence");
}

function testInterruptedFetchNotReliedUpon() {
  const report = loadAuditReport();
  assert(
    report.includes("al-sunan.org/vb, forum thread 3959") && report.includes("interrupted by the user mid-research"),
    "Audit report must record the al-sunan.org interruption and non-reliance",
  );
  assert(
    MDR_009.primaryCollection.includes("interrupted by the user mid-research, was not retried, and is not relied upon"),
    "MDR-009.primaryCollection must record the al-sunan.org interruption and non-reliance",
  );
  console.log("✓ the interrupted al-sunan.org fetch is recorded and explicitly not relied upon");
}

function testUsulAiSearchLogDocumentsSixQueries() {
  const occurrences = (MDR_009.usulAiResearchNotes.match(/Search \d/g) || []).length;
  assert(
    occurrences === 6,
    `MDR-009.usulAiResearchNotes must document exactly 6 Usul.ai searches, found ${occurrences}`,
  );
  assert(
    MDR_009.usulAiResearchNotes.includes("No usable result"),
    "MDR-009.usulAiResearchNotes must honestly record non-matching Usul.ai results rather than merely stating 'Usul.ai searched'",
  );
  assert(
    MDR_009.usulAiResearchNotes.includes("Ja'far al-Sadiq") && MDR_009.usulAiResearchNotes.includes("checked and rejected as unrelated"),
    "MDR-009.usulAiResearchNotes must record the unrelated Ja'far al-Sadiq hadith was checked and rejected as unrelated, not silently used",
  );
  console.log("✓ Usul.ai search log documents all 6 queries actually run, with honest no-match reporting");
}

function runAll() {
  testOnlyMdr009ResearchFieldsChanged();
  testMdr001Through008RemainUnchangedFromCheckpoint();
  testMdr021Through030RemainUnchanged();
  testMdr009ProtectedTranscriptionFieldsUnchanged();
  testNoClauseMapFileWasNeeded();
  testNoArabicWasAlteredOrDuplicated();
  testSourceHierarchyCorrectlyLabelled();
  testDirectSourceInspectionNotOverstated();
  testToolMediatedArabicNotCalledRawPrimaryText();
  testPropheticAttributionQualified();
  testTimingNotInferredFromChapterPlacementAlone();
  testMorningSpecificStatusReflectsAuthenticatedUsage();
  testContentClassificationMatchesMorningEveningWordingAlternation();
  testDisputedStatusExistsInEnumAndWasNotInvented();
  testStatusDecisionRejectsAlternatives();
  testGradingDisputeNamesBothSides();
  testGradingDisputeNotConflatedWithRouteOrEditionDiscrepancy();
  testTwoIsnadRoutesDistinguished();
  testRepetitionCountEvidenceBased();
  testVirtueOrRewardClaimPreservesGraduatedLevels();
  testVirtueEvidenceExplainsNarrationAttachedStatus();
  testRewardTextNotInsertedIntoTranscribedFields();
  testFourTimesNotInferredFromFamiliarityAlone();
  testWordingDifferenceRecordedNotSilentlyResolved();
  testWordingMatchStatusMatchesComparison();
  testScholarlyDecisionRemainsPending();
  testImportStatusRemainsResearchOnly();
  testComputeImportGateRemainsFalse();
  testNoSanityOrPublicFileChanged();
  testAuditReportContainsManualVerificationChecklist();
  testAuditReportDoesNotOverstateAuthenticityCertaintyOrNonExistence();
  testInterruptedFetchNotReliedUpon();
  testUsulAiSearchLogDocumentsSixQueries();
  console.log("\nAll MDR-009 source-audit tests passed.");
}

runAll();
