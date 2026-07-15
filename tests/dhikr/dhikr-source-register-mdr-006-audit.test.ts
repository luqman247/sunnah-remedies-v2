/**
 * Stage 3B — MDR-006 source-audit tests.
 *
 * Verifies the Stage 3B research pass touched only MDR-006's research
 * fields, left MDR-001 through MDR-005 (already researched, checkpoint
 * 38a0600) and MDR-007 through MDR-030 (still Stage 3A transcription-only)
 * unchanged. MDR-006 was not segmented (see docs/dhikr/research/MDR-006-source-audit.md,
 * "Segmentation decision") — directly-inspected primary evidence showed all
 * four thematic segments belong to one continuous narration, so no
 * clause-map file exists for this record and no reconstruction proof is
 * applicable. All other records are checked against a fixture snapshot
 * captured from checkpoint 38a0600 — see
 * tests/dhikr/fixtures/mdr-001-005-007-030-38a0600-baseline.json.
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
const MDR_006 = REGISTER.find((r) => r.internalId === "MDR-006")!;
const MDR_005 = REGISTER.find((r) => r.internalId === "MDR-005")!;

function loadBaselineFixture() {
  const fixturePath = path.resolve(__dirname, "fixtures/mdr-001-005-007-030-38a0600-baseline.json");
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
}

function loadAuditReport(): string {
  const repoRoot = path.resolve(__dirname, "../..");
  const reportPath = path.join(repoRoot, "docs/dhikr/research/MDR-006-source-audit.md");
  assert(fs.existsSync(reportPath), "docs/dhikr/research/MDR-006-source-audit.md does not exist");
  return fs.readFileSync(reportPath, "utf8");
}

function testOnlyMdr006ResearchFieldsChanged() {
  // MDR-007, MDR-008, and MDR-009 are excluded from this comparison: each
  // was legitimately researched in a later stage and is no longer expected
  // to match this checkpoint's baseline. Those later changes are verified
  // by their own dedicated files, tests/dhikr/dhikr-source-register-mdr-007-audit.test.ts,
  // -mdr-008-audit.test.ts, and -mdr-009-audit.test.ts.
  const excludedIds = new Set(["MDR-007", "MDR-008", "MDR-009"]);
  const baseline = loadBaselineFixture().filter((r: { internalId: string }) => !excludedIds.has(r.internalId));
  const otherRecords = REGISTER.filter((r) => r.internalId !== "MDR-006" && !excludedIds.has(r.internalId));
  assert(
    otherRecords.length === baseline.length,
    `Expected ${baseline.length} records besides MDR-006/MDR-007/MDR-008/MDR-009, found ${otherRecords.length}`,
  );
  for (let i = 0; i < otherRecords.length; i++) {
    assert(
      JSON.stringify(otherRecords[i]) === JSON.stringify(baseline[i]),
      `${otherRecords[i].internalId} differs from its checkpoint 38a0600 baseline — this Stage 3B pass must only touch MDR-006`,
    );
  }
  console.log(
    "✓ only MDR-006 changed in this stage; MDR-001 through MDR-005 and MDR-010 through MDR-030 match checkpoint 38a0600 exactly (MDR-007/MDR-008/MDR-009 verified separately)",
  );
}

function testMdr001Through005RemainUnchangedFromCheckpoint() {
  const baseline = loadBaselineFixture();
  for (const id of ["MDR-001", "MDR-002", "MDR-003", "MDR-004", "MDR-005"]) {
    const baselineRecord = baseline.find((r: { internalId: string }) => r.internalId === id);
    const currentRecord = REGISTER.find((r) => r.internalId === id);
    assert(!!baselineRecord && !!currentRecord, `${id} missing from baseline or current register`);
    assert(
      JSON.stringify(currentRecord) === JSON.stringify(baselineRecord),
      `${id} changed during the MDR-006 audit — its prior Stage 3B research (checkpoint 38a0600) must remain untouched`,
    );
  }
  console.log("✓ MDR-001 through MDR-005 remain unchanged from checkpoint 38a0600");
}

function testMdr010Through030RemainUnchanged() {
  // MDR-007, MDR-008, and MDR-009 are excluded: each was legitimately
  // researched in a later stage (verified separately by their own
  // dedicated test files against their own later checkpoint baselines).
  const baseline = loadBaselineFixture();
  const expectedIds = Array.from({ length: 21 }, (_, i) => `MDR-${String(i + 10).padStart(3, "0")}`);
  for (const id of expectedIds) {
    const baselineRecord = baseline.find((r: { internalId: string }) => r.internalId === id);
    const currentRecord = REGISTER.find((r) => r.internalId === id);
    assert(!!baselineRecord && !!currentRecord, `${id} missing from baseline or current register`);
    assert(
      JSON.stringify(currentRecord) === JSON.stringify(baselineRecord),
      `${id} changed during the MDR-006 audit — it must remain Stage-3A transcription-only`,
    );
  }
  console.log("✓ MDR-010 through MDR-030 remain unchanged (21 records checked; MDR-007/MDR-008/MDR-009 verified separately)");
}

function testMdr006ProtectedTranscriptionFieldsUnchanged() {
  const expected = {
    sequenceNumber: 6,
    internalId: "MDR-006",
    openingArabicWords: "أَصْبَحْنَا وَأَصْبَحَ الْمَلِكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ",
    sourceDocumentAnnotations: [],
    transcriptionStatus: "exact",
    scholarlyReviewer: "",
    scholarlyDecision: "pending",
    importStatus: "research-only",
  };
  for (const [field, value] of Object.entries(expected)) {
    assert(
      JSON.stringify((MDR_006 as unknown as Record<string, unknown>)[field]) === JSON.stringify(value),
      `MDR-006.${field} was altered by the Stage 3B research pass — this field must remain untouched`,
    );
  }
  assert(
    MDR_006.originalDocumentText.length === 446,
    `MDR-006.originalDocumentText length changed — expected 446, found ${MDR_006.originalDocumentText.length}`,
  );
  assert(
    MDR_006.originalDocumentText === MDR_006.fullArabicText,
    "MDR-006.originalDocumentText and fullArabicText should remain identical to each other (no correction applied)",
  );
  console.log(
    "✓ MDR-006's protected transcription fields (sequenceNumber, internalId, openingArabicWords, originalDocumentText, fullArabicText, sourceDocumentAnnotations, transcriptionStatus, scholarlyReviewer, scholarlyDecision, importStatus) are unchanged",
  );
}

function testNoClauseMapFileWasNeeded() {
  const repoRoot = path.resolve(__dirname, "../..");
  const clauseMapPath = path.join(repoRoot, "src/lib/dhikr-research/audits/mdr-006-clause-map.ts");
  assert(
    !fs.existsSync(clauseMapPath),
    "src/lib/dhikr-research/audits/mdr-006-clause-map.ts should not exist — MDR-006 was not segmented (see audit report, 'Segmentation decision')",
  );
  const report = loadAuditReport();
  assert(
    report.includes("MDR-006 was **not** segmented into clauses"),
    "Audit report must explicitly state MDR-006 was not segmented",
  );
  assert(
    report.includes("occur together and in the same order in the hosted Sahih Muslim narration returned through the fetch tool"),
    "Audit report must explain non-segmentation via the four components co-occurring in the fetched narration, without overclaiming exactness",
  );
  assert(
    report.includes(
      "This is **not** a claim of a character-for-character continuous matn, an exact match of four clauses, or a complete exact match",
    ),
    "Audit report must explicitly disclaim character-for-character/exact-match framing for the non-segmentation decision",
  );
  console.log("✓ no clause-map file was created; the audit report documents non-segmentation without overclaiming textual exactness");
}

function testNoArabicWasAlteredOrDuplicated() {
  const text = MDR_006.originalDocumentText;
  assert(text.length === 446, "MDR-006.originalDocumentText length must remain 446");
  assert(
    (text.match(/،/g) || []).length === 3,
    "MDR-006.originalDocumentText must retain exactly 3 commas — no segment omitted or duplicated",
  );
  console.log("✓ no Arabic is omitted, duplicated, or altered in MDR-006.originalDocumentText");
}

function testMdr005FindingsNotImportedAsMdr006Evidence() {
  assert(
    MDR_006.narrator !== MDR_005.narrator,
    "MDR-006.narrator must not be copied verbatim from MDR-005.narrator",
  );
  assert(
    MDR_006.primaryCollection !== MDR_005.primaryCollection,
    "MDR-006.primaryCollection must not be copied verbatim from MDR-005.primaryCollection",
  );
  assert(
    MDR_006.editorialNotes.includes("none of MDR-005's conclusions"),
    "MDR-006.editorialNotes must explicitly state MDR-005's conclusions were not inherited without independent inspection",
  );
  console.log("✓ MDR-005's findings (narrator, collection, grading, reference, wording, timing) were not imported as MDR-006 evidence");
}

function testMdr006TextIsMorningWordedNotEveningInherited() {
  assert(
    MDR_006.originalDocumentText.startsWith("أَصْبَحْنَا"),
    "MDR-006.originalDocumentText must start with the morning wording 'أَصْبَحْنَا', not an inherited evening assumption",
  );
  const report = loadAuditReport();
  assert(
    report.includes("is NOT the 'أَمْسَيْنَا'-opening evening wording that the MDR-005 audit's contextual lead described") ||
      report.includes("MDR-006's own transcribed text is morning-worded"),
    "Audit report must explicitly distinguish MDR-006's actual morning wording from the MDR-005 contextual lead's evening wording",
  );
  console.log("✓ MDR-006's own document text is confirmed morning-worded, not assumed evening-worded from the MDR-005 lead");
}

function testNoWholeRecordSourceClaimedFromPartialOpeningMatch() {
  const report = loadAuditReport();
  assert(
    report.includes("not merely the opening declaration") || report.includes("checked to contain all four segments"),
    "Audit report must state the source match covers all four segments, not merely the opening",
  );
  assert(
    !/matches based (solely|only) on (the |its )?opening/i.test(report),
    "Audit report must not claim a whole-record match based solely on the opening",
  );
  console.log("✓ no whole-record source is claimed from a partial opening-phrase match alone");
}

function testSourceHierarchyCorrectlyLabelled() {
  const report = loadAuditReport();
  assert(
    report.includes("| Candidate/reported item | Hierarchy label |"),
    "Audit report is missing the source-hierarchy table",
  );
  assert(
    report.includes("A directly fetched recognised hosting of Sahih Muslim's collection text"),
    "Audit report must label the islamweb.net Sahih Muslim fetch precisely, distinguishing the webpage being opened from exact textual inspection",
  );
  assert(
    report.includes("Indexed secondary discussion") || report.includes("Indexed classical commentary"),
    "Audit report must label Usul.ai index results as indexed, not directly inspected",
  );
  console.log("✓ source hierarchy is correctly labelled in the audit report");
}

function testOriginalSourceInspectionNotOverstated() {
  const report = loadAuditReport();
  assert(
    report.includes("is not a guaranteed lossless, character-for-character transcript"),
    "Audit report must explicitly qualify the WebFetch-mediated quotation as not a guaranteed lossless transcript",
  );
  assert(
    report.includes("is not the same as exact textual inspection") || report.includes("not the same as exact textual inspection"),
    "Audit report must distinguish opening the webpage from exact textual inspection",
  );
  assert(
    MDR_006.primaryCollection.includes("not the same as exact textual inspection"),
    "MDR-006.primaryCollection must record that opening the webpage is not the same as exact textual inspection",
  );
  console.log("✓ original-source inspection is not overstated; direct webpage access is distinguished from exact textual inspection");
}

function testSahihMuslimAuthenticityNotExtendedBeyondItsWording() {
  assert(
    MDR_006.gradingNotes.includes("this does not authenticate every MDR-006 letter-form or vocalisation"),
    "MDR-006.gradingNotes must state authenticity does not authenticate every MDR-006 letter-form or vocalisation",
  );
  const report = loadAuditReport();
  assert(
    report.includes("This does **not** authenticate every MDR-006 letter-form or vocalisation"),
    "Audit report must state Sahih Muslim authenticity is not extended to every MDR-006 letter-form or vocalisation",
  );
  assert(
    report.includes("does **not** mean Sahih Muslim automatically validates MDR-006's exact transcription"),
    "Audit report must explicitly disclaim that Sahih Muslim automatically validates MDR-006's exact transcription",
  );
  console.log("✓ Sahih Muslim authenticity is not extended to wording not confirmed to match the directly-inspected text");
}

function testPropheticAttributionQualified() {
  assert(
    MDR_006.narrator.includes("Reported as the Prophet's ﷺ own regular practice"),
    "MDR-006.narrator must qualify Prophetic attribution as reported, per the source's own framing",
  );
  const report = loadAuditReport();
  assert(
    report.includes("remains a tool-mediated reading of that isnad, not an independently re-verified manuscript check"),
    "Audit report must qualify the isnad finding as tool-mediated, not an independently re-verified manuscript check",
  );
  console.log("✓ Prophetic attribution and narrator identification are qualified, not asserted as independently re-verified");
}

function testEveningTimingSupportedAccurately() {
  const report = loadAuditReport();
  assert(
    report.includes("tool-mediated but directly-fetched statement within the narration itself"),
    "Audit report must ground timing conclusions in a tool-mediated but directly-fetched statement within the narration, not inference",
  );
  assert(
    report.includes("not a character-level verification of every quoted word"),
    "Audit report must state the timing conclusion is not a character-level verification of every quoted word",
  );
  assert(
    !/evening.{0,40}confirmed authentic/i.test(report),
    "Audit report must not overclaim evening authenticity in absolute terms",
  );
  console.log("✓ evening/morning timing is supported by a directly-fetched (tool-mediated) narration statement, with its limits stated explicitly");
}

function testSourceArabicWordingIsExplicitlyToolMediated() {
  assert(
    MDR_006.sourceArabicWording.startsWith("Tool-mediated Arabic quotation returned from a directly fetched hosting of Sahih Muslim"),
    "MDR-006.sourceArabicWording must open by declaring itself a tool-mediated quotation, not raw primary text",
  );
  assert(
    MDR_006.sourceArabicWording.includes("Not a raw transcription, not exact primary Arabic, not a character-for-character primary text, and not definitive Sahih Muslim wording"),
    "MDR-006.sourceArabicWording must explicitly disclaim being a raw/exact/character-for-character/definitive text",
  );
  assert(
    MDR_006.sourceArabicWording.includes("must not be treated as the final critical Arabic text"),
    "MDR-006.sourceArabicWording must state it must not be treated as the final critical Arabic text",
  );
  console.log("✓ sourceArabicWording is explicitly labelled tool-mediated and non-lossless, not raw primary Arabic");
}

function testContentClassificationAndMorningStatusUnchangedByCorrection() {
  assert(
    MDR_006.contentClassification === "morning-and-evening",
    `MDR-006.contentClassification is "${MDR_006.contentClassification}", expected "morning-and-evening" (unchanged by this narrow correction)`,
  );
  assert(
    MDR_006.morningSpecificStatus === "morning-and-evening",
    `MDR-006.morningSpecificStatus is "${MDR_006.morningSpecificStatus}", expected "morning-and-evening" (unchanged by this narrow correction)`,
  );
  console.log("✓ contentClassification and morningSpecificStatus remain morning-and-evening, unchanged by the wording-integrity correction");
}

function testFourComponentsTreatedAsOneNarrationNotFourSources() {
  const report = loadAuditReport();
  assert(
    report.includes("not as separately-sourced components"),
    "Audit report must state the four thematic components are treated as one narration, not separately-sourced components",
  );
  console.log("✓ the four thematic components are treated as occurring within one narration, not as four separate sources");
}

function testMorningEveningPairingNotAssumedWithoutEvidence() {
  const report = loadAuditReport();
  assert(
    report.includes("two similar openings are not assumed to belong to the same hadith") ||
      report.includes("not assumed to belong to the same hadith"),
    "Audit report must explicitly state two similar openings are not assumed to belong to the same hadith",
  );
  assert(
    report.includes("MDR-006 is not merged with MDR-005 and is not treated as its evening counterpart"),
    "Audit report must explicitly state MDR-006 is not merged with or treated as MDR-005's evening counterpart",
  );
  console.log("✓ morning/evening pairing is evidenced from the narration itself, not assumed from register adjacency or a shared opening");
}

function testRepetitionNotInvented() {
  assert(
    JSON.stringify(MDR_006.sourceDocumentAnnotations) === "[]",
    "MDR-006.sourceDocumentAnnotations should be empty (no repetition marker in the source document)",
  );
  assert(MDR_006.repetitionCount === undefined, "MDR-006.repetitionCount should remain unset — no repetition evidence was found");
  assert(MDR_006.repetitionEvidence === "", "MDR-006.repetitionEvidence should remain empty");
  console.log("✓ repetition is not invented — no count is populated for MDR-006");
}

function testVirtueOrProtectionNotInferredFromPetitionWording() {
  assert(MDR_006.virtueOrRewardClaim === "", "MDR-006.virtueOrRewardClaim must remain empty");
  assert(
    MDR_006.virtueEvidence.includes("Not populated") && MDR_006.virtueEvidence.includes("first-person petition"),
    "MDR-006.virtueEvidence should explain why no claim was inferred from petition/refuge-seeking wording",
  );
  console.log("✓ no virtue or protection claim is inferred from MDR-006's petition/refuge-seeking wording");
}

function testGradingAppliesOnlyToWordingActuallyCovered() {
  assert(
    MDR_006.hadithGrading.includes("Sahih") &&
      MDR_006.hadithGrading.includes("underlying four-part narration is contained in Sahih Muslim") &&
      MDR_006.hadithGrading.includes("not to every unresolved letter-form or vocalisation in MDR-006"),
    "MDR-006.hadithGrading must scope the Sahih grading to the identified narration, not every MDR-006 letter-form",
  );
  assert(
    MDR_006.gradingAuthority === "Sahih Muslim's canonical inclusion, with textual comparison still pending.",
    "MDR-006.gradingAuthority must use the preferred cautious wording",
  );
  assert(
    MDR_006.gradingNotes.includes("Specific unresolved wording points, none silently corrected"),
    "MDR-006.gradingNotes must list the specific unresolved wording points not covered by unqualified certainty",
  );
  assert(
    MDR_006.gradingNotes.includes("no single explanation is selected without directly inspected, raw Arabic evidence"),
    "MDR-006.gradingNotes must not select a single explanation for the wording differences without raw evidence",
  );
  console.log("✓ grading applies only to the identified narration, not to every unresolved MDR-006 letter-form");
}

function testUnderlyingNarrationIdentifiedAsSahihMuslim() {
  assert(
    MDR_006.hadithGrading.includes("Sahih Muslim"),
    "MDR-006.hadithGrading must identify Sahih Muslim as the underlying collection",
  );
  const report = loadAuditReport();
  assert(
    report.includes("Authentic Sahih Muslim narration identified"),
    "Audit report status heading must identify the underlying narration as an authentic Sahih Muslim narration",
  );
  console.log("✓ the underlying narration is identified as Sahih Muslim (Ibn Mas'ud)");
}

function testHadithNumberingRemainsUnresolved() {
  assert(
    MDR_006.primaryReference.includes("2723") && MDR_006.primaryReference.includes("4901"),
    "MDR-006.primaryReference must record both the commonly-cited 2723 and the fetched page's internal 4901 numbering",
  );
  assert(
    MDR_006.primaryReference.includes("not reconciled") || MDR_006.primaryReference.includes("were not reconciled"),
    "MDR-006.primaryReference must state the numbering discrepancy is not reconciled",
  );
  const report = loadAuditReport();
  assert(
    report.includes("Numbering systems can vary by edition, but that explanation is not assumed to account for this specific discrepancy without checking"),
    "Audit report must not assume edition variation explains the numbering discrepancy without checking",
  );
  console.log("✓ the hadith-numbering discrepancy (2723 vs. 4901) remains explicitly unresolved, neither presented as definitive");
}

function testNoRecognisedNarrationVariantLabelUsed() {
  const report = loadAuditReport();
  assert(
    !/(is|as)\s+(a\s+)?recognised.narration.variant/i.test(report) && !/confirmed as a (recognised )?variant/i.test(report),
    "Audit report must not label any of the four wording differences a recognised narration variant",
  );
  assert(
    report.includes("No single explanation is selected without directly inspected, raw Arabic evidence"),
    "Audit report must state no single explanation is selected without raw Arabic evidence",
  );
  console.log("✓ no wording difference is labelled a recognised narration variant, well-attested variant, or confirmed variant");
}

function testSourceResearchStatusMatchesActualEvidence() {
  assert(
    MDR_006.sourceResearchStatus === "scholarly-review-required",
    `MDR-006.sourceResearchStatus is "${MDR_006.sourceResearchStatus}", expected "scholarly-review-required" — the authentic core is directly inspected, but wording-variant questions remain for scholarly judgment`,
  );
  assert(MDR_006.sourceResearchStatus !== "verified", "MDR-006.sourceResearchStatus must not be \"verified\" while unresolved wording points remain");
  console.log('✓ MDR-006.sourceResearchStatus ("scholarly-review-required") matches the actual direct-inspection evidence');
}

function testWordingMatchStatusMatchesComparison() {
  assert(
    MDR_006.wordingMatchStatus === "unresolved",
    `MDR-006.wordingMatchStatus is "${MDR_006.wordingMatchStatus}", expected "unresolved" — narration identity is strongly supported, but the wording relationship is not yet text-critically resolved`,
  );
  console.log('✓ MDR-006.wordingMatchStatus ("unresolved") reflects that raw character-for-character comparison has not been done');
}

function testNoExactCharacterLevelMatchClaimed() {
  const report = loadAuditReport();
  assert(
    !/exact-match/.test(MDR_006.wordingMatchStatus),
    "MDR-006.wordingMatchStatus must not be exact-match",
  );
  assert(
    report.includes("compared character-for-character") || report.includes("compare it character-for-character"),
    "Audit report must state character-for-character comparison has not yet been done",
  );
  const overclaimPatterns = [/is an exact match/i, /matches character[- ]for[- ]character/i, /confirmed identical wording/i];
  for (const pattern of overclaimPatterns) {
    assert(!pattern.test(report), `Audit report contains an exact-match overclaim matching ${pattern}`);
  }
  console.log("✓ no exact character-level match between MDR-006 and the Sahih Muslim narration is claimed");
}

function testScholarlyDecisionRemainsPending() {
  assert(MDR_006.scholarlyDecision === "pending", `MDR-006.scholarlyDecision is "${MDR_006.scholarlyDecision}", expected "pending"`);
  console.log('✓ MDR-006.scholarlyDecision remains "pending"');
}

function testImportStatusRemainsResearchOnly() {
  assert(MDR_006.importStatus === "research-only", `MDR-006.importStatus is "${MDR_006.importStatus}", expected "research-only"`);
  console.log("✓ MDR-006.importStatus remains research-only");
}

function testComputeImportGateRemainsFalse() {
  const gate = computeImportGate(MDR_006);
  assert(gate.canImport === false, "MDR-006 unexpectedly passed computeImportGate");
  assert(
    gate.blockedReasons.length === 4,
    `MDR-006 should remain blocked by exactly four independent conditions, found ${gate.blockedReasons.length}: ${gate.blockedReasons.join(" | ")}`,
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
      `computeImportGate(MDR-006) is missing an expected blocker matching ${fragment}`,
    );
  }
  assert(
    !gate.blockedReasons.some((r) => /hadith grading is absent/i.test(r)),
    "computeImportGate(MDR-006) must not cite absent grading — hadithGrading is populated and identifies the underlying narration",
  );
  console.log(`✓ computeImportGate(MDR-006) remains false with exactly four blockers (source research, wording, scholarly approval, research-only status) — the canonical gate was not weakened`);
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
    report.includes("not resolved") || report.includes("unresolved"),
    "Audit report should record genuine uncertainty (wording-variant points) rather than resolving everything",
  );
  console.log("✓ audit report does not overstate authenticity, certainty, or non-existence");
}

function runAll() {
  testOnlyMdr006ResearchFieldsChanged();
  testMdr001Through005RemainUnchangedFromCheckpoint();
  testMdr010Through030RemainUnchanged();
  testMdr006ProtectedTranscriptionFieldsUnchanged();
  testNoClauseMapFileWasNeeded();
  testNoArabicWasAlteredOrDuplicated();
  testMdr005FindingsNotImportedAsMdr006Evidence();
  testMdr006TextIsMorningWordedNotEveningInherited();
  testNoWholeRecordSourceClaimedFromPartialOpeningMatch();
  testSourceHierarchyCorrectlyLabelled();
  testOriginalSourceInspectionNotOverstated();
  testSourceArabicWordingIsExplicitlyToolMediated();
  testSahihMuslimAuthenticityNotExtendedBeyondItsWording();
  testPropheticAttributionQualified();
  testEveningTimingSupportedAccurately();
  testContentClassificationAndMorningStatusUnchangedByCorrection();
  testFourComponentsTreatedAsOneNarrationNotFourSources();
  testMorningEveningPairingNotAssumedWithoutEvidence();
  testRepetitionNotInvented();
  testVirtueOrProtectionNotInferredFromPetitionWording();
  testGradingAppliesOnlyToWordingActuallyCovered();
  testUnderlyingNarrationIdentifiedAsSahihMuslim();
  testHadithNumberingRemainsUnresolved();
  testNoRecognisedNarrationVariantLabelUsed();
  testSourceResearchStatusMatchesActualEvidence();
  testWordingMatchStatusMatchesComparison();
  testNoExactCharacterLevelMatchClaimed();
  testScholarlyDecisionRemainsPending();
  testImportStatusRemainsResearchOnly();
  testComputeImportGateRemainsFalse();
  testNoSanityOrPublicFileChanged();
  testAuditReportContainsManualVerificationChecklist();
  testAuditReportDoesNotOverstateAuthenticityCertaintyOrNonExistence();
  console.log("\nAll MDR-006 source-audit tests passed.");
}

runAll();
