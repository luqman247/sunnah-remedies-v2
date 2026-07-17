/**
 * Duʿa & Dhikr — public-fetch safety and projection tests.
 *
 * Static source checks (no public route ever imports a staff-only module,
 * no public projection ever leaks a governance field) plus a query-string
 * check that both eligibility gates are actually interpolated into their
 * queries.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  duaDhikrEntriesPublicEligibleQuery,
  duaDhikrEntriesEditoriallyPublicEligibleQuery,
  duaDhikrCollectionsQuery,
} from "../../src/sanity/lib/queries";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const REPO_ROOT = join(__dirname, "../..");
const publicFetchSource = readFileSync(join(REPO_ROOT, "src/sanity/lib/dua-dhikr-public-fetch.ts"), "utf-8");
const landingPageSource = readFileSync(
  join(REPO_ROOT, "src/app/[locale]/knowledge-library/dua-dhikr/page.tsx"),
  "utf-8",
);
const collectionPageSource = readFileSync(
  join(REPO_ROOT, "src/app/[locale]/knowledge-library/dua-dhikr/[collectionSlug]/page.tsx"),
  "utf-8",
);

function testPublicFetchModuleUsesPublishedClient() {
  assert(publicFetchSource.includes('from "./client"'), "dua-dhikr-public-fetch.ts must import the public (published) client");
  assert(!publicFetchSource.includes("previewClient"), "dua-dhikr-public-fetch.ts must never use a preview client");
  console.log("✓ dua-dhikr-public-fetch.ts uses only the public client");
}

function testPublicFetchModuleNeverImportsStaffModules() {
  const importLines = publicFetchSource.split("\n").filter((line) => /^\s*import\b/.test(line));
  assert(
    !importLines.some((line) => line.includes("dhikr-fetch") || line.includes("app/(staff)")),
    "dua-dhikr-public-fetch.ts must never import a staff-only module",
  );
  console.log("✓ dua-dhikr-public-fetch.ts imports no staff-only module");
}

function testRoutesOnlyImportThePublicFetchModule() {
  for (const [name, source] of [
    ["landing page", landingPageSource],
    ["collection page", collectionPageSource],
  ] as const) {
    const importLines = source.split("\n").filter((line) => /^\s*import\b/.test(line));
    assert(
      !importLines.some((line) => line.includes("dhikr-fetch") && !line.includes("dua-dhikr-public-fetch")),
      `the ${name} must never import a staff-only Dhikr fetch module`,
    );
  }
  console.log("✓ landing and collection pages import only public-safe fetch modules");
}

function testCanonicalQueryNeverProjectsGovernanceFields() {
  // reviewStatus/boardApprovals legitimately appear in the FILTER clause
  // (the interpolated eligibility rule) but must never appear inside the
  // projection body (the `{ ... }` block after `order(order asc)`).
  const projectionBody = duaDhikrEntriesPublicEligibleQuery.split("order(order asc)")[1] ?? "";
  assert(!projectionBody.includes("reviewStatus"), "reviewStatus must not be selected in the public projection body");
  assert(!projectionBody.includes("boardApprovals"), "boardApprovals must not be selected in the public projection body");
  assert(!projectionBody.includes("editorialNotes"), "editorialNotes must never be selected in any public query");
  assert(!projectionBody.includes("approver"), "approver must never be selected in any public query");
  console.log("✓ the public entry query never projects governance/internal fields");
}

function testCollectionsQueryNeverProjectsInternalFields() {
  assert(!duaDhikrCollectionsQuery.includes("internalTitle"), "duaDhikrCollectionsQuery must not project internalTitle");
  console.log("✓ the public collections query never projects internalTitle");
}

function testBothEntryQueriesApplyTheirOwnGate() {
  assert(
    duaDhikrEntriesPublicEligibleQuery.includes('reviewStatus == "published"'),
    "the canonical entry query must apply the canonical eligibility rule",
  );
  assert(
    duaDhikrEntriesEditoriallyPublicEligibleQuery.includes("editorial-only-scholarly-review-pending"),
    "the editorial-bypass entry query must apply the bypass eligibility rule",
  );
  assert(
    duaDhikrEntriesPublicEligibleQuery !== duaDhikrEntriesEditoriallyPublicEligibleQuery,
    "the two entry queries must be distinct",
  );
  console.log("✓ both public entry queries apply their own distinct eligibility gate");
}

function runAll() {
  testPublicFetchModuleUsesPublishedClient();
  testPublicFetchModuleNeverImportsStaffModules();
  testRoutesOnlyImportThePublicFetchModule();
  testCanonicalQueryNeverProjectsGovernanceFields();
  testCollectionsQueryNeverProjectsInternalFields();
  testBothEntryQueriesApplyTheirOwnGate();
  console.log("\nAll Duʿa & Dhikr public-fetch safety tests passed.");
}

runAll();
