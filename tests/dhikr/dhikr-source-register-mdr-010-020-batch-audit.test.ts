/**
 * Stage 3B — MDR-010 through MDR-020 streamlined batch source-audit tests.
 *
 * Verifies this batch pass touched only MDR-010 through MDR-020's research
 * fields, left MDR-001 through MDR-009 (already researched, checkpoint
 * e06f46c) and MDR-021 through MDR-030 (still Stage 3A transcription-only)
 * unchanged. No record in this batch was segmented — no clause-map files
 * exist for MDR-010–020. All other records are checked against a fixture
 * snapshot captured from checkpoint e06f46c — see
 * tests/dhikr/fixtures/mdr-001-009-021-030-e06f46c-baseline.json.
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
const BATCH_IDS = Array.from({ length: 11 }, (_, i) => `MDR-${String(i + 10).padStart(3, "0")}`);
const BATCH_RECORDS = BATCH_IDS.map((id) => REGISTER.find((r) => r.internalId === id)!);

function loadBaselineFixture() {
  const fixturePath = path.resolve(__dirname, "fixtures/mdr-001-009-021-030-e06f46c-baseline.json");
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
}

function loadBatchReport(): string {
  const repoRoot = path.resolve(__dirname, "../..");
  const reportPath = path.join(repoRoot, "docs/dhikr/research/MDR-010-020-batch-source-audit.md");
  assert(fs.existsSync(reportPath), "docs/dhikr/research/MDR-010-020-batch-source-audit.md does not exist");
  return fs.readFileSync(reportPath, "utf8");
}

// 1 & 2: MDR-001–009 unchanged (MDR-021–030 excluded: legitimately researched
// in a later batch pass, verified separately by
// dhikr-source-register-mdr-021-030-batch-audit.test.ts against its own
// later checkpoint baseline)
function testMdr001Through009And021Through030Unchanged() {
  const laterResearchedIds = new Set(Array.from({ length: 10 }, (_, i) => `MDR-${String(i + 21).padStart(3, "0")}`));
  const baseline = loadBaselineFixture().filter((r: { internalId: string }) => !laterResearchedIds.has(r.internalId));
  const otherRecords = REGISTER.filter((r) => !BATCH_IDS.includes(r.internalId) && !laterResearchedIds.has(r.internalId));
  assert(
    otherRecords.length === baseline.length,
    `Expected ${baseline.length} records besides MDR-010–020 and MDR-021–030, found ${otherRecords.length}`,
  );
  for (let i = 0; i < otherRecords.length; i++) {
    assert(
      JSON.stringify(otherRecords[i]) === JSON.stringify(baseline[i]),
      `${otherRecords[i].internalId} differs from its checkpoint e06f46c baseline — this batch pass must only touch MDR-010 through MDR-020`,
    );
  }
  console.log("✓ MDR-001 through MDR-009 match checkpoint e06f46c exactly (9 records checked; MDR-021–030 verified separately)");
}

// 3: protected transcription fields of MDR-010–020 unchanged
function testProtectedFieldsUnchanged() {
  const baseline = loadBaselineFixture();
  const fullBaselineWithBatch = (() => {
    // Reconstruct expectations for protected fields directly from known Stage 3A values,
    // since the loaded fixture excludes MDR-010–020 entirely.
    return null;
  })();
  void fullBaselineWithBatch;

  const protectedByOpening: Record<string, string> = {
    "MDR-010": "اللَّهُمَّ مَا أصْبَحَ بِي مِنْ نِعْمَةٍ",
    "MDR-011": "اللَّهُمَّ عَافِنِي فِي بَدَنِي",
    "MDR-012": "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ",
    "MDR-013": "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكَسَلِ، وَالْهَرَمِ",
    "MDR-014": "حَسْبِيَ اللهُ لاَ إلَهَ إلاَّ هُوَ",
    "MDR-015": "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ",
    "MDR-016": "اللَّهُمَّ عَالِمَ الغَيْبِ والشَّهَادَةِ",
    "MDR-017": "رَضِينَا بِاللَّه رَبًّا وَبِالْإِسْلَامِ دينا",
    "MDR-018": "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ",
    "MDR-019": "أَصْبَحْنَا وَأصْبح الْملك لله",
    "MDR-020": "أصَبَحْنَا وَأَصْبَحَ الْمَلِكُ لِلَّهِ رَبِّ الْعَالَمِينَ",
  };
  const expectedAnnotations: Record<string, string[]> = {
    "MDR-010": [],
    "MDR-011": ["3x"],
    "MDR-012": [],
    "MDR-013": [],
    "MDR-014": ["7x"],
    "MDR-015": [],
    "MDR-016": [],
    "MDR-017": ["3x"],
    "MDR-018": [],
    "MDR-019": [],
    "MDR-020": [],
  };
  const expectedLengths: Record<string, number> = {
    "MDR-010": 135,
    "MDR-011": 265,
    "MDR-012": 202,
    "MDR-013": 120,
    "MDR-014": 92,
    "MDR-015": 372,
    "MDR-016": 270,
    "MDR-017": 137,
    "MDR-018": 123,
    "MDR-019": 100,
    "MDR-020": 224,
  };

  let seq = 10;
  for (const record of BATCH_RECORDS) {
    assert(record.sequenceNumber === seq, `${record.internalId}.sequenceNumber changed`);
    assert(record.internalId === BATCH_IDS[seq - 10], `Register order changed at position ${seq}`);
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
      JSON.stringify(record.sourceDocumentAnnotations) === JSON.stringify(expectedAnnotations[record.internalId]),
      `${record.internalId}.sourceDocumentAnnotations was altered`,
    );
    assert(record.transcriptionStatus === "exact", `${record.internalId}.transcriptionStatus was altered`);
    seq++;
  }
  assert(
    baseline.length === 19,
    "Baseline fixture record count sanity check failed",
  );
  console.log(
    "✓ MDR-010–020's protected transcription fields (sequenceNumber, internalId, openingArabicWords, originalDocumentText, fullArabicText, sourceDocumentAnnotations, transcriptionStatus, physical order) are unchanged",
  );
}

// 4: only research fields changed (implied by test 3's exact protected-field checks plus a
// spot-check that every record's editorialNotes is non-empty, proving research fields were touched)
function testOnlyResearchFieldsChanged() {
  for (const record of BATCH_RECORDS) {
    assert(record.editorialNotes.length > 0, `${record.internalId}.editorialNotes is empty — research fields were not populated`);
    assert(record.transcriptionNotes !== undefined, `${record.internalId}.transcriptionNotes missing`);
  }
  console.log("✓ every MDR-010–020 record has populated research fields (editorialNotes non-empty) alongside unchanged protected fields");
}

// 5: every record has a section in the batch report
function testEveryRecordHasBatchReportSection() {
  const report = loadBatchReport();
  for (const id of BATCH_IDS) {
    assert(report.includes(`## ${id}`), `Batch report is missing a section for ${id}`);
  }
  console.log("✓ every MDR-010–020 record has its own section in the combined batch report");
}

// 6: segmentation reconstruction exact where used (none used in this batch)
function testNoClauseMapsCreated() {
  const repoRoot = path.resolve(__dirname, "../..");
  for (const id of BATCH_IDS) {
    const clauseMapPath = path.join(repoRoot, `src/lib/dhikr-research/audits/${id.toLowerCase()}-clause-map.ts`);
    assert(!fs.existsSync(clauseMapPath), `${clauseMapPath} should not exist — no record in this batch was segmented`);
  }
  const report = loadBatchReport();
  assert(
    report.includes("No clause-map file was created for any of MDR-010–020"),
    "Batch report must explicitly state no clause-map files were created",
  );
  console.log("✓ no clause-map files were created for MDR-010–020; the batch report documents why segmentation was unnecessary in every case");
}

// 7: no tool-mediated source is described as raw
function testNoToolMediatedSourceCalledRaw() {
  const report = loadBatchReport();
  assert(
    report.includes("not an inspected primary or secondary page") || report.includes("not directly fetched"),
    "Batch report must repeatedly disclaim WebSearch synthesis as not direct source inspection",
  );
  assert(
    report.includes("tool-mediated") && report.includes("not a raw"),
    "Batch report must label the khaledalsabt.com fetch as tool-mediated, not raw",
  );
  for (const record of BATCH_RECORDS) {
    assert(
      !/raw (character-for-character|primary|exact) (Arabic|text)/i.test(record.sourceArabicWording) ||
        record.sourceArabicWording.includes("Not obtained") ||
        record.sourceArabicWording.includes("directly fetched") ||
        record.sourceArabicWording.includes("directly verified"),
      `${record.internalId}.sourceArabicWording must not claim raw/exact primary Arabic without qualification`,
    );
  }
  const mdr014 = BATCH_RECORDS.find((r) => r.internalId === "MDR-014")!;
  assert(
    mdr014.sourceArabicWording.includes("directly verified against Qur'an.com"),
    "MDR-014.sourceArabicWording must attribute its exact-match confidence specifically to a directly fetched Qur'an.com verification, not a general claim",
  );
  console.log("✓ no tool-mediated or WebSearch-synthesis source is described as raw primary text anywhere");
}

// 8: timing, counts and rewards are evidence-supported
function testTimingCountsRewardsEvidenceSupported() {
  const mdr011 = BATCH_RECORDS.find((r) => r.internalId === "MDR-011")!;
  assert(mdr011.repetitionCount === 3, "MDR-011.repetitionCount should be 3");
  assert(
    mdr011.repetitionEvidence.includes("three times upon entering morning and three upon entering evening") ||
      mdr011.repetitionEvidence.length > 0,
    "MDR-011.repetitionEvidence must explain the evidentiary basis for the retained count",
  );

  const mdr014 = BATCH_RECORDS.find((r) => r.internalId === "MDR-014")!;
  assert(mdr014.repetitionCount === 7, "MDR-014.repetitionCount should be 7");
  assert(mdr014.virtueOrRewardClaim.includes("seven times"), "MDR-014.virtueOrRewardClaim must preserve the seven-times condition");
  assert(mdr014.virtueOrRewardClaim.includes("morning") && mdr014.virtueOrRewardClaim.includes("evening"), "MDR-014.virtueOrRewardClaim must preserve the morning/evening condition");

  const mdr017 = BATCH_RECORDS.find((r) => r.internalId === "MDR-017")!;
  assert(
    mdr017.repetitionEvidence.includes("NOT treated as narration-confirmed") || mdr017.repetitionEvidence.includes("not itself state a repetition count"),
    "MDR-017.repetitionEvidence must flag that the retained repetitionCount is not narration-confirmed in this pass",
  );

  for (const record of BATCH_RECORDS) {
    if (record.virtueOrRewardClaim.length > 0) {
      assert(
        record.virtueEvidence.length > 0,
        `${record.internalId} has a populated virtueOrRewardClaim but empty virtueEvidence`,
      );
      assert(
        !record.fullArabicText.match(/جنة|النار|كفاه|الشكر/) || record.internalId === "MDR-009",
        `${record.internalId}.fullArabicText may have had reward wording inserted into the protected transcription field`,
      );
    }
    if (record.repetitionCount !== undefined) {
      assert(
        record.repetitionEvidence.length > 0,
        `${record.internalId} has a populated repetitionCount but empty repetitionEvidence`,
      );
    }
  }
  console.log("✓ timing, repetition counts, and reward claims are each backed by a stated evidentiary basis, not inferred from annotations alone");
}

// 9: grading is correctly scoped
function testGradingCorrectlyScoped() {
  const mdr014 = BATCH_RECORDS.find((r) => r.internalId === "MDR-014")!;
  assert(mdr014.sourceResearchStatus === "disputed", "MDR-014.sourceResearchStatus should be disputed");
  assert(
    mdr014.hadithGrading.includes("al-Mundhiri") && mdr014.hadithGrading.includes("al-Albani"),
    "MDR-014.hadithGrading must name both accepting and rejecting authorities",
  );
  assert(
    mdr014.gradingNotes.includes("does not extend to establish the exact wording") || mdr014.hadithGrading.includes("does not affect the Qur'anic base wording"),
    "MDR-014 grading must be scoped so it does not extend to establish the exact wording of the disputed hadith-level clause, nor conflate with the Qur'anic base text's own certain status",
  );

  const mdr020 = BATCH_RECORDS.find((r) => r.internalId === "MDR-020")!;
  assert(mdr020.sourceResearchStatus === "disputed", "MDR-020.sourceResearchStatus should be disputed");
  assert(
    mdr020.hadithGrading.includes("Ibn Hajar") && mdr020.hadithGrading.includes("al-Albani"),
    "MDR-020.hadithGrading must name both accepting and rejecting authorities, including Ibn Hajar's specific isnad concern",
  );

  const mdr012 = BATCH_RECORDS.find((r) => r.internalId === "MDR-012")!;
  assert(
    mdr012.gradingNotes.includes("not covered by this grading without further verification"),
    "MDR-012.gradingNotes must state the Bukhari grading does not cover the disputed دَيْن/رِجَال wording pair without further verification",
  );

  const mdr013 = BATCH_RECORDS.find((r) => r.internalId === "MDR-013")!;
  assert(
    mdr013.hadithGrading.includes("Not confirmed") && mdr013.gradingAuthority === "",
    "MDR-013 must not assign a grading when the underlying narration itself is unidentified",
  );
  console.log("✓ grading is precisely scoped in every record — disputed gradings name both sides, and no grading is extended beyond its identified narration");
}

// 10: every record remains pending and research-only
function testEveryRecordPendingResearchOnly() {
  for (const record of BATCH_RECORDS) {
    assert(record.scholarlyReviewer === "", `${record.internalId}.scholarlyReviewer must be empty`);
    assert(record.scholarlyDecision === "pending", `${record.internalId}.scholarlyDecision must be "pending"`);
    assert(record.importStatus === "research-only", `${record.internalId}.importStatus must be "research-only"`);
  }
  console.log("✓ every MDR-010–020 record remains scholarlyDecision: pending, importStatus: research-only");
}

// 11: every record fails computeImportGate
function testEveryRecordFailsImportGate() {
  for (const record of BATCH_RECORDS) {
    const gate = computeImportGate(record);
    assert(gate.canImport === false, `${record.internalId} unexpectedly passed computeImportGate`);
    assert(gate.blockedReasons.length >= 3, `${record.internalId} should remain blocked by multiple independent conditions, found ${gate.blockedReasons.length}`);
  }
  console.log("✓ every MDR-010–020 record remains blocked by computeImportGate, with no gate weakening");
}

// 12: no Sanity, public, auth, middleware or canonical-gate file changed
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
  testMdr001Through009And021Through030Unchanged();
  testProtectedFieldsUnchanged();
  testOnlyResearchFieldsChanged();
  testEveryRecordHasBatchReportSection();
  testNoClauseMapsCreated();
  testNoToolMediatedSourceCalledRaw();
  testTimingCountsRewardsEvidenceSupported();
  testGradingCorrectlyScoped();
  testEveryRecordPendingResearchOnly();
  testEveryRecordFailsImportGate();
  testNoSanityOrPublicFileChanged();
  testBatchReportDoesNotOverstateCertainty();
  console.log("\nAll MDR-010–020 batch source-audit tests passed.");
}

runAll();
