/**
 * Shopify commerce types — typed responses from the Storefront and Admin APIs.
 *
 * These types represent commerce state from Shopify.
 * Editorial types live in Sanity's type system — never duplicated here.
 *
 * @see Phase 4 Part 2, Spec 01 §1.3
 */

export interface Money {
  amount: string;
  currencyCode: string;
}

export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
  price: Money;
  compareAtPrice: Money | null;
  sku: string | null;
  barcode: string | null;
  weight: number | null;
  weightUnit: string | null;
}

export interface ProductCommerce {
  id: string;
  handle: string;
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  compareAtPriceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  } | null;
  variants: ProductVariant[];
  totalInventory: number | null;
}

export interface ProductCardCommerce {
  id: string;
  handle: string;
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  firstVariantId: string;
}

export type InventoryStatus =
  | "in_stock"
  | "low_stock"
  | "out_of_stock"
  | "backorder";

export const LOW_STOCK_THRESHOLD = 5;

export function deriveInventoryStatus(
  availableForSale: boolean,
  quantity: number | null
): InventoryStatus {
  if (!availableForSale) return "out_of_stock";
  if (quantity === null) return "in_stock";
  if (quantity <= 0) return "backorder";
  if (quantity <= LOW_STOCK_THRESHOLD) return "low_stock";
  return "in_stock";
}

// ── Cart Types ──

export interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: {
      handle: string;
      title: string;
    };
    price: Money;
    image: ShopifyImage | null;
  };
  cost: {
    totalAmount: Money;
    compareAtAmountPerQuantity: Money | null;
  };
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: CartLine[];
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money | null;
  };
  discountCodes: { code: string; applicable: boolean }[];
  note: string | null;
}

// ── Collection Types ──

export interface CollectionProduct {
  handle: string;
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  products: CollectionProduct[];
}

// ── Webhook Types ──

export interface WebhookPayload {
  id: string | number;
  [key: string]: unknown;
}
