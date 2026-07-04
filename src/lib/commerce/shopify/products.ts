/**
 * Shopify product service — fetches commerce data by handle or ID.
 *
 * Returns typed commerce state for composition with Sanity editorial data.
 */

import { storefrontQuery } from "./storefront-client";
import {
  PRODUCT_COMMERCE_BY_HANDLE,
  PRODUCT_CARDS_BY_HANDLES,
  INVENTORY_STATUS,
} from "./queries/products";
import type { ProductCommerce, ProductCardCommerce, ProductVariant } from "./types";

interface ProductByHandleResponse {
  product: {
    id: string;
    handle: string;
    availableForSale: boolean;
    priceRange: {
      minVariantPrice: { amount: string; currencyCode: string };
      maxVariantPrice: { amount: string; currencyCode: string };
    };
    compareAtPriceRange: {
      minVariantPrice: { amount: string; currencyCode: string };
      maxVariantPrice: { amount: string; currencyCode: string };
    } | null;
    variants: {
      edges: Array<{
        node: ProductVariant;
      }>;
    };
    totalInventory: number | null;
  } | null;
}

interface ProductCardsResponse {
  products: {
    edges: Array<{
      node: {
        id: string;
        handle: string;
        availableForSale: boolean;
        priceRange: {
          minVariantPrice: { amount: string; currencyCode: string };
          maxVariantPrice: { amount: string; currencyCode: string };
        };
        variants: {
          edges: Array<{ node: { id: string } }>;
        };
      };
    }>;
  };
}

interface InventoryStatusResponse {
  node: {
    id: string;
    availableForSale: boolean;
    quantityAvailable: number | null;
  } | null;
}

export async function getProductCommerce(handle: string): Promise<ProductCommerce | null> {
  const data = await storefrontQuery<ProductByHandleResponse>(
    PRODUCT_COMMERCE_BY_HANDLE,
    { handle }
  );

  if (!data.product) return null;

  const { product } = data;
  return {
    id: product.id,
    handle: product.handle,
    availableForSale: product.availableForSale,
    priceRange: product.priceRange,
    compareAtPriceRange: product.compareAtPriceRange,
    variants: product.variants.edges.map((e) => e.node),
    totalInventory: product.totalInventory,
  };
}

export async function getProductCardsCommerce(
  handles: string[]
): Promise<ProductCardCommerce[]> {
  if (handles.length === 0) return [];

  const queryString = handles.map((h) => `handle:${h}`).join(" OR ");
  const data = await storefrontQuery<ProductCardsResponse>(
    PRODUCT_CARDS_BY_HANDLES,
    { first: handles.length, query: queryString }
  );

  return data.products.edges.map(({ node }) => ({
    id: node.id,
    handle: node.handle,
    availableForSale: node.availableForSale,
    priceRange: node.priceRange,
    firstVariantId: node.variants.edges[0]?.node.id ?? "",
  }));
}

export async function getVariantInventory(
  variantId: string
): Promise<{ availableForSale: boolean; quantity: number | null } | null> {
  const data = await storefrontQuery<InventoryStatusResponse>(
    INVENTORY_STATUS,
    { id: variantId }
  );

  if (!data.node) return null;
  return {
    availableForSale: data.node.availableForSale,
    quantity: data.node.quantityAvailable,
  };
}
