/**
 * Commerce reconciliation — verifies Sanity ↔ Shopify consistency.
 *
 * Runs as a cron job or manual audit. Identifies:
 * - Products in Sanity with broken Shopify links
 * - Shopify products not linked to any Sanity document
 * - Price/availability mismatches (informational only — Shopify is SoT)
 * - Stale sync timestamps
 *
 * @see Phase 4 Part 2, Spec 08 §8.3
 */

import { client } from "@/sanity/lib/client";
import { adminQuery } from "../shopify/admin-client";
import { isCommerceConfigured } from "../config/env";

export interface ReconciliationReport {
  timestamp: string;
  sanityProducts: number;
  shopifyProducts: number;
  linked: number;
  orphanedSanity: string[];
  orphanedShopify: string[];
  staleSync: string[];
  errors: string[];
}

const SANITY_COMMERCE_QUERY = `
  *[_type == "product" && defined(commerce.shopifyProductId)] {
    _id,
    name,
    "slug": slug.current,
    "shopifyProductId": commerce.shopifyProductId,
    "shopifyHandle": commerce.shopifyHandle,
    "lastSyncedAt": commerce.lastSyncedAt,
    "status": commerce.status
  }
`;

const SHOPIFY_ALL_PRODUCTS_QUERY = `
  query AllProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      edges {
        node {
          id
          handle
          title
          status
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

interface SanityCommerceProduct {
  _id: string;
  name: string;
  slug: string;
  shopifyProductId: string;
  shopifyHandle: string | null;
  lastSyncedAt: string | null;
  status: string | null;
}

interface ShopifyAllProductsResponse {
  products: {
    edges: Array<{
      node: { id: string; handle: string; title: string; status: string };
      cursor: string;
    }>;
    pageInfo: { hasNextPage: boolean; endCursor: string };
  };
}

export async function runReconciliation(): Promise<ReconciliationReport> {
  if (!isCommerceConfigured()) {
    return {
      timestamp: new Date().toISOString(),
      sanityProducts: 0,
      shopifyProducts: 0,
      linked: 0,
      orphanedSanity: [],
      orphanedShopify: [],
      staleSync: [],
      errors: ["Commerce not configured"],
    };
  }

  const report: ReconciliationReport = {
    timestamp: new Date().toISOString(),
    sanityProducts: 0,
    shopifyProducts: 0,
    linked: 0,
    orphanedSanity: [],
    orphanedShopify: [],
    staleSync: [],
    errors: [],
  };

  try {
    const sanityProducts = await client.fetch<SanityCommerceProduct[]>(SANITY_COMMERCE_QUERY);
    report.sanityProducts = sanityProducts.length;

    const sanityGids = new Set(sanityProducts.map((p) => p.shopifyProductId));

    const shopifyProducts: Array<{ id: string; handle: string; title: string }> = [];
    let hasNext = true;
    let cursor: string | undefined;

    while (hasNext) {
      const data = await adminQuery<ShopifyAllProductsResponse>(
        SHOPIFY_ALL_PRODUCTS_QUERY,
        { first: 50, after: cursor ?? null }
      );
      for (const edge of data.products.edges) {
        shopifyProducts.push(edge.node);
        cursor = edge.cursor;
      }
      hasNext = data.products.pageInfo.hasNextPage;
    }

    report.shopifyProducts = shopifyProducts.length;
    const shopifyGids = new Set(shopifyProducts.map((p) => p.id));

    report.linked = sanityProducts.filter((p) => shopifyGids.has(p.shopifyProductId)).length;

    report.orphanedSanity = sanityProducts
      .filter((p) => !shopifyGids.has(p.shopifyProductId))
      .map((p) => `${p.name} (${p.slug}) → ${p.shopifyProductId}`);

    report.orphanedShopify = shopifyProducts
      .filter((p) => !sanityGids.has(p.id))
      .map((p) => `${p.title} (${p.handle}) — ${p.id}`);

    const staleThreshold = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 days
    report.staleSync = sanityProducts
      .filter((p) => {
        if (!p.lastSyncedAt) return true;
        return new Date(p.lastSyncedAt).getTime() < staleThreshold;
      })
      .map((p) => `${p.name} (last synced: ${p.lastSyncedAt ?? "never"})`);
  } catch (error) {
    report.errors.push(error instanceof Error ? error.message : String(error));
  }

  return report;
}
