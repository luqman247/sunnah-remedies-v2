/**
 * Duʿā & Dhikr landing hub composition — pure helper regressions.
 * Run: npx tsx tests/dua-dhikr/dua-dhikr-landing-hub.test.ts
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  BEGIN_HERE_COLLECTION_SLUGS,
  resolveLandingCollectionTitle,
  selectBeginHereCollections,
  selectBrowseByOccasionCollections,
  selectDuaDhikrGuideArticles,
  shouldRenderBrowseByOccasionSection,
  shouldRenderGuidesAndArticlesSection,
} from "../../src/lib/dua-dhikr/landing-hub";

function testBeginHereSelectsOnlyFoundationalPublishedCollections() {
  const published = [
    { slug: "travel" },
    { slug: "evening-dhikr" },
    { slug: "morning-dhikr" },
    { slug: "after-salah" },
  ];
  const begin = selectBeginHereCollections(published);
  assert.deepEqual(
    begin.map((c) => c.slug),
    ["morning-dhikr", "evening-dhikr"],
  );
  assert.deepEqual(
    [...BEGIN_HERE_COLLECTION_SLUGS],
    ["morning-dhikr", "evening-dhikr"],
  );
  console.log("✓ Begin here selects Morning then Evening when published");
}

function testBeginHereHandlesZeroPublished() {
  assert.deepEqual(selectBeginHereCollections([]), []);
  assert.deepEqual(selectBeginHereCollections([{ slug: "travel" }]), []);
  console.log(
    "✓ Begin here is empty when foundational collections are unpublished",
  );
}

function testBrowseExcludesBeginHereAndSupportsMany() {
  const published = [
    { slug: "morning-dhikr" },
    { slug: "evening-dhikr" },
    { slug: "travel" },
    { slug: "home" },
  ];
  const browse = selectBrowseByOccasionCollections(published);
  assert.deepEqual(
    browse.map((c) => c.slug),
    ["travel", "home"],
  );
  assert.equal(shouldRenderBrowseByOccasionSection(browse), true);

  const onlyFoundational = selectBrowseByOccasionCollections([
    { slug: "morning-dhikr" },
    { slug: "evening-dhikr" },
  ]);
  assert.deepEqual(onlyFoundational, []);
  assert.equal(shouldRenderBrowseByOccasionSection(onlyFoundational), false);
  console.log(
    "✓ Browse by occasion excludes Begin here and hides when only those two are published",
  );
}

function testNoDuplicatePrincipalSurfacing() {
  const published = [{ slug: "morning-dhikr" }, { slug: "evening-dhikr" }];
  const begin = selectBeginHereCollections(published);
  const browse = selectBrowseByOccasionCollections(published);
  const allSlugs = [...begin, ...browse].map((c) => c.slug);
  assert.equal(new Set(allSlugs).size, allSlugs.length);
  assert.equal(allSlugs.filter((s) => s === "morning-dhikr").length, 1);
  assert.equal(allSlugs.filter((s) => s === "evening-dhikr").length, 1);
  console.log(
    "✓ Morning and Evening appear only once across Begin here + Browse",
  );
}

function testGuidesSectionOnlyWhenMatchingArticlesExist() {
  assert.equal(shouldRenderGuidesAndArticlesSection([]), false);
  const articles = selectDuaDhikrGuideArticles([
    {
      _id: "a1",
      title: "Black Seed",
      excerpt: "Materia medica",
      topics: [{ slug: { current: "black-seed" }, title: "Black Seed" }],
    },
    {
      _id: "a2",
      title: "Etiquette of Duʿā",
      excerpt: "How to ask",
      topics: [{ slug: { current: "dua-etiquette" }, title: "Duʿā" }],
    },
    {
      _id: "a3",
      title: "Canonical hub topic",
      excerpt: "Assigned explicitly",
      topics: [{ slug: { current: "dua-dhikr" }, title: "Duʿā & Dhikr" }],
    },
    {
      _id: "a4",
      title: "On Remembrance",
      excerpt: "Dhikr in daily life",
      topics: [],
    },
  ]);
  assert.deepEqual(
    articles.map((a) => a.title),
    ["Etiquette of Duʿā", "Canonical hub topic", "On Remembrance"],
  );
  assert.equal(shouldRenderGuidesAndArticlesSection(articles), true);
  console.log(
    "✓ Guides & Articles selects only dua/dhikr-related published articles",
  );
}

function testGuidesRejectsBroadWordFalsePositives() {
  const articles = selectDuaDhikrGuideArticles([
    {
      _id: "b1",
      title: "Morning routines for wellness",
      excerpt: "Start the day with prayer and remembrance of good habits",
      topics: [],
    },
    {
      _id: "b2",
      title: "Daily prayer schedule at the mosque",
      excerpt: "How congregations organise morning and evening prayer",
      topics: [{ slug: { current: "mosque-life" }, title: "Mosque life" }],
    },
    {
      _id: "b3",
      title: "Remembrance as a literary theme",
      excerpt: "Poetry and the morning light",
      topics: [{ slug: { current: "literature" }, title: "Literature" }],
    },
    {
      _id: "b4",
      title: "Understanding Duʿā",
      excerpt: "A short guide",
      topics: [],
    },
  ]);
  assert.deepEqual(
    articles.map((a) => a.title),
    ["Understanding Duʿā"],
  );
  console.log(
    "✓ Guides rejects unrelated articles that only contain broad words like morning/prayer/remembrance",
  );
}

function testGuidesDedupesAndCapsResults() {
  const many = Array.from({ length: 10 }, (_, i) => ({
    _id: `d${i}`,
    title: `Guide ${i}`,
    excerpt: "About dhikr practice",
    topics: [] as { slug: { current: string }; title: string }[],
  }));
  const capped = selectDuaDhikrGuideArticles(many);
  assert.equal(capped.length, 6);

  const duped = selectDuaDhikrGuideArticles([
    {
      _id: "same",
      title: "First",
      excerpt: "dhikr",
      topics: [],
    },
    {
      _id: "same",
      title: "Second copy",
      excerpt: "dhikr",
      topics: [],
    },
  ]);
  assert.equal(duped.length, 1);
  assert.equal(duped[0].title, "First");
  console.log("✓ Guides de-duplicates by _id and caps at six articles");
}

function testDanishTitleResolutionNeverSilentEnglishFallback() {
  const withDa = resolveLandingCollectionTitle(
    { titleEn: "Home", titleDa: "Hjem" },
    "da",
  );
  assert.deepEqual(withDa, { title: "Hjem" });

  const intentional = resolveLandingCollectionTitle(
    { titleEn: "Morning Dhikr" },
    "da",
    "Morgen-dhikr",
  );
  assert.deepEqual(intentional, { title: "Morgen-dhikr" });

  const marked = resolveLandingCollectionTitle({ titleEn: "Travel" }, "da");
  assert.deepEqual(marked, { title: "Travel", lang: "en" });

  const english = resolveLandingCollectionTitle(
    { titleEn: "Morning Dhikr", titleDa: "Morgen-dhikr" },
    "en",
    "Morgen-dhikr",
  );
  assert.deepEqual(english, { title: "Morning Dhikr" });
  console.log(
    "✓ Danish titles use intentional fallbacks and mark English last-resort with lang=en",
  );
}

function testLandingSourceDoesNotListCollectionsInHero() {
  const source = readFileSync(
    join(
      __dirname,
      "../../src/app/[locale]/knowledge-library/dua-dhikr/page.tsx",
    ),
    "utf-8",
  );
  const heroBlock = source.slice(
    source.indexOf("dua-dhikr-hero"),
    source.indexOf("dua-dhikr-landing"),
  );
  assert(
    !/morning-dhikr|evening-dhikr|DhikrTimeNavigation|Morning Dhikr|Evening Dhikr/.test(
      heroBlock,
    ),
    "hero block must not reference collection names or DhikrTimeNavigation",
  );
  assert(source.includes("beginHereHeading"), "page must render Begin here");
  assert(
    source.includes("selectBrowseByOccasionCollections"),
    "page must use browse helper",
  );
  console.log("✓ landing source keeps collection names out of the hero");
}

function runAll() {
  testBeginHereSelectsOnlyFoundationalPublishedCollections();
  testBeginHereHandlesZeroPublished();
  testBrowseExcludesBeginHereAndSupportsMany();
  testNoDuplicatePrincipalSurfacing();
  testGuidesSectionOnlyWhenMatchingArticlesExist();
  testGuidesRejectsBroadWordFalsePositives();
  testGuidesDedupesAndCapsResults();
  testDanishTitleResolutionNeverSilentEnglishFallback();
  testLandingSourceDoesNotListCollectionsInHero();
  console.log("\nAll Duʿā & Dhikr landing-hub tests passed.");
}

runAll();
