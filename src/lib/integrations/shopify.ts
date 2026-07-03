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
 * Future: Fetch product availability from Shopify by product ID.
 */
export async function getShopifyProduct(
  _productId: string
): Promise<ShopifyProduct | null> {
  return null;
}

/**
 * Future: Create a Shopify cart.
 */
export async function createCart(
  _lines?: { merchandiseId: string; quantity: number }[]
): Promise<ShopifyCart | null> {
  return null;
}

/**
 * Future: Add items to an existing cart.
 */
export async function addToCart(
  _cartId: string,
  _lines: { merchandiseId: string; quantity: number }[]
): Promise<ShopifyCart | null> {
  return null;
}

/**
 * Future: Get checkout URL for a cart.
 */
export function getCheckoutUrl(_cart: ShopifyCart | null): string | null {
  return _cart?.checkoutUrl ?? null;
}
