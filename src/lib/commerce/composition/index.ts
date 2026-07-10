/**
 * Composition layer — merges Sanity editorial + Shopify commerce into view models.
 *
 * The single entry point for the frontend to get product/collection data.
 * Sanity provides editorial content + join keys. Shopify provides live commerce state.
 * This layer merges them into typed view models.
 *
 * Graceful degradation: if Shopify is unreachable, returns editorial-only view
 * with commerce = null. Components render accordingly.
 *
 * @see Phase 4 Part 2, Spec 02 §2.3, Spec 06 §6.4
 */

import { getProductBySlug, getAllProducts } from "@/sanity/lib/fetch";
import { getProductCommerce, getProductCardsCommerce } from "../shopify/products";
import { getCollectionCommerce } from "../shopify/collections";
import { deriveInventoryStatus } from "../shopify/types";
import { isCommerceConfigured } from "../config/env";
import type { Product } from "@/sanity/lib/types";
import type {
  ProductView,
  ProductCardView,
  ProductCommerceView,
  ProductVariantView,
  CollectionView,
  ImageView,
} from "./types";
import type { ProductCommerce, ProductVariant } from "../shopify/types";

// ── Product Composition ──

export async function composeProductView(
  slug: string,
  locale?: string
): Promise<ProductView | null> {
  const editorial = await getProductBySlug(slug, locale);
  if (!editorial) return null;

  let commerce: ProductCommerceView | null = null;

  if (isCommerceConfigured() && editorial.futureShopifyProductId) {
    try {
      const handle = getShopifyHandle(editorial);
      if (handle) {
        const shopifyData = await getProductCommerce(handle);
        if (shopifyData) {
          commerce = mapCommerceToView(shopifyData, editorial);
        }
      }
    } catch (error) {
      console.warn(`[Composition] Shopify unavailable for product "${slug}":`, error);
    }
  }

  return mapEditorialToProductView(editorial, commerce);
}

export async function composeProductCardViews(
  locale?: string
): Promise<ProductCardView[]> {
  const editorials = await getAllProducts(locale);

  if (!isCommerceConfigured()) {
    return editorials.map((e) => mapEditorialToCardView(e, null));
  }

  const handles = editorials
    .map((e) => getShopifyHandle(e))
    .filter((h): h is string => !!h);

  let commerceMap: Map<string, { availableForSale: boolean; price: { amount: string; currencyCode: string }; firstVariantId: string }> = new Map();

  if (handles.length > 0) {
    try {
      const cards = await getProductCardsCommerce(handles);
      commerceMap = new Map(cards.map((c) => [c.handle, {
        availableForSale: c.availableForSale,
        price: c.priceRange.minVariantPrice,
        firstVariantId: c.firstVariantId,
      }]));
    } catch (error) {
      console.warn("[Composition] Shopify unavailable for product cards:", error);
    }
  }

  return editorials.map((e) => {
    const handle = getShopifyHandle(e);
    const commerce = handle ? commerceMap.get(handle) ?? null : null;
    return mapEditorialToCardView(e, commerce);
  });
}

// ── Collection Composition ──

export async function composeCollectionView(
  sanityCollection: {
    slug: string;
    name: string;
    description?: string;
    image?: { url?: string; alt?: string };
    products?: Product[];
    shopifyCollectionRef?: { handle?: string };
    featuredProducts?: Product[];
    season?: { startDate?: string; endDate?: string; isSeasonal?: boolean };
  },
  locale?: string
): Promise<CollectionView> {
  const productCards = (sanityCollection.products ?? []).map((p) =>
    mapEditorialToCardView(p, null)
  );

  if (isCommerceConfigured() && sanityCollection.shopifyCollectionRef?.handle) {
    try {
      const shopifyCollection = await getCollectionCommerce(
        sanityCollection.shopifyCollectionRef.handle
      );
      if (shopifyCollection) {
        const commerceMap = new Map(
          shopifyCollection.products.map((p) => [p.handle, p])
        );
        for (const card of productCards) {
          const commerce = commerceMap.get(card.slug);
          if (commerce) {
            card.commerce = {
              availableForSale: commerce.availableForSale,
              price: commerce.priceRange.minVariantPrice,
              firstVariantId: "",
            };
          }
        }
      }
    } catch (error) {
      console.warn("[Composition] Shopify unavailable for collection:", error);
    }
  }

  return {
    slug: sanityCollection.slug,
    name: sanityCollection.name,
    description: sanityCollection.description,
    image: sanityCollection.image
      ? { url: sanityCollection.image.url ?? "", alt: sanityCollection.image.alt ?? "" }
      : undefined,
    products: productCards,
    featuredProducts: (sanityCollection.featuredProducts ?? []).map((p) =>
      mapEditorialToCardView(p, null)
    ),
    season: sanityCollection.season,
  };
}

// ── Internal Mappers ──

function mapEditorialToProductView(
  editorial: Product,
  commerce: ProductCommerceView | null
): ProductView {
  return {
    slug: editorial.slug.current,
    name: editorial.name,
    transliteration: editorial.transliteration,
    botanicalName: editorial.botanicalName,
    nature: editorial.nature,
    institutionalSummary: editorial.institutionalSummary,
    folio: editorial.folio,
    commerce,
    purchaseFraming: editorial.purchaseFraming ?? "standard",
    mainImage: editorial.mainImage ? mapImage(editorial.mainImage) : undefined,
    gallery: editorial.gallery?.map(mapImage),
    historicalContext: editorial.historicalContext,
    propheticReferences: editorial.propheticReferences?.map((pr) => ({
      statement: pr.statement,
      transliteration: pr.transliteration,
      grade: pr.grade,
      source: pr.source,
      standing: pr.standing,
      attribution: pr.attribution,
    })),
    traditionalScholarship: editorial.traditionalScholarship,
    traditionalUsage: editorial.traditionalUsage,
    evidenceEstablished: editorial.evidenceEstablished,
    evidenceEmerging: editorial.evidenceEmerging,
    provenanceOrigin: editorial.provenanceOrigin,
    provenanceCultivation: editorial.provenanceCultivation,
    provenanceHarvesting: editorial.provenanceHarvesting,
    laboratoryVerification: editorial.laboratoryVerification,
    qualityAssurance: editorial.qualityAssurance,
    suggestedUse: editorial.suggestedUse,
    preparation: editorial.preparation,
    storage: editorial.storage,
    contraindications: editorial.contraindications,
    volume: editorial.volume,
    priceNote: editorial.priceNote,
    relatedProducts: editorial.relatedProducts?.map((p) => mapEditorialToCardView(p, null)),
    ingredients: editorial.ingredients?.map((i) => ({
      name: i.name,
      slug: i.slug.current,
    })),
    academyLessons: editorial.academyLessons,
    knowledgeLibrary: editorial.knowledgeLibrary,
    pathways: editorial.pathways,
    faq: editorial.faq,
    seo: editorial.seo
      ? {
          metaTitle: editorial.seo.metaTitle,
          metaDescription: editorial.seo.metaDescription,
          ogImage: editorial.seo.ogImage?.asset?.url,
        }
      : undefined,
  };
}

function mapEditorialToCardView(
  editorial: Product,
  commerce: { availableForSale: boolean; price: { amount: string; currencyCode: string }; firstVariantId: string } | null
): ProductCardView {
  return {
    slug: editorial.slug.current,
    name: editorial.name,
    nature: editorial.nature,
    folio: editorial.folio,
    mainImage: editorial.mainImage ? mapImage(editorial.mainImage) : undefined,
    volume: editorial.volume,
    priceNote: editorial.priceNote,
    purchaseFraming: editorial.purchaseFraming ?? "standard",
    commerce,
  };
}

function mapCommerceToView(
  shopify: ProductCommerce,
  editorial: Product
): ProductCommerceView {
  const variantMap = editorial.commerce?.variantMap ?? [];

  const variants: ProductVariantView[] = shopify.variants.map((v) => {
    const editorialMapping = variantMap.find(
      (vm) => vm.shopifyVariantId === v.id
    );
    return mapVariantToView(v, editorialMapping);
  });

  return {
    shopifyProductId: shopify.id,
    shopifyHandle: shopify.handle,
    availableForSale: shopify.availableForSale,
    price: shopify.priceRange.minVariantPrice,
    compareAtPrice: shopify.compareAtPriceRange?.minVariantPrice ?? null,
    variants,
    inventoryStatus: deriveInventoryStatus(shopify.availableForSale, shopify.totalInventory),
    totalInventory: shopify.totalInventory,
  };
}

function mapVariantToView(
  variant: ProductVariant,
  editorialMapping?: { label: string; sanityKey: string }
): ProductVariantView {
  return {
    id: variant.id,
    title: variant.title,
    editorialLabel: editorialMapping?.label,
    sanityKey: editorialMapping?.sanityKey,
    availableForSale: variant.availableForSale,
    price: variant.price,
    compareAtPrice: variant.compareAtPrice,
    inventoryStatus: deriveInventoryStatus(variant.availableForSale, variant.quantityAvailable),
    quantityAvailable: variant.quantityAvailable,
  };
}

function mapImage(img: { asset?: { url?: string; _ref?: string }; alt?: string }): ImageView {
  return {
    url: img.asset?.url ?? "",
    alt: img.alt ?? "",
  };
}

function getShopifyHandle(product: Product): string | null {
  return product.commerce?.shopifyHandle ?? null;
}
