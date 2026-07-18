/**
 * Duʿa & Dhikr — production cache policy and sitemap freshness tests.
 *
 * Static source checks only (no religious content, no live network calls):
 * confirms the landing page, collection page, and sitemap all carry a
 * bounded revalidation window (so newly published Sanity content is never
 * stuck behind an indefinite Next.js Data/Full Route Cache snapshot), that
 * the on-demand revalidation webhook covers Duʿa & Dhikr types, and that
 * every canonical/OG/hreflang source uses the correct production host.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { seoConfig } from "../../src/lib/seo/config";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const REPO_ROOT = join(__dirname, "../..");
function readSource(relativePath: string): string {
  return readFileSync(join(REPO_ROOT, relativePath), "utf-8");
}

const landingPageSource = readSource("src/app/[locale]/knowledge-library/dua-dhikr/page.tsx");
const collectionPageSource = readSource("src/app/[locale]/knowledge-library/dua-dhikr/[collectionSlug]/page.tsx");
const sitemapSource = readSource("src/app/sitemap.ts");
const revalidateRouteSource = readSource("src/app/api/revalidate/route.ts");
const seoConfigSource = readSource("src/lib/seo/config.ts");
const canonicalSource = readSource("src/lib/seo/canonical.ts");
const nextConfigSource = readSource("next.config.ts");
const homePageSource = readSource("src/app/[locale]/page.tsx");

function extractRevalidateValue(source: string): number | undefined {
  const match = source.match(/export const revalidate = (\d+)/);
  return match ? Number(match[1]) : undefined;
}

function testLandingPageHasBoundedRevalidation() {
  const revalidate = extractRevalidateValue(landingPageSource);
  assert(revalidate !== undefined, "the Duʿa & Dhikr landing page must export a numeric `revalidate`");
  assert(revalidate! > 0 && revalidate! <= 3600, "the landing page revalidate window must be bounded (>0 and <=1h), never indefinite");
  console.log(`✓ landing page has a bounded revalidate window (${revalidate}s)`);
}

function testCollectionPageHasBoundedRevalidation() {
  const revalidate = extractRevalidateValue(collectionPageSource);
  assert(revalidate !== undefined, "the Duʿa & Dhikr collection page must export a numeric `revalidate`");
  assert(revalidate! > 0 && revalidate! <= 3600, "the collection page revalidate window must be bounded, never indefinite");
  console.log(`✓ collection page has a bounded revalidate window (${revalidate}s)`);
}

function testSitemapHasBoundedRevalidation() {
  const revalidate = extractRevalidateValue(sitemapSource);
  assert(revalidate !== undefined, "sitemap.ts must export a numeric `revalidate`");
  assert(revalidate! > 0 && revalidate! <= 3600, "the sitemap revalidate window must be bounded, never indefinite");
  console.log(`✓ sitemap.ts has a bounded revalidate window (${revalidate}s)`);
}

function testSitemapStillIncludesAllPublishedDuaDhikrCollections() {
  assert(sitemapSource.includes("getDuaDhikrCollectionsPublic"), "sitemap.ts must still enumerate every public Duʿa & Dhikr collection, not a fixed/hardcoded list");
  assert(sitemapSource.includes("isDuaDhikrCollectionPublished"), "sitemap.ts must still gate collections on real publication state, never taxonomy structure alone");
  console.log("✓ sitemap.ts still derives Duʿa & Dhikr routes from live publication state, not a static snapshot");
}

function testSitemapNeverFabricatesIndividualEntryUrls() {
  assert(!sitemapSource.includes("duaDhikrEntry"), "sitemap.ts must never generate a per-entry URL — no individual entry route exists");
  assert(!sitemapSource.includes("importIdentifier"), "sitemap.ts must never reference importIdentifier — that would imply a per-entry URL");
  console.log("✓ sitemap.ts never fabricates individual Duʿa & Dhikr entry URLs");
}

function testSitemapExcludesDraftPerspective() {
  assert(sitemapSource.includes('from "@/sanity/lib/client"'), "sitemap.ts must read via the public client module");
  assert(!sitemapSource.includes("previewClient"), "sitemap.ts must never use a preview/draft client");
  console.log("✓ sitemap.ts never reads through a draft/preview client");
}

function testRevalidateWebhookCoversDuaDhikrTypes() {
  assert(revalidateRouteSource.includes("duaDhikrCollection"), "the revalidation webhook must map duaDhikrCollection to its public route(s)");
  assert(revalidateRouteSource.includes("duaDhikrEntry"), "the revalidation webhook must map duaDhikrEntry to its public route(s)");
  assert(
    revalidateRouteSource.includes("/knowledge-library/dua-dhikr/[collectionSlug]"),
    "the revalidation webhook must invalidate the dynamic collection-page pattern, not just the landing page, since a single entry change can affect any populated collection",
  );
  console.log("✓ the on-demand revalidation webhook covers both Duʿa & Dhikr Sanity types");
}

function testCanonicalHostIsCoUk() {
  assert(seoConfig.siteUrl === "https://www.sunnahremedies.co.uk", `seoConfig.siteUrl must be the real production host, got "${seoConfig.siteUrl}"`);
  assert(!seoConfigSource.includes("sunnahremedies.com"), "seo/config.ts must not reference the obsolete .com host");
  assert(!canonicalSource.includes("sunnahremedies.com"), "seo/canonical.ts must not reference the obsolete .com host");
  console.log("✓ seoConfig.siteUrl and canonical.ts use the real production .co.uk host");
}

function testHomepageStructuredDataUsesCanonicalHost() {
  assert(!homePageSource.includes("sunnahremedies.com"), "the homepage JSON-LD must not reference the obsolete .com host");
  assert(homePageSource.includes("sunnahremedies.co.uk"), "the homepage JSON-LD must reference the real production .co.uk host");
  console.log("✓ homepage structured data (JSON-LD) uses the .co.uk host");
}

function testApexHostRedirectsToWww() {
  assert(
    nextConfigSource.includes('value: "sunnahremedies.co.uk"') && nextConfigSource.includes("www.sunnahremedies.co.uk"),
    "next.config.ts must redirect the apex (non-www) host to the canonical www host, so the served host and seoConfig.siteUrl always agree",
  );
  console.log("✓ next.config.ts canonicalises the apex host to www.sunnahremedies.co.uk");
}

function testEmailAddressesAreUntouched() {
  const resendSource = readSource("src/operations/email/service/resend.ts");
  assert(
    resendSource.includes("mail@sunnahremedies.com") && resendSource.includes("https://sunnahremedies.com/privacy"),
    "the domain correction must never touch unrelated email sender/unsubscribe strings — those are a separate, deliberately untouched concern",
  );
  console.log("✓ email sender/unsubscribe strings were left untouched by the domain correction");
}

function runAll() {
  testLandingPageHasBoundedRevalidation();
  testCollectionPageHasBoundedRevalidation();
  testSitemapHasBoundedRevalidation();
  testSitemapStillIncludesAllPublishedDuaDhikrCollections();
  testSitemapNeverFabricatesIndividualEntryUrls();
  testSitemapExcludesDraftPerspective();
  testRevalidateWebhookCoversDuaDhikrTypes();
  testCanonicalHostIsCoUk();
  testHomepageStructuredDataUsesCanonicalHost();
  testApexHostRedirectsToWww();
  testEmailAddressesAreUntouched();
  console.log("\nAll Duʿa & Dhikr production cache and sitemap tests passed.");
}

runAll();
