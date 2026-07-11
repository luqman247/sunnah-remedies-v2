/**
 * Shared types for Apothecary Seller Centre (Studio tool).
 */

export type SellerView =
  | { kind: "home" }
  | { kind: "add"; draftId?: string; step?: number }
  | { kind: "edit"; documentId: string };

export type StockStatus =
  | "in-stock"
  | "low-stock"
  | "out-of-stock"
  | "backorder"
  | "unavailable";

export type PublicationStatus =
  | "draft"
  | "active"
  | "coming-soon"
  | "out-of-stock"
  | "discontinued"
  | "archived";

export interface SellerProductRow {
  _id: string;
  _updatedAt?: string;
  name?: string;
  slug?: { current?: string };
  language?: string;
  price?: number;
  salePrice?: number;
  currency?: string;
  stockStatus?: StockStatus;
  status?: PublicationStatus;
  visibleInApothecary?: boolean;
  featured?: boolean;
  institutionalSummary?: string;
  subtitle?: string;
  volume?: string;
  sku?: string;
  productType?: string;
  mainImage?: {
    asset?: { _ref?: string; url?: string };
    alt?: string;
  };
  category?: { _id: string; title?: string; name?: string };
  collection?: { _id: string; title?: string; name?: string };
  aiDraft?: { reviewStatus?: string };
}

export interface RefOption {
  _id: string;
  title: string;
}

export interface WizardMediaImage {
  _key: string;
  assetId: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface WizardVideo {
  _key: string;
  title: string;
  caption: string;
  externalUrl?: string;
  libraryVideoId?: string;
  posterAssetId?: string;
  posterUrl?: string;
  autoplay: false;
  controls: true;
}

export interface WizardDetails {
  name: string;
  slug: string;
  categoryId: string;
  productType: string;
  volume: string;
  origin: string;
  ingredientsText: string;
  intendedUse: string;
  brandId: string;
  sku: string;
}

export interface WizardPricing {
  price: number | "";
  salePrice: number | "";
  currency: "GBP" | "DKK";
  stockStatus: StockStatus;
  stockQuantity: number | "";
  lowStockThreshold: number | "";
  comingSoon: boolean;
  allowBackorder: boolean;
  estimatedDispatchTime: string;
  visibleInApothecary: boolean;
  featured: boolean;
}

export interface AiProposal {
  subtitle?: string;
  shortDescription?: string;
  fullDescription?: string;
  keyQualities?: string[];
  sourcingParagraph?: string;
  howToUse?: string;
  storageGuidance?: string;
  faqs?: { question: string; answer: string }[];
  seoTitle?: string;
  metaDescription?: string;
  altTextSuggestions?: string[];
  danishDraft?: string;
  warnings?: string[];
}

export interface AcceptedContent {
  subtitle: string;
  shortDescription: string;
  fullDescription: string;
  keyQualities: string[];
  sourcingParagraph: string;
  howToUse: string;
  storageGuidance: string;
  faqs: { question: string; answer: string }[];
  seoTitle: string;
  metaDescription: string;
}
