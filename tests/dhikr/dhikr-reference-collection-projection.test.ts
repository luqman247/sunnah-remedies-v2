/**
 * Reference-Collection Projection tests.
 *
 * Covers src/lib/dhikr-research/public-reference-projection.ts — the ONLY
 * module through which any Morning Dhikr Source Register data may reach a
 * public route, for the 28 (currently) records that have not passed either
 * publication pathway. Verifies the projection is structurally incapable
 * of exposing internal notes, reviewer identity, grading/authentication
 * claims, or unsupported virtue text, that it never marks a pending record
 * as reviewed/approved, that protected transcription fields are read but
 * never written, and that the public route wiring (page.tsx +
 * MorningDhikrCollection.tsx) only imports this dedicated chokepoint —
 * never the raw register or its types module.
 *
 * Plain assert()-based, run via `npx tsx`, following the repository's
 * established convention (docs/dhikr/17-test-and-validation-plan.md).
 */

import fs from "node:fs";
import path from "node:path";
import { MORNING_DHIKR_SOURCE_REGISTER } from "../../src/lib/dhikr-research/morning-dhikr-register";
import {
  getPendingReferenceCollection,
  getSourceRegisterTotalCount,
} from "../../src/lib/dhikr-research/public-reference-projection";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const REPO_ROOT = path.resolve(__dirname, "../..");

/** The two currently-published records — kept in sync with the live editorial launch. */
const CURRENTLY_PUBLISHED_IDS = ["MDR-002", "MDR-011"];

/* ── 1. Total register size and coverage ─────────────────────────────── */

function testTotalCountMatchesRegister() {
  assert(getSourceRegisterTotalCount() === 30, "getSourceRegisterTotalCount must report 30");
  assert(MORNING_DHIKR_SOURCE_REGISTER.length === 30, "The live register must contain exactly 30 records");
  console.log("✓ getSourceRegisterTotalCount matches the live register's 30 records");
}

function testAllRecordsRepresentedExactlyOnce() {
  const pending = getPendingReferenceCollection(CURRENTLY_PUBLISHED_IDS);
  assert(pending.length === 28, `Expected exactly 28 pending reference entries, got ${pending.length}`);

  const pendingIds = new Set(pending.map((e) => e.internalId));
  const publishedSet = new Set(CURRENTLY_PUBLISHED_IDS);
  const allRegisterIds = MORNING_DHIKR_SOURCE_REGISTER.map((r) => r.internalId);

  for (const id of allRegisterIds) {
    const inPending = pendingIds.has(id);
    const inPublished = publishedSet.has(id);
    assert(inPending !== inPublished, `${id} must appear in exactly one of {published, pending} — pending=${inPending}, published=${inPublished}`);
  }
  assert(pendingIds.size === 28, "No duplicate internalId in the pending reference collection");
  console.log("✓ all 30 source records are represented exactly once across the published (2) and pending (28) sets");
}

function testExcludingNoIdsReturnsAll30() {
  const all = getPendingReferenceCollection([]);
  assert(all.length === 30, "With no published IDs excluded, the projection must return all 30 records");
  console.log("✓ getPendingReferenceCollection([]) returns all 30 records when nothing is excluded");
}

/* ── 2. The projection is structurally public-safe ───────────────────── */

const ALLOWED_KEYS = new Set([
  "internalId",
  "sequenceNumber",
  "protectedArabicText",
  "documentedSourceReference",
  "knownTiming",
  "knownRepetitionCount",
  "reviewStatus",
]);

function testProjectionExposesOnlyAllowedFields() {
  const pending = getPendingReferenceCollection(CURRENTLY_PUBLISHED_IDS);
  assert(pending.length > 0, "Expected at least one pending entry to check");
  for (const entry of pending) {
    for (const key of Object.keys(entry)) {
      assert(ALLOWED_KEYS.has(key), `Reference-collection entry ${entry.internalId} exposes a disallowed field: ${key}`);
    }
  }
  console.log(`✓ every returned entry (${pending.length} checked) exposes only the allowed public-safe field set`);
}

function testReviewStatusAlwaysPending() {
  const pending = getPendingReferenceCollection(CURRENTLY_PUBLISHED_IDS);
  for (const entry of pending) {
    assert(entry.reviewStatus === "pending", `${entry.internalId}.reviewStatus must be "pending", got "${entry.reviewStatus}"`);
  }
  console.log("✓ every pending reference-collection entry reports reviewStatus \"pending\" — none is marked reviewed/approved");
}

function testProtectedArabicUnchangedAndSourced() {
  const pending = getPendingReferenceCollection(CURRENTLY_PUBLISHED_IDS);
  const byId = new Map(MORNING_DHIKR_SOURCE_REGISTER.map((r) => [r.internalId, r]));
  for (const entry of pending) {
    const record = byId.get(entry.internalId);
    assert(!!record, `${entry.internalId} must exist in the live register`);
    assert(
      entry.protectedArabicText === record!.fullArabicText && entry.protectedArabicText === record!.originalDocumentText,
      `${entry.internalId}: protectedArabicText must equal both fullArabicText and originalDocumentText, unmodified`,
    );
  }
  console.log("✓ every entry's protectedArabicText is the live register's unmodified, protected transcription");
}

function testSourceReferenceOnlyWhenDocumented() {
  const pending = getPendingReferenceCollection(CURRENTLY_PUBLISHED_IDS);
  const byId = new Map(MORNING_DHIKR_SOURCE_REGISTER.map((r) => [r.internalId, r]));
  let checkedDocumented = 0;
  let checkedUndocumented = 0;
  for (const entry of pending) {
    const record = byId.get(entry.internalId)!;
    const isDocumented = record.sourceResearchStatus === "sourced" || record.sourceResearchStatus === "verified";
    if (isDocumented) {
      assert(entry.documentedSourceReference === record.primaryReference, `${entry.internalId}: documentedSourceReference must equal primaryReference when sourceResearchStatus is documented`);
      checkedDocumented++;
    } else {
      assert(entry.documentedSourceReference === undefined, `${entry.internalId}: documentedSourceReference must be undefined when sourceResearchStatus ("${record.sourceResearchStatus}") is not "sourced"/"verified" — caller must show "Source verification pending" instead`);
      checkedUndocumented++;
    }
  }
  assert(checkedDocumented + checkedUndocumented === pending.length, "Every entry must be checked");
  console.log(`✓ documentedSourceReference is present only for genuinely documented sources (${checkedDocumented} documented, ${checkedUndocumented} pending verification)`);
}

function testKnownTimingOmittedWhenUncertain() {
  const pending = getPendingReferenceCollection(CURRENTLY_PUBLISHED_IDS);
  const byId = new Map(MORNING_DHIKR_SOURCE_REGISTER.map((r) => [r.internalId, r]));
  for (const entry of pending) {
    const record = byId.get(entry.internalId)!;
    if (record.morningSpecificStatus === "uncertain") {
      assert(entry.knownTiming === undefined, `${entry.internalId}: knownTiming must be undefined when morningSpecificStatus is "uncertain"`);
    } else {
      assert(entry.knownTiming === record.morningSpecificStatus, `${entry.internalId}: knownTiming must mirror a resolved morningSpecificStatus`);
    }
  }
  console.log("✓ knownTiming is never presented as resolved when the underlying classification is uncertain");
}

/* ── 3. The public route only imports the dedicated chokepoints ─────── */

function testPublicRouteNeverImportsRawRegisterOrTypes() {
  const files = [
    path.join(REPO_ROOT, "src/app/[locale]/knowledge/dhikr/morning/page.tsx"),
    path.join(REPO_ROOT, "src/app/[locale]/knowledge/dhikr/morning/MorningDhikrCollection.tsx"),
  ];
  for (const file of files) {
    const source = fs.readFileSync(file, "utf8");
    assert(
      !/from\s+["'][^"']*morning-dhikr-register["']/.test(source),
      `${path.basename(file)} must not import the raw research register directly — only public-reference-projection.ts may do that`,
    );
    assert(
      !/from\s+["'][^"']*dhikr-research\/types["']/.test(source),
      `${path.basename(file)} must not import dhikr-research/types directly`,
    );
  }
  console.log("✓ [static check] the public route imports research-derived data only through public-reference-projection.ts / dhikr-public-fetch.ts");
}

/* ── 4. UI wiring and copy ────────────────────────────────────────────── */

function testUiRendersReferenceSectionSafely() {
  const source = fs.readFileSync(
    path.join(REPO_ROOT, "src/app/[locale]/knowledge/dhikr/morning/MorningDhikrCollection.tsx"),
    "utf8",
  );
  assert(source.includes('t("reviewPendingBadge")'), "Every reference-collection card must render the review-pending badge");
  assert(source.includes('t("translationUnderReview")'), "Reference-collection cards must render the translation-under-review label, never an invented translation");
  assert(source.includes("entry.documentedSourceReference ?? t(\"sourceVerificationPending\")"), "Reference-collection cards must show 'Source verification pending' whenever no documented source reference exists");
  assert(source.includes('t("sectionReferenceHeading")'), "The reference-collection section heading must be rendered");
  assert(!source.includes("entry.knownRepetitionCount}"), "A raw repetition count must never be rendered without the unverified-repetition label wrapper");
  console.log("✓ [static check] the reference-collection UI never invents a translation, never claims an undocumented source, and always shows the review-pending badge");
}

function testExactRequiredCopy() {
  const en = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, "src/messages/en.json"), "utf8"));
  const m = en.dhikrMorning;
  assert(m.sectionReferenceHeading === "Reference collection — scholarly and editorial review pending", "sectionReferenceHeading must match the exact required label");
  assert(m.sourceVerificationPending === "Source verification pending", "sourceVerificationPending must match the exact required text");
  assert(m.translationUnderReview === "Translation under review.", "translationUnderReview must match the exact required text");
  assert(m.reviewPendingBadge === "Review pending", "reviewPendingBadge must match the exact required text");
  assert(m.progressIndicator === "{reviewed} of {total} entries editorially reviewed.", "progressIndicator must match the required format");

  const da = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, "src/messages/da.json"), "utf8"));
  for (const key of ["sectionReferenceHeading", "referenceCollectionNotice", "reviewPendingBadge", "sourceVerificationPending", "translationUnderReview", "progressIndicator"]) {
    assert(typeof da.dhikrMorning[key] === "string" && da.dhikrMorning[key].length > 0, `Danish dhikrMorning.${key} must exist and be non-empty`);
  }
  console.log("✓ [static check] the required Section 2 copy matches the specified wording exactly, with Danish equivalents present");
}

function testNoOverclaimingPhrasesInNewCopy() {
  const en = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, "src/messages/en.json"), "utf8"));
  const text = JSON.stringify(en.dhikrMorning).toLowerCase();
  const forbidden = ["scholarly approved", "verified by scholars", "fully verified"];
  for (const phrase of forbidden) {
    assert(!text.includes(phrase), `Forbidden phrase "${phrase}" must not appear anywhere in dhikrMorning copy (including the new reference-collection keys)`);
  }
  assert(!/\bauthenticated\b/.test(text), 'The bare word "authenticated" must not appear as a positive claim anywhere in dhikrMorning copy');
  console.log("✓ the new reference-collection copy contains none of the forbidden overclaiming phrases");
}

async function runAll() {
  testTotalCountMatchesRegister();
  testAllRecordsRepresentedExactlyOnce();
  testExcludingNoIdsReturnsAll30();
  testProjectionExposesOnlyAllowedFields();
  testReviewStatusAlwaysPending();
  testProtectedArabicUnchangedAndSourced();
  testSourceReferenceOnlyWhenDocumented();
  testKnownTimingOmittedWhenUncertain();
  testPublicRouteNeverImportsRawRegisterOrTypes();
  testUiRendersReferenceSectionSafely();
  testExactRequiredCopy();
  testNoOverclaimingPhrasesInNewCopy();
  console.log("\nAll reference-collection projection tests passed.");
}

runAll();
