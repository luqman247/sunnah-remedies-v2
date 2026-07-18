/**
 * Duʿa & Dhikr — canonical taxonomy and alias-map tests.
 *
 * Plain assert()-based, run via `npx tsx`, mirroring the convention in
 * tests/dhikr/. No dev server, no network — pure source-level checks
 * against src/lib/dua-dhikr/taxonomy.ts.
 */

import {
  CANONICAL_COLLECTIONS,
  CANONICAL_COLLECTION_SLUGS,
  PARENT_GROUPS,
  resolveCollectionSlug,
  getCanonicalCollection,
} from "../../src/lib/dua-dhikr/taxonomy";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

function testEverySlugIsUnique() {
  const seen = new Set<string>();
  for (const slug of CANONICAL_COLLECTION_SLUGS) {
    assert(!seen.has(slug), `duplicate canonical collection slug: "${slug}"`);
    seen.add(slug);
  }
  console.log(`✓ all ${CANONICAL_COLLECTION_SLUGS.length} canonical collection slugs are unique`);
}

function testEveryCollectionHasAValidParentGroup() {
  const groupKeys = new Set(PARENT_GROUPS.map((g) => g.key));
  for (const collection of CANONICAL_COLLECTIONS) {
    assert(groupKeys.has(collection.parentGroup), `collection "${collection.slug}" has unknown parentGroup "${collection.parentGroup}"`);
  }
  console.log("✓ every canonical collection has a valid parentGroup");
}

/** Every worked example from docs/dua-dhikr/CATEGORY_ALIAS_MAP.md must resolve exactly as documented. */
const WORKED_EXAMPLES: [string, string][] = [
  ["after sleep", "waking-up"],
  ["eating", "food-and-drink"],
  ["travelling", "travel"],
  ["traveling", "travel"],
  ["entering a car", "travel"],
  ["entering the house", "home"],
  ["leaving the house", "home"],
  ["before wudu", "lavatory-and-wudu"],
  ["after wudu", "lavatory-and-wudu"],
  ["wudu", "lavatory-and-wudu"],
  ["hajj", "hajj-and-umrah"],
  ["umrah", "hajj-and-umrah"],
  ["hajj & umrah", "hajj-and-umrah"],
  // Approved taxonomy decision (content-intake Audit v2/v3): three ASCII
  // alias fixes plus the new During Salah collection.
  ["sunnah duas", "sunnah-duas"],
  ["sunnah dua", "sunnah-duas"],
  ["qur'anic duas", "quranic-duas"],
  ["qur’anic duas", "quranic-duas"],
  ["quranic duas", "quranic-duas"],
  ["protection of iman", "protection-of-iman"],
  ["salah", "during-salah"],
  ["after salah", "after-salah"],
  ["tahajjud", "tahajjud"],
  ["istikharah", "istikharah"],
];

function testWorkedAliasExamplesResolveCorrectly() {
  for (const [alias, expected] of WORKED_EXAMPLES) {
    const resolved = resolveCollectionSlug(alias);
    assert(resolved === expected, `alias "${alias}" should resolve to "${expected}", got "${resolved}"`);
  }
  console.log(`✓ all ${WORKED_EXAMPLES.length} worked alias examples from CATEGORY_ALIAS_MAP.md resolve correctly`);
}

function testNoAliasIsSharedAcrossTwoDifferentCollections() {
  const ownerByTerm = new Map<string, string>();
  for (const collection of CANONICAL_COLLECTIONS) {
    const terms = [collection.slug, ...collection.aliases];
    for (const term of terms) {
      const key = term.trim().toLowerCase();
      const owner = ownerByTerm.get(key);
      assert(
        !owner || owner === collection.slug,
        `term "${term}" is claimed by both "${owner}" and "${collection.slug}" — a term must resolve to exactly one canonical collection`,
      );
      ownerByTerm.set(key, collection.slug);
    }
  }
  console.log("✓ no alias or slug is claimed by two different collections");
}

function testMarriageAndChildrenUmbrellaDoesNotDuplicateItsMembers() {
  const umbrella = getCanonicalCollection("marriage-and-children");
  assert(!!umbrella, "marriage-and-children collection must exist");
  const memberSlugs = ["parents", "children", "newborn", "marriage"];
  for (const slug of memberSlugs) {
    const member = getCanonicalCollection(slug);
    assert(!!member, `member collection "${slug}" must exist as its own collection`);
    assert(
      !!member!.relatedGroupSlugs?.includes("marriage-and-children"),
      `"${slug}" must reference "marriage-and-children" in relatedGroupSlugs`,
    );
  }
  assert(
    umbrella!.relatedGroupSlugs?.length === memberSlugs.length,
    "marriage-and-children must reference exactly its four members, not duplicate their content",
  );
  console.log("✓ Marriage & Children is an umbrella referencing, not duplicating, Parents/Children/Newborn/Marriage");
}

function testAfterSalahIsNotDuplicated() {
  const matches = CANONICAL_COLLECTIONS.filter((c) => c.slug === "after-salah");
  assert(matches.length === 1, `"after-salah" must appear exactly once, found ${matches.length}`);
  console.log('✓ the repeated "After Salah" request collapses to exactly one canonical collection');
}

function testHajjAndUmrahHasParentChildSubcategories() {
  const collection = getCanonicalCollection("hajj-and-umrah");
  assert(!!collection, "hajj-and-umrah must exist");
  const subSlugs = collection!.subcategories?.map((s) => s.slug) ?? [];
  assert(subSlugs.includes("hajj") && subSlugs.includes("umrah"), "hajj-and-umrah must have hajj and umrah as subcategories");
  console.log("✓ Hajj & Umrah uses one coherent parent-child structure");
}

const DURING_SALAH_SUBCATEGORY_SLUGS = [
  "opening-supplications",
  "before-quran-recitation",
  "ruku",
  "rising-from-ruku",
  "sujud",
  "between-the-two-prostrations",
  "tashahhud-and-salawat",
  "before-salam",
  "qunut",
];

function testDuringSalahExistsWithNineApprovedSubcategories() {
  const collection = getCanonicalCollection("during-salah");
  assert(!!collection, "during-salah must exist as its own canonical collection");
  assert(collection!.titleEn === "During Salah", `during-salah titleEn must be "During Salah", got "${collection!.titleEn}"`);
  const subSlugs = collection!.subcategories?.map((s) => s.slug) ?? [];
  assert(subSlugs.length === 9, `during-salah must have exactly 9 subcategories, found ${subSlugs.length}`);
  for (const expected of DURING_SALAH_SUBCATEGORY_SLUGS) {
    assert(subSlugs.includes(expected), `during-salah is missing approved subcategory "${expected}"`);
  }
  console.log("✓ During Salah exists with exactly the 9 approved subcategories");
}

function testDuringSalahAndAfterSalahAreDistinctNotMerged() {
  const during = getCanonicalCollection("during-salah");
  const after = getCanonicalCollection("after-salah");
  assert(!!during && !!after, "both during-salah and after-salah must exist");
  assert(during!.slug !== after!.slug, "During Salah and After Salah must be distinct collections, never merged");
  assert(during!.titleEn !== after!.titleEn, "During Salah and After Salah must have distinct titles");
  console.log("✓ During Salah and After Salah remain fully distinct canonical collections");
}

function testNoBroadCanonicalSalahCollectionWasCreated() {
  const matches = CANONICAL_COLLECTIONS.filter((c) => c.titleEn.trim().toLowerCase() === "salah");
  assert(matches.length === 0, 'a broad canonical collection literally titled "Salah" must not exist — only During Salah, After Salah, Tahajjud, and Istikharah');
  console.log('✓ no broad canonical "Salah" collection was created — Salah remains an alias into During Salah only');
}

function testTahajjudAndIstikharahRemainUntouchedByDuringSalah() {
  const tahajjud = getCanonicalCollection("tahajjud");
  const istikharah = getCanonicalCollection("istikharah");
  assert(!!tahajjud && !!istikharah, "tahajjud and istikharah must both still exist");
  assert(tahajjud!.slug !== "during-salah" && istikharah!.slug !== "during-salah", "tahajjud/istikharah must not have been collapsed into during-salah");
  console.log("✓ Tahajjud and Istikharah remain separate, untouched canonical collections");
}

function testInvalidArbitrarySubcategoryIsRejected() {
  const collection = getCanonicalCollection("during-salah");
  const subSlugs = collection!.subcategories?.map((s) => s.slug) ?? [];
  assert(!subSlugs.includes("made-up-subcategory"), "an arbitrary, unapproved subcategory must not be present");
  console.log("✓ an arbitrary subcategory slug is correctly absent from During Salah's approved list");
}

function testMorningAndEveningDhikrSlugsUnchanged() {
  const morning = getCanonicalCollection("morning-dhikr");
  const evening = getCanonicalCollection("evening-dhikr");
  assert(!!morning && morning.slug === "morning-dhikr" && morning.externalHref === "/knowledge/dhikr/morning", "morning-dhikr slug/externalHref must be unchanged");
  assert(!!evening && evening.slug === "evening-dhikr" && evening.externalHref === "/knowledge/dhikr/evening", "evening-dhikr slug/externalHref must be unchanged");
  console.log("✓ Morning Dhikr and Evening Dhikr slugs/routes are unchanged by this taxonomy addition");
}

function runAll() {
  testEverySlugIsUnique();
  testEveryCollectionHasAValidParentGroup();
  testWorkedAliasExamplesResolveCorrectly();
  testNoAliasIsSharedAcrossTwoDifferentCollections();
  testMarriageAndChildrenUmbrellaDoesNotDuplicateItsMembers();
  testAfterSalahIsNotDuplicated();
  testHajjAndUmrahHasParentChildSubcategories();
  testDuringSalahExistsWithNineApprovedSubcategories();
  testDuringSalahAndAfterSalahAreDistinctNotMerged();
  testNoBroadCanonicalSalahCollectionWasCreated();
  testTahajjudAndIstikharahRemainUntouchedByDuringSalah();
  testInvalidArbitrarySubcategoryIsRejected();
  testMorningAndEveningDhikrSlugsUnchanged();
  console.log("\nAll Duʿa & Dhikr taxonomy/alias tests passed.");
}

runAll();
