/**
 * Commerce layer — unified public API.
 *
 * All commerce imports from application code go through this barrel.
 * Internal implementation details stay encapsulated.
 */

export * from "./config";
export * from "./config/env";
export * from "./shopify";
export * from "./stripe";
export * from "./composition/types";
export { composeProductView, composeProductCardViews, composeCollectionView } from "./composition";
export { checkRateLimit, getRateLimitHeaders, sanitizeInput, isValidEmail, isValidGid, getClientIp } from "./security";
export { verifyShopifyWebhook, verifyStripeWebhook, isAlreadyProcessed, markProcessed } from "./webhooks";
