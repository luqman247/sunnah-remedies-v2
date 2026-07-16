/**
 * Dhikr Public Fetch Tests — Stage 2 (public data layer).
 *
 * Covers the requirements from docs/dhikr/21-decision-log.md's Stage 2
 * entry: the public query must interpolate the canonical eligibility gate,
 * use the public client (never previewClient), project no governance/
 * reviewer fields, never import staff-only modules or the placeholder
 * register, derive categories only from eligible items, and no item-detail
 * or category route may exist yet.
 *
 * Tests are a mix of:
 *   - behavioural: import the real query string / real functions and assert
 *     on them directly (no live Sanity dataset exists for this prototype,
 *     so nothing here executes a live GROQ query or live HTTP request).
 *   - static source-inspection: read a file's own source text with
 *     node:fs and assert on it, exactly as
 *     tests/dhikr/dhikr-review-status-gating.test.ts already does for
 *     middleware.ts. Each such test is explicitly labelled "[static check]".
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { DHIKR_ELIGIBILITY_GROQ } from "../../src/sanity/lib/dhikr-publication-gate";
import { dhikrItemsPublicEligibleQuery } from "../../src/sanity/lib/queries";
import {
  getDhikrItemsPublic,
  getDhikrCategoriesPublic,
  type DhikrItemPublic,
} from "../../src/sanity/lib/dhikr-public-fetch";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const REPO_ROOT = join(__dirname, "../..");
const PUBLIC_FETCH_PATH = join(REPO_ROOT, "src/sanity/lib/dhikr-public-fetch.ts");
const publicFetchSource = readFileSync(PUBLIC_FETCH_PATH, "utf-8");

/* ── Query uses the canonical gate, inside the filter ────────────────── */

function testPublicQueryInterpolatesCanonicalGate() {
  assert(
    dhikrItemsPublicEligibleQuery.includes(DHIKR_ELIGIBILITY_GROQ),
    "dhikrItemsPublicEligibleQuery must interpolate DHIKR_ELIGIBILITY_GROQ, not a hand-copied filter",
  );
  const filterPos = dhikrItemsPublicEligibleQuery.indexOf(DHIKR_ELIGIBILITY_GROQ);
  const projectionPos = dhikrItemsPublicEligibleQuery.indexOf("{", filterPos);
  assert(
    filterPos > -1 && projectionPos > filterPos,
    "the eligibility gate must appear inside the query's *[...] filter, before the { projection }, not applied after fetching",
  );
  console.log("✓ public query interpolates the canonical gate inside its GROQ filter (not post-fetch filtering)");
}

/* ── Every non-published reviewStatus remains excluded (gate untouched) ── */

function testEveryNonPublishedStatusStillExcluded() {
  const nonPublished = ["sourced", "scholarly-review", "editorial-review", "approved"];
  for (const status of nonPublished) {
    assert(
      !DHIKR_ELIGIBILITY_GROQ.includes(`reviewStatus == "${status}"`),
      `DHIKR_ELIGIBILITY_GROQ must not admit reviewStatus "${status}"`,
    );
  }
  assert(
    DHIKR_ELIGIBILITY_GROQ.includes('reviewStatus == "published"'),
    "DHIKR_ELIGIBILITY_GROQ must require reviewStatus == \"published\" exactly",
  );
  console.log("✓ the gate consumed by the public query still excludes every non-published reviewStatus");
}

/* ── Public client, never previewClient ──────────────────────────────── */

function testPublicFetchUsesPublicClientOnly() {
  assert(
    /import\s*\{\s*client\s*\}\s*from\s*["']\.\/client["']/.test(publicFetchSource),
    "[static check] dhikr-public-fetch.ts must import the public `client` from ./client",
  );
  const importLines = publicFetchSource.split("\n").filter((line) => /^\s*import\b/.test(line));
  assert(
    !importLines.some((line) => /previewClient/.test(line)),
    "[static check] dhikr-public-fetch.ts must never import previewClient",
  );
  assert(
    !/previewClient\s*\./.test(publicFetchSource),
    "[static check] dhikr-public-fetch.ts must never call previewClient.* (prose mentions of the word in comments are fine)",
  );
  console.log("✓ [static check] dhikr-public-fetch.ts imports only the public client, never previewClient");
}

/* ── Never imports staff-only modules or the placeholder register ───── */

function testPublicFetchNeverImportsStaffOnlyModules() {
  const importLines = publicFetchSource.split("\n").filter((line) => /^\s*import\b/.test(line));
  assert(
    !importLines.some((line) => /\.\/dhikr-fetch["']/.test(line)),
    "[static check] dhikr-public-fetch.ts must never import ./dhikr-fetch (staff-only)",
  );
  assert(
    !importLines.some((line) => /DHIKR_V1_PLACEHOLDER_REGISTER/.test(line)),
    "[static check] dhikr-public-fetch.ts must never import DHIKR_V1_PLACEHOLDER_REGISTER (prose mentions in comments are fine)",
  );
  console.log("✓ [static check] dhikr-public-fetch.ts imports neither dhikr-fetch.ts nor the placeholder register");
}

function testNoPublicRouteImportsStaffOnlyFetchModule() {
  const localeAppDir = join(REPO_ROOT, "src/app/[locale]");
  const offenders: string[] = [];

  function walk(dir: string) {
    if (!existsSync(dir)) return;
    for (const entry of require("node:fs").readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (/\.(ts|tsx)$/.test(entry.name)) {
        const src = readFileSync(full, "utf-8");
        if (/dhikr-fetch["']/.test(src)) offenders.push(full);
      }
    }
  }
  walk(localeAppDir);

  assert(
    offenders.length === 0,
    `[static check] no route under src/app/[locale]/ may import dhikr-fetch.ts, but found: ${offenders.join(", ")}`,
  );
  console.log("✓ [static check] no route under src/app/[locale]/ imports the staff-only dhikr-fetch.ts module");
}

/* ── Public projection omits governance/reviewer fields ─────────────── */

/**
 * Isolates the projection ({ ... } block) from the *[ filter ] that precedes
 * it, so this check inspects only what is returned to the caller — the
 * filter legitimately contains "reviewStatus" (as part of the eligibility
 * gate condition itself), which must not be confused with the field being
 * absent from the projected result.
 */
function extractProjection(query: string): string {
  const filterEnd = query.indexOf("]");
  const projectionStart = query.indexOf("{", filterEnd);
  return query.slice(projectionStart);
}

function testPublicProjectionOmitsGovernanceFields() {
  const projection = extractProjection(dhikrItemsPublicEligibleQuery);
  const forbidden = [
    "reviewStatus",
    "boardApprovals",
    "approver",
    "\"date\":", // boardApproval.date
    "notes,", // boardApproval.notes (internal editorial note)
    "audioAsset",
    "tags,",
    "_createdAt",
    "_updatedAt",
    "_rev",
  ];
  for (const term of forbidden) {
    assert(
      !projection.includes(term),
      `dhikrItemsPublicEligibleQuery's projection (not its filter) must not include forbidden term "${term}"`,
    );
  }
  console.log("✓ public query projection contains none of the forbidden governance/reviewer/workflow field names");
}

function testSourceReferenceProjectionIsExplicitFieldList() {
  assert(
    !/"sourceReferences":\s*sourceReferences\s*$/m.test(dhikrItemsPublicEligibleQuery) &&
      !dhikrItemsPublicEligibleQuery.includes("sourceReferences[]{...}") &&
      !dhikrItemsPublicEligibleQuery.includes("sourceReferences,"),
    "sourceReferences must not be projected as a bare/implicit spread — it must be an explicit field-by-field projection",
  );
  const expectedFields = [
    "type", "citation", "hadithCollection", "hadithNumber",
    "hadithGrading", "surah", "ayah", "sourceUrl", "verifiedStatus",
  ];
  for (const field of expectedFields) {
    assert(
      dhikrItemsPublicEligibleQuery.includes(field),
      `sourceReferences projection must explicitly name field "${field}"`,
    );
  }
  console.log("✓ sourceReferences is projected as an explicit, named field list (no implicit spread)");
}

/* ── Categories derived only from eligible items, never a direct query ── */

function testCategoriesNeverQueriedDirectly() {
  assert(
    !/_type\s*==\s*["']dhikrCategory["']/.test(publicFetchSource),
    "[static check] dhikr-public-fetch.ts must never query dhikrCategory directly — categories must be derived from eligible items only",
  );
  const fetchCallCount = (publicFetchSource.match(/client\.fetch/g) ?? []).length;
  assert(
    fetchCallCount === 2,
    `[static check] dhikr-public-fetch.ts should call client.fetch exactly twice (the scholarly-approved items query and the separate editorial-publication items query — see dhikrItemsEditoriallyPublicEligibleQuery); found ${fetchCallCount} — an unexpected additional call would suggest a category query or a third pathway was added without review`,
  );
  console.log("✓ [static check] dhikr-public-fetch.ts issues exactly two Sanity item queries (both non-category) and never queries dhikrCategory directly");
}

async function testGetDhikrCategoriesPublicGroupsFromItemsOnly() {
  const items = await getDhikrItemsPublic();
  const categories = await getDhikrCategoriesPublic();
  assert(
    Array.isArray(items) && Array.isArray(categories),
    "getDhikrItemsPublic and getDhikrCategoriesPublic must both resolve to arrays even with no live dataset (empty, not an error)",
  );
  const itemCategorySlugs = new Set(items.map((i) => i.categorySlug).filter(Boolean));
  for (const category of categories) {
    assert(
      itemCategorySlugs.has(category.slug),
      `every category returned by getDhikrCategoriesPublic must trace back to at least one eligible item's categorySlug (got "${category.slug}")`,
    );
    assert(category.items.length > 0, `category "${category.slug}" must have at least one item — empty categories must never appear`);
  }
  console.log(`✓ getDhikrCategoriesPublic derives categories only from eligible items (currently ${items.length} eligible item(s), ${categories.length} categor${categories.length === 1 ? "y" : "ies"})`);
}

/* ── No category or item-detail route created (landing page is Stage 3+) ─
 *
 * As of Stage 3, the landing page (.../dhikr/page.tsx) legitimately exists
 * — see tests/dhikr/dhikr-landing-page.test.ts. This test now guards only
 * the routes that remain out of scope: category scaffolding (Stage 4) and
 * the deferred item-detail route (see docs/dhikr/21-decision-log.md,
 * ADR-015).
 */

function testNoCategoryOrItemPagesCreatedYet() {
  const forbiddenRoutes = [
    "src/app/[locale]/knowledge-library/dhikr/[category]/page.tsx",
    "src/app/[locale]/knowledge-library/dhikr/[slug]/page.tsx",
    "src/app/[locale]/knowledge-library/dhikr/[category]/[slug]/page.tsx",
  ];
  for (const relPath of forbiddenRoutes) {
    assert(
      !existsSync(join(REPO_ROOT, relPath)),
      `[static check] no category or item-detail Dhikr page may exist yet, but found: ${relPath}`,
    );
  }
  console.log("✓ [static check] no category or item-detail Dhikr page exists yet (landing page is in scope as of Stage 3)");
}

function testItemDetailRouteRemainsAbsent() {
  const neverRoutes = [
    "src/app/[locale]/knowledge-library/dhikr/[slug]",
    "src/app/[locale]/knowledge-library/dhikr/[category]/[slug]",
  ];
  for (const relPath of neverRoutes) {
    assert(
      !existsSync(join(REPO_ROOT, relPath)),
      `[static check] the item-detail route is deferred and must not exist: ${relPath}`,
    );
  }
  console.log("✓ [static check] the deferred item-detail route directories do not exist");
}

/* ── Type-shape sanity: DhikrItemPublic carries no governance field ──── */

function testDhikrItemPublicTypeHasNoGovernanceKeys() {
  const sample: DhikrItemPublic = {
    _id: "test",
    titleEn: "test",
    arabicText: "test",
    translationEn: "test",
    translationDa: "test",
    sourceReferences: [],
    publicationPathway: "scholarly-approved",
  };
  const keys = Object.keys(sample);
  const forbiddenKeys = ["reviewStatus", "boardApprovals", "reviewer", "internalNote", "editorialNote"];
  for (const key of forbiddenKeys) {
    assert(!keys.includes(key), `DhikrItemPublic sample must not carry a "${key}" key`);
  }
  console.log("✓ DhikrItemPublic's shape (as constructed) carries no governance/reviewer keys");
}

async function runAll() {
  testPublicQueryInterpolatesCanonicalGate();
  testEveryNonPublishedStatusStillExcluded();
  testPublicFetchUsesPublicClientOnly();
  testPublicFetchNeverImportsStaffOnlyModules();
  testNoPublicRouteImportsStaffOnlyFetchModule();
  testPublicProjectionOmitsGovernanceFields();
  testSourceReferenceProjectionIsExplicitFieldList();
  testCategoriesNeverQueriedDirectly();
  await testGetDhikrCategoriesPublicGroupsFromItemsOnly();
  testNoCategoryOrItemPagesCreatedYet();
  testItemDetailRouteRemainsAbsent();
  testDhikrItemPublicTypeHasNoGovernanceKeys();
  console.log("\nAll Dhikr public-fetch tests passed.");
}

runAll();
