/**
 * Seller Centre helpers — slug, SKU, preview URLs, money formatting.
 */

import { buildProductDraftPreviewUrl } from "@/sanity/lib/product-preview";
import type { AcceptedContent, PublicationStatus, SellerProductRow } from "./types";

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

export function visibilityLabel(row: SellerProductRow): string {
  if (row.status === "archived") return "Archived";
  if (row.visibleInApothecary === false) return "Hidden";
  if (row.status === "draft") return "Hidden";
  return "Visible";
}

export function languageCompletion(row: SellerProductRow): string {
  const lang = row.language === "da" ? "DA" : "EN";
  const hasCopy = Boolean(row.institutionalSummary?.trim());
  return hasCopy ? `${lang} · ready` : `${lang} · incomplete`;
}

export function productPreviewUrl(
  row: Pick<SellerProductRow, "slug" | "language"> & { _id?: string },
): string | null {
  return buildProductDraftPreviewUrl({
    _id: row._id,
    slug: row.slug,
    language: row.language,
  });
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
): Promise<Record<string, unknown>> {
  const token = process.env.SANITY_STUDIO_AI_ADMIN_TOKEN || "";
  const response = await fetch("/api/apothecary/generate-content", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const err = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(err.error || `AI request failed (${response.status})`);
  }
  return response.json() as Promise<Record<string, unknown>>;
}
