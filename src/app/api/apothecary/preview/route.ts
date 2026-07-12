/**
 * POST /api/apothecary/preview
 *
 * Server-mediated Draft Mode enable for Apothecary products.
 * Requires a Sanity Studio user bearer token (not a shared preview secret).
 *
 * Body: { documentId: string; slug?: string; locale?: "en" | "da" }
 * Response: { redirectTo: string } with Draft Mode cookies set.
 */

import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { authorizeSanityStudioEditor } from "@/lib/apothecary/studio-auth";
import { previewClient } from "@/sanity/lib/client";
import { productPreviewByIdQuery } from "@/sanity/lib/queries";
import {
  productDraftPreviewPath,
  productSlugValue,
  type ProductPreviewFields,
} from "@/sanity/lib/product-preview";

export const runtime = "nodejs";

type PreviewBody = {
  documentId?: string;
  slug?: string;
  locale?: string;
};

function stripDraft(id: string): string {
  return id.replace(/^drafts\./, "");
}

export async function POST(request: NextRequest) {
  const auth = await authorizeSanityStudioEditor(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  if (!process.env.SANITY_API_TOKEN) {
    return NextResponse.json(
      { error: "Preview is not configured" },
      { status: 503 },
    );
  }

  let body: PreviewBody;
  try {
    body = (await request.json()) as PreviewBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const rawId = body.documentId?.trim();
  if (!rawId) {
    return NextResponse.json(
      { error: "documentId is required" },
      { status: 400 },
    );
  }

  const id = stripDraft(rawId);

  let product: ProductPreviewFields | null = null;
  try {
    product = await previewClient.fetch<ProductPreviewFields | null>(
      productPreviewByIdQuery,
      { id },
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to resolve product" },
      { status: 500 },
    );
  }

  if (!product) {
    // Do not enable Draft Mode for missing documents
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const slug =
    productSlugValue(product.slug) ||
    (body.slug || "").replace(/^\/+|\/+$/g, "") ||
    null;

  if (!slug) {
    return NextResponse.json(
      { error: "Product slug is required before preview" },
      { status: 400 },
    );
  }

  const language =
    body.locale === "da" || product.language === "da" ? "da" : "en";

  const path = productDraftPreviewPath({
    slug,
    language,
    _id: id,
  });

  if (!path) {
    return NextResponse.json(
      { error: "Unable to derive preview path" },
      { status: 400 },
    );
  }

  const draft = await draftMode();
  draft.enable();

  const joiner = path.includes("?") ? "&" : "?";
  const redirectTo = `${path}${joiner}previewId=${encodeURIComponent(id)}`;

  return NextResponse.json({ redirectTo });
}
