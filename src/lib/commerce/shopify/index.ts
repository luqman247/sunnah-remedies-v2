/**
 * Shopify barrel export — public API surface for the commerce layer.
 */

export { storefrontQuery, StorefrontError } from "./storefront-client";
export { adminQuery, AdminError } from "./admin-client";
export { getProductCommerce, getProductCardsCommerce, getVariantInventory } from "./products";
export { getCollectionCommerce } from "./collections";
export * from "./types";
