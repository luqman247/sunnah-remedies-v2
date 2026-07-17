/**
 * Duʿa & Dhikr — search, alias, and discovery audit tests.
 *
 * Confirms every term supplied in the original brief remains discoverable,
 * that canonical categories never duplicate, that punctuation/apostrophe
 * variants are tolerated, and that "dua"/"duʿa" search-input variants find
 * relevant results without changing the official visible name (which stays
 * exactly "Duʿa & Dhikr" everywhere — see docs/dua-dhikr/README.md).
 */

import { CANONICAL_COLLECTIONS, resolveCollectionSlug, CANONICAL_COLLECTION_SLUGS } from "../../src/lib/dua-dhikr/taxonomy";
import { searchDuaDhikrCollections, normalizeSearchText, collectionMatchesSearchTerm } from "../../src/lib/dua-dhikr/search";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

/** Every term named in the readiness brief, mapped to its expected canonical collection. */
const REQUIRED_DISCOVERABLE_TERMS: [string, string][] = [
  ["After Salah", "after-salah"],
  ["Before Sleep", "before-sleep"],
  ["After Sleep", "waking-up"],
  ["Waking Up", "waking-up"],
  ["Eating", "food-and-drink"],
  ["Food & Drink", "food-and-drink"],
  ["Travelling", "travel"],
  ["Travel", "travel"],
  ["Entering a car", "travel"],
  ["Entering home", "home"],
  ["Leaving home", "home"],
  ["Before Wudu", "lavatory-and-wudu"],
  ["After Wudu", "lavatory-and-wudu"],
  ["Lavatory & Wudu", "lavatory-and-wudu"],
  ["Hajj", "hajj-and-umrah"],
  ["Umrah", "hajj-and-umrah"],
  ["Hajj & Umrah", "hajj-and-umrah"],
  ["Children", "children"],
  ["Parents", "parents"],
  ["Marriage", "marriage"],
  ["Marriage & Children", "marriage-and-children"],
  ["Newborn", "newborn"],
  ["Ruqyah & Illness", "ruqyah-and-illness"],
  ["Difficulties & Happiness", "difficulties-and-happiness"],
  ["Money & Shopping", "money-and-shopping"],
];

function testEveryRequiredTermResolvesToItsCanonicalCollection() {
  for (const [term, expectedSlug] of REQUIRED_DISCOVERABLE_TERMS) {
    const resolved = resolveCollectionSlug(term);
    assert(resolved === expectedSlug, `"${term}" must resolve to "${expectedSlug}", got "${resolved}"`);
  }
  console.log(`✓ all ${REQUIRED_DISCOVERABLE_TERMS.length} terms from the brief resolve to their canonical collection via resolveCollectionSlug`);
}

function testEveryRequiredTermIsFindableThroughSearch() {
  for (const [term, expectedSlug] of REQUIRED_DISCOVERABLE_TERMS) {
    const results = searchDuaDhikrCollections(CANONICAL_COLLECTIONS, term);
    assert(
      results.some((c) => c.slug === expectedSlug),
      `searching "${term}" must surface the "${expectedSlug}" collection in the landing search`,
    );
  }
  console.log(`✓ all ${REQUIRED_DISCOVERABLE_TERMS.length} terms are findable through the landing-page search, not just the alias resolver`);
}

function testNoCanonicalCategoryDuplicates() {
  const seen = new Set<string>();
  for (const slug of CANONICAL_COLLECTION_SLUGS) {
    assert(!seen.has(slug), `duplicate canonical collection slug: "${slug}"`);
    seen.add(slug);
  }
  // Spot-check the specific overlapping-name scenarios named in the brief:
  assert(CANONICAL_COLLECTIONS.filter((c) => c.slug === "after-salah").length === 1, "\"After Salah\" must not be duplicated (it was listed twice in the original brief)");
  assert(!CANONICAL_COLLECTION_SLUGS.includes("after-sleep" as never), "\"After Sleep\" must not exist as its own collection — it is an alias of waking-up");
  console.log("✓ no canonical category duplicates exist, including the specific overlaps named in the brief");
}

function testPunctuationAndCaseVariantsTolerated() {
  const variants = ["hajj & umrah", "HAJJ & UMRAH", "hajj and umrah", "hajj-and-umrah", "Hajj&Umrah"];
  for (const variant of variants) {
    const results = searchDuaDhikrCollections(CANONICAL_COLLECTIONS, variant);
    assert(
      results.some((c) => c.slug === "hajj-and-umrah"),
      `search variant "${variant}" must still find the Ḥajj & ʿUmrah collection`,
    );
  }
  console.log("✓ common punctuation and case variants of the same term are all tolerated by search");
}

function testNormalizeSearchTextHandlesAmpersandsAndApostrophes() {
  assert(normalizeSearchText("Food & Drink") === normalizeSearchText("Food and Drink"), "\"&\" must normalise the same as \"and\"");
  assert(normalizeSearchText("wudu's") === normalizeSearchText("wudus"), "apostrophes must be stripped for comparison");
  console.log("✓ normalizeSearchText treats \"&\"/\"and\" and apostrophe variants as equivalent");
}

function testDuaAndDuaWithAynFindRelevantResultsWithoutRenamingSections() {
  // Several collection descriptions legitimately use the word "duʿa"
  // (e.g. Parents: "Remembrance and duʿa for one's parents.") — searching
  // the plain, diacritic-free spelling users are likely to type ("dua")
  // must still surface them, without the site ever renaming a section to
  // match the search input.
  const plainSpelling = collectionMatchesSearchTerm(
    { slug: "parents", titleEn: "Parents", descriptionEn: "Remembrance and duʿa for one's parents.", aliases: [] },
    "dua",
  );
  assert(plainSpelling, "searching the plain spelling \"dua\" must match content containing \"duʿa\"");
  console.log("✓ plain-spelling \"dua\" search input finds content containing \"duʿa\" without altering any visible section name");
}

function testSearchNeverClaimsToSearchEntryContent() {
  // The landing search operates over collection metadata only — verified
  // structurally: SearchableCollection has no entry-level fields at all.
  const sampleCollection = CANONICAL_COLLECTIONS[0];
  const keys = Object.keys(sampleCollection);
  assert(!keys.includes("entries") && !keys.includes("arabicText"), "collection search data must never include entry-level content fields");
  console.log("✓ the landing search structurally cannot search entry content — it operates on collection metadata only");
}

function testEmptyQueryReturnsNoResultsNotEverything() {
  assert(searchDuaDhikrCollections(CANONICAL_COLLECTIONS, "").length === 0, "an empty query must return zero results, not the full collection list");
  assert(searchDuaDhikrCollections(CANONICAL_COLLECTIONS, "   ").length === 0, "a whitespace-only query must return zero results");
  console.log("✓ empty/whitespace-only queries return no results rather than the entire taxonomy");
}

function runAll() {
  testEveryRequiredTermResolvesToItsCanonicalCollection();
  testEveryRequiredTermIsFindableThroughSearch();
  testNoCanonicalCategoryDuplicates();
  testPunctuationAndCaseVariantsTolerated();
  testNormalizeSearchTextHandlesAmpersandsAndApostrophes();
  testDuaAndDuaWithAynFindRelevantResultsWithoutRenamingSections();
  testSearchNeverClaimsToSearchEntryContent();
  testEmptyQueryReturnsNoResultsNotEverything();
  console.log("\nAll Duʿa & Dhikr search/alias/discovery tests passed.");
}

runAll();
