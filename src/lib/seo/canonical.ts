/**
 * Canonical URL & URL Normalisation.
 *
 * Single policy governing the entire estate:
 * - Canonical host: https://www.sunnahremedies.co.uk
 * - Lowercase paths, no trailing slash
 * - Strip tracking params (utm_*, gclid, fbclid)
 * - Self-referential canonicals by default
 */

import { seoConfig } from "./config";

const STRIP_PARAMS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "ref",
  "mc_cid",
  "mc_eid",
]);

/**
 * Normalise a path for canonical use:
 * - lowercase
 * - strip trailing slash (except root)
 * - strip tracking params
 */
export function normalisePath(path: string): string {
  let normalised = path.toLowerCase();

  // Remove trailing slash (except root)
  if (normalised.length > 1 && normalised.endsWith("/")) {
    normalised = normalised.slice(0, -1);
  }

  return normalised;
}

/**
 * Build a full canonical URL from a path.
 */
export function canonicalUrl(path: string): string {
  const normalised = normalisePath(path);
  return `${seoConfig.siteUrl}${normalised}`;
}

/**
 * Strip tracking parameters from a URL string.
 */
export function stripTrackingParams(url: string): string {
  try {
    const parsed = new URL(url, seoConfig.siteUrl);
    for (const key of [...parsed.searchParams.keys()]) {
      if (STRIP_PARAMS.has(key)) {
        parsed.searchParams.delete(key);
      }
    }
    const search = parsed.searchParams.toString();
    return `${parsed.pathname}${search ? `?${search}` : ""}`;
  } catch {
    return url;
  }
}

/**
 * Determine if a path should be 301-redirected due to normalisation.
 * Returns the corrected path or null if no redirect needed.
 */
export function getRedirectTarget(path: string): string | null {
  const normalised = normalisePath(path);
  if (normalised !== path) return normalised;
  return null;
}

/**
 * Curated allow-list of faceted URL combinations that ARE indexable
 * (promoted to semantic landing pages with their own metadata).
 */
export const indexableFacetPages: string[] = [
  "/knowledge/ingredient?bodySystem=digestive",
  "/knowledge/ingredient?bodySystem=immune",
  "/knowledge/ingredient?bodySystem=respiratory",
  "/knowledge/hadith?authenticity=sahih",
];

/**
 * Check if a faceted URL should be indexable.
 */
export function isFacetIndexable(path: string): boolean {
  return indexableFacetPages.some((allowed) => path.startsWith(allowed));
}
