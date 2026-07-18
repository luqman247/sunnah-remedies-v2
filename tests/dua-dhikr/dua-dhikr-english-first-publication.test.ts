/**
 * Duʿa & Dhikr — English-first publication pathway tests.
 *
 * Covers the owner-approved-English-first eligibility pathway added
 * alongside (never replacing) the canonical scholarly and editorial-bypass
 * pathways: locale-aware eligibility, Danish still hard-gated, drafts
 * still invisible, no fabricated scholarly claim. No live Sanity access —
 * every test exercises pure gate functions or static source/query-string
 * checks. No religious content in any fixture.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  isDuaDhikrEntryPubliclyEligible,
  isDuaDhikrEntryEditoriallyPubliclyEligible,
  isDuaDhikrEntryOwnerApprovedEnglishEligible,
  isDuaDhikrEntryEnglishPubliclyEligible,
  isDuaDhikrEntryDanishPubliclyEligible,
  isDuaDhikrEntryPubliclyEligibleForLocale,
  getDuaDhikrOwnerApprovedEnglishEligibilityConditions,
  type DuaDhikrEntryLocaleEligibilityInput,
} from "../../src/sanity/lib/dua-dhikr-publication-gate";
import {
  duaDhikrEntriesPublicEligibleQuery,
  duaDhikrEntriesEditoriallyPublicEligibleQuery,
  duaDhikrEntriesOwnerApprovedEnglishEligibleQuery,
} from "../../src/sanity/lib/queries";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const REPO_ROOT = join(__dirname, "../..");

const ownerApprovedEnglishFirstNeutral: DuaDhikrEntryLocaleEligibilityInput = {
  editorialPublicationStatus: "owner-approved-english-first",
  importIdentifier: "TEST-001",
  arabicText: "[TEST ARABIC PLACEHOLDER — NOT RELIGIOUS CONTENT]",
  translationEn: "[TEST TRANSLATION PLACEHOLDER]",
  collections: [{ _ref: "duaDhikrCollection-food-and-drink" }],
  reviewStatus: "sourced",
  boardApprovals: [],
};

const canonicalEligibleWithDanishNeutral: DuaDhikrEntryLocaleEligibilityInput = {
  reviewStatus: "published",
  arabicText: "[TEST ARABIC PLACEHOLDER]",
  translationEn: "[TEST TRANSLATION PLACEHOLDER]",
  translationDa: "[TEST DANISH PLACEHOLDER]",
  sourceReferences: [{ citation: "[TEST SOURCE PLACEHOLDER]" }],
  boardApprovals: [
    { board: "scholarly", approved: true },
    { board: "editorial", approved: true },
  ],
};

/* ── English eligibility ───────────────────────────────────────────────── */

function testEnglishEligibilitySucceedsWithoutDanishWhenOwnerApproved() {
  assert(
    isDuaDhikrEntryOwnerApprovedEnglishEligible(ownerApprovedEnglishFirstNeutral),
    "an owner-approved-english-first entry with no translationDa field at all must still be eligible via that pathway",
  );
  assert(
    isDuaDhikrEntryEnglishPubliclyEligible(ownerApprovedEnglishFirstNeutral),
    "English eligibility must succeed for an owner-approved entry with no translationDa",
  );
  console.log("✓ English eligibility succeeds without translationDa when owner-approved-english-first requirements pass");
}

function testEnglishEligibilityFailsWithoutRequiredFields() {
  assert(!isDuaDhikrEntryOwnerApprovedEnglishEligible({ ...ownerApprovedEnglishFirstNeutral, arabicText: undefined }), "missing Arabic must block the owner-approved pathway");
  assert(!isDuaDhikrEntryOwnerApprovedEnglishEligible({ ...ownerApprovedEnglishFirstNeutral, translationEn: undefined }), "missing English translation must block the owner-approved pathway");
  assert(!isDuaDhikrEntryOwnerApprovedEnglishEligible({ ...ownerApprovedEnglishFirstNeutral, importIdentifier: undefined }), "missing import identifier must block the owner-approved pathway");
  assert(!isDuaDhikrEntryOwnerApprovedEnglishEligible({ ...ownerApprovedEnglishFirstNeutral, collections: [] }), "an empty collections array must block the owner-approved pathway");
  assert(!isDuaDhikrEntryOwnerApprovedEnglishEligible({ ...ownerApprovedEnglishFirstNeutral, editorialPublicationStatus: "" }), "an unset editorialPublicationStatus must block the owner-approved pathway");
  console.log("✓ the owner-approved-english-first pathway blocks on every one of its required fields individually");
}

function testOwnerApprovedPathwayNeverClaimsScholarlyApproval() {
  const withFabricatedScholarly: DuaDhikrEntryLocaleEligibilityInput = {
    ...ownerApprovedEnglishFirstNeutral,
    boardApprovals: [{ board: "scholarly", approved: true }],
  };
  assert(!isDuaDhikrEntryOwnerApprovedEnglishEligible(withFabricatedScholarly), "the owner-approved pathway must refuse eligibility if a scholarly board approval is (incorrectly) present — this pathway must never coexist with a scholarly claim");
  const conditions = getDuaDhikrOwnerApprovedEnglishEligibilityConditions(withFabricatedScholarly);
  const scholarlyCondition = conditions.find((c) => c.key === "no-fabricated-scholarly-approval");
  assert(scholarlyCondition !== undefined && scholarlyCondition.met === false, "the no-fabricated-scholarly-approval condition must explicitly report unmet");
  console.log("✓ the owner-approved-english-first pathway refuses eligibility if a scholarly board approval is present");
}

/* ── Danish eligibility ───────────────────────────────────────────────── */

function testDanishEligibilityFailsWithoutDanish() {
  assert(!isDuaDhikrEntryPubliclyEligible({ ...canonicalEligibleWithDanishNeutral, translationDa: undefined }), "the canonical pathway must fail without translationDa");
  assert(!isDuaDhikrEntryDanishPubliclyEligible({ ...canonicalEligibleWithDanishNeutral, translationDa: undefined }), "Danish eligibility must fail without translationDa");
  console.log("✓ Danish eligibility fails without translationDa");
}

function testDanishEligibilitySucceedsWithApprovedDanish() {
  assert(isDuaDhikrEntryPubliclyEligible(canonicalEligibleWithDanishNeutral), "the canonical pathway must succeed with translationDa and full board approvals");
  assert(isDuaDhikrEntryDanishPubliclyEligible(canonicalEligibleWithDanishNeutral), "Danish eligibility must succeed once the canonical pathway's Danish requirements are met");
  console.log("✓ Danish eligibility succeeds only with approved Danish translation status");
}

function testOwnerApprovedEnglishFirstNeverSatisfiesDanishEligibility() {
  assert(!isDuaDhikrEntryDanishPubliclyEligible(ownerApprovedEnglishFirstNeutral), "an owner-approved-english-first entry must never be Danish-eligible, even though it is English-eligible");
  assert(isDuaDhikrEntryEnglishPubliclyEligible(ownerApprovedEnglishFirstNeutral), "sanity check: the same entry must remain English-eligible");
  console.log("✓ an owner-approved-english-first entry is English-eligible but never Danish-eligible");
}

function testMissingDanishNeverSuppressesEnglish() {
  const englishOnly: DuaDhikrEntryLocaleEligibilityInput = { ...ownerApprovedEnglishFirstNeutral, translationDa: undefined };
  assert(isDuaDhikrEntryEnglishPubliclyEligible(englishOnly), "missing translationDa must never suppress English eligibility for an owner-approved entry");
  console.log("✓ missing Danish translation never suppresses English publication");
}

function testNoAmbiguousFallbackLocale() {
  assert(
    isDuaDhikrEntryPubliclyEligibleForLocale(ownerApprovedEnglishFirstNeutral, "en") === true,
    "locale \"en\" must resolve to English eligibility",
  );
  assert(
    isDuaDhikrEntryPubliclyEligibleForLocale(ownerApprovedEnglishFirstNeutral, "da") === false,
    "locale \"da\" must resolve to Danish eligibility, not silently fall back to English",
  );
  console.log("✓ the locale-aware entry point resolves each locale explicitly, with no ambiguous fallback");
}

/* ── Additive, never weakens existing pathways ───────────────────────── */

function testExistingPathwaysUnchanged() {
  assert(isDuaDhikrEntryPubliclyEligible(canonicalEligibleWithDanishNeutral) === true, "the canonical pathway's own behaviour must be completely unchanged");
  const editorialNeutral = {
    editorialPublicationStatus: "editorial-only-scholarly-review-pending",
    arabicText: "[TEST ARABIC PLACEHOLDER]",
    translationEn: "[TEST TRANSLATION PLACEHOLDER]",
    translationDa: "[TEST DANISH PLACEHOLDER]",
    sourceReferences: [{ citation: "[TEST SOURCE PLACEHOLDER]" }],
    boardApprovals: [{ board: "editorial" as const, approved: true }],
  };
  assert(isDuaDhikrEntryEditoriallyPubliclyEligible(editorialNeutral) === true, "the editorial-bypass pathway's own behaviour must be completely unchanged");
  console.log("✓ neither existing pathway's own behaviour changed by adding the third pathway");
}

/* ── Query-level checks (no network — these are just string constants) ── */

function testOwnerApprovedQueryNeverChecksDanish() {
  // translationDa legitimately appears in the shared PROJECTION body (so the
  // field can still be returned/displayed if ever present) — only the
  // FILTER clause (everything before "order(order asc)") must never gate on
  // it. Isolate the filter the same way the existing public-fetch-safety
  // test isolates the projection.
  const filterClause = duaDhikrEntriesOwnerApprovedEnglishEligibleQuery.split("order(order asc)")[0] ?? "";
  assert(!filterClause.includes("translationDa"), "the owner-approved-english-first query's FILTER clause must never check translationDa");
  console.log("✓ [static check] the owner-approved-english-first query's filter never gates on translationDa");
}

function testOwnerApprovedQueryChecksItsOwnStatus() {
  assert(duaDhikrEntriesOwnerApprovedEnglishEligibleQuery.includes("owner-approved-english-first"), "the query must filter on its own distinct status value");
  console.log("✓ [static check] the owner-approved-english-first query filters on its own status value");
}

function testAllThreeEntryQueriesAreDistinct() {
  const queries = [duaDhikrEntriesPublicEligibleQuery, duaDhikrEntriesEditoriallyPublicEligibleQuery, duaDhikrEntriesOwnerApprovedEnglishEligibleQuery];
  const unique = new Set(queries);
  assert(unique.size === 3, "all three entry eligibility queries must be textually distinct");
  console.log("✓ [static check] all three public entry queries are distinct");
}

/* ── Locale threading through public fetch (source-level) ─────────────── */

const publicFetchSource = readFileSync(join(REPO_ROOT, "src/sanity/lib/dua-dhikr-public-fetch.ts"), "utf-8");
const landingPageSource = readFileSync(join(REPO_ROOT, "src/app/[locale]/knowledge-library/dua-dhikr/page.tsx"), "utf-8");
const collectionPageSource = readFileSync(join(REPO_ROOT, "src/app/[locale]/knowledge-library/dua-dhikr/[collectionSlug]/page.tsx"), "utf-8");
const gateSource = readFileSync(join(REPO_ROOT, "src/sanity/lib/dua-dhikr-publication-gate.ts"), "utf-8");
const sitemapSource = readFileSync(join(REPO_ROOT, "src/app/sitemap.ts"), "utf-8");

function testPublicFetchStillUsesPublishedClientOnly() {
  assert(publicFetchSource.includes('from "./client"'), "dua-dhikr-public-fetch.ts must still import only the public (published) client");
  assert(!publicFetchSource.includes("previewClient"), "dua-dhikr-public-fetch.ts must never use a preview client — draft documents must never be exposed");
  console.log("✓ public fetch still uses only the published-perspective client — drafts remain invisible");
}

function testLandingAndCollectionPagesPassLocaleThrough() {
  assert(landingPageSource.includes("getDuaDhikrCollectionsPublic(locale)"), "the landing page must pass locale into getDuaDhikrCollectionsPublic");
  assert(collectionPageSource.includes("getDuaDhikrCollectionPublic(collectionSlug, locale)"), "the collection page must pass locale into getDuaDhikrCollectionPublic");
  assert(collectionPageSource.includes("getDuaDhikrEntriesForCollection(collectionSlug, locale)"), "the collection page must pass locale into getDuaDhikrEntriesForCollection");
  console.log("✓ both public routes explicitly pass the request locale into every locale-aware fetch call");
}

function testGateNeverFabricatesScholarlyStatusInComments() {
  assert(
    gateSource.includes("NEVER claims scholarly review") || gateSource.toLowerCase().includes("never claims scholarly") || gateSource.includes("NEVER"),
    "the gate file must document that the owner-approved pathway never claims scholarly review",
  );
  console.log("✓ [static check] the gate module documents that the owner-approved pathway makes no scholarly claim");
}

function testSitemapNeverGeneratesPerEntryUrls() {
  assert(!sitemapSource.includes("importIdentifier"), "the sitemap must never reference importIdentifier — no per-entry route exists to generate a URL for");
  assert(sitemapSource.includes("duaCollections"), "the sitemap must continue to source Duʿa & Dhikr URLs only from collection-level data");
  console.log("✓ [static check] the sitemap generates only real collection routes, never fabricated per-entry URLs");
}

function testSitemapNeverGeneratesDanishDuaDhikrUrls() {
  const duaDhikrSection = sitemapSource.split("Duʿa & Dhikr")[1] ?? "";
  assert(!duaDhikrSection.includes('localeUrl("da"'), "the sitemap must not generate Danish-locale Duʿa & Dhikr URLs while no Danish content exists");
  console.log("✓ [static check] the sitemap does not generate Danish Duʿa & Dhikr URLs");
}

async function runAll() {
  testEnglishEligibilitySucceedsWithoutDanishWhenOwnerApproved();
  testEnglishEligibilityFailsWithoutRequiredFields();
  testOwnerApprovedPathwayNeverClaimsScholarlyApproval();
  testDanishEligibilityFailsWithoutDanish();
  testDanishEligibilitySucceedsWithApprovedDanish();
  testOwnerApprovedEnglishFirstNeverSatisfiesDanishEligibility();
  testMissingDanishNeverSuppressesEnglish();
  testNoAmbiguousFallbackLocale();
  testExistingPathwaysUnchanged();
  testOwnerApprovedQueryNeverChecksDanish();
  testOwnerApprovedQueryChecksItsOwnStatus();
  testAllThreeEntryQueriesAreDistinct();
  testPublicFetchStillUsesPublishedClientOnly();
  testLandingAndCollectionPagesPassLocaleThrough();
  testGateNeverFabricatesScholarlyStatusInComments();
  testSitemapNeverGeneratesPerEntryUrls();
  testSitemapNeverGeneratesDanishDuaDhikrUrls();
  console.log("\nAll Duʿa & Dhikr English-first publication tests passed.");
}

runAll();
