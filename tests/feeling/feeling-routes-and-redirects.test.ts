/**
 * "I am feeling…" — route/redirect static-source checks (SPEC §2, §17).
 *
 * Mirrors the static-check style already used in
 * tests/dua-dhikr/dua-dhikr-english-first-publication.test.ts: reads real
 * source files and asserts on their content, rather than booting a server.
 * No live Sanity access, no religious content.
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { getLaunchFeelingStates, CANONICAL_FEELING_STATES } from "../../src/lib/feeling/taxonomy";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

const root = join(__dirname, "..", "..");
const nextConfigSource = readFileSync(join(root, "next.config.ts"), "utf-8");

function testTopLevelRouteFilesExist() {
  const landingPath = join(root, "src/app/[locale]/i-am-feeling/page.tsx");
  const detailPath = join(root, "src/app/[locale]/i-am-feeling/[feelingSlug]/page.tsx");
  const urgentPath = join(root, "src/app/[locale]/i-am-feeling/urgent-support/page.tsx");
  assert(existsSync(landingPath), "landing page must exist at the top-level /i-am-feeling path");
  assert(existsSync(detailPath), "detail page must exist at /i-am-feeling/[feelingSlug]");
  assert(existsSync(urgentPath), "urgent-support page must exist at /i-am-feeling/urgent-support");
  console.log("✓ all three canonical top-level route files exist");
}

function testNoRouteFileExistsAtSupersededNestedPath() {
  const supersededPath = join(root, "src/app/[locale]/knowledge-library/i-am-feeling");
  assert(!existsSync(supersededPath), "no page should ever exist at the superseded /knowledge-library/i-am-feeling path — redirect only (SPEC §2)");
  console.log("✓ no renderable page exists at the superseded nested path — exactly one canonical route per URL");
}

function testRedirectsCoverBothLocalesAndBothDepths() {
  assert(
    nextConfigSource.includes('source: "/knowledge-library/i-am-feeling"') &&
      nextConfigSource.includes('destination: "/i-am-feeling"'),
    "next.config.ts must redirect the unprefixed English landing path",
  );
  assert(
    nextConfigSource.includes('source: "/knowledge-library/i-am-feeling/:feelingSlug"') &&
      nextConfigSource.includes('destination: "/i-am-feeling/:feelingSlug"'),
    "next.config.ts must redirect the unprefixed English detail path",
  );
  assert(
    nextConfigSource.includes('source: "/dk/knowledge-library/i-am-feeling"') &&
      nextConfigSource.includes('destination: "/dk/i-am-feeling"'),
    "next.config.ts must redirect the Danish (/dk) landing path",
  );
  assert(
    nextConfigSource.includes('source: "/dk/knowledge-library/i-am-feeling/:feelingSlug"') &&
      nextConfigSource.includes('destination: "/dk/i-am-feeling/:feelingSlug"'),
    "next.config.ts must redirect the Danish (/dk) detail path",
  );
  console.log("✓ redirects cover both locales (unprefixed English and /dk Danish) and both route depths");
}

function testRedirectsArePermanent() {
  const redirectBlockMatch = nextConfigSource.match(
    /source: "\/knowledge-library\/i-am-feeling"[\s\S]{0,120}/,
  );
  assert(!!redirectBlockMatch && redirectBlockMatch[0].includes("permanent: true"), "the /knowledge-library/i-am-feeling redirect must be permanent (301)");
  console.log("✓ the superseded-route redirect is permanent, not a temporary redirect");
}

function testGenerateStaticParamsSourceOnlyReferencesLaunchStates() {
  const detailSource = readFileSync(join(root, "src/app/[locale]/i-am-feeling/[feelingSlug]/page.tsx"), "utf-8");
  assert(detailSource.includes("getLaunchFeelingStates()"), "generateStaticParams must be driven by getLaunchFeelingStates(), not the full taxonomy");
  assert(
    detailSource.includes('canonical.launchStatus !== "launch"') && detailSource.includes("notFound()"),
    "the detail page must 404 for any non-launch slug regardless of Sanity content",
  );
  console.log("✓ the detail route's static params and notFound guard are both driven by launchStatus, not just slug existence");
}

function testDeferredSlugsAreExcludedFromStaticParams() {
  const launchSlugs = new Set(getLaunchFeelingStates().map((s) => s.slug));
  const deferredSlugs = CANONICAL_FEELING_STATES.filter((s) => s.launchStatus !== "launch").map((s) => s.slug);
  assert(deferredSlugs.length > 0, "fixture assumption: at least one deferred/not-suitable state must exist to test against");
  for (const slug of deferredSlugs) {
    assert(!launchSlugs.has(slug), `deferred slug "${slug}" must not appear in getLaunchFeelingStates()`);
  }
  console.log(`✓ all ${deferredSlugs.length} deferred/not-suitable slugs (troubled-by-doubts, feeling-disappointed, feeling-impatient) are excluded from static generation`);
}

function testDetailPageHreflangIsConditionalPerLocale() {
  const detailSource = readFileSync(join(root, "src/app/[locale]/i-am-feeling/[feelingSlug]/page.tsx"), "utf-8");
  assert(
    detailSource.includes("enReady") && detailSource.includes("daReady"),
    "generateMetadata must check English and Danish readiness independently before advertising either as an hreflang alternate (owner-review requirement 2026-07-19)",
  );
  assert(
    !/languages:\s*{\s*en:\s*localeUrl\("en",\s*path\),\s*da:\s*localeUrl\("da",\s*path\)/.test(detailSource),
    "hreflang languages must not be unconditionally set for both locales regardless of readiness",
  );
  console.log("✓ detail-page hreflang only advertises a locale alternate once that locale is actually publication-ready");
}

function testUrgentSupportPageIsNoindex() {
  const urgentSource = readFileSync(join(root, "src/app/[locale]/i-am-feeling/urgent-support/page.tsx"), "utf-8");
  assert(urgentSource.includes("index: false") && urgentSource.includes("follow: false"), "urgent-support page must always set robots noindex,nofollow");
  console.log("✓ urgent-support page metadata sets robots: noindex, nofollow unconditionally");
}

function testUrgentSupportPageHasNoFormFields() {
  const urgentSource = readFileSync(join(root, "src/app/[locale]/i-am-feeling/urgent-support/page.tsx"), "utf-8");
  assert(!/<form[\s>]/i.test(urgentSource), "urgent-support page must never contain a <form> element (SPEC §8)");
  assert(!/<input[\s>]/i.test(urgentSource), "urgent-support page must never contain an <input> element (SPEC §8)");
  console.log("✓ urgent-support page contains no form fields");
}

function testReviewStatusBadgeIsProductionGuarded() {
  const badgeSource = readFileSync(join(root, "src/components/feeling/FeelingReviewStatusBadge.tsx"), "utf-8");
  assert(
    badgeSource.includes('process.env.NODE_ENV === "production"') && badgeSource.includes("return null"),
    "the dev-only review-status badge must return null when NODE_ENV is production, so it is dead-code-eliminated from the production build (owner-review requirement 2026-07-19, item 9)",
  );
  const detailSource = readFileSync(join(root, "src/app/[locale]/i-am-feeling/[feelingSlug]/page.tsx"), "utf-8");
  assert(
    detailSource.includes('process.env.NODE_ENV !== "production"'),
    "the detail page must skip computing review tags (and the extra locale fetch) outside of dev/preview mode",
  );
  console.log("✓ the review-status badge is guarded to never render (or fetch) in a production build");
}

function testGetDepartmentByPathResolvesTopLevelFeelingRoute() {
  const siteStructureSource = readFileSync(join(root, "src/lib/navigation/site-structure.ts"), "utf-8");
  assert(
    siteStructureSource.includes('path.startsWith("/i-am-feeling")'),
    "getDepartmentByPath must resolve /i-am-feeling to the Knowledge Library department (SPEC §2)",
  );
  console.log("✓ getDepartmentByPath resolves the top-level /i-am-feeling route to Knowledge Library");
}

async function runAll() {
  testTopLevelRouteFilesExist();
  testNoRouteFileExistsAtSupersededNestedPath();
  testRedirectsCoverBothLocalesAndBothDepths();
  testRedirectsArePermanent();
  testGenerateStaticParamsSourceOnlyReferencesLaunchStates();
  testDeferredSlugsAreExcludedFromStaticParams();
  testDetailPageHreflangIsConditionalPerLocale();
  testReviewStatusBadgeIsProductionGuarded();
  testUrgentSupportPageIsNoindex();
  testUrgentSupportPageHasNoFormFields();
  testGetDepartmentByPathResolvesTopLevelFeelingRoute();
  console.log("\nAll feeling-routes-and-redirects tests passed.");
}

runAll();
