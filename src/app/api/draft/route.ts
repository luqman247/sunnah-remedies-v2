/**
 * GET /api/draft
 *
 * Enables Next.js Draft Mode after validating a server-side preview secret.
 * Used by Sanity Studio “Preview Draft” for unpublished / hidden products.
 *
 * Query params:
 * - secret (required) — must match SANITY_PREVIEW_SECRET
 * - slug — full path (/en/the-apothecary/x or /dk/the-apothecary/x) or bare slug
 * - locale — en | da (optional; inferred from path or defaults to en)
 * - id — Sanity product document id without drafts. prefix (optional)
 */

import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { productDraftPreviewPath } from "@/sanity/lib/product-preview";

export const runtime = "nodejs";

function resolveRedirectPath(request: NextRequest): string {
  const { searchParams } = request.nextUrl;
  const rawSlug = searchParams.get("slug") || "";
  const localeParam = searchParams.get("locale");
  const id = searchParams.get("id")?.replace(/^drafts\./, "") || undefined;
  const language = localeParam === "da" ? "da" : "en";

  let path = rawSlug.trim();

  if (!path || path === "/") {
    const bare = searchParams.get("productSlug");
    if (bare) {
      path =
        productDraftPreviewPath({
          slug: bare,
          language,
        }) || "/";
    } else {
      path = "/";
    }
  }

  // Bare product slug → locale-aware draft path
  if (path && !path.startsWith("/")) {
    path =
      productDraftPreviewPath({
        slug: path,
        language,
      }) || `/${path}`;
  }

  // Legacy unprefixed English public path → explicit /en for Draft Mode
  if (path.startsWith("/the-apothecary/") && !path.startsWith("/dk/")) {
    path = `/en${path}`;
  }

  if (id) {
    const joiner = path.includes("?") ? "&" : "?";
    path = `${path}${joiner}previewId=${encodeURIComponent(id)}`;
  }

  return path || "/";
}

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const expected = process.env.SANITY_PREVIEW_SECRET;

  if (!expected) {
    return NextResponse.json(
      { error: "Preview secret not configured" },
      { status: 500 },
    );
  }

  if (!secret || secret !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  redirect(resolveRedirectPath(request));
}
