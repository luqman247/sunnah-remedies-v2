/**
 * Commerce configuration — pinned API versions, TTLs, and feature flags.
 *
 * Centralised configuration for the entire commerce layer.
 * API versions are pinned and upgraded deliberately, never floating.
 *
 * @see Phase 4 Part 2, Spec 00 §0.7–0.8
 */

export const SHOPIFY_API_VERSION = "2024-10";

export const CACHE_TTLS = {
  editorial: 0, // Until revalidated by webhook
  commerceProduct: 30, // Seconds — short cache, webhook-revalidated
  collectionMembership: 60, // Seconds
  inventory: 0, // Always live — never cached
  cartNone: 0, // Per-session, always live
  imagesCdn: 31536000, // 1 year (Cloudinary CDN)
} as const;

export const RATE_LIMITS = {
  maxConcurrentStorefront: 6,
  maxConcurrentAdmin: 3,
  maxRetries: 3,
  baseBackoffMs: 500,
} as const;

export const FEATURE_FLAGS = {
  subscriptions: false,
  memberships: false,
  giftCards: false,
  wishlist: false,
  saveForLater: false,
  wholesale: false,
  practitionerAccounts: false,
  affiliate: false,
  courseBundles: false,
  donations: false,
  instalments: false,
  recentlyViewed: false,
  frequentlyBoughtTogether: false,
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  const envOverride = process.env[`FEATURE_${flag.toUpperCase()}`];
  if (envOverride === "true") return true;
  if (envOverride === "false") return false;
  return FEATURE_FLAGS[flag];
}
