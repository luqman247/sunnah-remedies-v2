/**
 * Duʿa & Dhikr — route existence, collection-route generation, locale
 * routing, and Morning/Evening-unchanged tests.
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import en from "../../src/messages/en.json";
import da from "../../src/messages/da.json";
import { LOCALES } from "../../src/i18n/locales";
import { knowledgeLibrary } from "../../src/lib/navigation/site-structure";
import { CANONICAL_COLLECTIONS } from "../../src/lib/dua-dhikr/taxonomy";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const REPO_ROOT = join(__dirname, "../..");
const LANDING_PAGE_PATH = join(REPO_ROOT, "src/app/[locale]/knowledge-library/dua-dhikr/page.tsx");
const COLLECTION_PAGE_PATH = join(REPO_ROOT, "src/app/[locale]/knowledge-library/dua-dhikr/[collectionSlug]/page.tsx");
const MORNING_PAGE_PATH = join(REPO_ROOT, "src/app/[locale]/knowledge/dhikr/morning/page.tsx");
const EVENING_PAGE_PATH = join(REPO_ROOT, "src/app/[locale]/knowledge/dhikr/evening/page.tsx");
const NEXT_CONFIG_PATH = join(REPO_ROOT, "next.config.ts");

function testLandingAndCollectionRouteFilesExist() {
  assert(existsSync(LANDING_PAGE_PATH), "the Duʿa & Dhikr landing page route file must exist");
  assert(existsSync(COLLECTION_PAGE_PATH), "the Duʿa & Dhikr [collectionSlug] route file must exist");
  console.log("✓ landing and collection route files exist");
}

function testCollectionPageGeneratesStaticParamsFromCanonicalTaxonomy() {
  const source = readFileSync(COLLECTION_PAGE_PATH, "utf-8");
  assert(source.includes("generateStaticParams"), "the collection page must export generateStaticParams");
  assert(source.includes("CANONICAL_COLLECTIONS"), "generateStaticParams must derive routes from CANONICAL_COLLECTIONS");
  console.log("✓ collection routes are generated from the canonical taxonomy, not from Sanity content");
}

function testMorningAndEveningSlugsRedirectRatherThanDuplicate() {
  const source = readFileSync(COLLECTION_PAGE_PATH, "utf-8");
  assert(source.includes("externalHref"), "the collection page must check for externalHref (Morning/Evening) and redirect");
  assert(source.includes("redirect("), "the collection page must call redirect() for collections with an externalHref");
  const morningDhikr = CANONICAL_COLLECTIONS.find((c) => c.slug === "morning-dhikr");
  const eveningDhikr = CANONICAL_COLLECTIONS.find((c) => c.slug === "evening-dhikr");
  assert(morningDhikr?.externalHref === "/knowledge/dhikr/morning", "morning-dhikr must defer to the real Morning Dhikr route");
  assert(eveningDhikr?.externalHref === "/knowledge/dhikr/evening", "evening-dhikr must defer to the real Evening Dhikr route");
  console.log("✓ morning-dhikr/evening-dhikr collection slugs redirect to the existing routes instead of duplicating them");
}

function testMorningAndEveningRoutesAreUnchangedInSubstance() {
  assert(existsSync(MORNING_PAGE_PATH), "the Morning Dhikr route must still exist");
  assert(existsSync(EVENING_PAGE_PATH), "the Evening Dhikr route must still exist");
  const morningSource = readFileSync(MORNING_PAGE_PATH, "utf-8");
  const eveningSource = readFileSync(EVENING_PAGE_PATH, "utf-8");
  assert(
    morningSource.includes('from "@/sanity/lib/dhikr-public-fetch"'),
    "Morning Dhikr must still fetch through @/sanity/lib/dhikr-public-fetch (unchanged data source)",
  );
  assert(
    eveningSource.includes("DhikrTimeNavigation"),
    "Evening Dhikr must still render the shared DhikrTimeNavigation component (unchanged)",
  );
  assert(
    !morningSource.includes("duaDhikrEntry") && !morningSource.includes("dua-dhikr-public-fetch"),
    "Morning Dhikr must not have been migrated onto the duaDhikrEntry content type",
  );
  console.log("✓ Morning and Evening Dhikr routes are unchanged and were not migrated or duplicated");
}

function testLandingHeroIsEditorialNotTypographicMenu() {
  const source = readFileSync(LANDING_PAGE_PATH, "utf-8");
  assert(
    !source.includes("DhikrTimeNavigation"),
    "the Duʿā & Dhikr landing hub must not embed DhikrTimeNavigation as a typographic collection menu",
  );
  assert(
    source.includes("beginHereHeading") && source.includes("selectBeginHereCollections"),
    "Morning/Evening must surface once via the Begin here section",
  );
  assert(
    source.includes("selectBrowseByOccasionCollections"),
    "Browse by occasion must exclude Begin here collections to prevent duplication",
  );
  console.log(
    "✓ the Duʿā & Dhikr landing hub uses Begin here cards instead of embedding DhikrTimeNavigation",
  );
}

function testKnowledgeLibraryRedirectConfigured() {
  const source = readFileSync(NEXT_CONFIG_PATH, "utf-8");
  assert(
    source.includes('"/knowledge-library/dhikr"') && source.includes('"/knowledge-library/dua-dhikr"'),
    "next.config.ts must redirect the old /knowledge-library/dhikr to /knowledge-library/dua-dhikr",
  );
  console.log("✓ a permanent redirect from the old landing page to the new hub is configured");
}

function testSidebarPointsToNewHub() {
  const entry = knowledgeLibrary.sections.find((s) => s.href === "/knowledge-library/dua-dhikr");
  assert(!!entry, "the Knowledge Library sidebar must link to /knowledge-library/dua-dhikr");
  assert(entry!.label === "Duʿa & Dhikr", `sidebar label must use the order "Duʿa & Dhikr", got "${entry!.label}"`);
  console.log("✓ Knowledge Library sidebar links to the new Duʿa & Dhikr hub with the correct label order");
}

/* ── Locale completeness ──────────────────────────────────────────────── */

function collectKeys(obj: unknown, prefix = ""): string[] {
  if (typeof obj !== "object" || obj === null) return [prefix];
  return Object.entries(obj as Record<string, unknown>).flatMap(([key, value]) =>
    collectKeys(value, prefix ? `${prefix}.${key}` : key),
  );
}

function testDuaDhikrMessageNamespaceExistsInBothLocales() {
  assert("duaDhikr" in en, 'src/messages/en.json must have a top-level "duaDhikr" namespace');
  assert("duaDhikr" in da, 'src/messages/da.json must have a top-level "duaDhikr" namespace');
  console.log("✓ the duaDhikr message namespace exists in both en.json and da.json");
}

function testDuaDhikrKeysMatchBetweenLocales() {
  const enKeys = new Set(collectKeys((en as Record<string, unknown>).duaDhikr).sort());
  const daKeys = new Set(collectKeys((da as Record<string, unknown>).duaDhikr).sort());
  const missingFromDa = [...enKeys].filter((k) => !daKeys.has(k));
  const missingFromEn = [...daKeys].filter((k) => !enKeys.has(k));
  assert(missingFromDa.length === 0, `da.json is missing duaDhikr keys present in en.json: ${missingFromDa.join(", ")}`);
  assert(missingFromEn.length === 0, `en.json is missing duaDhikr keys present in da.json: ${missingFromEn.join(", ")}`);
  console.log(`✓ all ${enKeys.size} duaDhikr message keys match between en.json and da.json (no raw-key fallback risk)`);
}

function testDanishLocaleStillUsesDkPrefix() {
  const daLocale = LOCALES.find((l) => l.id === "da");
  assert(!!daLocale && daLocale.prefix === "/dk", 'the Danish locale must still resolve via the existing "/dk" prefix');
  console.log("✓ Danish routing still resolves through the existing /dk prefix — no separate route file needed");
}

function runAll() {
  testLandingAndCollectionRouteFilesExist();
  testCollectionPageGeneratesStaticParamsFromCanonicalTaxonomy();
  testMorningAndEveningSlugsRedirectRatherThanDuplicate();
  testMorningAndEveningRoutesAreUnchangedInSubstance();
  testLandingHeroIsEditorialNotTypographicMenu();
  testKnowledgeLibraryRedirectConfigured();
  testSidebarPointsToNewHub();
  testDuaDhikrMessageNamespaceExistsInBothLocales();
  testDuaDhikrKeysMatchBetweenLocales();
  testDanishLocaleStillUsesDkPrefix();
  console.log("\nAll Duʿa & Dhikr route/locale tests passed.");
}

runAll();
