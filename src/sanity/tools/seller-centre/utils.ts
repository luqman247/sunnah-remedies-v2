/**
 * Seller Centre helpers — slug, SKU, preview URLs, money formatting.
 */

import { requestProductDraftPreview } from "@/sanity/lib/product-preview";
import type {
  AcceptedContent,
  PublicationStatus,
  SellerProductRow,
  StockStatus,
} from "./types";

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

export function generateSku(name: string): string {
  const base = name
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "")
    .slice(0, 8);
  const suffix = Date.now().toString(36).toUpperCase().slice(-4);
  return `SR-${base || "ITEM"}-${suffix}`;
}

export function newKey(prefix = "k"): string {
  return `${prefix}${Math.random().toString(36).slice(2, 10)}`;
}

export function stripDraftId(id: string): string {
  return id.replace(/^drafts\./, "");
}

export function toDraftId(id: string): string {
  const clean = stripDraftId(id);
  return `drafts.${clean}`;
}

export function formatMoney(amount?: number, currency: string = "GBP"): string {
  if (typeof amount !== "number") return "—";
  if (currency === "DKK") return `${amount} kr`;
  return `£${amount}`;
}

export function statusLabel(status?: PublicationStatus): string {
  switch (status) {
    case "active":
      return "Live";
    case "draft":
      return "Draft";
    case "coming-soon":
      return "Coming soon";
    case "out-of-stock":
      return "Out of stock";
    case "archived":
      return "Archived";
    case "discontinued":
      return "Discontinued";
    default:
      return status || "Unknown";
  }
}

export function stockLabel(stock?: StockStatus | string): string {
  switch (stock) {
    case "in-stock":
      return "In stock";
    case "low-stock":
      return "Low stock";
    case "out-of-stock":
      return "Out of stock";
    case "backorder":
      return "Backorder";
    case "unavailable":
      return "Unavailable";
    default:
      return stock || "—";
  }
}

export function visibilityLabel(row: SellerProductRow): string {
  if (row.status === "archived") return "Archived";
  if (row.visibleInApothecary === false) return "Hidden";
  if (row.status === "draft") return "Hidden";
  return "Visible";
}

/** True when AI review, price, or short copy still needs attention */
export function needsAttention(row: SellerProductRow): boolean {
  return (
    row.aiDraft?.reviewStatus === "review-required" ||
    (row.status === "active" && typeof row.price !== "number") ||
    !row.institutionalSummary?.trim()
  );
}

export function isHiddenProduct(row: SellerProductRow): boolean {
  return (
    row.visibleInApothecary === false ||
    row.status === "draft" ||
    row.status === "archived"
  );
}

export function languageCompletion(row: SellerProductRow): string {
  const lang = row.language === "da" ? "DA" : "EN";
  const hasCopy = Boolean(row.institutionalSummary?.trim());
  return hasCopy ? `${lang} · ready` : `${lang} · incomplete`;
}

/**
 * Open an authenticated draft preview. Requires the Studio user's Sanity token.
 */
export async function openProductPreview(
  row: Pick<SellerProductRow, "slug" | "language"> & { _id?: string },
  sanityToken: string,
): Promise<void> {
  if (!row._id) {
    throw new Error("Save the product before previewing");
  }
  const slug =
    typeof row.slug === "string" ? row.slug : row.slug?.current || undefined;
  const { redirectTo } = await requestProductDraftPreview({
    documentId: row._id,
    slug,
    locale: row.language,
    sanityToken,
  });
  const origin =
    typeof window !== "undefined" ? window.location.origin : "";
  window.open(`${origin}${redirectTo}`, "_blank", "noopener,noreferrer");
}

/** @deprecated Use openProductPreview — secret-in-URL preview is retired. */
export function productPreviewUrl(
  _row: Pick<SellerProductRow, "slug" | "language"> & { _id?: string },
): string | null {
  return null;
}

export function emptyAcceptedContent(): AcceptedContent {
  return {
    subtitle: "",
    shortDescription: "",
    fullDescription: "",
    keyQualities: [],
    sourcingParagraph: "",
    howToUse: "",
    storageGuidance: "",
    faqs: [],
    seoTitle: "",
    metaDescription: "",
  };
}

export function publishRequirements(input: {
  name?: string;
  slug?: string;
  price?: number | "";
  shortDescription?: string;
  hasPrimaryImage?: boolean;
  comingSoon?: boolean;
}): string[] {
  const missing: string[] = [];
  if (!input.name?.trim()) missing.push("Add a product name");
  if (!input.slug?.trim()) missing.push("Add a URL slug");
  if (!input.hasPrimaryImage) missing.push("Upload a primary image");
  if (!input.shortDescription?.trim()) missing.push("Add a short description");
  if (
    !input.comingSoon &&
    (input.price === "" || input.price === undefined || Number(input.price) < 0)
  ) {
    missing.push("Set a regular price (or mark Coming soon)");
  }
  return missing;
}

export async function callProductAi(
  body: Record<string, unknown>,
  sanityToken: string,
): Promise<Record<string, unknown>> {
  if (!sanityToken) {
    throw new Error("Sign in to Sanity Studio to generate AI drafts");
  }
  const response = await fetch("/api/apothecary/generate-content", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sanityToken}`,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const err = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(err.error || `AI request failed (${response.status})`);
  }
  return response.json() as Promise<Record<string, unknown>>;
}
