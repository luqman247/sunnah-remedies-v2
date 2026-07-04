/**
 * Shopify barrel export — public API surface for the commerce layer.
 */

export { storefrontQuery, StorefrontError } from "./storefront-client";
export { adminQuery, AdminError } from "./admin-client";
export { getProductCommerce, getProductCardsCommerce, getVariantInventory } from "./products";
export { getCollectionCommerce } from "./collections";
export { getInventoryView, registerBackInStock } from "./inventory";
export { getCustomerProfile } from "./customers";
export {
  createCart,
  getCart,
  addToCart,
  updateCartLines,
  removeFromCart,
  applyDiscountCode,
  updateCartNote,
  CartError,
} from "./cart";
export * from "./types";
