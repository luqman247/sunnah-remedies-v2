/**
 * Shopify Join — compose Sanity knowledge with Shopify commerce.
 *
 * Commerce data (price, inventory, Offer) is owned by Shopify and
 * never duplicated as truth in Sanity. The product page and its
 * Product+Offer schema are composed by joining the Shopify commerce
 * record to the Sanity knowledge record on a shared key.
 */

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
    maxVariantPrice: { amount: string; currencyCode: string };
  };
  availableForSale: boolean;
  totalInventory?: number;
  images: { url: string; altText?: string }[];
  variants: {
    id: string;
    title: string;
    sku?: string;
    price: { amount: string; currencyCode: string };
    availableForSale: boolean;
  }[];
}

export interface SanityKnowledgeLayer {
  ingredients?: { name: string; slug: string }[];
  conditions?: { name: string; slug: string }[];
  preparation?: string[];
  contraindications?: string;
  evidenceLevel?: string;
  propheticBasis?: string;
  faqs?: { question: string; answer: string }[];
  reviewer?: { name: string; slug: string; jobTitle?: string };
  reviewDate?: string;
  relationships?: unknown[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    noIndex?: boolean;
    keywords?: string[];
  };
}

export interface ComposedProduct {
  // Commerce (Shopify truth)
  handle: string;
  title: string;
  description: string;
  price: number;
  priceCurrency: string;
  availability: "InStock" | "OutOfStock" | "PreOrder" | "BackOrder";
  sku?: string;
  image?: string;
  imageAlt?: string;
  // Knowledge (Sanity truth)
  ingredients: { name: string; slug: string }[];
  conditions: { name: string; slug: string }[];
  preparation: string[];
  contraindications?: string;
  evidenceLevel?: string;
  propheticBasis?: string;
  faqs: { question: string; answer: string }[];
  reviewer?: { name: string; slug: string; jobTitle?: string };
  reviewDate?: string;
  relationships: unknown[];
  seo?: SanityKnowledgeLayer["seo"];
}

/**
 * Join Shopify commerce data with Sanity knowledge layer.
 */
export function composeProduct(
  shopify: ShopifyProduct,
  knowledge: SanityKnowledgeLayer | null
): ComposedProduct {
  const price = parseFloat(shopify.priceRange.minVariantPrice.amount);
  const currency = shopify.priceRange.minVariantPrice.currencyCode;

  let availability: ComposedProduct["availability"] = "OutOfStock";
  if (shopify.availableForSale) {
    availability = shopify.totalInventory && shopify.totalInventory > 0
      ? "InStock"
      : "BackOrder";
  }

  return {
    handle: shopify.handle,
    title: shopify.title,
    description: shopify.description,
    price,
    priceCurrency: currency,
    availability,
    sku: shopify.variants[0]?.sku || undefined,
    image: shopify.images[0]?.url,
    imageAlt: shopify.images[0]?.altText || shopify.title,
    ingredients: knowledge?.ingredients || [],
    conditions: knowledge?.conditions || [],
    preparation: knowledge?.preparation || [],
    contraindications: knowledge?.contraindications,
    evidenceLevel: knowledge?.evidenceLevel,
    propheticBasis: knowledge?.propheticBasis,
    faqs: knowledge?.faqs || [],
    reviewer: knowledge?.reviewer,
    reviewDate: knowledge?.reviewDate,
    relationships: knowledge?.relationships || [],
    seo: knowledge?.seo,
  };
}
