/**
 * Knowledge Library Duʿā & Dhikr feature — pure helper regressions.
 * Run: npx tsx tests/dua-dhikr/knowledge-library-dua-feature.test.ts
 */
import assert from "node:assert/strict";
import {
  allocateKnowledgeLibraryNumerals,
  resolveDuaDhikrFeatureTileTitle,
  selectDuaDhikrFeaturePreview,
} from "../../src/components/department/dua-dhikr-feature-utils";
import type { DuaDhikrCollectionPublic } from "../../src/sanity/lib/dua-dhikr-public-fetch";

function collection(
  partial: Partial<DuaDhikrCollectionPublic> &
    Pick<DuaDhikrCollectionPublic, "slug" | "titleEn" | "iconKey">,
): DuaDhikrCollectionPublic {
  return {
    parentGroup: "daily-foundations",
    descriptionEn: "Test",
    aliases: [],
    entryCount: 1,
    publicationState: "published",
    hasPendingUnreviewedCopy: false,
    ...partial,
  };
}

function testPreviewPrefersCanonicalDailyCollections() {
  const published = [
    collection({ slug: "travel", titleEn: "Travel", iconKey: "journey-path" }),
    collection({
      slug: "evening-dhikr",
      titleEn: "Evening Dhikr",
      iconKey: "moon-bedding",
    }),
    collection({
      slug: "morning-dhikr",
      titleEn: "Morning Dhikr",
      iconKey: "sunrise",
    }),
    collection({ slug: "home", titleEn: "Home", iconKey: "doorway" }),
    collection({
      slug: "after-salah",
      titleEn: "After Salah",
      iconKey: "prayer-mat",
    }),
  ];
  const preview = selectDuaDhikrFeaturePreview(published, 4);
  assert.deepEqual(
    preview.map((item) => item.slug),
    ["morning-dhikr", "evening-dhikr", "after-salah", "travel"],
  );
  console.log("✓ preview prefers daily collections then fills from remainder");
}

function testPreviewNeverPadsEmptySlots() {
  const published = [
    collection({
      slug: "morning-dhikr",
      titleEn: "Morning Dhikr",
      iconKey: "sunrise",
    }),
  ];
  const preview = selectDuaDhikrFeaturePreview(published, 4);
  assert.equal(preview.length, 1);
  console.log("✓ preview never invents empty placeholder tiles");
}

function testDanishTitlesNeverFallBackToEnglish() {
  const withDa = collection({
    slug: "home",
    titleEn: "Home",
    titleDa: "Hjem",
    iconKey: "doorway",
  });
  const withoutDa = collection({
    slug: "morning-dhikr",
    titleEn: "Morning Dhikr",
    iconKey: "sunrise",
  });
  assert.equal(resolveDuaDhikrFeatureTileTitle(withDa, "da"), "Hjem");
  assert.equal(resolveDuaDhikrFeatureTileTitle(withoutDa, "da"), null);
  assert.equal(
    resolveDuaDhikrFeatureTileTitle(withoutDa, "en"),
    "Morning Dhikr",
  );
  console.log(
    "✓ Danish decorative titles never fall back to English taxonomy strings",
  );
}

function testSectionNumeralSequences() {
  const withRecent = allocateKnowledgeLibraryNumerals(true);
  assert.deepEqual(
    [
      withRecent.hero,
      withRecent.duaDhikr,
      withRecent.openShelf,
      withRecent.featured,
      withRecent.recent,
      withRecent.closing,
    ],
    ["I", "II", "III", "IV", "V", "VI"],
  );

  const withoutRecent = allocateKnowledgeLibraryNumerals(false);
  assert.equal(withoutRecent.recent, null);
  assert.deepEqual(
    [
      withoutRecent.hero,
      withoutRecent.duaDhikr,
      withoutRecent.openShelf,
      withoutRecent.featured,
      withoutRecent.closing,
    ],
    ["I", "II", "III", "IV", "V"],
  );
  console.log(
    "✓ Roman numeral sequences remain consecutive with and without recent articles",
  );
}

function runAll() {
  testPreviewPrefersCanonicalDailyCollections();
  testPreviewNeverPadsEmptySlots();
  testDanishTitlesNeverFallBackToEnglish();
  testSectionNumeralSequences();
  console.log("\nAll Knowledge Library Duʿā & Dhikr feature tests passed.");
}

runAll();
