/**
 * Apothecary product service — single composition entry for public pages.
 *
 * Sanity is the source of truth for editable product content.
 * Only publicly visible products are returned (never drafts/archived).
 */

import { getAllProducts, getProductBySlug } from "@/sanity/lib/fetch";
import { productToRemedy } from "@/sanity/lib/adapters";
import type { Product } from "@/sanity/lib/types";
import type { Remedy } from "@/lib/content/types";

const PUBLIC_STATUSES = new Set([
  "active",
  "coming-soon",
  "out-of-stock",
  undefined,
  null,
]);

export function isPubliclyVisibleProduct(product: Product): boolean {
  if (product.visibleInApothecary === false) return false;
  const status = product.status;
  if (status === "draft" || status === "archived" || status === "discontinued") {
    return false;
  }
  if (status && !PUBLIC_STATUSES.has(status)) return false;
  return true;
}

export async function listPublicRemedies(locale: string): Promise<Remedy[]> {
  const products = await getAllProducts(locale);
  return products.filter(isPubliclyVisibleProduct).map(productToRemedy);
}

export async function getPublicRemedyBySlug(
  slug: string,
  locale: string,
): Promise<Remedy | null> {
  const product = await getProductBySlug(slug, locale);
  if (!product || !isPubliclyVisibleProduct(product)) return null;
  return productToRemedy(product);
}

export async function listFeaturedRemedies(
  locale: string,
  limit = 3,
): Promise<Remedy[]> {
  const remedies = await listPublicRemedies(locale);
  const featured = remedies
    .filter((r) => r.featured)
    .sort((a, b) => (a.featuredPriority ?? 99) - (b.featuredPriority ?? 99));
  if (featured.length >= limit) return featured.slice(0, limit);
  const rest = remedies.filter((r) => !r.featured);
  return [...featured, ...rest].slice(0, limit);
}

export async function resolveRelatedRemedies(
  remedy: Remedy,
  locale: string,
): Promise<Remedy[]> {
  if (!remedy.relatedRemedies.length) return [];
  const all = await listPublicRemedies(locale);
  const bySlug = new Map(all.map((r) => [r.slug, r]));
  return remedy.relatedRemedies
    .map((slug) => bySlug.get(slug))
    .filter((r): r is Remedy => Boolean(r));
}
