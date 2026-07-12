/**
 * Listing Centre types — Milestone 1 shell (no media / AI).
 */

import type { PublicationStatus, StockStatus } from "./types";

export type ListingView =
  | { kind: "home" }
  | { kind: "add" }
  | { kind: "edit"; documentId: string };

export interface ListingProductRow {
  _id: string;
  _updatedAt?: string;
  name?: string;
  slug?: { current?: string };
  language?: string;
  price?: number;
  currency?: string;
  stockStatus?: StockStatus;
  status?: PublicationStatus;
  visibleInApothecary?: boolean;
  featured?: boolean;
  institutionalSummary?: string;
  mainImage?: { asset?: { _ref?: string; url?: string }; alt?: string };
}

export interface ListingComposerState {
  documentId: string | null;
  name: string;
  slug: string;
  subtitle: string;
  institutionalSummary: string;
  price: string;
  salePrice: string;
  currency: "GBP" | "DKK";
  volume: string;
  stockStatus: StockStatus;
  estimatedDispatchTime: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  status: PublicationStatus;
  visibleInApothecary: boolean;
  featured: boolean;
  hasPrimaryImage: boolean;
  language: "en" | "da";
}

export function emptyComposerState(): ListingComposerState {
  return {
    documentId: null,
    name: "",
    slug: "",
    subtitle: "",
    institutionalSummary: "",
    price: "",
    salePrice: "",
    currency: "GBP",
    volume: "",
    stockStatus: "in-stock",
    estimatedDispatchTime: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    status: "draft",
    visibleInApothecary: false,
    featured: false,
    hasPrimaryImage: false,
    language: "en",
  };
}
