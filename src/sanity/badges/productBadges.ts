/**
 * Document badges for Apothecary products — status, stock, featured, language.
 */

"use client";

import type { DocumentBadgeComponent } from "sanity";

type ProductFields = {
  status?: string;
  stockStatus?: string;
  featured?: boolean;
  language?: string;
  purchaseFraming?: string;
  visibleInApothecary?: boolean;
};

type BadgeColor = "primary" | "success" | "warning" | "danger" | undefined;

function fields(props: {
  draft?: Record<string, unknown> | null;
  published?: Record<string, unknown> | null;
}): ProductFields {
  return (props.draft || props.published || {}) as ProductFields;
}

export const ProductStatusBadge: DocumentBadgeComponent = (props) => {
  const { status } = fields(props);
  if (!status) return null;

  const tones: Record<string, BadgeColor> = {
    draft: undefined,
    active: "success",
    "coming-soon": "warning",
    "out-of-stock": "danger",
    discontinued: "warning",
    archived: "danger",
  };

  const labels: Record<string, string> = {
    draft: "Draft",
    active: "Active",
    "coming-soon": "Coming soon",
    "out-of-stock": "Out of stock",
    discontinued: "Discontinued",
    archived: "Archived",
  };

  return {
    label: labels[status] || status,
    title: `Publication status: ${status}`,
    color: tones[status],
  };
};

export const ProductStockBadge: DocumentBadgeComponent = (props) => {
  const { stockStatus, status } = fields(props);
  if (!stockStatus || status === "archived") return null;
  if (stockStatus === "in-stock") return null;

  const labels: Record<string, string> = {
    "low-stock": "Low stock",
    "out-of-stock": "No stock",
    backorder: "Backorder",
    unavailable: "Unavailable",
  };

  return {
    label: labels[stockStatus] || stockStatus,
    title: `Stock: ${stockStatus}`,
    color:
      stockStatus === "out-of-stock" || stockStatus === "unavailable"
        ? "danger"
        : "warning",
  };
};

export const ProductFeaturedBadge: DocumentBadgeComponent = (props) => {
  const { featured } = fields(props);
  if (!featured) return null;
  return {
    label: "Featured",
    title: "Featured on the Apothecary",
    color: "primary",
  };
};

export const ProductLanguageBadge: DocumentBadgeComponent = (props) => {
  const { language } = fields(props);
  if (!language) return null;
  return {
    label: language.toUpperCase(),
    title: language === "da" ? "Danish document" : "English document",
  };
};

export const ProductHiddenBadge: DocumentBadgeComponent = (props) => {
  const { visibleInApothecary, status } = fields(props);
  if (visibleInApothecary !== false || status === "archived") return null;
  return {
    label: "Hidden",
    title: "Not visible in the public Apothecary",
    color: "warning",
  };
};

export const PRODUCT_DOCUMENT_BADGES = [
  ProductStatusBadge,
  ProductStockBadge,
  ProductFeaturedBadge,
  ProductLanguageBadge,
  ProductHiddenBadge,
] as const;
