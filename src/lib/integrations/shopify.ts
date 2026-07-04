/**
 * Shopify Integration — Architecture Preparation
 *
 * This module prepares the architecture for future Shopify Headless integration.
 * When activated, Shopify will handle:
 * - Inventory and stock management
 * - Order processing
 * - Shipping calculations
 * - Checkout flow
 * - Tax calculations
 * - Discount codes
 *
 * Editorial content remains in Sanity. Shopify provides commerce only.
 *
 * DO NOT implement Shopify during Phase 2.
 * This file exists solely to define the integration interface.
 */

export interface ShopifyConfig {
  storeDomain: string;
  storefrontAccessToken: string;
  adminAccessToken?: string;
  apiVersion: string;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
    maxVariantPrice: { amount: string; currencyCode: string };
  };
  variants: ShopifyVariant[];
}

export interface ShopifyVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: { amount: string; currencyCode: string };
  quantityAvailable: number;
}

export interface ShopifyCart {
  id: string;
  lines: ShopifyCartLine[];
  totalQuantity: number;
  cost: {
    subtotalAmount: { amount: string; currencyCode: string };
    totalAmount: { amount: string; currencyCode: string };
    totalTaxAmount: { amount: string; currencyCode: string };
  };
  checkoutUrl: string;
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: { amount: string; currencyCode: string };
    product: { handle: string; title: string };
  };
}

/**
 * i18n: When Shopify is activated, all fetch functions accept a locale parameter.
 * The locale maps to a Shopify LanguageCode via localeById(locale).shopify.
 * Queries use @inContext(language: $language) to return localised content.
 *
 * Example query pattern for future implementation:
 *
 *   query ProductByHandle($handle: String!, $language: LanguageCode!)
 *   @inContext(language: $language) {
 *     product(handle: $handle) {
 *       id title description handle
 *       seo { title description }
 *       options { name values }
 *       variants(first: 100) {
 *         nodes { id title availableForSale price { amount currencyCode } }
 *       }
 *     }
 *   }
 */

/**
 * Future: Fetch product availability from Shopify by product ID.
 * @param _locale - App locale (e.g. "en", "da") for @inContext
 */
export async function getShopifyProduct(
  _productId: string,
  _locale?: string,
): Promise<ShopifyProduct | null> {
  return null;
}

/**
 * Future: Create a Shopify cart.
 * @param _locale - App locale for localised checkout
 */
export async function createCart(
  _lines?: { merchandiseId: string; quantity: number }[],
  _locale?: string,
): Promise<ShopifyCart | null> {
  return null;
}

/**
 * Future: Add items to an existing cart.
 * @param _locale - App locale for localised cart updates
 */
export async function addToCart(
  _cartId: string,
  _lines: { merchandiseId: string; quantity: number }[],
  _locale?: string,
): Promise<ShopifyCart | null> {
  return null;
}

/**
 * Future: Get checkout URL for a cart.
 */
export function getCheckoutUrl(_cart: ShopifyCart | null): string | null {
  return _cart?.checkoutUrl ?? null;
}
