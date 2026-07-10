/**
 * Studio helpers for Apothecary product management — actions, badges, preview URLs.
 */

import type {
  DocumentActionComponent,
  DocumentActionsContext,
  DocumentBadgeComponent,
  DocumentBadgesContext,
  ResolveProductionUrlContext,
  SanityDocumentLike,
  Template,
} from "sanity";
import {
  PRODUCT_DOCUMENT_ACTIONS,
  PRODUCT_AI_DOCUMENT_ACTIONS,
} from "@/sanity/actions/productActions";
import { PRODUCT_DOCUMENT_BADGES } from "@/sanity/badges/productBadges";

const PRODUCT_TYPES = new Set(["product"]);

type ProductLike = SanityDocumentLike & {
  _type?: string;
  slug?: { current?: string };
  language?: string;
};

function siteOrigin(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SANITY_STUDIO_SITE_URL ||
    "http://localhost:3000"
  );
}

function previewSecret(): string | undefined {
  return (
    process.env.SANITY_STUDIO_PREVIEW_SECRET ||
    process.env.NEXT_PUBLIC_SANITY_PREVIEW_SECRET ||
    undefined
  );
}

export function resolveProductActions(
  prev: DocumentActionComponent[],
  context: DocumentActionsContext,
): DocumentActionComponent[] {
  if (!PRODUCT_TYPES.has(context.schemaType)) return prev;

  // Prefer archive over hard delete for catalogue safety
  const withoutDelete = prev.filter((action) => action.action !== "delete");
  return [
    ...withoutDelete,
    ...PRODUCT_DOCUMENT_ACTIONS,
    ...PRODUCT_AI_DOCUMENT_ACTIONS,
  ];
}

export function resolveProductBadges(
  prev: DocumentBadgeComponent[],
  context: DocumentBadgesContext,
): DocumentBadgeComponent[] {
  if (!PRODUCT_TYPES.has(context.schemaType)) return prev;
  return [...prev, ...PRODUCT_DOCUMENT_BADGES];
}

export async function resolveProductProductionUrl(
  prev: string | undefined,
  context: ResolveProductionUrlContext,
): Promise<string | undefined> {
  const doc = context.document as ProductLike | undefined;
  if (!doc || doc._type !== "product") return prev;

  const slug = doc.slug?.current;
  if (!slug) return prev;

  const prefix = doc.language === "da" ? "/dk" : "";
  const path = `${prefix}/the-apothecary/${slug}`;
  const origin = siteOrigin().replace(/\/$/, "");
  const secret = previewSecret();

  if (secret) {
    return `${origin}/api/draft?secret=${encodeURIComponent(secret)}&slug=${encodeURIComponent(path)}`;
  }

  return `${origin}${path}`;
}

export function resolveProductTemplates(prev: Template[]): Template[] {
  return [
    ...prev,
    {
      id: "product-english",
      title: "Product (English)",
      schemaType: "product",
      value: {
        language: "en",
        status: "draft",
        purchaseFraming: "standard",
        currency: "GBP",
        taxBehaviour: "inclusive",
        stockStatus: "in-stock",
        inStock: true,
        visibleInApothecary: false,
        featured: false,
        allowBackorder: false,
        lowStockThreshold: 5,
      },
    },
    {
      id: "product-danish",
      title: "Product (Dansk)",
      schemaType: "product",
      value: {
        language: "da",
        status: "draft",
        purchaseFraming: "standard",
        currency: "DKK",
        taxBehaviour: "inclusive",
        stockStatus: "in-stock",
        inStock: true,
        visibleInApothecary: false,
        featured: false,
        allowBackorder: false,
        lowStockThreshold: 5,
      },
    },
  ];
}
