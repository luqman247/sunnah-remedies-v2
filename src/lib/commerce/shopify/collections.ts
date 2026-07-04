/**
 * Shopify collection service — fetches collection membership from Storefront API.
 */

import { storefrontQuery } from "./storefront-client";
import { COLLECTION_BY_HANDLE } from "./queries/collections";
import type { ShopifyCollection } from "./types";

interface CollectionByHandleResponse {
  collection: {
    id: string;
    handle: string;
    title: string;
    products: {
      edges: Array<{
        node: {
          handle: string;
          availableForSale: boolean;
          priceRange: {
            minVariantPrice: { amount: string; currencyCode: string };
            maxVariantPrice: { amount: string; currencyCode: string };
          };
        };
      }>;
    };
  } | null;
}

export async function getCollectionCommerce(
  handle: string,
  first = 50
): Promise<ShopifyCollection | null> {
  const data = await storefrontQuery<CollectionByHandleResponse>(
    COLLECTION_BY_HANDLE,
    { handle, first }
  );

  if (!data.collection) return null;

  const { collection } = data;
  return {
    id: collection.id,
    handle: collection.handle,
    title: collection.title,
    products: collection.products.edges.map(({ node }) => node),
  };
}
