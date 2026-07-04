/**
 * Enhanced Ecommerce item builders — products and courses.
 *
 * Standardises the GA4 item schema across Shopify products and
 * Academy courses so both report through one commerce model.
 * item_brand is always "Sunnah Remedies".
 */

import type { EcommerceItem } from "./types";

const BRAND = "Sunnah Remedies";

/* ── Product item builder ──────────────────────────────────────── */

export interface ProductItemInput {
  id: string;
  name: string;
  category?: string;
  subcategory?: string;
  variant?: string;
  price?: number;
  quantity?: number;
  currency?: string;
  coupon?: string;
  listName?: string;
  index?: number;
}

export function buildProductItem(input: ProductItemInput): EcommerceItem {
  return {
    item_id: input.id,
    item_name: input.name,
    item_brand: BRAND,
    item_category: "Apothecary",
    ...(input.subcategory && { item_category2: input.subcategory }),
    ...(input.variant && { item_variant: input.variant }),
    ...(input.price !== undefined && { price: input.price }),
    quantity: input.quantity ?? 1,
    currency: input.currency ?? "GBP",
    ...(input.coupon && { coupon: input.coupon }),
    ...(input.listName && { item_list_name: input.listName }),
    ...(input.index !== undefined && { index: input.index }),
  };
}

/* ── Course item builder ───────────────────────────────────────── */

export interface CourseItemInput {
  id: string;
  name: string;
  subcategory?: string;
  variant?: string;
  price?: number;
  quantity?: number;
  currency?: string;
  coupon?: string;
  listName?: string;
  index?: number;
}

export function buildCourseItem(input: CourseItemInput): EcommerceItem {
  return {
    item_id: input.id,
    item_name: input.name,
    item_brand: BRAND,
    item_category: "Academy",
    ...(input.subcategory && { item_category2: input.subcategory }),
    ...(input.variant && { item_variant: input.variant }),
    ...(input.price !== undefined && { price: input.price }),
    quantity: input.quantity ?? 1,
    currency: input.currency ?? "GBP",
    ...(input.coupon && { coupon: input.coupon }),
    ...(input.listName && { item_list_name: input.listName }),
    ...(input.index !== undefined && { index: input.index }),
  };
}

/* ── Journey item builder ──────────────────────────────────────── */

export interface JourneyItemInput {
  id: string;
  name: string;
  subcategory?: string;
  price?: number;
  quantity?: number;
  currency?: string;
  listName?: string;
  index?: number;
}

export function buildJourneyItem(input: JourneyItemInput): EcommerceItem {
  return {
    item_id: input.id,
    item_name: input.name,
    item_brand: BRAND,
    item_category: "Sacred Journeys",
    ...(input.subcategory && { item_category2: input.subcategory }),
    quantity: input.quantity ?? 1,
    ...(input.price !== undefined && { price: input.price }),
    currency: input.currency ?? "GBP",
    ...(input.listName && { item_list_name: input.listName }),
    ...(input.index !== undefined && { index: input.index }),
  };
}
