/**
 * Stage 3B — MDR-001 source-audit tests.
 *
 * Verifies the Stage 3B research pass touched only MDR-001, left every
 * protected transcription field on MDR-001 itself untouched, and did not
 * relax any import-blocking condition beyond what real, cited evidence
 * supports. MDR-002 through MDR-030 are checked against a fixture snapshot
 * captured from the Stage 3A checkpoint commit (309fbdb) — see
 * tests/dhikr/fixtures/mdr-002-030-stage3a-baseline.json.
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
const MDR_001 = REGISTER[0];

function loadBaselineFixture() {
  const fixturePath = path.resolve(__dirname, "fixtures/mdr-002-030-stage3a-baseline.json");
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
}

function testOnlyMdr001Changed() {
  // MDR-002 through MDR-006 are excluded from this comparison: each was
  // legitimately researched in a later stage and is no longer expected to
  // match the pre-research Stage 3A baseline. Those later changes are
  // verified by their own dedicated files (dhikr-source-register-mdr-002-audit.test.ts,
  // dhikr-source-register-mdr-003-audit.test.ts, -mdr-004-audit.test.ts,
  // -mdr-005-audit.test.ts, -mdr-006-audit.test.ts). This file's job is only
  // to confirm MDR-001's own Stage 3B research, and that MDR-007 through
  // MDR-030 (still untouched since Stage 3A) remain exactly as transcribed.
  assert(MDR_001.internalId === "MDR-001", "REGISTER[0] is not MDR-001");
  const excluded = new Set(["MDR-002", "MDR-003", "MDR-004", "MDR-005", "MDR-006"]);
  const baseline = loadBaselineFixture().filter((r: { internalId: string }) => !excluded.has(r.internalId));
  const currentTail = REGISTER.slice(1).filter((r) => !excluded.has(r.internalId));
  assert(
    currentTail.length === baseline.length,
    `Expected ${baseline.length} records after MDR-001 (excluding MDR-002/MDR-003), found ${currentTail.length}`,
  );
  for (let i = 0; i < currentTail.length; i++) {
    assert(
      JSON.stringify(currentTail[i]) === JSON.stringify(baseline[i]),
      `${currentTail[i].internalId} differs from its Stage 3A checkpoint (commit 309fbdb) baseline — this stage must only touch MDR-001`,
    );
  }
  console.log("✓ only MDR-001 changed here; MDR-007 through MDR-030 match the Stage 3A checkpoint exactly (MDR-002 through MDR-006 verified separately)");
}

function testMdr001ProtectedFieldsUnchanged() {
  const expected = {
    sequenceNumber: 1,
    internalId: "MDR-001",
    originalDocumentText: "آيَة ٱلْكُرْسِيّ | ٱلْإِخْلَاص 3x | ٱلْفَلَق 3x| ٱلنَّاس  3x ",
    fullArabicText: "آيَة ٱلْكُرْسِيّ | ٱلْإِخْلَاص 3x | ٱلْفَلَق 3x| ٱلنَّاس  3x ",
    sourceDocumentAnnotations: ["3x (al-Ikhlas)", "3x (al-Falaq)", "3x (an-Nas)"],
    transcriptionStatus: "exact",
  };
  for (const [field, value] of Object.entries(expected)) {
    assert(
      JSON.stringify((MDR_001 as unknown as Record<string, unknown>)[field]) === JSON.stringify(value),
      `MDR-001.${field} was altered by the Stage 3B research pass — transcription fields must remain untouched`,
    );
  }
  assert(MDR_001.transcriptionNotes.length > 0, "MDR-001.transcriptionNotes was unexpectedly cleared");
  console.log(
    "✓ MDR-001's protected transcription fields (sequenceNumber, internalId, originalDocumentText, fullArabicText, sourceDocumentAnnotations, transcriptionStatus, transcriptionNotes) are unchanged",
  );
}

function testMdr001RemainsResearchOnly() {
  assert(
    MDR_001.importStatus === "research-only",
    `MDR-001.importStatus is "${MDR_001.importStatus}", expected "research-only"`,
  );
  console.log("✓ MDR-001 remains research-only");
}

function testMdr001RemainsBlockedByImportGate() {
  const gate = computeImportGate(MDR_001);
  assert(gate.canImport === false, "MDR-001 unexpectedly passed computeImportGate after Stage 3B research");
  assert(gate.blockedReasons.length >= 2, "MDR-001 should remain blocked by multiple independent conditions");
  console.log(`✓ MDR-001 remains blocked by computeImportGate (${gate.blockedReasons.length} reasons)`);
}

function testNoScholarlyApprovalIsClaimed() {
  assert(
    MDR_001.scholarlyDecision === "pending",
    `MDR-001.scholarlyDecision is "${MDR_001.scholarlyDecision}", expected "pending"`,
  );
  assert(MDR_001.scholarlyReviewer === "", "MDR-001.scholarlyReviewer is populated — no reviewer has signed off");
  console.log("✓ no scholarly approval is claimed for MDR-001");
}

function testNoUnsupportedRepetitionOrVirtueClaimBecomesImportReady() {
  // The repetition/virtue evidence conditions may now be individually satisfied
  // (real evidence was found for the three-Quls component), but the record as a
  // whole must still be blocked by other conditions — evidence for one component
  // must never be allowed to silently clear the whole record for import.
  assert(
    MDR_001.repetitionCount !== undefined,
    "MDR-001 should still carry the document-supplied repetitionCount",
  );
  assert(
    MDR_001.repetitionEvidence.trim().length > 0,
    "MDR-001.repetitionEvidence should now cite real evidence found during Stage 3B",
  );
  assert(
    MDR_001.virtueOrRewardClaim.trim().length > 0 && MDR_001.virtueEvidence.trim().length > 0,
    "MDR-001's virtue claim and evidence should be populated together, or not at all",
  );

  const gate = computeImportGate(MDR_001);
  assert(
    gate.canImport === false,
    "MDR-001 became import-ready — populating repetition/virtue evidence for one component must not clear the whole record",
  );
  assert(
    !gate.blockedReasons.some((r) => r.toLowerCase().includes("repetition")),
    "computeImportGate still cites an unresolved repetition-evidence problem even though MDR-001 now has cited repetition evidence for its sourced component",
  );
  assert(
    !gate.blockedReasons.some((r) => r.toLowerCase().includes("virtue")),
    "computeImportGate still cites an unresolved virtue-evidence problem even though MDR-001 now has cited virtue evidence for its sourced component",
  );
  assert(
    gate.blockedReasons.some((r) => r.toLowerCase().includes("wording")),
    "MDR-001's composite wording-match status should still be cited as a blocking reason",
  );
  assert(
    gate.blockedReasons.some((r) => r.toLowerCase().includes("scholarly")),
    "MDR-001's pending scholarly decision should still be cited as a blocking reason",
  );
  console.log(
    "✓ MDR-001's cited repetition/virtue evidence clears only its own specific conditions — the record remains blocked overall by unresolved wording-match and scholarly-approval conditions",
  );
}

function testMdr001WordingMatchStatusReflectsCompositeNature() {
  assert(
    MDR_001.wordingMatchStatus === "composite-of-multiple-sources",
    `MDR-001.wordingMatchStatus is "${MDR_001.wordingMatchStatus}", expected "composite-of-multiple-sources"`,
  );
  console.log("✓ MDR-001.wordingMatchStatus correctly reflects its composite, multi-source nature");
}

function testMdr001DoesNotAssertASingleCitationForTheWholeEntry() {
  assert(
    MDR_001.hadithGrading === "",
    "MDR-001.hadithGrading is populated at the record level — a composite entry with two differently-graded components must not assert one grading",
  );
  assert(
    MDR_001.primaryReference.toLowerCase().includes("three-quls component only") ||
      MDR_001.primaryReference.toLowerCase().includes("three quls component only"),
    "MDR-001.primaryReference should explicitly scope itself to the three-Quls component, not the whole entry",
  );
  assert(
    MDR_001.secondaryReferences.length > 0,
    "MDR-001.secondaryReferences should document the separately-sourced Ayat al-Kursi component",
  );
  console.log("✓ MDR-001 does not merge its two independently-sourced components into a false single citation");
}

function testNoPublicRouteProjectionOrCanonicalGateChanges() {
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
  console.log("✓ no public route, projection, canonical eligibility gate, or Sanity schema changed");
}

function loadAuditReport(): string {
  const repoRoot = path.resolve(__dirname, "../..");
  const reportPath = path.join(repoRoot, "docs/dhikr/research/MDR-001-source-audit.md");
  assert(fs.existsSync(reportPath), "docs/dhikr/research/MDR-001-source-audit.md does not exist");
  return fs.readFileSync(reportPath, "utf8");
}

function testMdr001IsNotMarkedVerified() {
  assert(
    MDR_001.sourceResearchStatus !== "verified",
    `MDR-001.sourceResearchStatus must not be "verified" until manual primary-source verification is complete; found "${MDR_001.sourceResearchStatus}"`,
  );
  assert(
    MDR_001.sourceResearchStatus === "scholarly-review-required",
    `MDR-001.sourceResearchStatus is "${MDR_001.sourceResearchStatus}", expected "scholarly-review-required"`,
  );
  console.log('✓ MDR-001.sourceResearchStatus is "scholarly-review-required", not "verified"');
}

function testSourceArabicWordingRemainsEmpty() {
  assert(
    MDR_001.sourceArabicWording === "",
    "MDR-001.sourceArabicWording must remain empty until each component's Arabic source text has been directly inspected",
  );
  console.log("✓ MDR-001.sourceArabicWording remains empty pending direct inspection");
}

function testRecordLevelGradingRemainsEmpty() {
  assert(MDR_001.hadithGrading === "", "MDR-001.hadithGrading must remain empty at the record level");
  assert(MDR_001.gradingAuthority === "", "MDR-001.gradingAuthority must remain empty at the record level");
  console.log("✓ MDR-001's record-level hadithGrading and gradingAuthority remain empty");
}

function testAuditReportContainsManualVerificationChecklist() {
  const report = loadAuditReport();
  assert(
    report.includes("## Manual primary-source verification required"),
    'Audit report is missing the "Manual primary-source verification required" section',
  );
  const requiredChecklistFragments = [
    "Open Abu Dawud 5082 directly",
    "Open Tirmidhi 3575 directly",
    "Open Tirmidhi 2879 directly",
    "Verify the Ibn al-Sunni citation",
    "Open Bukhari 5010 directly",
    "Verify Qur'anic text against Quran.com",
    "Obtain scholarly judgment on whether MDR-001",
    "Verify that no repetition count has been transferred",
  ];
  for (const fragment of requiredChecklistFragments) {
    assert(report.includes(fragment), `Audit report's manual-verification checklist is missing: "${fragment}"`);
  }
  console.log("✓ audit report contains the full manual primary-source verification checklist");
}

function testAuditReportUsesNotLocatedLanguageNotAbsoluteNonExistence() {
  const report = loadAuditReport();
  assert(
    report.includes("No single narration containing the full combined MDR-001 entry was located"),
    "Audit report should state the finding as 'not located', not as absolute non-existence",
  );
  assert(
    report.includes("The evidence located supports the components separately, not the combined entry as one narration"),
    "Audit report is missing the required scoped-evidence statement",
  );
  const overclaimPatterns = [/confirmed not to exist/i, /does not exist as one (single )?narration/i];
  for (const pattern of overclaimPatterns) {
    assert(
      !pattern.test(report),
      `Audit report contains overclaiming certainty language matching ${pattern} — exhaustive non-existence must not be asserted`,
    );
  }
  assert(
    !report.includes("Research complete for this record only"),
    'Audit report must not claim "Research complete" — use "Research partially complete — primary-text verification outstanding"',
  );
  assert(
    report.includes("Research partially complete — primary-text verification outstanding"),
    "Audit report is missing the required partial-completion status line",
  );
  console.log('✓ audit report uses "not located" framing and the correct partial-completion status, with no absolute non-existence claims');
}

function testMorningDhikrRegisterSourceFileUsesScopedCertaintyLanguage() {
  const repoRoot = path.resolve(__dirname, "../..");
  const registerSource = fs.readFileSync(
    path.join(repoRoot, "src/lib/dhikr-research/morning-dhikr-register.ts"),
    "utf8",
  );
  const overclaimPatterns = [/confirmed not to exist/i, /does not exist as one (single )?narration/i];
  for (const pattern of overclaimPatterns) {
    assert(
      !pattern.test(registerSource),
      `morning-dhikr-register.ts contains overclaiming certainty language matching ${pattern}`,
    );
  }
  assert(
    registerSource.includes("No single narration containing the full combined MDR-001 entry was located"),
    "morning-dhikr-register.ts's editorialNotes should use the required 'not located' framing",
  );
  console.log("✓ morning-dhikr-register.ts uses scoped, non-overclaiming certainty language");
}

function runAll() {
  testOnlyMdr001Changed();
  testMdr001ProtectedFieldsUnchanged();
  testMdr001RemainsResearchOnly();
  testMdr001RemainsBlockedByImportGate();
  testNoScholarlyApprovalIsClaimed();
  testNoUnsupportedRepetitionOrVirtueClaimBecomesImportReady();
  testMdr001WordingMatchStatusReflectsCompositeNature();
  testMdr001DoesNotAssertASingleCitationForTheWholeEntry();
  testNoPublicRouteProjectionOrCanonicalGateChanges();
  testMdr001IsNotMarkedVerified();
  testSourceArabicWordingRemainsEmpty();
  testRecordLevelGradingRemainsEmpty();
  testAuditReportContainsManualVerificationChecklist();
  testAuditReportUsesNotLocatedLanguageNotAbsoluteNonExistence();
  testMorningDhikrRegisterSourceFileUsesScopedCertaintyLanguage();
  console.log("\nAll MDR-001 source-audit tests passed.");
}

runAll();
