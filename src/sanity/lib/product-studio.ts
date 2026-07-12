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
import {
  buildProductDraftPreviewPath,
  productPublicPath,
  siteOriginForPreview,
} from "@/sanity/lib/product-preview";

const PRODUCT_TYPES = new Set(["product"]);

type ProductLike = SanityDocumentLike & {
  _id?: string;
  _type?: string;
  slug?: { current?: string };
  language?: string;
};

export function resolveProductActions(
  prev: DocumentActionComponent[],
  context: DocumentActionsContext,
): DocumentActionComponent[] {
  if (!PRODUCT_TYPES.has(context.schemaType)) return prev;

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

  const withId = { ...doc, _id: doc._id };
  // Presentation enables Draft Mode via /api/draft-mode/enable first, then
  // navigates here. Do not embed long-lived secrets in this URL.
  const draftPath = buildProductDraftPreviewPath(withId);
  if (draftPath) {
    const origin = siteOriginForPreview();
    return origin ? `${origin}${draftPath}` : draftPath;
  }

  const path = productPublicPath(withId);
  if (!path) return prev;
  const origin = siteOriginForPreview();
  return origin ? `${origin}${path}` : path;
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
