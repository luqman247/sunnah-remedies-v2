/**
 * Shared helpers for Apothecary product preview URLs and locale paths.
 *
 * Canonical routes (from i18n):
 * - English (default): /the-apothecary/{slug}
 * - Danish:            /dk/the-apothecary/{slug}
 *
 * Draft Mode is enabled only via authenticated server routes:
 * - POST /api/apothecary/preview (Studio user bearer)
 * - GET /api/draft-mode/enable (Presentation short-lived secrets)
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
    (typeof window !== "undefined" ? window.location.origin : "")
  ).replace(/\/$/, "");
}

/**
 * Build the monograph path for an already-authenticated Draft Mode session.
 * Does not include secrets. Prefer `openProductDraftPreview` from Studio tools.
 */
export function buildProductDraftPreviewPath(
  product: ProductPreviewFields,
): string | null {
  const path = productDraftPreviewPath(product);
  if (!path) return null;
  const id = product._id?.replace(/^drafts\./, "");
  if (!id) return path;
  const joiner = path.includes("?") ? "&" : "?";
  return `${path}${joiner}previewId=${encodeURIComponent(id)}`;
}

/**
 * @deprecated Secret-in-URL preview is retired. Use openProductDraftPreview /
 * POST /api/apothecary/preview instead. Returns null so callers cannot open
 * an insecure enable URL.
 */
export function buildProductDraftPreviewUrl(
  _product: ProductPreviewFields,
): string | null {
  return null;
}

/**
 * Initiate Draft Mode via the authenticated preview API, then open the page.
 * `sanityToken` must be the current Studio user's token from useClient().
 */
export async function requestProductDraftPreview(options: {
  documentId: string;
  slug?: string;
  locale?: string;
  sanityToken: string;
}): Promise<{ redirectTo: string }> {
  if (!options.sanityToken) {
    throw new Error("Sign in to Sanity Studio to preview drafts");
  }
  if (!options.documentId) {
    throw new Error("documentId is required");
  }

  const response = await fetch("/api/apothecary/preview", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${options.sanityToken}`,
    },
    body: JSON.stringify({
      documentId: options.documentId,
      slug: options.slug,
      locale: options.locale,
    }),
  });

  const payload = (await response.json().catch(() => ({}))) as {
    error?: string;
    redirectTo?: string;
  };

  if (!response.ok) {
    throw new Error(payload.error || `Preview failed (${response.status})`);
  }
  if (!payload.redirectTo) {
    throw new Error("Preview did not return a redirect path");
  }

  return { redirectTo: payload.redirectTo };
}
