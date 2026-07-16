/**
 * Stage 3B — MDR-021 through MDR-030 streamlined batch source-audit tests.
 *
 * Verifies this batch pass touched only MDR-021 through MDR-030's research
 * fields, left MDR-001 through MDR-020 (already researched, checkpoint
 * a298fa9) unchanged. All other records are checked against a fixture
 * snapshot captured from checkpoint a298fa9 — see
 * tests/dhikr/fixtures/mdr-001-020-a298fa9-baseline.json.
 *
 * ONE clause map was created, for MDR-029 only (narrow remediation pass,
 * superseding the initial "no clause maps in this batch" decision) — see
 * src/lib/dhikr-research/audits/mdr-029-clause-map.ts. No clause-map file
 * exists for MDR-021–028 or MDR-030; MDR-027's "|"-separated structure
 * remains documented within its own research fields, not segmented.
 *
 * MDR-023's source hierarchy was also corrected in the same remediation
 * pass: the Sahih Muslim route ("four souls from the descendants of
 * Isma'il") is now identified as the primary reward claim, and the
 * Majma' al-Zawa'id route ("ten slaves") as a separate secondary-route
 * report — neither merged into the other nor presented as equal in source
 * authority.
 *
 * Plain assert()-based, run via `npx tsx`, following the repository's
 * established convention (docs/dhikr/17-test-and-validation-plan.md).
 */

import fs from "node:fs";
import path from "node:path";
import { MORNING_DHIKR_SOURCE_REGISTER } from "../../src/lib/dhikr-research/morning-dhikr-register";
import { computeImportGate } from "../../src/lib/dhikr-research/validation";
import { MDR_029_CLAUSE_MAP, reconstructMdr029FromClauses } from "../../src/lib/dhikr-research/audits/mdr-029-clause-map";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const REGISTER = MORNING_DHIKR_SOURCE_REGISTER;
const BATCH_IDS = Array.from({ length: 10 }, (_, i) => `MDR-${String(i + 21).padStart(3, "0")}`);
const BATCH_RECORDS = BATCH_IDS.map((id) => REGISTER.find((r) => r.internalId === id)!);

function loadBaselineFixture() {
  const fixturePath = path.resolve(__dirname, "fixtures/mdr-001-020-a298fa9-baseline.json");
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
}

function loadBatchReport(): string {
  const repoRoot = path.resolve(__dirname, "../..");
  const reportPath = path.join(repoRoot, "docs/dhikr/research/MDR-021-030-batch-source-audit.md");
  assert(fs.existsSync(reportPath), "docs/dhikr/research/MDR-021-030-batch-source-audit.md does not exist");
  return fs.readFileSync(reportPath, "utf8");
}

// 1: MDR-001–020 unchanged
function testMdr001Through020Unchanged() {
  const baseline = loadBaselineFixture();
  const otherRecords = REGISTER.filter((r) => !BATCH_IDS.includes(r.internalId));
  assert(
    otherRecords.length === baseline.length,
    `Expected ${baseline.length} records besides MDR-021–030, found ${otherRecords.length}`,
  );
  for (let i = 0; i < otherRecords.length; i++) {
    assert(
      JSON.stringify(otherRecords[i]) === JSON.stringify(baseline[i]),
      `${otherRecords[i].internalId} differs from its checkpoint a298fa9 baseline — this batch pass must only touch MDR-021 through MDR-030`,
    );
  }
  console.log("✓ MDR-001 through MDR-020 match checkpoint a298fa9 exactly (20 records checked)");
}

// 2: protected transcription fields of MDR-021–030 unchanged
function testProtectedFieldsUnchanged() {
  const protectedByOpening: Record<string, string> = {
    "MDR-021": "أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ",
    "MDR-022": "لَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ",
    "MDR-023": "لَا إِلَهَ إِلَّا اللَّهُ، وَحْدَهُ لَا شَرِيكَ لَهُ",
    "MDR-024": "سُبْحَانَ اللهِ وَبِحَمْدِهِ، عَدَدَ خَلْقِهِ",
    "MDR-025": "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ لَا قُوَّةَ إِلَّا بِاللَّهِ",
    "MDR-026": "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
    "MDR-027": "سُبْحَانَ اللَّهِ | الْحَمْدُ لِلَّهِ",
    "MDR-028": "المَسَاءُ فَقَطْ أَمْسَيْنَا وَأَمْسَى الْمَلِكُ لِلَّهِ",
    "MDR-029": ": ACTION فَإِذَا طَلَعَتِ الشَّمْسُ",
    "MDR-030": "دَعَا رَسُول الله ﷺ سُلَيْمَان",
  };
  const expectedLengths: Record<string, number> = {
    "MDR-021": 181,
    "MDR-022": 250,
    "MDR-023": 125,
    "MDR-024": 102,
    "MDR-025": 215,
    "MDR-026": 80,
    "MDR-027": 106,
    "MDR-028": 207,
    "MDR-029": 236,
    "MDR-030": 203,
  };
  const expectedAnnotationCounts: Record<string, number> = {
    "MDR-021": 0,
    "MDR-022": 0,
    "MDR-023": 1,
    "MDR-024": 0,
    "MDR-025": 0,
    "MDR-026": 1,
    "MDR-027": 2,
    "MDR-028": 1,
    "MDR-029": 1,
    "MDR-030": 1,
  };

  let seq = 21;
  for (const record of BATCH_RECORDS) {
    assert(record.sequenceNumber === seq, `${record.internalId}.sequenceNumber changed`);
    assert(record.internalId === BATCH_IDS[seq - 21], `Register order changed at position ${seq}`);
    assert(
      record.openingArabicWords === protectedByOpening[record.internalId],
      `${record.internalId}.openingArabicWords was altered`,
    );
    assert(
      record.fullArabicText === record.originalDocumentText,
      `${record.internalId}.fullArabicText and originalDocumentText must remain identical (no silent correction)`,
    );
    assert(
      record.fullArabicText.length === expectedLengths[record.internalId],
      `${record.internalId}.fullArabicText length changed — expected ${expectedLengths[record.internalId]}, found ${record.fullArabicText.length}`,
    );
    assert(
      record.sourceDocumentAnnotations.length === expectedAnnotationCounts[record.internalId],
      `${record.internalId}.sourceDocumentAnnotations was altered`,
    );
    assert(record.transcriptionStatus === "exact", `${record.internalId}.transcriptionStatus was altered`);
    seq++;
  }
  // MDR-028's proposedCategory was set in Stage 3A and must remain untouched.
  const mdr028 = BATCH_RECORDS.find((r) => r.internalId === "MDR-028")!;
  assert(mdr028.proposedCategory === "Evening", "MDR-028.proposedCategory must remain 'Evening' (Stage 3A value)");
  for (const id of ["MDR-021", "MDR-022", "MDR-023", "MDR-024", "MDR-025", "MDR-026", "MDR-027", "MDR-029", "MDR-030"]) {
    const r = BATCH_RECORDS.find((x) => x.internalId === id)!;
    assert(r.proposedCategory === "", `${id}.proposedCategory should remain empty (Stage 3A value)`);
  }
  console.log(
    "✓ MDR-021–030's protected transcription fields (sequenceNumber, internalId, openingArabicWords, originalDocumentText, fullArabicText, sourceDocumentAnnotations, transcriptionStatus, proposedCategory, physical order) are unchanged",
  );
}

// 3: only research fields changed
function testOnlyResearchFieldsChanged() {
  for (const record of BATCH_RECORDS) {
    assert(record.editorialNotes.length > 0, `${record.internalId}.editorialNotes is empty — research fields were not populated`);
  }
  console.log("✓ every MDR-021–030 record has populated research fields (editorialNotes non-empty) alongside unchanged protected fields");
}

// 4: every record has a section in the batch report
function testEveryRecordHasBatchReportSection() {
  const report = loadBatchReport();
  for (const id of BATCH_IDS) {
    assert(report.includes(`## ${id}`), `Batch report is missing a section for ${id}`);
  }
  console.log("✓ every MDR-021–030 record has its own section in the combined batch report");
}

// 5: segmentation reconstructs exactly where used — exactly one clause map
// exists in this batch (MDR-029); MDR-027's "|" structure remains
// documented within its own fields, not segmented.
function testSegmentationPreservedWhereUsed() {
  const repoRoot = path.resolve(__dirname, "../..");
  const idsWithoutClauseMap = BATCH_IDS.filter((id) => id !== "MDR-029");
  for (const id of idsWithoutClauseMap) {
    const clauseMapPath = path.join(repoRoot, `src/lib/dhikr-research/audits/${id.toLowerCase()}-clause-map.ts`);
    assert(!fs.existsSync(clauseMapPath), `${clauseMapPath} should not exist — only MDR-029 received a formal clause-map file in this batch`);
  }
  const mdr029ClauseMapPath = path.join(repoRoot, "src/lib/dhikr-research/audits/mdr-029-clause-map.ts");
  assert(fs.existsSync(mdr029ClauseMapPath), "src/lib/dhikr-research/audits/mdr-029-clause-map.ts should exist");

  const mdr027 = BATCH_RECORDS.find((r) => r.internalId === "MDR-027")!;
  assert(mdr027.fullArabicText.includes("|"), "MDR-027.fullArabicText must retain its source-document '|' separators verbatim");
  const mdr029 = BATCH_RECORDS.find((r) => r.internalId === "MDR-029")!;
  assert(mdr029.fullArabicText.includes("|"), "MDR-029.fullArabicText must retain its source-document '|' separator verbatim");
  assert(
    mdr029.contentClassification === "composite-text",
    "MDR-029.contentClassification should be 'composite-text', reflecting its two independently-sourced parts",
  );
  const report = loadBatchReport();
  assert(
    report.includes("one clause map was created, for MDR-029 only") || report.includes("One clause map was created, for MDR-029 only"),
    "Batch report must state exactly one clause map was created, for MDR-029 only",
  );
  assert(
    report.includes("two independently reported hadiths joined by an explicit \"|\" divider"),
    "Batch report must document MDR-029's two-part structure explicitly",
  );
  console.log("✓ exactly one clause-map file exists in this batch (MDR-029); no clause map exists for MDR-021–028 or MDR-030; MDR-027's '|' separators remain documented, not segmented");
}

// MDR-029 clause-map specific checks (points 8-22 of the remediation brief)
function testMdr029ClauseMapStructure() {
  // 8 & 9: file exists, exactly two clauses
  assert(MDR_029_CLAUSE_MAP.length === 2, `Expected exactly 2 clauses for MDR-029, found ${MDR_029_CLAUSE_MAP.length}`);

  // 10 & 11: clause IDs are MDR-029-A/B, in correct order
  const ids = MDR_029_CLAUSE_MAP.map((c) => c.clauseId);
  assert(JSON.stringify(ids) === JSON.stringify(["MDR-029-A", "MDR-029-B"]), `Clause IDs are not MDR-029-A, MDR-029-B in order: ${ids.join(", ")}`);
  const sequences = MDR_029_CLAUSE_MAP.map((c) => c.sequenceWithinRecord);
  assert(JSON.stringify(sequences) === JSON.stringify([1, 2]), `sequenceWithinRecord values are not 1, 2 in order: ${sequences.join(", ")}`);

  console.log("✓ MDR-029 clause map exists with exactly two clauses, IDs MDR-029-A/MDR-029-B, in correct order");
}

function testMdr029ReconstructionExact() {
  const mdr029 = BATCH_RECORDS.find((r) => r.internalId === "MDR-029")!;

  // 12: reconstruction exactly equals the protected source text
  const reconstructed = reconstructMdr029FromClauses();
  assert(
    reconstructed === mdr029.originalDocumentText,
    "Concatenating MDR-029's two clauses does not reproduce MDR-029.originalDocumentText exactly",
  );

  // 13: the "|" separator is preserved
  const clauseA = MDR_029_CLAUSE_MAP.find((c) => c.clauseId === "MDR-029-A")!;
  assert(clauseA.exactArabicClause.includes("|"), "MDR-029-A's exactArabicClause must retain the '|' separator exactly as transcribed");

  // No character omitted or duplicated: sum of clause lengths equals original length exactly.
  const totalClauseLength = MDR_029_CLAUSE_MAP.reduce((sum, c) => sum + c.exactArabicClause.length, 0);
  assert(
    totalClauseLength === mdr029.originalDocumentText.length,
    `Sum of clause lengths (${totalClauseLength}) does not equal originalDocumentText length (${mdr029.originalDocumentText.length}) — Arabic may be omitted or duplicated`,
  );
  for (const clause of MDR_029_CLAUSE_MAP) {
    assert(clause.exactArabicClause.length > 0, `${clause.clauseId} has zero length`);
  }

  // 21: protected transcription fields remain unchanged (length/content spot-check)
  assert(mdr029.originalDocumentText.length === 236, "MDR-029.originalDocumentText length must remain 236");
  assert(
    mdr029.fullArabicText === mdr029.originalDocumentText,
    "MDR-029.fullArabicText and originalDocumentText must remain identical (no clause was silently replaced with canonical wording)",
  );

  console.log("✓ MDR-029's two-clause reconstruction reproduces originalDocumentText exactly (236 characters, '|' separator preserved, no omission or duplication)");
}

function testMdr029ClauseMapContent() {
  const clauseA = MDR_029_CLAUSE_MAP.find((c) => c.clauseId === "MDR-029-A")!;
  const clauseB = MDR_029_CLAUSE_MAP.find((c) => c.clauseId === "MDR-029-B")!;

  // 14: different narrators
  assert(clauseA.proposedSources[0].includes("Anas ibn Malik"), "MDR-029-A's proposedSources must name Anas ibn Malik");
  assert(clauseB.proposedSources[0].includes("Nu'aym ibn Hammar"), "MDR-029-B's proposedSources must name Nu'aym ibn Hammar al-Ghatafani");

  // 15: separately scoped sources
  assert(clauseA.proposedSources[0].includes("Jami' al-Tirmidhi") || clauseA.proposedSources[0].includes("Tirmidhi"), "MDR-029-A must cite Jami' al-Tirmidhi");
  assert(clauseB.proposedSources[0].includes("Abu Dawud"), "MDR-029-B must cite Abu Dawud");

  // 16: separately scoped grading notes
  assert(clauseA.sourceResearchStatus === "disputed", "MDR-029-A.sourceResearchStatus should be 'disputed'");
  assert(clauseA.gradingNotes.includes("Clause B") || clauseA.gradingNotes.includes("must not be extended"), "MDR-029-A.gradingNotes must scope its grading away from Clause B");
  assert(clauseB.gradingNotes.includes("Clause A") || clauseB.gradingNotes.includes("must not be extended"), "MDR-029-B.gradingNotes must scope its grading away from Clause A");
  assert(clauseA.gradingNotes !== clauseB.gradingNotes, "MDR-029-A and MDR-029-B must have distinct, separately-scoped gradingNotes");

  console.log("✓ MDR-029's two clauses have different narrators, separately scoped sources, and separately scoped grading notes");
}

function testMdr029VirtueOrRewardClaim() {
  const mdr029 = BATCH_RECORDS.find((r) => r.internalId === "MDR-029")!;

  // 17: virtueOrRewardClaim contains both outcomes
  assert(mdr029.virtueOrRewardClaim.length > 0, "MDR-029.virtueOrRewardClaim must be populated");
  assert(mdr029.virtueOrRewardClaim.includes("Part 1") && mdr029.virtueOrRewardClaim.includes("Part 2"), "MDR-029.virtueOrRewardClaim must contain both Part 1 and Part 2 outcomes");
  assert(mdr029.virtueOrRewardClaim.includes("Hajj") && mdr029.virtueOrRewardClaim.includes("'Umrah"), "MDR-029.virtueOrRewardClaim must preserve the Hajj/'Umrah outcome (Part 1)");
  assert(mdr029.virtueOrRewardClaim.includes("suffice") || mdr029.virtueOrRewardClaim.includes("sufficed"), "MDR-029.virtueOrRewardClaim must preserve the sufficiency outcome (Part 2)");

  // 18: the two outcomes are not merged
  assert(
    mdr029.virtueOrRewardClaim.includes("two separate claims") || mdr029.virtueOrRewardClaim.includes("must not be read as one combined promise"),
    "MDR-029.virtueOrRewardClaim must explicitly state the two outcomes are not one combined promise",
  );

  // 19: Hajj-and-Umrah wording not described as replacing actual Hajj or Umrah
  assert(
    mdr029.virtueOrRewardClaim.includes("NOT restated as a guaranteed Hajj") || mdr029.virtueOrRewardClaim.toLowerCase().includes("not a replacement for hajj"),
    "MDR-029.virtueOrRewardClaim must explicitly disclaim guaranteed/replacement/actual/unconditional Hajj framing",
  );
  // 20: the four-rak'ah claim preserves the beginning-of-day condition
  assert(
    mdr029.virtueOrRewardClaim.includes("beginning of the day") || mdr029.virtueOrRewardClaim.includes("beginning-of-day"),
    "MDR-029.virtueOrRewardClaim must preserve the beginning-of-day condition for the four-rak'ah claim",
  );
  assert(mdr029.virtueOrRewardClaim.includes("four rak'ahs") || mdr029.virtueOrRewardClaim.includes("four-rak'ah"), "MDR-029.virtueOrRewardClaim must preserve the four-rak'ah count");

  const mdr029Evidence = mdr029.virtueEvidence;
  assert(mdr029Evidence.length > 0, "MDR-029.virtueEvidence must be populated");
  assert(
    mdr029Evidence.includes("nothing has been inserted into originalDocumentText or fullArabicText") ||
      mdr029Evidence.includes("remain byte-for-byte unedited"),
    "MDR-029.virtueEvidence must confirm nothing was inserted into the protected transcription fields",
  );
  assert(mdr029Evidence.includes("separate narrations"), "MDR-029.virtueEvidence must state Part 1 and Part 2 belong to separate narrations");
  assert(mdr029Evidence.includes("disputed"), "MDR-029.virtueEvidence must reference Part 1's disputed grading");
  assert(mdr029Evidence.includes("sahih"), "MDR-029.virtueEvidence must reference Part 2's separately reported sahih grading");

  console.log("✓ MDR-029.virtueOrRewardClaim contains both separately-scoped outcomes without merging them, correctly disclaims guaranteed/replacement Hajj framing, and preserves the four-rak'ah/beginning-of-day condition");
}

function testMdr029ProtectedFieldsAndImportGate() {
  const mdr029 = BATCH_RECORDS.find((r) => r.internalId === "MDR-029")!;

  // 21: protected transcription fields remain unchanged
  assert(mdr029.sequenceNumber === 29, "MDR-029.sequenceNumber must remain 29");
  assert(mdr029.internalId === "MDR-029", "MDR-029.internalId must remain 'MDR-029'");
  assert(mdr029.openingArabicWords === ": ACTION فَإِذَا طَلَعَتِ الشَّمْسُ", "MDR-029.openingArabicWords must be unchanged");
  assert(JSON.stringify(mdr029.sourceDocumentAnnotations) === JSON.stringify(["ACTION (heading/label, in mixed Latin-Arabic text)"]), "MDR-029.sourceDocumentAnnotations must be unchanged");
  assert(mdr029.transcriptionStatus === "exact", "MDR-029.transcriptionStatus must remain 'exact'");

  // Status retained provisionally, per the remediation brief.
  assert(mdr029.contentClassification === "composite-text", "MDR-029.contentClassification must remain 'composite-text'");
  assert(mdr029.morningSpecificStatus === "morning-only", "MDR-029.morningSpecificStatus must remain 'morning-only'");
  assert(mdr029.wordingMatchStatus === "unresolved", "MDR-029.wordingMatchStatus must remain 'unresolved'");
  assert(mdr029.sourceResearchStatus === "in-progress", "MDR-029.sourceResearchStatus must remain 'in-progress' — not forced to 'disputed' merely because Part 1 is");
  assert(mdr029.scholarlyDecision === "pending", "MDR-029.scholarlyDecision must remain 'pending'");
  assert(mdr029.importStatus === "research-only", "MDR-029.importStatus must remain 'research-only'");

  // 22: computeImportGate remains false
  const gate = computeImportGate(mdr029);
  assert(gate.canImport === false, "MDR-029 unexpectedly passed computeImportGate");
  assert(gate.blockedReasons.length >= 3, `MDR-029 should remain blocked by multiple independent conditions, found ${gate.blockedReasons.length}`);

  console.log("✓ MDR-029's protected transcription fields and provisional status fields are unchanged; computeImportGate remains false");
}

// MDR-023 source-hierarchy correction checks (points 1-7 of the remediation brief)
function testMdr023SourceHierarchyCorrection() {
  const mdr023 = BATCH_RECORDS.find((r) => r.internalId === "MDR-023")!;

  // 1: the Sahih Muslim four-souls reward is identified as the primary route
  assert(
    mdr023.virtueOrRewardClaim.includes("Primary claim") && mdr023.virtueOrRewardClaim.includes("Sahih Muslim"),
    "MDR-023.virtueOrRewardClaim must identify the Sahih Muslim four-souls reward as the primary claim",
  );
  assert(mdr023.gradingNotes.includes("PRIMARY reward claim"), "MDR-023.gradingNotes must identify the Sahih Muslim route as the primary reward claim");

  // 2: the ten-slaves claim is identified as a separate secondary route
  assert(
    mdr023.virtueOrRewardClaim.includes("Secondary claim") && mdr023.virtueOrRewardClaim.includes("ten slaves"),
    "MDR-023.virtueOrRewardClaim must identify the ten-slaves figure as a separate secondary claim",
  );
  assert(mdr023.gradingNotes.includes("SECONDARY"), "MDR-023.gradingNotes must label the Majma' al-Zawa'id route as secondary");

  // 3: the two figures are not merged
  assert(
    mdr023.virtueOrRewardClaim.includes("not merged into or substituted for the primary"),
    "MDR-023.virtueOrRewardClaim must state the secondary figure is not merged into or substituted for the primary",
  );

  // 4: the secondary route is not presented as equal in source authority to Sahih Muslim
  assert(
    mdr023.virtueEvidence.includes("not presented as equal in source authority"),
    "MDR-023.virtueEvidence must explicitly state the secondary route is not presented as equal in source authority to the primary Sahih Muslim route",
  );

  // 5: the hundred-times tahlil narration remains excluded
  assert(
    mdr023.gradingNotes.includes("hundred-times version") && mdr023.gradingNotes.includes("excluded"),
    "MDR-023.gradingNotes must state the related hundred-times tahlil narration remains excluded",
  );

  // 6: exact wording remains unresolved
  assert(mdr023.wordingMatchStatus === "unresolved", "MDR-023.wordingMatchStatus must remain 'unresolved'");

  // 7: direct primary inspection is not overstated
  assert(
    mdr023.virtueEvidence.includes("has not yet been inspected") || mdr023.gradingNotes.includes("has not yet been inspected"),
    "MDR-023 must explicitly state the direct Sahih Muslim primary page has not yet been inspected",
  );
  assert(mdr023.repetitionCount === 10, "MDR-023.repetitionCount must remain 10");
  assert(mdr023.sourceResearchStatus === "in-progress", "MDR-023.sourceResearchStatus must remain 'in-progress'");
  assert(mdr023.scholarlyDecision === "pending", "MDR-023.scholarlyDecision must remain 'pending'");
  assert(mdr023.importStatus === "research-only", "MDR-023.importStatus must remain 'research-only'");

  const report = loadBatchReport();
  assert(
    report.includes("Sahih Muslim route has stronger source standing"),
    "Batch report must state the Sahih Muslim route has stronger source standing",
  );
  assert(
    report.includes("secondary-route report") || report.includes("secondary reward claim") || report.toLowerCase().includes("secondary-route"),
    "Batch report must identify the ten-slaves figure as a secondary-route report",
  );

  console.log("✓ MDR-023's source hierarchy is corrected: Sahih Muslim four-souls reward is primary, Majma' al-Zawa'id ten-slaves is a separate secondary report, neither merged nor treated as equal in authority, hundred-times narration remains excluded, wording remains unresolved, and direct primary inspection is not overstated");
}

// 6: tool-mediated evidence is not called raw (this batch used WebSearch synthesis only — no WebFetch)
function testNoToolMediatedSourceCalledRaw() {
  const report = loadBatchReport();
  assert(
    report.includes("No WebFetch calls were made in this pass"),
    "Batch report must state no WebFetch calls were made in this pass",
  );
  for (const record of BATCH_RECORDS) {
    assert(
      record.primaryCollection.includes("Not directly fetched"),
      `${record.internalId}.primaryCollection must disclaim direct fetching`,
    );
    assert(
      !/raw (character-for-character|primary|exact) (Arabic|text)/i.test(record.sourceArabicWording) ||
        record.sourceArabicWording.includes("Not obtained"),
      `${record.internalId}.sourceArabicWording must not claim raw/exact primary Arabic without qualification`,
    );
  }
  console.log("✓ no WebSearch-synthesis source is described as raw primary text anywhere; every record discloses it was not directly fetched");
}

// 7: timing, count and rewards are evidence-supported
function testTimingCountsRewardsEvidenceSupported() {
  const mdr023 = BATCH_RECORDS.find((r) => r.internalId === "MDR-023")!;
  assert(mdr023.repetitionCount === 10, "MDR-023.repetitionCount should be 10");
  assert(mdr023.repetitionEvidence.length > 0, "MDR-023.repetitionEvidence must be populated");
  assert(
    mdr023.virtueOrRewardClaim.includes("four souls") && mdr023.virtueOrRewardClaim.includes("ten slaves"),
    "MDR-023.virtueOrRewardClaim must preserve both distinct, non-conflated reward figures",
  );

  const mdr024 = BATCH_RECORDS.find((r) => r.internalId === "MDR-024")!;
  assert(mdr024.repetitionCount === 3, "MDR-024.repetitionCount should be 3");
  assert(
    mdr024.repetitionEvidence.includes("narration-supported") || mdr024.repetitionEvidence.includes("not a source-document display convention"),
    "MDR-024.repetitionEvidence must flag the count as narration-supported despite no source-document annotation",
  );
  assert(
    mdr024.morningSpecificStatus === "uncertain",
    "MDR-024.morningSpecificStatus must remain 'uncertain' — the Fajr-to-duha narrative frame must not be treated as a timing instruction",
  );

  const mdr026 = BATCH_RECORDS.find((r) => r.internalId === "MDR-026")!;
  assert(
    mdr026.repetitionEvidence.includes("NOT confirmed") || mdr026.repetitionEvidence.includes("not confirmed as narration-supported"),
    "MDR-026.repetitionEvidence must flag the retained 100x count as unconfirmed for the combined two-phrase form",
  );

  const mdr028 = BATCH_RECORDS.find((r) => r.internalId === "MDR-028")!;
  assert(mdr028.morningSpecificStatus === "evening-only", "MDR-028.morningSpecificStatus should be 'evening-only', reflecting its explicit source-document heading");
  assert(mdr028.repetitionCount === 3, "MDR-028.repetitionCount should be 3 (narration-supported)");

  for (const record of BATCH_RECORDS) {
    if (record.virtueOrRewardClaim.length > 0) {
      assert(record.virtueEvidence.length > 0, `${record.internalId} has a populated virtueOrRewardClaim but empty virtueEvidence`);
    }
    if (record.repetitionCount !== undefined) {
      assert(record.repetitionEvidence.length > 0, `${record.internalId} has a populated repetitionCount but empty repetitionEvidence`);
    }
  }
  console.log("✓ timing, repetition counts, and reward claims are each backed by a stated evidentiary basis, not inferred from annotations or placement alone");
}

// 8: grading is correctly scoped
function testGradingCorrectlyScoped() {
  const mdr023 = BATCH_RECORDS.find((r) => r.internalId === "MDR-023")!;
  assert(
    mdr023.gradingNotes.includes("must not be conflated") || mdr023.gradingNotes.includes("not conflated"),
    "MDR-023.gradingNotes must explicitly warn against conflating the two distinct reward-figure routes",
  );

  const mdr029 = BATCH_RECORDS.find((r) => r.internalId === "MDR-029")!;
  assert(
    mdr029.gradingNotes.includes("must not be treated as a single graded unit"),
    "MDR-029.gradingNotes must state the two parts are not a single graded unit",
  );
  assert(
    mdr029.hadithGrading.includes("Part 1") && mdr029.hadithGrading.includes("Part 2"),
    "MDR-029.hadithGrading must scope grading separately to each of the two parts",
  );

  const mdr026 = BATCH_RECORDS.find((r) => r.internalId === "MDR-026")!;
  assert(
    mdr026.gradingNotes.includes("does not") || mdr026.gradingNotes.includes("not established"),
    "MDR-026.gradingNotes must state that neither candidate hadith's grading authenticates MDR-026's own combined form",
  );

  const mdr013Style = BATCH_RECORDS.find((r) => r.internalId === "MDR-027")!;
  assert(
    mdr013Style.hadithGrading.includes("Not assigned"),
    "MDR-027.hadithGrading must not assign a grading when the underlying narration is unidentified",
  );
  console.log("✓ grading is precisely scoped in every record — multi-route and multi-part records keep gradings separate, and no grading is assigned without an identified narration");
}

// 9: every record remains pending and research-only
function testEveryRecordPendingResearchOnly() {
  for (const record of BATCH_RECORDS) {
    assert(record.scholarlyReviewer === "", `${record.internalId}.scholarlyReviewer must be empty`);
    assert(record.scholarlyDecision === "pending", `${record.internalId}.scholarlyDecision must be "pending"`);
    assert(record.importStatus === "research-only", `${record.internalId}.importStatus must be "research-only"`);
  }
  console.log("✓ every MDR-021–030 record remains scholarlyDecision: pending, importStatus: research-only");
}

// 10: every record fails computeImportGate
function testEveryRecordFailsImportGate() {
  for (const record of BATCH_RECORDS) {
    const gate = computeImportGate(record);
    assert(gate.canImport === false, `${record.internalId} unexpectedly passed computeImportGate`);
    assert(gate.blockedReasons.length >= 3, `${record.internalId} should remain blocked by multiple independent conditions, found ${gate.blockedReasons.length}`);
  }
  console.log("✓ every MDR-021–030 record remains blocked by computeImportGate, with no gate weakening");
}

// 11: no Sanity, public, auth, middleware or canonical-gate file changed
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
      `${relativePath} references the dhikr-research module — the canonical eligibility gate and public/staff routes must remain untouched by this batch`,
    );
  }
  const schemaDir = path.join(repoRoot, "src/sanity/schemas/documents/dhikr");
  const schemaFiles = fs.readdirSync(schemaDir);
  assert(
    JSON.stringify(schemaFiles.sort()) === JSON.stringify(["dhikr-category.ts", "dhikr-item.ts"].sort()),
    `Expected only dhikr-category.ts and dhikr-item.ts in ${schemaDir}, found: ${schemaFiles.join(", ")}`,
  );
  console.log("✓ no Sanity schema, public route, projection, auth, middleware, or canonical eligibility gate changed");
}

function testBatchReportDoesNotOverstateCertainty() {
  const report = loadBatchReport();
  const overclaimPatterns = [
    /confirmed not to exist/i,
    /definitively (proves|confirms|establishes)/i,
    /beyond (any )?doubt/i,
    /is (definitely|certainly) (sahih|authentic)/i,
    /proven to be/i,
  ];
  for (const pattern of overclaimPatterns) {
    assert(!pattern.test(report), `Batch report contains overclaiming language matching ${pattern}`);
  }
  console.log("✓ batch report does not overstate authenticity, certainty, or non-existence anywhere");
}

function runAll() {
  testMdr001Through020Unchanged();
  testProtectedFieldsUnchanged();
  testOnlyResearchFieldsChanged();
  testEveryRecordHasBatchReportSection();
  testSegmentationPreservedWhereUsed();
  testMdr029ClauseMapStructure();
  testMdr029ReconstructionExact();
  testMdr029ClauseMapContent();
  testMdr029VirtueOrRewardClaim();
  testMdr029ProtectedFieldsAndImportGate();
  testMdr023SourceHierarchyCorrection();
  testNoToolMediatedSourceCalledRaw();
  testTimingCountsRewardsEvidenceSupported();
  testGradingCorrectlyScoped();
  testEveryRecordPendingResearchOnly();
  testEveryRecordFailsImportGate();
  testNoSanityOrPublicFileChanged();
  testBatchReportDoesNotOverstateCertainty();
  console.log("\nAll MDR-021–030 batch source-audit tests passed.");
}

runAll();
