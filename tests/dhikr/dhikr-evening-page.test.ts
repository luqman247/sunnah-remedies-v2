/**
 * Evening Dhikr page tests.
 *
 * Covers the expanded Evening Dhikr route (src/app/[locale]/knowledge/
 * dhikr/evening/) — structure, copy honesty, filter correctness, and reuse
 * of the shared card/notice/filter components also used by Morning. Data-
 * layer eligibility (which records may appear) is covered separately in
 * tests/dhikr/dhikr-evening-eligibility.test.ts.
 *
 * Plain assert()-based, run via `npx tsx`.
 */

import fs from "node:fs";
import path from "node:path";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const REPO_ROOT = path.resolve(__dirname, "../..");
const EVENING_DIR = path.join(REPO_ROOT, "src/app/[locale]/knowledge/dhikr/evening");
const EVENING_PAGE = path.join(EVENING_DIR, "page.tsx");
const EVENING_COLLECTION = path.join(EVENING_DIR, "EveningDhikrCollection.tsx");
const EVENING_CSS = path.join(EVENING_DIR, "evening-dhikr.css");

/* ── 1. Reuses the shared safety-critical components ─────────────────── */

function testEveningReusesSharedCardComponents() {
  const source = fs.readFileSync(EVENING_COLLECTION, "utf8");
  assert(source.includes('from "@/components/dhikr/ReviewedDhikrCard"'), "Evening collection must reuse the shared ReviewedDhikrCard, not a duplicate implementation");
  assert(source.includes('from "@/components/dhikr/PendingReferenceCard"'), "Evening collection must reuse the shared PendingReferenceCard");
  assert(source.includes('from "@/components/dhikr/CollectionStatusNotice"'), "Evening collection must reuse the shared CollectionStatusNotice");
  assert(source.includes('from "@/components/dhikr/DhikrCollectionFilters"'), "Evening collection must reuse the shared DhikrCollectionFilters");
  console.log("✓ [static check] Evening reuses the same shared card/notice/filter components as Morning — no duplicated safety logic");
}

/* ── 2. Filter set is Evening-specific, never morning-only ───────────── */

function testEveningFilterSetHasNoMorningOnlyOption() {
  const source = fs.readFileSync(EVENING_COLLECTION, "utf8");
  assert(!source.includes('"morning-only"'), "The Evening filter set must never include a morning-only filter option");
  assert(source.includes('"evening-only"'), "The Evening filter set must include an evening-only filter option");
  assert(source.includes("filters.eveningOnly"), "The Evening filter bar must use the eveningOnly label key");
  assert(source.includes('"morning-and-evening"'), "The Evening filter set must still include a morning-and-evening filter option");
  console.log("✓ [static check] Evening's filter set is All / Editorially reviewed / Review pending / Evening only / Morning and evening — never Morning only");
}

/* ── 3. Structural parity with Morning (sections, progress, contents) ── */

function testEveningPageStructureParity() {
  const collectionSource = fs.readFileSync(EVENING_COLLECTION, "utf8");
  assert(collectionSource.includes('t("progressIndicator"'), "Evening must render a data-derived progress indicator");
  assert(collectionSource.includes('t("sectionEditoriallyReviewedHeading")'), "Evening must render the editorially-reviewed section heading");
  assert(collectionSource.includes('t("sectionReferenceHeading")'), "Evening must render the reference-collection section heading");
  assert(collectionSource.includes('t("referenceCollectionCount"'), "Evening must render a data-derived reference-collection count");
  const filterComponentSource = fs.readFileSync(path.join(REPO_ROOT, "src/components/dhikr/DhikrCollectionFilters.tsx"), "utf8");
  assert(filterComponentSource.includes("aria-pressed"), "The shared filter component (used by Evening) must expose aria-pressed state");
  assert(filterComponentSource.includes(":focus-visible") || fs.readFileSync(path.join(REPO_ROOT, "src/components/dhikr/dhikr-collection.css"), "utf8").includes(":focus-visible"), "The shared filter component must define a visible focus state");
  assert(collectionSource.includes("visibleItems.length > 0") && collectionSource.includes("visibleReferenceEntries.length > 0"), "Evening must render each section independently — one empty section must not hide the other");
  console.log("✓ [static check] Evening page has structural parity with Morning: progress indicator, both section headings, independent section visibility");
}

function testEveningPageHasMethodologyAndRelatedCollections() {
  const pageSource = fs.readFileSync(EVENING_PAGE, "utf8");
  assert(pageSource.includes("<details") && pageSource.includes('t("methodologyHeading")') && pageSource.includes('t("methodologyBody")'), "Evening page must include an expandable source/review methodology note");
  assert(pageSource.includes('t("relatedCollectionsHeading")'), "Evening page must include a related-collections navigation block");
  assert(pageSource.includes('href="/knowledge/dhikr/morning"'), "Evening page's related-collections block must link to Morning Dhikr");
  console.log("✓ [static check] Evening page includes a methodology note and a related-collections navigation block");
}

/* ── 4. Empty/error states are differentiated, matching Morning ──────── */

function testEveningDifferentiatesErrorFromEmpty() {
  const pageSource = fs.readFileSync(EVENING_PAGE, "utf8");
  assert(pageSource.includes("loadFailed"), "Evening page must track a distinct load-failure state");
  assert(pageSource.includes('t("errorState.heading")') && pageSource.includes('t("errorState.body")'), "Evening page must render a distinct error state, separate from the empty state");
  assert(pageSource.includes("items.length === 0 && referenceEntries.length === 0"), "The true empty state must require BOTH sections to be empty, not just one");
  console.log("✓ [static check] Evening page distinguishes a fetch failure from a genuine zero-eligible-records state, and never collapses to empty when either section has content");
}

/* ── 5. Copy is honest — no overclaiming, exact required text present ── */

function testEveningRequiredCopyExact() {
  const en = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, "src/messages/en.json"), "utf8"));
  const m = en.dhikrEvening;
  assert(m.sectionReferenceHeading === "Reference collection — scholarly and editorial review pending", "Evening sectionReferenceHeading must match Morning's exact required wording");
  assert(m.sourceVerificationPending === "Source verification pending", "Evening sourceVerificationPending must match the exact required text");
  assert(m.translationUnderReview === "Translation under review.", "Evening translationUnderReview must match the exact required text");
  assert(m.reviewPendingBadge === "Review pending", "Evening reviewPendingBadge must match the exact required text");
  assert(m.virtueLabel === "Why recite this?", "Evening virtueLabel must use the 'Why recite this?' framing");

  const pages = en.pages.dhikrEvening;
  assert(pages.title === "Evening Dhikr | Sunnah Remedies", "Evening metadata title must match the exact required text");
  assert(
    pages.description === "Read the Sunnah Remedies Evening Dhikr collection with Arabic, translations, sources and transparent editorial review status.",
    "Evening metadata description must match the exact required text",
  );

  const da = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, "src/messages/da.json"), "utf8"));
  for (const key of ["sectionReferenceHeading", "referenceCollectionNotice", "reviewPendingBadge", "sourceVerificationPending", "translationUnderReview", "progressIndicator", "methodologyHeading", "relatedCollectionsHeading"]) {
    assert(typeof da.dhikrEvening[key] === "string" && da.dhikrEvening[key].length > 0, `Danish dhikrEvening.${key} must exist and be non-empty`);
  }
  console.log("✓ [static check] Evening's required copy matches the specified wording exactly, with Danish equivalents present");
}

function testEveningCopyHasNoOverclaimingPhrases() {
  const en = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, "src/messages/en.json"), "utf8"));
  const text = JSON.stringify(en.dhikrEvening).toLowerCase();
  const forbidden = ["scholarly approved", "verified by scholars", "fully verified"];
  for (const phrase of forbidden) {
    assert(!text.includes(phrase), `Forbidden phrase "${phrase}" must not appear anywhere in dhikrEvening copy`);
  }
  assert(!/\bauthenticated\b/.test(text), 'The bare word "authenticated" must not appear as a positive claim anywhere in dhikrEvening copy');

  const metaText = JSON.stringify(en.pages.dhikrEvening).toLowerCase();
  assert(!metaText.includes("verif"), "Evening page metadata must not claim the collection is verified");
  console.log("✓ none of the forbidden overclaiming phrases appear in dhikrEvening copy or metadata");
}

/* ── 6. Evening's own visual identity exists, without disallowed motifs ── */

function testEveningHasOwnVisualIdentityWithoutDisallowedMotifs() {
  const css = fs.readFileSync(EVENING_CSS, "utf8");
  assert(css.includes("evening-dhikr-horizon") || fs.readFileSync(EVENING_PAGE, "utf8").includes("evening-dhikr-horizon"), "Evening page must include its own horizon motif, distinct from Morning");
  assert(!/#000\b|#000000|black/i.test(css), "Evening CSS must not use dark/black backgrounds");
  assert(!/gradient/i.test(css), "Evening CSS must not use gradients (no app-style purple gradients)");
  assert(!/🌙|✨|⭐/.test(css) && !/🌙|✨|⭐/.test(fs.readFileSync(EVENING_PAGE, "utf8")), "Evening must not use emoji moon/star graphics");
  console.log("✓ [static check] Evening has its own restrained visual identity (horizon motif) with none of the disallowed styling patterns");
}

async function runAll() {
  testEveningReusesSharedCardComponents();
  testEveningFilterSetHasNoMorningOnlyOption();
  testEveningPageStructureParity();
  testEveningPageHasMethodologyAndRelatedCollections();
  testEveningDifferentiatesErrorFromEmpty();
  testEveningRequiredCopyExact();
  testEveningCopyHasNoOverclaimingPhrases();
  testEveningHasOwnVisualIdentityWithoutDisallowedMotifs();
  console.log("\nAll Evening Dhikr page tests passed.");
}

runAll();
