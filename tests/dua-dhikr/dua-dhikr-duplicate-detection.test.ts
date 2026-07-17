/**
 * Duʿa & Dhikr — duplicate/near-duplicate detection tests.
 *
 * Fixture-only data throughout (clearly-labelled placeholder Arabic/English,
 * never real duʿās) — see docs/dua-dhikr/SOURCE_POLICY.md, "What shipped in
 * this phase". No Sanity access.
 */

import { normalizeArabicForComparison, findDuplicateCandidates } from "../../src/lib/dua-dhikr/import/duplicate-detection";
import type { DuaDhikrImportRow } from "../../src/lib/dua-dhikr/import/schema";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

function fixtureRow(overrides: Partial<DuaDhikrImportRow>): DuaDhikrImportRow {
  return {
    importIdentifier: "FIXTURE-BASE",
    collectionSlug: "food-and-drink",
    titleEn: "[FIXTURE] Base entry",
    arabicText: "[ARABIC FIXTURE — NOT RELIGIOUS CONTENT] تَجْرِبَة أَسَاسِيَّة",
    translationEn: "[TRANSLATION FIXTURE]",
    references: [{ type: "other", citation: "[SOURCE FIXTURE] Reference A" }],
    ...overrides,
  };
}

function testNormalizeStripsTashkilAndWhitespace() {
  const withTashkil = "تَجْرِبَة س";
  const withoutTashkil = "تجربة س";
  const extraWhitespace = "تجربة   س";
  assert(
    normalizeArabicForComparison(withTashkil) === normalizeArabicForComparison(withoutTashkil),
    "normalizeArabicForComparison must treat identical text with/without tashkīl as equal",
  );
  assert(
    normalizeArabicForComparison(withoutTashkil) === normalizeArabicForComparison(extraWhitespace),
    "normalizeArabicForComparison must treat differing whitespace as equal",
  );
  console.log("✓ normalizeArabicForComparison strips tashkīl and normalises whitespace");
}

function testSameArabicDifferentWhitespaceIsDuplicate() {
  const rows = [
    fixtureRow({ importIdentifier: "FIXTURE-A", arabicText: "تجربة نموذج مكرر" }),
    fixtureRow({ importIdentifier: "FIXTURE-B", arabicText: "تجربة  نموذج   مكرر" }),
  ];
  const groups = findDuplicateCandidates(rows);
  assert(
    groups.some((g) => g.reason === "same-arabic-normalized" && g.rowIndices.length === 2),
    "identical Arabic differing only in whitespace must be flagged as a duplicate candidate",
  );
  console.log("✓ same Arabic, different whitespace → flagged as duplicate candidate");
}

function testSameArabicDifferentTashkilIsDuplicate() {
  const rows = [
    fixtureRow({ importIdentifier: "FIXTURE-A", arabicText: "تَجْرِبَة" }),
    fixtureRow({ importIdentifier: "FIXTURE-B", arabicText: "تجربة" }),
  ];
  const groups = findDuplicateCandidates(rows);
  assert(
    groups.some((g) => g.reason === "same-arabic-normalized"),
    "identical Arabic differing only in tashkīl must be flagged as a duplicate candidate",
  );
  console.log("✓ same Arabic, different tashkīl → flagged as duplicate candidate");
}

function testSameEntryInTwoCollectionsIsAdvisoryNotError() {
  const rows = [
    fixtureRow({ importIdentifier: "FIXTURE-A", collectionSlug: "after-salah", arabicText: "تجربة معاد استخدامها" }),
    fixtureRow({ importIdentifier: "FIXTURE-B", collectionSlug: "before-sleep", arabicText: "تجربة معاد استخدامها" }),
  ];
  const groups = findDuplicateCandidates(rows);
  const group = groups.find((g) => g.reason === "same-arabic-reused-in-other-collection");
  assert(!!group, "identical Arabic assigned to two different collections must be flagged as an advisory candidate");
  assert(
    !groups.some((g) => g.reason === "same-arabic-normalized"),
    "cross-collection reuse must use the advisory reason, not the same-collection duplicate reason",
  );
  console.log("✓ same duʿā reused across two collections → advisory candidate, not a hard duplicate");
}

function testSameSourceAndRepetitionIsCandidate() {
  const rows = [
    fixtureRow({ importIdentifier: "FIXTURE-A", arabicText: "[ARABIC FIXTURE A]", references: [{ type: "other", citation: "[SOURCE FIXTURE] Ref X" }], repetitionCount: 3 }),
    fixtureRow({ importIdentifier: "FIXTURE-B", arabicText: "[ARABIC FIXTURE B]", references: [{ type: "other", citation: "[SOURCE FIXTURE] Ref X" }], repetitionCount: 3 }),
  ];
  const groups = findDuplicateCandidates(rows);
  assert(
    groups.some((g) => g.reason === "same-source-and-repetition"),
    "same source citation + same repetition count with different Arabic must be flagged for review",
  );
  console.log("✓ same source + same repetition count, different Arabic → flagged for review");
}

function testMinorPunctuationDifferencesStillMatch() {
  const rows = [
    fixtureRow({ importIdentifier: "FIXTURE-A", arabicText: "[ARABIC FIXTURE A]", references: [{ type: "other", citation: "[SOURCE FIXTURE], Ref: X." }], repetitionCount: 1 }),
    fixtureRow({ importIdentifier: "FIXTURE-B", arabicText: "[ARABIC FIXTURE B]", references: [{ type: "other", citation: "[SOURCE FIXTURE] Ref X" }], repetitionCount: 1 }),
  ];
  const groups = findDuplicateCandidates(rows);
  assert(
    groups.some((g) => g.reason === "same-source-and-repetition"),
    "minor punctuation differences in the citation must not defeat same-source matching",
  );
  console.log("✓ minor citation punctuation differences do not defeat duplicate matching");
}

function testDifferentDuasSimilarEnglishPurposeNotFlagged() {
  const rows: DuaDhikrImportRow[] = [
    fixtureRow({
      importIdentifier: "FIXTURE-A",
      whatItIsFor: "[FIXTURE] Said before sleeping",
      arabicText: "[ARABIC FIXTURE A — DISTINCT]",
      references: [{ type: "other", citation: "[SOURCE FIXTURE] Ref A" }],
      repetitionCount: 1,
    }),
    fixtureRow({
      importIdentifier: "FIXTURE-B",
      whatItIsFor: "[FIXTURE] Said before going to sleep",
      arabicText: "[ARABIC FIXTURE B — ENTIRELY DIFFERENT TEXT]",
      references: [{ type: "other", citation: "[SOURCE FIXTURE] Ref B" }],
      repetitionCount: 7,
    }),
  ];
  const groups = findDuplicateCandidates(rows);
  assert(groups.length === 0, "two different duʿās that merely share similar English purpose wording must NOT be flagged as duplicates");
  console.log("✓ different duʿās with similar English purpose are never auto-flagged as duplicates (no merge-by-English-similarity)");
}

function testExactSameArabicSameCollectionIsHardDuplicateNotAdvisory() {
  const rows = [
    fixtureRow({ importIdentifier: "FIXTURE-A", collectionSlug: "istighfar", arabicText: "تجربة مطابقة تمامًا" }),
    fixtureRow({ importIdentifier: "FIXTURE-B", collectionSlug: "istighfar", arabicText: "تجربة مطابقة تمامًا" }),
  ];
  const groups = findDuplicateCandidates(rows);
  assert(
    groups.some((g) => g.reason === "same-arabic-normalized"),
    "identical Arabic within the SAME collection must use the stronger, non-advisory duplicate reason",
  );
  console.log("✓ identical Arabic within the same collection is a true duplicate candidate, not merely advisory");
}

function runAll() {
  testNormalizeStripsTashkilAndWhitespace();
  testSameArabicDifferentWhitespaceIsDuplicate();
  testSameArabicDifferentTashkilIsDuplicate();
  testSameEntryInTwoCollectionsIsAdvisoryNotError();
  testSameSourceAndRepetitionIsCandidate();
  testMinorPunctuationDifferencesStillMatch();
  testDifferentDuasSimilarEnglishPurposeNotFlagged();
  testExactSameArabicSameCollectionIsHardDuplicateNotAdvisory();
  console.log("\nAll Duʿa & Dhikr duplicate-detection tests passed.");
}

runAll();
