/**
 * Shared helpers for Apothecary product preview URLs and locale paths.
 *
 * Canonical routes (from i18n):
 * - English (default): /the-apothecary/{slug}
 * - Danish:            /dk/the-apothecary/{slug}
 */

export type ProductPreviewFields = {
  _id?: string;
  slug?: { current?: string } | string;
  language?: string;
};

export function productSlugValue(
  slug: ProductPreviewFields["slug"],
): string | null {
  if (!slug) return null;
  if (typeof slug === "string") return slug || null;
  return slug.current || null;
}

/** Locale-aware public path (no origin). English is unprefixed (canonical). */
export function productPublicPath(product: ProductPreviewFields): string | null {
  const slug = productSlugValue(product.slug);
  if (!slug) return null;
  const prefix = product.language === "da" ? "/dk" : "";
  return `${prefix}/the-apothecary/${slug}`;
}

/**
 * Path used for Draft Mode redirects.
 * English uses the explicit `/en` segment so App Router + next-intl always
 * resolve `[locale]` (unprefixed EN can 404 when middleware rewrite fails).
 * Danish keeps `/dk`.
 */
export function productDraftPreviewPath(
  product: ProductPreviewFields,
): string | null {
  const slug = productSlugValue(product.slug);
  if (!slug) return null;
  if (product.language === "da") return `/dk/the-apothecary/${slug}`;
  return `/en/the-apothecary/${slug}`;
}

export function siteOriginForPreview(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SANITY_STUDIO_SITE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000")
  ).replace(/\/$/, "");
}

export function studioPreviewSecret(): string | undefined {
  return (
    process.env.SANITY_STUDIO_PREVIEW_SECRET ||
    process.env.SANITY_PREVIEW_SECRET ||
    undefined
  );
}

/**
 * Build the Draft Mode enable URL for a product.
 * Requires a preview secret; returns null if secret or slug is missing.
 */
export function buildProductDraftPreviewUrl(
  product: ProductPreviewFields,
): string | null {
  const path = productDraftPreviewPath(product);
  const secret = studioPreviewSecret();
  if (!path || !secret) return null;

  const origin = siteOriginForPreview();
  const params = new URLSearchParams({
    secret,
    slug: path,
  });
  if (product.language) params.set("locale", product.language);
  if (product._id) params.set("id", product._id.replace(/^drafts\./, ""));

  return `${origin}/api/draft?${params.toString()}`;
}
