/**
 * Duʿa & Dhikr — development-only UI stress-test fixtures.
 *
 * Every field below is obviously synthetic, clearly-labelled placeholder
 * text — never a real duʿā, Arabic verse, hadith, or translation. This
 * module exists solely to stress-test layout, RTL rendering, and the
 * entry-card component against extreme content lengths before any real
 * content exists. See docs/dua-dhikr/PREFLIGHT_VALIDATION.md,
 * "UI stress-test fixtures".
 *
 * This module is imported ONLY by the dev-only preview route
 * (src/app/[locale]/knowledge-library/dua-dhikr/dev-preview/page.tsx),
 * which itself refuses to render outside `next dev` — see that file for
 * the production guard. Nothing here is ever sent to Sanity, indexed, or
 * reachable from a production build.
 */

import type { DuaDhikrEntryPublic } from "@/sanity/lib/dua-dhikr-public-fetch";

const SHARED_REFERENCE = {
  type: "other" as const,
  citation: "[SOURCE FIXTURE] Placeholder citation — not a real source.",
  verifiedStatus: "unverified" as const,
};

function fixtureEntry(overrides: Partial<DuaDhikrEntryPublic>): DuaDhikrEntryPublic {
  return {
    _id: "dev-fixture",
    slug: "dev-fixture",
    titleEn: "[TEST DATA] Stress-test entry",
    order: 0,
    featured: false,
    whatItIsFor: "[TEST DATA] Used to stress-test layout only — not religious content.",
    occasion: ["dev-preview"],
    searchAliases: [],
    arabicText: "[ARABIC FIXTURE — NOT RELIGIOUS CONTENT]",
    translationEn: "[TRANSLATION FIXTURE]",
    translationDa: "[DANSK FIXTURE]",
    sourceReferences: [SHARED_REFERENCE],
    collections: [{ slug: "food-and-drink", titleEn: "Food & Drink" }],
    publicationPathway: "scholarly-approved",
    ...overrides,
  };
}

const VERY_SHORT_ARABIC = "ء";

const VERY_LONG_ARABIC = Array.from({ length: 40 })
  .map(() => "[ARABIC FIXTURE — NOT RELIGIOUS CONTENT] نص تجريبي طويل جدًا لاختبار التخطيط")
  .join(" ");

const VERY_LONG_TRANSLITERATION = Array.from({ length: 30 })
  .map(() => "test-transliteration-placeholder")
  .join(" ");

const VERY_LONG_TRANSLATION_EN = Array.from({ length: 25 })
  .map(() => "[TRANSLATION FIXTURE] a long run of placeholder English translation text used only to test wrapping and line length.")
  .join(" ");

const VERY_LONG_TRANSLATION_DA = Array.from({ length: 25 })
  .map(() => "[DANSK FIXTURE] en lang række af pladsholder-oversættelsestekst, kun brugt til at teste ombrydning og linjelængde.")
  .join(" ");

const VERY_LONG_EXPLANATION = Array.from({ length: 15 })
  .map(() => "[LONG EXPLANATION FIXTURE] Placeholder explanatory text, repeated to test the expandable section's height, scroll behaviour, and reading rhythm at length.")
  .join(" ");

const VERY_LONG_COLLECTION_NAME = "[TEST DATA] An Unusually and Deliberately Very Long Collection Name Used Only To Stress-Test Card and Breadcrumb Wrapping";

/**
 * One fixture per stress dimension named in the readiness brief. Each is
 * independently renderable — the dev-preview route lists them all on one
 * page so every dimension can be checked at every viewport in one pass.
 */
export const DEV_STRESS_FIXTURES: { label: string; entry: DuaDhikrEntryPublic }[] = [
  {
    label: "Very short Arabic",
    entry: fixtureEntry({ _id: "stress-short-arabic", arabicText: VERY_SHORT_ARABIC }),
  },
  {
    label: "Very long Arabic placeholder",
    entry: fixtureEntry({ _id: "stress-long-arabic", arabicText: VERY_LONG_ARABIC }),
  },
  {
    label: "Long transliteration",
    entry: fixtureEntry({ _id: "stress-long-translit", transliteration: VERY_LONG_TRANSLITERATION }),
  },
  {
    label: "Long English translation",
    entry: fixtureEntry({ _id: "stress-long-en", translationEn: VERY_LONG_TRANSLATION_EN }),
  },
  {
    label: "Long Danish translation",
    entry: fixtureEntry({ _id: "stress-long-da", translationDa: VERY_LONG_TRANSLATION_DA }),
  },
  {
    label: "Long explanation (expandable section)",
    entry: fixtureEntry({ _id: "stress-long-explanation", explanationText: VERY_LONG_EXPLANATION }),
  },
  {
    label: "Multiple references",
    entry: fixtureEntry({
      _id: "stress-multi-refs",
      sourceReferences: [
        { ...SHARED_REFERENCE, citation: "[SOURCE FIXTURE] First placeholder reference" },
        { ...SHARED_REFERENCE, type: "hadith", citation: "[SOURCE FIXTURE] Second placeholder reference", hadithCollection: "[TEST DATA]", hadithNumber: "0000" },
        { ...SHARED_REFERENCE, type: "quran", citation: "[SOURCE FIXTURE] Third placeholder reference", surah: "0", ayah: "0" },
      ],
    }),
  },
  {
    label: "No optional explanation",
    entry: fixtureEntry({ _id: "stress-no-explanation", explanationText: undefined, virtueText: undefined }),
  },
  {
    label: "No transliteration",
    entry: fixtureEntry({ _id: "stress-no-translit", transliteration: undefined }),
  },
  {
    label: "Large repetition count label",
    entry: fixtureEntry({ _id: "stress-large-repetition", recommendedRepetitions: 999999 }),
  },
  {
    label: "Multiple collections",
    entry: fixtureEntry({
      _id: "stress-multi-collections",
      collections: [
        { slug: "food-and-drink", titleEn: "Food & Drink" },
        { slug: "travel", titleEn: "Travel" },
        { slug: "gatherings", titleEn: "Gatherings" },
      ],
    }),
  },
  {
    label: "Very long collection name",
    entry: fixtureEntry({
      _id: "stress-long-collection-name",
      collections: [{ slug: "food-and-drink", titleEn: VERY_LONG_COLLECTION_NAME }],
    }),
  },
  {
    label: "Pending scholarly review badge",
    entry: fixtureEntry({ _id: "stress-pending-review", publicationPathway: "editorial-pending-scholarly-review" }),
  },
];
