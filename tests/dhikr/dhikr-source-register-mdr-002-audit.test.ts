/**
 * Stage 3B — MDR-002 source-audit tests.
 *
 * Verifies the Stage 3B research pass touched only MDR-002's research
 * fields, left MDR-001 (already researched, checkpoint 8e2c46d) and
 * MDR-003 through MDR-030 (still Stage 3A transcription-only) unchanged,
 * and did not relax any import-blocking condition beyond what real, cited
 * evidence supports. MDR-001 and MDR-003 through MDR-030 are checked
 * against a fixture snapshot captured from checkpoint 8e2c46d — see
 * tests/dhikr/fixtures/mdr-001-and-003-030-8e2c46d-baseline.json.
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
const MDR_002 = REGISTER[1];

function loadBaselineFixture() {
  const fixturePath = path.resolve(__dirname, "fixtures/mdr-001-and-003-030-8e2c46d-baseline.json");
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
}

function loadAuditReport(): string {
  const repoRoot = path.resolve(__dirname, "../..");
  const reportPath = path.join(repoRoot, "docs/dhikr/research/MDR-002-source-audit.md");
  assert(fs.existsSync(reportPath), "docs/dhikr/research/MDR-002-source-audit.md does not exist");
  return fs.readFileSync(reportPath, "utf8");
}

function testOnlyMdr002ChangedInThisStage() {
  // MDR-003 through MDR-006 are excluded from this comparison: each was
  // legitimately researched in a later stage and is no longer expected to
  // match this checkpoint's baseline. Those later changes are verified by
  // their own dedicated files, tests/dhikr/dhikr-source-register-mdr-003-audit.test.ts,
  // -mdr-004-audit.test.ts, -mdr-005-audit.test.ts, and -mdr-006-audit.test.ts.
  assert(MDR_002.internalId === "MDR-002", "REGISTER[1] is not MDR-002");
  const excludedIds = new Set(["MDR-003", "MDR-004", "MDR-005", "MDR-006"]);
  const baseline = loadBaselineFixture().filter((r: { internalId: string }) => !excludedIds.has(r.internalId));
  const otherRecords = REGISTER.filter((r) => r.internalId !== "MDR-002" && !excludedIds.has(r.internalId));
  assert(
    otherRecords.length === baseline.length,
    `Expected ${baseline.length} records besides MDR-002/MDR-003/MDR-004/MDR-005/MDR-006, found ${otherRecords.length}`,
  );
  for (let i = 0; i < otherRecords.length; i++) {
    assert(
      JSON.stringify(otherRecords[i]) === JSON.stringify(baseline[i]),
      `${otherRecords[i].internalId} differs from its checkpoint 8e2c46d baseline — this Stage 3B pass must only touch MDR-002`,
    );
  }
  console.log(
    "✓ only MDR-002 changed in this stage; MDR-001 and MDR-007 through MDR-030 match checkpoint 8e2c46d exactly (MDR-003 through MDR-006 verified separately)",
  );
}

function testMdr001RemainsUnchangedFromCheckpoint() {
  const baseline = loadBaselineFixture();
  const mdr001Baseline = baseline.find((r: { internalId: string }) => r.internalId === "MDR-001");
  const mdr001Current = REGISTER.find((r) => r.internalId === "MDR-001");
  assert(!!mdr001Baseline && !!mdr001Current, "MDR-001 missing from baseline or current register");
  assert(
    JSON.stringify(mdr001Current) === JSON.stringify(mdr001Baseline),
    "MDR-001 changed during the MDR-002 audit — MDR-001's Stage 3B research (checkpoint 8e2c46d) must remain untouched",
  );
  console.log("✓ MDR-001 remains unchanged from commit 8e2c46d");
}

function testMdr002ProtectedFieldsUnchanged() {
  const expected = {
    sequenceNumber: 2,
    internalId: "MDR-002",
    openingArabicWords: "بسْمِ اللَّهِ الَّذِي لَا يَضُرُّ",
    fullArabicText:
      "بسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ، فِي الْأَرْضِ، وَلَا فِي السَّمَاءِ، وَهُوَ السَّمِيعُ الْعَلِيمُ 3x ",
    originalDocumentText:
      "بسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ، فِي الْأَرْضِ، وَلَا فِي السَّمَاءِ، وَهُوَ السَّمِيعُ الْعَلِيمُ 3x ",
    sourceDocumentAnnotations: ["3x"],
    transcriptionStatus: "exact",
    scholarlyReviewer: "",
    scholarlyDecision: "pending",
    importStatus: "research-only",
  };
  for (const [field, value] of Object.entries(expected)) {
    assert(
      JSON.stringify((MDR_002 as unknown as Record<string, unknown>)[field]) === JSON.stringify(value),
      `MDR-002.${field} was altered by the Stage 3B research pass — this field must remain untouched`,
    );
  }
  console.log(
    "✓ MDR-002's protected fields (sequenceNumber, internalId, openingArabicWords, originalDocumentText, fullArabicText, sourceDocumentAnnotations, transcriptionStatus, scholarlyReviewer, scholarlyDecision, importStatus) are unchanged",
  );
}

function testSourceDocumentX3IsNotTreatedAsEvidenceAlone() {
  assert(
    MDR_002.repetitionCount === 3,
    `MDR-002.repetitionCount should remain 3 (document-supplied), found ${MDR_002.repetitionCount}`,
  );
  assert(
    MDR_002.repetitionEvidence.trim().length > 0,
    "MDR-002.repetitionEvidence should now cite real evidence found during Stage 3B, not just the document's own x3 annotation",
  );
  assert(
    /abu dawud|tirmidhi|ibn majah|riyad as-salihin/i.test(MDR_002.repetitionEvidence),
    "MDR-002.repetitionEvidence should cite an actual inspected/indexed narration, not merely restate the document's x3 annotation",
  );
  console.log("✓ the source document's x3 annotation alone is not treated as repetition evidence");
}

function testRepetitionEvidenceCitesAnInspectedNarration() {
  const citesCollection = /abudawud|abu dawud|tirmidhi|ibnmajah|ibn majah|riyad/i.test(MDR_002.repetitionEvidence);
  assert(citesCollection, "MDR-002.repetitionEvidence does not cite any named hadith collection");
  console.log("✓ repetitionEvidence cites a named, indexed/inspected narration");
}

function testMdr002RemainsResearchOnly() {
  assert(
    MDR_002.importStatus === "research-only",
    `MDR-002.importStatus is "${MDR_002.importStatus}", expected "research-only"`,
  );
  console.log("✓ MDR-002 remains research-only");
}

function testScholarlyDecisionRemainsPending() {
  assert(
    MDR_002.scholarlyDecision === "pending",
    `MDR-002.scholarlyDecision is "${MDR_002.scholarlyDecision}", expected "pending"`,
  );
  console.log('✓ MDR-002.scholarlyDecision remains "pending"');
}

function testComputeImportGateRemainsFalse() {
  // Must include at least these four blockers after reverting
  // sourceResearchStatus — the gate must not be weakened merely to preserve
  // an earlier blocker count.
  const gate = computeImportGate(MDR_002);
  assert(gate.canImport === false, "MDR-002 unexpectedly passed computeImportGate");
  assert(
    gate.blockedReasons.some((r) => /source research is not verified/i.test(r)),
    "computeImportGate should cite sourceResearchStatus as not verified",
  );
  assert(
    gate.blockedReasons.some((r) => /grading is absent/i.test(r)),
    "computeImportGate should cite the absent record-level grading",
  );
  assert(
    gate.blockedReasons.some((r) => /scholarly approval is absent/i.test(r)),
    "computeImportGate should cite the pending scholarly decision",
  );
  assert(
    gate.blockedReasons.some((r) => /research-only/i.test(r)),
    "computeImportGate should cite the research-only import status",
  );
  console.log(`✓ computeImportGate(MDR-002) remains false with all 4 required blockers (${gate.blockedReasons.length} total)`);
}

function testNoUnsupportedGradingIsApplied() {
  // Record-level grading stays empty regardless of sourceResearchStatus: the
  // schema's single hadithGrading/gradingAuthority fields cannot cleanly
  // represent the four distinct, source-specific grading labels directly
  // inspected for this record (Tirmidhi's own classification, the Darussalam
  // edition grading, Ibn Majah's displayed grading, An-Nawawi's citation) —
  // see docs/dhikr/research/MDR-002-source-audit.md §11.
  assert(MDR_002.hadithGrading === "", "MDR-002.hadithGrading must remain empty at the record level");
  assert(MDR_002.gradingAuthority === "", "MDR-002.gradingAuthority must remain empty at the record level");
  console.log("✓ no single unsupported grading value is applied at the record level, despite direct-inspection evidence");
}

function testSourceArabicWordingIsPopulatedAndComplete() {
  assert(MDR_002.sourceArabicWording.trim().length > 0, "MDR-002.sourceArabicWording should now be populated");
  // Matched against the field's actual fully-diacritized (tashkeel) text —
  // plain/undiacritized Arabic substrings will not match, since each
  // diacritic mark is its own combining character in the string.
  const requiredFragments = [
    "السَّمِيعُ",
    "الْعَلِيمُ",
    "ثَلاَثَ مَرَّاتٍ",
    "صَبَاحِ كُلِّ يَوْمٍ",
    "مَسَاءِ كُلِّ لَيْلَةٍ",
  ];
  for (const fragment of requiredFragments) {
    assert(
      MDR_002.sourceArabicWording.includes(fragment),
      `MDR-002.sourceArabicWording is missing required directly-inspected fragment: "${fragment}"`,
    );
  }
  console.log("✓ sourceArabicWording is populated and contains the directly-inspected grading/timing/repetition wording");
}

function testWordingMatchStatusReflectsDirectInspection() {
  assert(
    MDR_002.wordingMatchStatus !== "unresolved",
    `MDR-002.wordingMatchStatus should no longer be "unresolved" now that a direct Arabic-to-Arabic comparison has been performed; found "${MDR_002.wordingMatchStatus}"`,
  );
  assert(
    MDR_002.wordingMatchStatus === "minor-orthographic-variation",
    `MDR-002.wordingMatchStatus is "${MDR_002.wordingMatchStatus}", expected "minor-orthographic-variation" (punctuation/diacritic-notation differences only)`,
  );
  console.log('✓ wordingMatchStatus reflects the direct comparison: "minor-orthographic-variation", not "unresolved"');
}

function testMorningSpecificStatusIsMorningAndEvening() {
  assert(
    MDR_002.morningSpecificStatus === "morning-and-evening",
    `MDR-002.morningSpecificStatus is "${MDR_002.morningSpecificStatus}", expected "morning-and-evening"`,
  );
  console.log('✓ morningSpecificStatus is "morning-and-evening", directly supported by the inspected narration\'s own wording');
}

function testSourceResearchStatusRequiresScholarlyReview() {
  // Reverted from an earlier "verified" pass: the closing Arabic clause was
  // reconstructed rather than copied character-for-character from an
  // independently accessible live primary page; Abu Dawud 5088's own Arabic
  // page remains uninspected; the Sahih Ibn Hibban and al-Tabarani leads
  // remain unconfirmed; grading presentation still requires scholarly
  // judgment; record-level grading fields remain empty; and the directly
  // inspected evidence was relayed into this environment rather than
  // independently fetched by this system.
  assert(
    MDR_002.sourceResearchStatus === "scholarly-review-required",
    `MDR-002.sourceResearchStatus is "${MDR_002.sourceResearchStatus}", expected "scholarly-review-required"`,
  );
  assert(
    MDR_002.sourceResearchStatus !== "verified",
    "MDR-002.sourceResearchStatus must not be \"verified\" — independent, agent-fetched primary-text and scholarly verification remain outstanding",
  );
  assert(MDR_002.scholarlyDecision === "pending", "scholarlyDecision must remain pending");
  assert(MDR_002.importStatus === "research-only", "importStatus must remain research-only");
  console.log('✓ sourceResearchStatus is "scholarly-review-required" (not "verified"); scholarlyDecision/importStatus remain unchanged');
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

function testAuditReportIncludesEvidenceQualityLabels() {
  const report = loadAuditReport();
  const requiredLabels = [
    "Directly inspected source-page content relayed by the content owner",
    "Indexed source page located but inaccessible",
    "Location unverified",
    "Classical edition located via Usul.ai search index",
    "Contextual evidence only",
  ];
  for (const label of requiredLabels) {
    assert(report.includes(label), `Audit report is missing the evidence-quality label: "${label}"`);
  }
  console.log(
    "✓ audit report includes the required evidence-quality labels, including the precise user-relayed provenance label",
  );
}

function testAuditReportCorrectsAllSeeingAsTranslationAnomalyOnly() {
  const report = loadAuditReport();
  assert(
    report.includes("English translation anomaly"),
    'Audit report must identify "All-Seeing" as an English translation anomaly',
  );
  assert(
    /not an Arabic (wording )?variant/i.test(report),
    'Audit report must explicitly state "All-Seeing" is not an Arabic wording variant',
  );
  assert(
    /not a chain disagreement/i.test(report) && /not a source-text conflict/i.test(report),
    'Audit report must explicitly rule out "All-Seeing" as a chain disagreement or source-text conflict',
  );
  assert(
    report.includes("the All-Hearing"),
    "Audit report should state the correct meaning of السميع (the All-Hearing)",
  );
  console.log('✓ audit report identifies "All-Seeing" as an English translation anomaly only, not an Arabic wording discrepancy');
}

function testAuditReportDoesNotDescribeAllSeeingAsArabicDiscrepancy() {
  const report = loadAuditReport();
  assert(
    !/wording (comparison|discrepancy)[^.]*all-seeing/i.test(report),
    "Audit report must not frame the All-Seeing anomaly as an Arabic wording discrepancy",
  );
  console.log('✓ audit report does not describe "All-Seeing" as an Arabic wording discrepancy');
}

function testAuditReportIncludesManualVerificationChecklist() {
  const report = loadAuditReport();
  assert(
    report.includes("## 18. Manual primary-source verification required"),
    'Audit report is missing the "Manual primary-source verification required" section',
  );
  assert(
    (report.match(/^\- \[ \]/gm) || []).length >= 8,
    "Audit report's manual-verification checklist should have at least 8 items",
  );
  console.log("✓ audit report includes a manual verification checklist with at least 8 items");
}

function testAuditReportDoesNotCallRecordFullyVerified() {
  const report = loadAuditReport();
  assert(
    report.includes("Core narration strongly supported — independent primary-text and scholarly verification still required"),
    "Audit report is missing the required status heading",
  );
  assert(
    !/\*\*research verified\*\*/i.test(report) && !/record is (fully |now )?verified\b/i.test(report),
    "Audit report must not call the record fully verified",
  );
  assert(
    report.includes("`sourceResearchStatus` is `scholarly-review-required`, not `verified`") ||
      report.includes("sourceResearchStatus is scholarly-review-required, not verified"),
    "Audit report must explicitly state sourceResearchStatus is scholarly-review-required, not verified",
  );
  console.log('✓ audit report does not call the record "fully verified"; status heading matches the required wording');
}

function testAuditReportIdentifiesUserRelayedEvidence() {
  const report = loadAuditReport();
  const requiredPhrases = [
    "relayed by the content owner",
    "not the same evidentiary weight as",
  ];
  for (const phrase of requiredPhrases) {
    assert(report.includes(phrase), `Audit report is missing required provenance language: "${phrase}"`);
  }
  console.log("✓ audit report identifies the directly-inspected evidence as user-relayed source-page content, not independently fetched");
}

function testClosingClauseIsTransparentlyMarkedAsReconstructed() {
  const report = loadAuditReport();
  assert(report.includes("**reconstructed**"), "Audit report must mark the closing clause as reconstructed");
  assert(
    report.includes("It is **not** independently transcribed from the live page"),
    "Audit report must explicitly state the closing clause was not independently transcribed from the live page",
  );
  assert(
    report.includes("فَيَضُرُّهُ شَيْءٌ"),
    "Audit report must retain the transparency note quoting the relayed line's literal (incorrect) reading",
  );
  console.log("✓ the closing clause is transparently marked as reconstructed, not independently transcribed");
}

function testAuditReportDoesNotOverstateCertainty() {
  const report = loadAuditReport();
  assert(
    report.includes("not scholarly-approved") || report.includes("Not scholarly-approved"),
    "Audit report must still state the record is not scholarly-approved",
  );
  assert(
    report.includes("not import-ready") || report.includes("Not import-ready"),
    "Audit report must still state the record is not import-ready",
  );
  assert(
    report.includes("not separately re-inspected") || report.includes("not been separately re-inspected"),
    "Audit report must acknowledge Abu Dawud 5088's own page was not separately re-inspected in this pass",
  );
  const overclaimPatterns = [
    /confirmed not to exist/i,
    /definitively (proves|confirms|establishes)/i,
    /beyond (any )?doubt/i,
    /genuine unresolved discrepancy/i,
    /fully verified/i,
  ];
  for (const pattern of overclaimPatterns) {
    assert(!pattern.test(report), `Audit report contains overclaiming certainty language matching ${pattern}`);
  }
  assert(
    report.includes("do not, by themselves, establish a substantive contradiction"),
    "Audit report should explicitly state the grading-label differences do not by themselves establish a contradiction",
  );
  console.log(
    "✓ audit report does not overstate certainty: it distinguishes what was directly inspected from what remains unconfirmed, and does not claim an unevidenced contradiction",
  );
}

function runAll() {
  testOnlyMdr002ChangedInThisStage();
  testMdr001RemainsUnchangedFromCheckpoint();
  testMdr002ProtectedFieldsUnchanged();
  testSourceDocumentX3IsNotTreatedAsEvidenceAlone();
  testRepetitionEvidenceCitesAnInspectedNarration();
  testMdr002RemainsResearchOnly();
  testScholarlyDecisionRemainsPending();
  testComputeImportGateRemainsFalse();
  testNoUnsupportedGradingIsApplied();
  testSourceArabicWordingIsPopulatedAndComplete();
  testWordingMatchStatusReflectsDirectInspection();
  testMorningSpecificStatusIsMorningAndEvening();
  testSourceResearchStatusRequiresScholarlyReview();
  testNoSanityOrPublicFileChanged();
  testAuditReportIncludesEvidenceQualityLabels();
  testAuditReportCorrectsAllSeeingAsTranslationAnomalyOnly();
  testAuditReportDoesNotDescribeAllSeeingAsArabicDiscrepancy();
  testAuditReportIncludesManualVerificationChecklist();
  testAuditReportDoesNotCallRecordFullyVerified();
  testAuditReportIdentifiesUserRelayedEvidence();
  testClosingClauseIsTransparentlyMarkedAsReconstructed();
  testAuditReportDoesNotOverstateCertainty();
  console.log("\nAll MDR-002 source-audit tests passed.");
}

runAll();
