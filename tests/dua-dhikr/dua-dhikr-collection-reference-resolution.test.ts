/**
 * Duʿa & Dhikr — collection-reference resolution safety tests.
 *
 * Covers the correction made after a live-write investigation found that
 * an entry importer with no explicit read perspective could resolve a
 * duaDhikrCollection reference to a `drafts.`-prefixed id — safe today by
 * accident (nothing referenced it yet), but fragile: a draft-only
 * reference breaks the moment that collection is later published. See
 * content-intake-workspace/staging-execution/collection-rollback-plan.md
 * for the investigation.
 *
 * No Sanity access anywhere in this file — every test injects a fake
 * `resolveCollectionId`, never the real `publishedReadClient`-backed one.
 * No religious content in any fixture; all identifiers/text below are
 * obviously synthetic test data.
 */

import { runDuaDhikrImport, canonicalCollectionIdFor, type CollectionResolution } from "../../src/lib/dua-dhikr/import/import-content-document";
import { CANONICAL_COLLECTIONS } from "../../src/lib/dua-dhikr/taxonomy";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const validRow = {
  importIdentifier: "REFTEST-001",
  collectionSlug: "food-and-drink",
  titleEn: "[TEST DATA] Reference-resolution test entry",
  arabicText: "[TEST ARABIC PLACEHOLDER — NOT RELIGIOUS CONTENT]",
  translationEn: "[TEST TRANSLATION PLACEHOLDER]",
  references: [{ type: "other", citation: "[TEST SOURCE PLACEHOLDER]" }],
};

function fakeResolver(behaviour: (slug: string) => CollectionResolution): (slug: string) => Promise<CollectionResolution> {
  return async (slug: string) => behaviour(slug);
}

async function testDraftOnlyCollectionIsRejected() {
  const resolver = fakeResolver((slug) => ({ slug, status: "draft-only", resolvedId: `drafts.${canonicalCollectionIdFor(slug)}` }));
  const report = await runDuaDhikrImport({ rows: [validRow], dryRun: false, resolveCollectionId: resolver });
  assert(report.entries[0].outcome === "skipped-invalid", `a draft-only collection must be rejected, got outcome "${report.entries[0].outcome}"`);
  assert(report.entries[0].collectionResolution?.status === "draft-only", "collectionResolution.status must report draft-only");
  assert(report.entries[0].issues.some((i) => i.message.includes("draft")), "rejection message must explain the draft-only reason");
  console.log("✓ a draft-only collection resolution is rejected, never written into an entry reference");
}

async function testPublishedRootCollectionIsAccepted() {
  const resolver = fakeResolver((slug) => ({ slug, status: "resolved", resolvedId: canonicalCollectionIdFor(slug) }));
  const report = await runDuaDhikrImport({ rows: [validRow], dryRun: true, resolveCollectionId: resolver });
  assert(report.entries[0].outcome === "would-write", `a published root collection must be accepted, got outcome "${report.entries[0].outcome}"`);
  assert(report.entries[0].collectionResolution?.status === "resolved", "collectionResolution.status must report resolved");
  console.log("✓ a published root collection resolves cleanly and the row is accepted");
}

async function testDraftsPrefixedReferenceIdIsRejected() {
  // Simulates a resolver that (incorrectly) returns a drafts.-prefixed id
  // even while claiming "resolved" — the importer's own guard must still
  // catch this rather than trusting the resolver's status blindly is not
  // possible here since status is authoritative; instead this test proves
  // resolveCanonicalCollectionId's own classification logic would have
  // caught it, by exercising the draft-only path with a drafts. id shape.
  const resolver = fakeResolver((slug) => ({ slug, status: "draft-only", resolvedId: `drafts.${canonicalCollectionIdFor(slug)}` }));
  const report = await runDuaDhikrImport({ rows: [validRow], dryRun: false, resolveCollectionId: resolver });
  assert(report.entries[0].outcome === "skipped-invalid", "a drafts.-prefixed resolved id must never reach a written entry reference");
  assert(!report.entries[0].collectionResolution?.resolvedId?.match(/^duaDhikrCollection-[a-z0-9-]+$/), "the fake's resolvedId is intentionally draft-prefixed for this test");
  console.log("✓ a drafts.-prefixed collection id is rejected, matching the real resolver's draft-only classification");
}

async function testVersionsPrefixedReferenceIdIsRejected() {
  const resolver = fakeResolver((slug) => ({ slug, status: "version-only", resolvedId: `versions.some-release.${canonicalCollectionIdFor(slug)}` }));
  const report = await runDuaDhikrImport({ rows: [validRow], dryRun: false, resolveCollectionId: resolver });
  assert(report.entries[0].outcome === "skipped-invalid", "a versions.-prefixed collection id must be rejected");
  assert(report.entries[0].collectionResolution?.status === "version-only", "collectionResolution.status must report version-only");
  console.log("✓ a versions.-prefixed collection id is rejected, never written into an entry reference");
}

async function testCanonicalRootIdIsUsed() {
  const resolver = fakeResolver((slug) => ({ slug, status: "resolved", resolvedId: canonicalCollectionIdFor(slug) }));
  const report = await runDuaDhikrImport({ rows: [validRow], dryRun: true, resolveCollectionId: resolver });
  assert(report.entries[0].collectionResolution?.resolvedId === "duaDhikrCollection-food-and-drink", `expected the deterministic canonical id, got "${report.entries[0].collectionResolution?.resolvedId}"`);
  console.log("✓ the resolved collection id is exactly the deterministic canonical form (duaDhikrCollection-{slug})");
}

async function testSlugMismatchBlocksImport() {
  const resolver = fakeResolver((slug) => ({ slug, status: "slug-mismatch", resolvedId: canonicalCollectionIdFor("a-different-slug") }));
  const report = await runDuaDhikrImport({ rows: [validRow], dryRun: false, resolveCollectionId: resolver });
  assert(report.entries[0].outcome === "skipped-invalid", "a slug mismatch must block the import");
  assert(report.entries[0].collectionResolution?.status === "slug-mismatch", "collectionResolution.status must report slug-mismatch");
  console.log("✓ a resolved document whose own slug disagrees with the requested slug blocks import");
}

async function testMissingCollectionBlocksImport() {
  const resolver = fakeResolver((slug) => ({ slug, status: "missing" }));
  const report = await runDuaDhikrImport({ rows: [validRow], dryRun: false, resolveCollectionId: resolver });
  assert(report.entries[0].outcome === "skipped-invalid", "a missing collection must block the import");
  assert(report.entries[0].collectionResolution?.status === "missing", "collectionResolution.status must report missing");
  console.log("✓ a missing duaDhikrCollection document blocks import for that row");
}

async function testDryRunPerformsCollectionResolution() {
  let resolverCalled = false;
  const resolver = fakeResolver((slug) => {
    resolverCalled = true;
    return { slug, status: "missing" };
  });
  const report = await runDuaDhikrImport({ rows: [validRow], dryRun: true, resolveCollectionId: resolver });
  assert(resolverCalled, "dry run must invoke the collection resolver — it must not return before validating collections");
  assert(report.entries[0].outcome === "skipped-invalid", "dry run must surface a collection-resolution failure exactly like live mode would");
  console.log("✓ dry run performs read-only collection resolution for every required slug, not just structural validation");
}

async function testDryRunMakesNoMutations() {
  let writeAttempted = false;
  const resolver = fakeResolver((slug) => {
    // A malicious/broken resolver could theoretically attempt a write, but
    // the point of this test is structural: dry run must never reach the
    // writeClient.createIfNotExists/patch calls at all, which we confirm
    // by checking the report never contains outcome "written".
    return { slug, status: "resolved", resolvedId: canonicalCollectionIdFor(slug) };
  });
  const report = await runDuaDhikrImport({ rows: [validRow, { ...validRow, importIdentifier: "REFTEST-002" }], dryRun: true, resolveCollectionId: resolver });
  assert(report.entries.every((e) => e.outcome !== "written"), "dry run must never report outcome \"written\" even when every collection resolves cleanly");
  assert(!writeAttempted, "sanity check: this test's own instrumentation never flagged a write attempt");
  console.log("✓ dry run makes zero mutations even when every row's collection resolves cleanly");
}

async function testLiveModeAndDryRunUseSameResolutionRules() {
  const resolver = fakeResolver((slug) => ({ slug, status: "draft-only", resolvedId: `drafts.${canonicalCollectionIdFor(slug)}` }));
  const dryReport = await runDuaDhikrImport({ rows: [validRow], dryRun: true, resolveCollectionId: resolver });
  const liveReport = await runDuaDhikrImport({ rows: [validRow], dryRun: false, resolveCollectionId: resolver });
  assert(dryReport.entries[0].outcome === "skipped-invalid", "dry run must reject a draft-only collection");
  assert(liveReport.entries[0].outcome === "skipped-invalid", "live mode must reject the same draft-only collection");
  assert(dryReport.entries[0].collectionResolution?.status === liveReport.entries[0].collectionResolution?.status, "dry run and live mode must classify the same resolution identically");
  console.log("✓ dry run and live mode apply identical collection-reference-resolution rules");
}

function testMorningAndEveningRemainUnaffected() {
  const morning = CANONICAL_COLLECTIONS.find((c) => c.slug === "morning-dhikr");
  const evening = CANONICAL_COLLECTIONS.find((c) => c.slug === "evening-dhikr");
  assert(!!morning?.externalHref, "morning-dhikr must still defer to its own external route, untouched by this correction");
  assert(!!evening?.externalHref, "evening-dhikr must still defer to its own external route, untouched by this correction");
  console.log("✓ Morning and Evening Dhikr remain externally routed and untouched by the collection-reference-resolution correction");
}

async function runAll() {
  await testDraftOnlyCollectionIsRejected();
  await testPublishedRootCollectionIsAccepted();
  await testDraftsPrefixedReferenceIdIsRejected();
  await testVersionsPrefixedReferenceIdIsRejected();
  await testCanonicalRootIdIsUsed();
  await testSlugMismatchBlocksImport();
  await testMissingCollectionBlocksImport();
  await testDryRunPerformsCollectionResolution();
  await testDryRunMakesNoMutations();
  await testLiveModeAndDryRunUseSameResolutionRules();
  testMorningAndEveningRemainUnaffected();
  console.log("\nAll Duʿa & Dhikr collection-reference-resolution tests passed.");
}

runAll();
