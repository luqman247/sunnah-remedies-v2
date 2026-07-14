/**
 * Dhikr Internal Review Tests — Stage 2E.
 *
 * Covers the expanded staff-only internal query (dhikrItemsInternalDetailQuery),
 * the internal fetch layer (getDhikrItemsInternalDetail), and the rebuilt
 * /dhikr-review page.
 *
 * Tests are a mix of:
 *   - behavioural: import the real functions (computeDhikrReviewSummary,
 *     filterDhikrItems, getDhikrItemsInternalDetail) and assert on their
 *     actual return values. No live Sanity dataset is required for the
 *     pure-function tests; getDhikrItemsInternalDetail resolves to an
 *     empty array on any fetch failure (documented, existing behaviour),
 *     so it is safe to call without a live dataset.
 *   - static: read a file's own source text with node:fs and assert on it
 *     directly, labelled "[static check]".
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import {
  computeDhikrReviewSummary,
  filterDhikrItems,
} from "../../src/app/(staff)/dhikr-review/page";
import { getDhikrItemsInternalDetail, type DhikrItemInternalDetail } from "../../src/sanity/lib/dhikr-fetch";
import { dhikrItemsPublicEligibleQuery, dhikrItemsInternalDetailQuery } from "../../src/sanity/lib/queries";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const REPO_ROOT = join(__dirname, "../..");
const PAGE_PATH = join(REPO_ROOT, "src/app/(staff)/dhikr-review/page.tsx");
const FETCH_PATH = join(REPO_ROOT, "src/sanity/lib/dhikr-fetch.ts");
const QUERIES_PATH = join(REPO_ROOT, "src/sanity/lib/queries.ts");
const SITEMAP_PATH = join(REPO_ROOT, "src/app/sitemap.ts");
const MIDDLEWARE_PATH = join(REPO_ROOT, "middleware.ts");

const pageSource = readFileSync(PAGE_PATH, "utf-8");
const fetchSource = readFileSync(FETCH_PATH, "utf-8");

/* ── 1. Internal query includes the required internal fields ────────── */

function testInternalQueryIncludesRequiredFields() {
  const requiredFields = [
    "_id", "_type", "_updatedAt", "titleEn", "titleDa", "slug",
    "categoryNameEn", "categoryNameDa", "categorySlug", "order", "tags",
    "arabicText", "transliteration", "translationEn", "translationDa",
    "recommendedRepetitions", "audioAssetTitle", "sourceReferences",
    "reviewStatus", "boardApprovals",
  ];
  for (const field of requiredFields) {
    assert(dhikrItemsInternalDetailQuery.includes(field), `dhikrItemsInternalDetailQuery must include "${field}"`);
  }
  // Source reference / board approval sub-fields, taken from the actual schema objects, not invented.
  for (const field of ["type", "citation", "hadithCollection", "hadithNumber", "hadithGrading", "surah", "ayah", "sourceUrl", "verifiedStatus"]) {
    assert(dhikrItemsInternalDetailQuery.includes(field), `dhikrItemsInternalDetailQuery's sourceReferences projection must include "${field}"`);
  }
  for (const field of ["board", "approved", "approver", "date", "notes"]) {
    assert(dhikrItemsInternalDetailQuery.includes(field), `dhikrItemsInternalDetailQuery's boardApprovals projection must include "${field}"`);
  }
  console.log("✓ the internal detail query includes every required internal field, using the actual schema field names");
}

/* ── 2. Public query remains unchanged ───────────────────────────────── */

function testPublicQueryUnchanged() {
  const expectedProjectedFields = [
    "_id", "slug", "titleEn", "titleDa", "order", "arabicText", "transliteration",
    "translationEn", "translationDa", "categoryName", "categoryNameDa", "categorySlug",
  ];
  for (const field of expectedProjectedFields) {
    assert(dhikrItemsPublicEligibleQuery.includes(field), `dhikrItemsPublicEligibleQuery must still project "${field}"`);
  }
  console.log("✓ the public query's projection is unchanged by Stage 2E");
}

/* ── 3. Governance fields appear only in the internal query ─────────── */

function testGovernanceFieldsOnlyInInternalQuery() {
  const filterEnd = dhikrItemsPublicEligibleQuery.indexOf("]");
  const publicProjection = dhikrItemsPublicEligibleQuery.slice(dhikrItemsPublicEligibleQuery.indexOf("{", filterEnd));
  for (const forbidden of ["reviewStatus", "boardApprovals", "approver", "\"notes\"", "notes,"]) {
    assert(!publicProjection.includes(forbidden), `public projection must not include "${forbidden}"`);
  }
  assert(dhikrItemsInternalDetailQuery.includes("reviewStatus"), "the internal query must include reviewStatus");
  assert(dhikrItemsInternalDetailQuery.includes("boardApprovals"), "the internal query must include boardApprovals");
  assert(dhikrItemsInternalDetailQuery.includes("approver"), "the internal query must include approver");
  console.log("✓ governance fields (reviewStatus, boardApprovals, approver, notes) appear only in the internal query, never the public one");
}

/* ── 4. Staff fetch function uses the internal/preview client ───────── */

function testFetchFunctionUsesPreviewClient() {
  const importLines = fetchSource.split("\n").filter((l) => /^\s*import\b/.test(l));
  assert(importLines.some((l) => /previewClient/.test(l)), "dhikr-fetch.ts must import previewClient");
  assert(
    /getDhikrItemsInternalDetail[\s\S]*?previewClient\.fetch/.test(fetchSource),
    "getDhikrItemsInternalDetail must call previewClient.fetch, not the public client",
  );
  console.log("✓ [static check] getDhikrItemsInternalDetail uses previewClient");
}

/* ── 5. No file under src/app/[locale]/ imports dhikr-fetch.ts ──────── */

function testNoPublicRouteImportsDhikrFetch() {
  const localeAppDir = join(REPO_ROOT, "src/app/[locale]");
  const offenders: string[] = [];
  function walk(dir: string) {
    if (!existsSync(dir)) return;
    for (const entry of require("node:fs").readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(ts|tsx)$/.test(entry.name)) {
        const src = readFileSync(full, "utf-8");
        if (/dhikr-fetch["']/.test(src)) offenders.push(full);
      }
    }
  }
  walk(localeAppDir);
  assert(offenders.length === 0, `no route under src/app/[locale]/ may import dhikr-fetch.ts, found: ${offenders.join(", ")}`);
  console.log("✓ [static check] no route under src/app/[locale]/ imports dhikr-fetch.ts");
}

/* ── 6 & 7. Page imports the canonical function, does not hard-code it ── */

function testPageImportsGetDhikrEligibilityConditions() {
  assert(
    /import\s*\{[\s\S]*?getDhikrEligibilityConditions[\s\S]*?\}\s*from\s*["']@\/sanity\/lib\/dhikr-publication-gate["']/.test(pageSource),
    "the page must import getDhikrEligibilityConditions from the canonical gate",
  );
  console.log("✓ [static check] the page imports getDhikrEligibilityConditions");
}

function testPageDoesNotHardCodeConditionKeys() {
  const canonicalKeys = [
    "review-status-published", "arabic-present", "english-translation-present",
    "danish-translation-present", "valid-source-reference-present",
    "scholarly-approval-present", "editorial-approval-present",
  ];
  for (const key of canonicalKeys) {
    assert(!pageSource.includes(`"${key}"`) && !pageSource.includes(`'${key}'`), `the page must not hard-code the condition key literal "${key}"`);
  }
  console.log("✓ [static check] the page never hard-codes any of the seven canonical condition keys");
}

/* ── 8. Arabic output includes RTL and lang attributes ───────────────── */

function testArabicOutputHasRtlAndLangAttributes() {
  assert(pageSource.includes('dir="rtl"'), 'the page must render dir="rtl" for Arabic text');
  assert(pageSource.includes('lang="ar"'), 'the page must render lang="ar" for Arabic text');
  console.log("✓ [static check] Arabic output includes dir=\"rtl\" and lang=\"ar\"");
}

/* ── 9. Canonical and advisory sections are separated ────────────────── */

function testCanonicalAndAdvisorySectionsSeparated() {
  assert(pageSource.includes("Canonical Readiness"), "the page must have a Canonical Readiness section");
  assert(pageSource.includes("not part of the canonical public eligibility gate"), "the page must label the advisory section as non-canonical");
  const canonicalIndex = pageSource.indexOf("Canonical Readiness");
  const advisoryIndex = pageSource.indexOf("Advisory checks");
  assert(canonicalIndex > -1 && advisoryIndex > canonicalIndex, "the canonical section must appear before the advisory section");
  console.log("✓ [static check] canonical and advisory sections are distinct and separated");
}

/* ── 10. Scholarly and editorial approvals displayed separately ─────── */

function testApprovalsDisplayedSeparately() {
  assert(pageSource.includes('board === "scholarly"'), "the page must filter approvals by board === \"scholarly\" separately");
  assert(pageSource.includes('board === "editorial"'), "the page must filter approvals by board === \"editorial\" separately");
  assert(pageSource.includes("Scholarly approval"), "the page must have a distinct Scholarly approval heading");
  assert(pageSource.includes("Editorial approval"), "the page must have a distinct Editorial approval heading");
  console.log("✓ [static check] scholarly and editorial approvals are filtered and displayed in two separate blocks");
}

/* ── 11. No mutation controls or document actions added ─────────────── */

function testNoMutationControlsOrActions() {
  assert(!existsSync(join(REPO_ROOT, "src/sanity/actions")), "src/sanity/actions/ must not exist");
  assert(!/\.patch\s*\(/.test(pageSource) && !/client\.create/.test(pageSource) && !/useDocumentOperation/.test(pageSource), "the page must not call any Sanity mutation API");
  assert(!/onClick=/.test(pageSource), "the page must not have any onClick handler (no client-side mutation controls)");
  assert(!pageSource.includes('"use client"'), "the page must remain a server component (no client-side interactivity/mutation surface)");
  console.log("✓ [static check] no mutation control, document action, or client-side interactivity was added");
}

/* ── 12. /dhikr-review remains noindex ───────────────────────────────── */

function testPageRemainsNoindex() {
  assert(/robots:\s*\{\s*index:\s*false,\s*follow:\s*false\s*\}/.test(pageSource), "the page's metadata must still set robots: { index: false, follow: false }");
  console.log("✓ [static check] /dhikr-review metadata is still noindex, nofollow");
}

/* ── 13. Auth boundary files unchanged ───────────────────────────────── */

function testAuthBoundaryUnchanged() {
  const middlewareSource = readFileSync(MIDDLEWARE_PATH, "utf-8");
  const authBlockMatch = middlewareSource.match(/if \(([\s\S]*?)\)\s*\{\s*return \(authMiddleware/);
  assert(!!authBlockMatch, "could not locate the auth-protected pathname block in middleware.ts");
  assert(authBlockMatch![1].includes('pathname.startsWith("/dhikr-review")'), "middleware.ts must still gate \"/dhikr-review\" through authMiddleware");
  console.log("✓ [static check] /dhikr-review remains in middleware.ts's staff authentication matcher, unchanged");
}

/* ── 14. Public sitemap is unchanged ─────────────────────────────────── */

function testSitemapUnchanged() {
  const sitemapSource = readFileSync(SITEMAP_PATH, "utf-8");
  assert(!sitemapSource.includes("dhikrItemsInternalDetailQuery"), "sitemap.ts must not reference the new internal detail query");
  assert(!sitemapSource.includes("dhikr-fetch"), "sitemap.ts must not import dhikr-fetch.ts");
  assert(!sitemapSource.includes("DhikrItemInternalDetail"), "sitemap.ts must not reference the internal detail type");
  console.log("✓ [static check] the public sitemap is unchanged and references none of Stage 2E's internal-only additions");
}

/* ── 15. No religious content added ──────────────────────────────────── */

function testNoReligiousContentAdded() {
  const queriesSource = readFileSync(QUERIES_PATH, "utf-8");
  const combined = pageSource + fetchSource + queriesSource;
  assert(!/[؀-ۿ]/.test(combined), "no Arabic script may appear in Stage 2E's files");
  const suspiciousTerms = ["sahih al-bukhari", "sahih muslim", "abu dawud", "tirmidhi", "ibn majah", "musnad ahmad"];
  const lower = combined.toLowerCase();
  for (const term of suspiciousTerms) {
    assert(!lower.includes(term), `no real hadith-collection citation ("${term}") may appear in Stage 2E's files`);
  }
  console.log("✓ no Arabic script or real hadith-collection citation appears anywhere in Stage 2E's files");
}

/* ── Behavioural: getDhikrItemsInternalDetail resolves safely ───────── */

async function testInternalDetailFetchResolvesSafely() {
  const result = await getDhikrItemsInternalDetail();
  assert(Array.isArray(result), "getDhikrItemsInternalDetail must resolve to an array (empty on failure/no dataset), never throw");
  console.log(`✓ getDhikrItemsInternalDetail resolves to an array (${result.length} item(s) currently)`);
}

/* ── Behavioural: computeDhikrReviewSummary ──────────────────────────── */

function fixture(overrides: Partial<DhikrItemInternalDetail>): DhikrItemInternalDetail {
  return {
    _id: "test",
    _type: "dhikrItem",
    _updatedAt: "2026-01-01T00:00:00Z",
    titleEn: "Test",
    hasAudioAsset: false,
    sourceReferences: [],
    reviewStatus: "sourced",
    boardApprovals: [],
    ...overrides,
  };
}

const FULLY_ELIGIBLE = fixture({
  reviewStatus: "published",
  arabicText: "x",
  translationEn: "x",
  translationDa: "x",
  sourceReferences: [{ type: "hadith", citation: "x" }],
  boardApprovals: [
    { board: "scholarly", approved: true },
    { board: "editorial", approved: true },
  ],
});

function testComputeDhikrReviewSummaryCounts() {
  const items: DhikrItemInternalDetail[] = [
    fixture({ reviewStatus: "sourced" }),
    fixture({ reviewStatus: "sourced" }),
    fixture({ reviewStatus: "scholarly-review" }),
    fixture({ reviewStatus: "editorial-review" }),
    fixture({ reviewStatus: "approved" }),
    { ...FULLY_ELIGIBLE }, // published AND eligible
    fixture({ reviewStatus: "published" }), // published but NOT eligible (missing everything else)
  ];
  const summary = computeDhikrReviewSummary(items);
  assert(summary.total === 7, `total must be 7, got ${summary.total}`);
  assert(summary.sourced === 2, `sourced must be 2, got ${summary.sourced}`);
  assert(summary.scholarlyReview === 1, `scholarlyReview must be 1, got ${summary.scholarlyReview}`);
  assert(summary.editorialReview === 1, `editorialReview must be 1, got ${summary.editorialReview}`);
  assert(summary.approved === 1, `approved must be 1, got ${summary.approved}`);
  assert(summary.published === 2, `published must be 2 (both published-status items), got ${summary.published}`);
  assert(summary.canonicallyEligible === 1, `canonicallyEligible must be 1 (only the fully valid item), got ${summary.canonicallyEligible}`);
  assert(summary.incomplete === 6, `incomplete must be 6 (everything except the fully valid item), got ${summary.incomplete}`);
  console.log("✓ computeDhikrReviewSummary produces correct counts, including a published-but-ineligible item counted as both published and incomplete");
}

function testFilterDhikrItems() {
  const items: DhikrItemInternalDetail[] = [
    fixture({ reviewStatus: "sourced" }),
    fixture({ reviewStatus: "approved" }),
    { ...FULLY_ELIGIBLE },
  ];
  assert(filterDhikrItems(items, undefined).length === 3, "no filter (undefined) must return all items");
  assert(filterDhikrItems(items, "all").length === 3, '"all" must return all items');
  assert(filterDhikrItems(items, "sourced").length === 1, '"sourced" must return only the sourced item');
  assert(filterDhikrItems(items, "approved").length === 1, '"approved" must return only the approved item');
  const incomplete = filterDhikrItems(items, "incomplete");
  assert(incomplete.length === 2, '"incomplete" must return the sourced and approved items (not the fully eligible one)');
  console.log('✓ filterDhikrItems correctly filters by reviewStatus and by the calculated "incomplete" view');
}

async function runAll() {
  testInternalQueryIncludesRequiredFields();
  testPublicQueryUnchanged();
  testGovernanceFieldsOnlyInInternalQuery();
  testFetchFunctionUsesPreviewClient();
  testNoPublicRouteImportsDhikrFetch();
  testPageImportsGetDhikrEligibilityConditions();
  testPageDoesNotHardCodeConditionKeys();
  testArabicOutputHasRtlAndLangAttributes();
  testCanonicalAndAdvisorySectionsSeparated();
  testApprovalsDisplayedSeparately();
  testNoMutationControlsOrActions();
  testPageRemainsNoindex();
  testAuthBoundaryUnchanged();
  testSitemapUnchanged();
  testNoReligiousContentAdded();
  await testInternalDetailFetchResolvesSafely();
  testComputeDhikrReviewSummaryCounts();
  testFilterDhikrItems();
  console.log("\nAll Dhikr internal-review tests passed.");
}

runAll();
