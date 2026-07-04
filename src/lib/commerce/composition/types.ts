/**
 * Commerce composition types — view models for the frontend.
 *
 * These types represent the merged state of:
 *  - Sanity editorial (narrative, scholarship, framing)
 *  - Shopify commerce (price, availability, variants)
 *  - Cloudinary media (transformed image URLs)
 *
 * The composition layer is the ONLY place where these three sources merge.
 * Components receive these view models, never raw API responses.
 *
 * @see Phase 4 Part 2, Spec 06 §6.4
 */

import type { Money, ProductVariant, InventoryStatus } from "../shopify/types";

// ── Product View ──

export interface ProductView {
  // Identity (Sanity)
  slug: string;
  name: string;
  transliteration?: string;
  botanicalName?: string;
  nature?: string;
  institutionalSummary?: string;
  folio?: string;

  // Commerce (Shopify — live)
  commerce: ProductCommerceView | null;

  // Framing (Sanity)
  purchaseFraming: "standard" | "education-first" | "reference-only";

  // Media (Cloudinary/Sanity)
  mainImage?: ImageView;
  gallery?: ImageView[];

  // Editorial content (Sanity)
  historicalContext?: string[];
  propheticReferences?: PropheticReferenceView[];
  traditionalScholarship?: string[];
  traditionalUsage?: string[];
  evidenceEstablished?: string[];
  evidenceEmerging?: string[];

  // Provenance (Sanity)
  provenanceOrigin?: string[];
  provenanceCultivation?: string[];
  provenanceHarvesting?: string[];
  laboratoryVerification?: string[];
  qualityAssurance?: string[];

  // Usage (Sanity)
  suggestedUse?: string[];
  preparation?: string[];
  storage?: string[];
  contraindications?: string[];

  // Commerce display (Sanity — editorial control)
  volume?: string;
  priceNote?: string;

  // Relations (Sanity)
  relatedProducts?: ProductCardView[];
  ingredients?: { name: string; slug: string }[];
  academyLessons?: { label: string; href: string }[];
  knowledgeLibrary?: { label: string; href: string }[];
  pathways?: { label: string; href: string }[];
  faq?: { question: string; answer: string }[];

  // SEO
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
  };
}

export interface ProductCommerceView {
  shopifyProductId: string;
  shopifyHandle?: string;
  availableForSale: boolean;
  price: Money;
  compareAtPrice: Money | null;
  variants: ProductVariantView[];
  inventoryStatus: InventoryStatus;
  totalInventory: number | null;
}

export interface ProductVariantView {
  id: string;
  title: string;
  editorialLabel?: string;
  sanityKey?: string;
  availableForSale: boolean;
  price: Money;
  compareAtPrice: Money | null;
  inventoryStatus: InventoryStatus;
  quantityAvailable: number | null;
}

// ── Product Card View (listing/grid) ──

export interface ProductCardView {
  slug: string;
  name: string;
  nature?: string;
  folio?: string;
  mainImage?: ImageView;
  volume?: string;
  priceNote?: string;
  purchaseFraming: "standard" | "education-first" | "reference-only";
  commerce: {
    availableForSale: boolean;
    price: Money;
    firstVariantId: string;
  } | null;
}

// ── Collection View ──

export interface CollectionView {
  slug: string;
  name: string;
  description?: string;
  image?: ImageView;
  products: ProductCardView[];
  featuredProducts?: ProductCardView[];
  season?: {
    startDate?: string;
    endDate?: string;
    isSeasonal?: boolean;
  };
}

// ── Image View ──

export interface ImageView {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  blurDataUrl?: string;
}

// ── Supporting types ──

export interface PropheticReferenceView {
  statement: string;
  transliteration?: string;
  grade: string;
  source: string;
  standing?: string;
  attribution: string;
}
