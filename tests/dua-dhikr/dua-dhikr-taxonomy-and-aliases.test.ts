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

function runAll() {
  testEverySlugIsUnique();
  testEveryCollectionHasAValidParentGroup();
  testWorkedAliasExamplesResolveCorrectly();
  testNoAliasIsSharedAcrossTwoDifferentCollections();
  testMarriageAndChildrenUmbrellaDoesNotDuplicateItsMembers();
  testAfterSalahIsNotDuplicated();
  testHajjAndUmrahHasParentChildSubcategories();
  console.log("\nAll Duʿa & Dhikr taxonomy/alias tests passed.");
}

runAll();
