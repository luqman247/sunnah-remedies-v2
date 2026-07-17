/**
 * Editorial-Publication Model tests.
 *
 * Covers the transparent-editorial launch pathway: a SEPARATE, additive
 * publication route (computeEditorialPublicationGate,
 * publicationReviewStatus, DHIKR_EDITORIAL_ELIGIBILITY_GROQ) that never
 * touches or weakens the existing scholarly-approval pathway
 * (computeImportGate, DHIKR_ELIGIBILITY_GROQ — both provably unchanged
 * elsewhere, see tests/dhikr/dhikr-schema-organisation.test.ts). Nothing in
 * this test file, or in the code it tests, ever sets scholarlyDecision to
 * "approved" or invents a scholar's name.
 *
 * Plain assert()-based, run via `npx tsx`, following the repository's
 * established convention (docs/dhikr/17-test-and-validation-plan.md).
 */

import fs from "node:fs";
import path from "node:path";
import { MORNING_DHIKR_SOURCE_REGISTER } from "../../src/lib/dhikr-research/morning-dhikr-register";
import { computeEditorialPublicationGate, COMPOSITE_RECORD_IDS_WITH_CLAUSE_MAPS } from "../../src/lib/dhikr-research/validation";
import type { DhikrSourceResearchRecord } from "../../src/lib/dhikr-research/types";
import { DHIKR_EDITORIAL_ELIGIBILITY_GROQ, isDhikrItemEditoriallyPubliclyEligible } from "../../src/sanity/lib/dhikr-publication-gate";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const REPO_ROOT = path.resolve(__dirname, "../..");

/* ── Isolated test fixture — never part of the live register ─────────── */

function makeCompleteEditorialFixture(overrides: Partial<DhikrSourceResearchRecord> = {}): DhikrSourceResearchRecord {
  const base: DhikrSourceResearchRecord = {
    sequenceNumber: 999,
    internalId: "MDR-TEST-999",
    openingArabicWords: "test",
    fullArabicText: "نَصّ تجريبي",
    originalDocumentText: "نَصّ تجريبي",
    sourceDocumentAnnotations: [],
    transcriptionStatus: "exact",
    transcriptionNotes: "",
    proposedCategory: "",
    contentClassification: "prophetic-morning-dhikr",
    morningSpecificStatus: "morning-only",
    sourceResearchStatus: "sourced",
    primaryCollection: "Test Collection",
    primaryReference: "Test 1:1",
    secondaryReferences: [],
    narrator: "Test Narrator",
    sourceArabicWording: "نَصّ تجريبي",
    wordingMatchStatus: "exact-match",
    hadithGrading: "sahih",
    gradingAuthority: "Test Authority",
    gradingNotes: "",
    repetitionEvidence: "",
    virtueOrRewardClaim: "",
    virtueEvidence: "",
    sourceUrls: [],
    usulAiResearchNotes: "",
    scholarlyReviewer: "",
    scholarlyReviewerQualification: "",
    scholarlyReviewDate: "",
    scholarlyDecision: "pending",
    scholarlyNotes: "",
    approvedArabicText: "نَصّ تجريبي",
    approvedEnglishText: "Test approved English text",
    approvedSourceReference: "Test 1:1, Test Collection",
    approvedTiming: "morning-only",
    approvedVirtueText: "",
    editorialReviewer: "Test Editor",
    editorialApproval: "approved",
    editorialApprovalDate: "2026-01-02",
    publicationReviewStatus: "editorially-published-pending-scholarly-review",
    editorialNotes: "",
    importStatus: "research-only",
  };
  return { ...base, ...overrides };
}

/* ── 1. No record is falsely marked scholar-approved ────────────────── */

function testNoLiveRecordFalselyMarkedScholarApproved() {
  for (const record of MORNING_DHIKR_SOURCE_REGISTER) {
    assert(record.scholarlyDecision === "pending", `${record.internalId}.scholarlyDecision must remain "pending", found "${record.scholarlyDecision}"`);
    assert(record.scholarlyReviewer === "", `${record.internalId}.scholarlyReviewer must remain empty — no scholar's name may be assigned`);
  }
  console.log("✓ no live record is falsely marked scholar-approved; no scholar's name is assigned anywhere");
}

function testEditorialGateNeverAcceptsARealScholarlyDecision() {
  const gate = computeEditorialPublicationGate(makeCompleteEditorialFixture({ scholarlyDecision: "approved" }));
  assert(gate.canImport === false, "The editorial-publication gate must refuse a record whose scholarlyDecision is already a real approval — that record belongs on the scholarly pathway, not this one");
  assert(gate.blockedReasons.some((r) => /scholarlyDecision is "approved"/i.test(r)), "Expected an explicit blocker naming the unexpected scholarlyDecision value");
  console.log("✓ the editorial-publication gate refuses records that already carry a real scholarly decision, rather than silently accepting or overwriting it");
}

function testEditorialGateNeverGrantsScholarlyApproval() {
  const gate = computeEditorialPublicationGate(makeCompleteEditorialFixture());
  assert(gate.canImport === true, `Complete editorial fixture unexpectedly blocked: ${gate.blockedReasons.join(" | ")}`);
  // Passing this gate must never be interpreted as, or converted into, scholarlyDecision: "approved".
  const gateSource = fs.readFileSync(path.join(REPO_ROOT, "src/lib/dhikr-research/validation.ts"), "utf8");
  assert(
    !/\.scholarlyDecision\s*=(?!=)/.test(gateSource),
    "validation.ts must never assign scholarlyDecision anywhere (only ===/!== comparisons are allowed) — it only ever reads it",
  );
  console.log("✓ a passing editorial-publication gate result never grants or implies scholarly approval");
}

/* ── 2. Disputed/composite records remain private ───────────────────── */

function testDisputedRecordsRemainPrivate() {
  const gate = computeEditorialPublicationGate(makeCompleteEditorialFixture({ sourceResearchStatus: "disputed" }));
  assert(gate.canImport === false, "A disputed record must never pass the editorial-publication gate");
  assert(gate.blockedReasons.some((r) => /disputed/i.test(r)), "Expected an explicit disputed-record blocker");
  console.log("✓ disputed records are blocked from editorial publication");
}

function testCompositeRecordsRemainPrivate() {
  assert(COMPOSITE_RECORD_IDS_WITH_CLAUSE_MAPS.length > 0, "Expected at least one known composite record ID");
  for (const compositeId of [...COMPOSITE_RECORD_IDS_WITH_CLAUSE_MAPS, "MDR-001"]) {
    const gate = computeEditorialPublicationGate(makeCompleteEditorialFixture({ internalId: compositeId }));
    assert(gate.canImport === false, `Composite record ${compositeId} must never pass the editorial-publication gate`);
    assert(gate.blockedReasons.some((r) => /composite/i.test(r)), `Expected an explicit composite-record blocker for ${compositeId}`);
  }
  console.log("✓ all known composite records (including the MDR-001 special case) are blocked from editorial publication");
}

function testAllLiveDisputedAndCompositeRecordsCurrentlyBlocked() {
  const compositeIds = new Set([...COMPOSITE_RECORD_IDS_WITH_CLAUSE_MAPS, "MDR-001"]);
  let checked = 0;
  for (const record of MORNING_DHIKR_SOURCE_REGISTER) {
    if (record.sourceResearchStatus !== "disputed" && !compositeIds.has(record.internalId)) continue;
    checked++;
    const gate = computeEditorialPublicationGate(record);
    assert(gate.canImport === false, `Live record ${record.internalId} (disputed or composite) unexpectedly passes the editorial-publication gate`);
  }
  assert(checked > 0, "Expected at least one live disputed or composite record to check");
  console.log(`✓ every live disputed/composite record (${checked} checked) remains blocked from editorial publication`);
}

/* ── 3. The public notice is visible ─────────────────────────────────── */

function testPublicNoticeRenderedWhenEditorialItemsPresent() {
  // The Editorially-reviewed section's rendering (including this notice)
  // lives in MorningDhikrCollection.tsx, a client component rendered by
  // page.tsx — see that file's module docblock for why.
  const pageSource = fs.readFileSync(
    path.join(REPO_ROOT, "src/app/[locale]/knowledge/dhikr/morning/MorningDhikrCollection.tsx"),
    "utf8",
  );
  assert(
    pageSource.includes('publicationPathway === "editorial-pending-scholarly-review"') && pageSource.includes('t("editorialNotice")'),
    "The Morning Dhikr page must render the editorial notice whenever any visible item took the editorial-only pathway",
  );

  const en = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, "src/messages/en.json"), "utf8"));
  const expectedNotice =
    "Editorial review status: These entries have been prepared from documented sources and are awaiting independent scholarly verification. They should not be treated as a formal fatwa or definitive hadith-authentication ruling.";
  assert(en.dhikrMorning.editorialNotice === expectedNotice, "The editorial notice text must match the exact required wording");

  const da = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, "src/messages/da.json"), "utf8"));
  assert(typeof da.dhikrMorning.editorialNotice === "string" && da.dhikrMorning.editorialNotice.length > 0, "A Danish editorial notice translation must exist");

  console.log("✓ [static check] the public notice is rendered above the list whenever an editorially-published item is present, with the exact required wording");
}

function testForbiddenPhrasesNotUsed() {
  const en = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, "src/messages/en.json"), "utf8"));
  const dhikrMorningText = JSON.stringify(en.dhikrMorning).toLowerCase();
  const forbidden = ["scholarly approved", "verified by scholars", "fully verified"];
  for (const phrase of forbidden) {
    assert(!dhikrMorningText.includes(phrase), `Forbidden phrase "${phrase}" must not appear in dhikrMorning public copy`);
  }
  // "authenticated" is checked separately: it may appear only inside the negated
  // disclaimer ("...not be treated as ... hadith-authentication ruling"), never as
  // a standalone positive claim.
  assert(
    !/\bauthenticated\b/.test(dhikrMorningText),
    'The bare word "authenticated" must not appear as a positive claim in dhikrMorning public copy',
  );
  console.log('✓ none of the forbidden claim phrases ("scholarly approved", "verified by scholars", "authenticated", "fully verified") appear in the public copy');
}

/* ── 4. Unsupported virtue claims are omitted ────────────────────────── */

function testUnsupportedVirtueClaimBlocksEditorialPublication() {
  const gate = computeEditorialPublicationGate(
    makeCompleteEditorialFixture({ approvedVirtueText: "An unsupported virtue claim", virtueEvidence: "" }),
  );
  assert(gate.canImport === false, "An approved virtue text with no supporting evidence must block editorial publication");
  assert(gate.blockedReasons.some((r) => /virtue.*no supporting evidence/i.test(r)), "Expected an explicit unsupported-virtue-claim blocker");
  console.log("✓ an unsupported virtue/reward claim blocks editorial publication rather than being silently published");
}

function testSupportedVirtueClaimDoesNotBlock() {
  const gate = computeEditorialPublicationGate(
    makeCompleteEditorialFixture({ approvedVirtueText: "A supported virtue claim", virtueEvidence: "Sahih al-Bukhari 1, directly inspected" }),
  );
  assert(gate.canImport === true, `A properly evidenced virtue claim should not block editorial publication: ${gate.blockedReasons.join(" | ")}`);
  console.log("✓ a properly evidenced virtue claim does not block editorial publication");
}

function testPublicPageOmitsVirtueTextUnlessPresent() {
  // Reviewed-card rendering (including this conditional) lives in the
  // shared ReviewedDhikrCard.tsx, used by both Morning and Evening — see
  // that file's module docblock.
  const pageSource = fs.readFileSync(
    path.join(REPO_ROOT, "src/components/dhikr/ReviewedDhikrCard.tsx"),
    "utf8",
  );
  assert(pageSource.includes("{item.virtueText &&"), "The public page must only render virtue text when item.virtueText is actually present");
  console.log("✓ [static check] the public page renders virtue text only when present, never a placeholder or default claim");
}

/* ── 5. Pending scholarly review is shown publicly ───────────────────── */

function testPendingScholarlyReviewBadgeShownForEditorialItems() {
  const pageSource = fs.readFileSync(
    path.join(REPO_ROOT, "src/components/dhikr/ReviewedDhikrCard.tsx"),
    "utf8",
  );
  assert(
    pageSource.includes("pendingScholarlyReview") && pageSource.includes('t("pendingScholarlyReviewBadge")'),
    "The public page must render a per-item pending-scholarly-review badge for editorially-published items",
  );
  console.log("✓ [static check] a pending-scholarly-review badge is rendered on every editorially-published card");
}

function testEditorialEligibleItemNeverImpliesScholarlyApproval() {
  const fullyEligibleDoc = {
    editorialPublicationStatus: "editorially-published-pending-scholarly-review",
    arabicText: "test",
    translationEn: "test",
    translationDa: "test",
    sourceReferences: [{ type: "hadith", citation: "test" }],
    boardApprovals: [{ board: "editorial", approved: true }],
  };
  assert(isDhikrItemEditoriallyPubliclyEligible(fullyEligibleDoc) === true, "A fully complete editorial-only document should be editorially eligible");
  assert(
    !DHIKR_EDITORIAL_ELIGIBILITY_GROQ.includes('board == "scholarly"'),
    "DHIKR_EDITORIAL_ELIGIBILITY_GROQ must never filter on a scholarly board approval — this pathway can never require or imply one",
  );
  console.log("✓ the editorial-eligibility rule never requires or implies scholarly board approval");
}

/* ── Scholarly pathway remains completely intact ─────────────────────── */

function testScholarlyPathwayUnaffected() {
  const validationSource = fs.readFileSync(path.join(REPO_ROOT, "src/lib/dhikr-research/validation.ts"), "utf8");
  assert(validationSource.includes("export function computeImportGate"), "computeImportGate must still exist, unmodified in spirit");
  assert(validationSource.includes("export function computeEditorialPublicationGate"), "computeEditorialPublicationGate must exist as a separate function");
  console.log("✓ [static check] the existing scholarly-approval pathway (computeImportGate) remains intact alongside the new editorial pathway");
}

async function runAll() {
  testNoLiveRecordFalselyMarkedScholarApproved();
  testEditorialGateNeverAcceptsARealScholarlyDecision();
  testEditorialGateNeverGrantsScholarlyApproval();
  testDisputedRecordsRemainPrivate();
  testCompositeRecordsRemainPrivate();
  testAllLiveDisputedAndCompositeRecordsCurrentlyBlocked();
  testPublicNoticeRenderedWhenEditorialItemsPresent();
  testForbiddenPhrasesNotUsed();
  testUnsupportedVirtueClaimBlocksEditorialPublication();
  testSupportedVirtueClaimDoesNotBlock();
  testPublicPageOmitsVirtueTextUnlessPresent();
  testPendingScholarlyReviewBadgeShownForEditorialItems();
  testEditorialEligibleItemNeverImpliesScholarlyApproval();
  testScholarlyPathwayUnaffected();
  console.log("\nAll editorial-publication model tests passed.");
}

runAll();
