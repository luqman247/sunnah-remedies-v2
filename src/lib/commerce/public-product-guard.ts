/**
 * Public-facing product guard.
 *
 * Verification fixtures and developer inventory must never appear in the
 * catalogue, monographs index, product detail routes, or sitemaps.
 */

const NON_PUBLIC_SLUG_PATTERN =
  /(^|-)(verification|fixture|do-not-buy|test-product|sample-sku|dev-only)(-|$)/i;

const NON_PUBLIC_NAME_PATTERN =
  /do not buy|must not appear|verification product|not for publication|fixture\b|test inventory/i;

export function isPublicCatalogueProduct(product: {
  slug?: string | { current?: string } | null;
  name?: string | null;
}): boolean {
  const slug =
    typeof product.slug === "string"
      ? product.slug
      : product.slug?.current ?? "";
  const name = product.name ?? "";

  if (!slug && !name) return false;
  if (slug && NON_PUBLIC_SLUG_PATTERN.test(slug)) return false;
  if (name && NON_PUBLIC_NAME_PATTERN.test(name)) return false;
  return true;
}

export function filterPublicCatalogueProducts<
  T extends { slug?: string | { current?: string } | null; name?: string | null },
>(products: T[]): T[] {
  return products.filter(isPublicCatalogueProduct);
}
