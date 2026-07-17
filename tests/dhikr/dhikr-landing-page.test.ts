/**
 * Dhikr Landing Page Tests — Stage 3 (Knowledge Library landing integration).
 *
 * All tests here are static source/config inspection — no dev server, no
 * live HTTP request, no browser is used anywhere in this file. Each test
 * reads real repository files (the page component, message catalogues,
 * navigation config, locale config, route directories) and asserts on
 * their content directly. This mirrors the convention already used in
 * tests/dhikr/dhikr-review-status-gating.test.ts for middleware.ts.
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import en from "../../src/messages/en.json";
import da from "../../src/messages/da.json";
import { LOCALES } from "../../src/i18n/locales";
import { knowledgeLibrary, departments } from "../../src/lib/navigation/site-structure";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const REPO_ROOT = join(__dirname, "../..");
const PAGE_PATH = join(REPO_ROOT, "src/app/[locale]/knowledge-library/dhikr/page.tsx");
const pageSource = existsSync(PAGE_PATH) ? readFileSync(PAGE_PATH, "utf-8") : "";

/* ── Route existence and locale resolution ───────────────────────────── */

function testEnglishRouteFileExists() {
  assert(existsSync(PAGE_PATH), "src/app/[locale]/knowledge-library/dhikr/page.tsx must exist");
  console.log("✓ landing page route file exists at src/app/[locale]/knowledge-library/dhikr/page.tsx");
}

function testDanishRouteResolvesThroughDkPrefix() {
  const da = LOCALES.find((l) => l.id === "da");
  assert(!!da, "the \"da\" locale must be configured in src/i18n/locales.ts");
  assert(
    da!.prefix === "/dk",
    `the Danish locale prefix must be "/dk" (confirmed during Stage 1 repository verification), got "${da!.prefix}"`,
  );
  const enLocale = LOCALES.find((l) => l.id === "en");
  assert(enLocale?.prefix === "", "the English locale must remain unprefixed");
  console.log('✓ [config check] Danish resolves via the existing "/dk" prefix; the single [locale] route file serves both EN and DA — no separate Danish page file is needed or was created');
}

/* ── Imports: public fetch only, never staff-only modules ────────────── */

function testPageImportsOnlyPublicFetchModule() {
  assert(
    pageSource.includes('from "@/sanity/lib/dhikr-public-fetch"'),
    "the landing page must import from @/sanity/lib/dhikr-public-fetch",
  );
  console.log("✓ [static check] landing page imports @/sanity/lib/dhikr-public-fetch");
}

function testPageNeverImportsStaffOnlyFetchModule() {
  // Only import lines are checked (not prose/JSDoc, which legitimately
  // documents the restriction in comments using the same words). "dhikr-
  // public-fetch" does not contain "dhikr-fetch" as a contiguous substring
  // ("...dhikr-" + "public-fetch", not "...dhikr-" + "fetch"), so this
  // safely distinguishes an import of the two different modules.
  const importLines = pageSource.split("\n").filter((line) => /^\s*import\b/.test(line));
  assert(
    !importLines.some((line) => line.includes("dhikr-fetch")),
    "the landing page must never import the staff-only dhikr-fetch.ts module",
  );
  console.log("✓ [static check] landing page imports contain no reference to the staff-only dhikr-fetch.ts module");
}

function testPageNeverImportsPlaceholderRegister() {
  const importLines = pageSource.split("\n").filter((line) => /^\s*import\b/.test(line));
  assert(
    !importLines.some((line) => line.includes("DHIKR_V1_PLACEHOLDER_REGISTER")),
    "the landing page must never import DHIKR_V1_PLACEHOLDER_REGISTER",
  );
  console.log("✓ [static check] landing page imports contain no reference to DHIKR_V1_PLACEHOLDER_REGISTER");
}

/* ── Approved copy is present, verbatim ──────────────────────────────── */

function testApprovedEnglishEmptyStateCopyPresent() {
  const expected = "Daily Dhikr is being prepared and reviewed. Verified entries will appear here once scholarly and editorial review is complete.";
  const actual = (en as { dhikr?: { emptyState?: { body?: string } } }).dhikr?.emptyState?.body;
  assert(actual === expected, `en.json dhikr.emptyState.body must exactly match the approved copy, got: "${actual}"`);
  console.log("✓ approved English empty-state copy is present verbatim in en.json");
}

function testApprovedDanishEmptyStateCopyPresent() {
  const expected = "Daglig dhikr er under forberedelse og gennemgang. Verificerede tekster vises her, når den faglige og redaktionelle gennemgang er afsluttet.";
  const actual = (da as { dhikr?: { emptyState?: { body?: string } } }).dhikr?.emptyState?.body;
  assert(actual === expected, `da.json dhikr.emptyState.body must exactly match the approved copy, got: "${actual}"`);
  console.log("✓ approved Danish empty-state copy is present verbatim in da.json");
}

function testEmptyStateRenderBranchExistsInPage() {
  assert(
    pageSource.includes("emptyState.heading") && pageSource.includes("emptyState.body"),
    "the landing page must render dhikr.emptyState.heading and dhikr.emptyState.body when there are zero eligible items",
  );
  console.log("✓ [static check] landing page renders the emptyState.heading/body translation keys");
}

/* ── No governance/workflow fields in page source ────────────────────── */

function testPageSourceHasNoGovernanceFields() {
  const forbidden = ["reviewStatus", "boardApprovals", "approver", "reviewer", "editorialNote", "internalNote", "draftStatus"];
  for (const term of forbidden) {
    assert(!pageSource.includes(term), `landing page source must not reference "${term}"`);
  }
  console.log("✓ [static check] landing page source contains no governance/workflow field names");
}

/* ── Knowledge Library entry point ───────────────────────────────────── */

function testKnowledgeLibrarySectionsPointsToDhikrLanding() {
  // Superseded by the Duʿa & Dhikr expansion (docs/dua-dhikr/
  // INFORMATION_ARCHITECTURE.md): the sidebar entry now points at the new
  // canonical hub, /knowledge-library/dua-dhikr, which itself links to
  // Morning/Evening Dhikr and supersedes this page's plain-list UI. This
  // page (src/app/[locale]/knowledge-library/dhikr/page.tsx) is kept in
  // place, unmodified, and reachable only via a permanent redirect
  // (next.config.ts) — hence the rest of this test file's assertions about
  // its own source/content remain valid and unchanged.
  const entry = knowledgeLibrary.sections.find((s) => s.href === "/knowledge-library/dua-dhikr");
  assert(!!entry, "knowledgeLibrary.sections must contain an entry linking to /knowledge-library/dua-dhikr");
  assert(entry!.label === "Duʿa & Dhikr", `sidebar entry label must be "Duʿa & Dhikr", got "${entry!.label}"`);
  assert(
    knowledgeLibrary.sections.length === 1,
    `Knowledge Library sidebar must list only Duʿa & Dhikr for now, got ${knowledgeLibrary.sections.length} sections`,
  );
  assert(
    !knowledgeLibrary.sections.some((s) =>
      ["Prophetic Medicine", "Hijama", "Patient Guides", "Daily Dhikr"].includes(s.label),
    ),
    "Knowledge Library sidebar must not list the deferred topic entries",
  );
  console.log(`✓ knowledgeLibrary.sections includes only "${entry!.label}" linking to /knowledge-library/dua-dhikr`);
}

function testNoFifthDepartmentAdded() {
  assert(departments.length === 4, `departments must remain exactly 4 (Apothecary, Academy, Sacred Journeys, Knowledge Library) — got ${departments.length}`);
  assert(
    !departments.some((d) => d.id.toLowerCase().includes("dhikr")),
    "no new top-level department may be added for Dhikr",
  );
  console.log("✓ departments remains exactly the 4 existing entries — no fifth department was added");
}

function testGlobalNavigationFallbackUnaffected() {
  const fetchSource = readFileSync(join(REPO_ROOT, "src/sanity/lib/fetch.ts"), "utf-8");
  const fallbackNavMatch = fetchSource.match(/items:\s*\[[\s\S]*?\],\s*fromCms:\s*false,?\s*\}\s*;\s*\}\s*\n\s*\/\* ── Footer/);
  const searchWindow = fallbackNavMatch ? fallbackNavMatch[0] : fetchSource;
  assert(
    !/dhikr/i.test(searchWindow),
    "[static check] the global navigation fallback (getNavigation's static items list in fetch.ts) must not mention Dhikr — the Knowledge Library sidebar entry is a separate, department-local mechanism",
  );
  console.log("✓ [static check] the global navigation fallback list is unaffected — Dhikr is not part of main site navigation");
}

/* ── No category or item-detail route created ────────────────────────── */

function testNoCategoryOrItemRouteCreatedInStage3() {
  const forbidden = [
    "src/app/[locale]/knowledge-library/dhikr/[category]/page.tsx",
    "src/app/[locale]/knowledge-library/dhikr/[slug]/page.tsx",
    "src/app/[locale]/knowledge-library/dhikr/[category]/[slug]/page.tsx",
  ];
  for (const relPath of forbidden) {
    assert(!existsSync(join(REPO_ROOT, relPath)), `Stage 3 must not create: ${relPath}`);
  }
  console.log("✓ [static check] no category or item-detail route exists — Stage 3 is landing-page only");
}

/* ── No out-of-scope reader features ─────────────────────────────────── */

function testNoOutOfScopeFeaturesInPage() {
  const forbidden = [
    "localStorage",
    "sessionStorage",
    "<audio",
    "useState",
    "recommendedRepetitions",
    "memoris", // covers memorise/memorize/memorisation
    "counter",
    "searchParams",
    "<input",
  ];
  for (const term of forbidden) {
    assert(
      !pageSource.toLowerCase().includes(term.toLowerCase()),
      `landing page must not contain "${term}" — no counter, audio, memorisation, search, filtering, or local-storage feature is in scope for Stage 3`,
    );
  }
  console.log("✓ [static check] landing page contains no counter, audio, memorisation, search, filtering, or local-storage code");
}

function runAll() {
  testEnglishRouteFileExists();
  testDanishRouteResolvesThroughDkPrefix();
  testPageImportsOnlyPublicFetchModule();
  testPageNeverImportsStaffOnlyFetchModule();
  testPageNeverImportsPlaceholderRegister();
  testApprovedEnglishEmptyStateCopyPresent();
  testApprovedDanishEmptyStateCopyPresent();
  testEmptyStateRenderBranchExistsInPage();
  testPageSourceHasNoGovernanceFields();
  testKnowledgeLibrarySectionsPointsToDhikrLanding();
  testNoFifthDepartmentAdded();
  testGlobalNavigationFallbackUnaffected();
  testNoCategoryOrItemRouteCreatedInStage3();
  testNoOutOfScopeFeaturesInPage();
  console.log("\nAll Dhikr landing-page tests passed.");
}

runAll();
