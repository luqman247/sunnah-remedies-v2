/**
 * Product + Offer JSON-LD builder.
 *
 * Composes Sanity knowledge layer (description, ingredients, evidence)
 * with Shopify commerce data (price, availability, SKU).
 */

import { seoConfig } from "../config";
import { type JsonLdNode, orgRef, imageObject } from "./index";

export interface ProductSchemaInput {
  name: string;
  slug: string;
  description: string;
  image?: string;
  imageAlt?: string;
  brand?: string;
  sku?: string;
  gtin?: string;
  // Shopify commerce fields
  price?: number;
  priceCurrency?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder" | "BackOrder";
  priceValidUntil?: string;
  // Reviews (only genuine, verified)
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

export function productSchema(input: ProductSchemaInput): JsonLdNode {
  const url = `${seoConfig.siteUrl}/the-apothecary/${input.slug}`;

  const node: JsonLdNode = {
    "@type": "Product",
    "@id": `${url}#product`,
    name: input.name,
    description: input.description,
    url,
    brand: {
      "@type": "Brand",
      name: input.brand || seoConfig.organizationName,
    },
    manufacturer: orgRef(),
  };

  if (input.image) {
    node.image = imageObject(input.image, input.imageAlt);
  }

  if (input.sku) node.sku = input.sku;
  if (input.gtin) node.gtin13 = input.gtin;

  // Offer — sourced exclusively from Shopify
  if (input.price !== undefined) {
    const offer: JsonLdNode = {
      "@type": "Offer",
      url,
      price: input.price,
      priceCurrency: input.priceCurrency || "GBP",
      seller: orgRef(),
    };

    if (input.availability) {
      const availMap: Record<string, string> = {
        InStock: "https://schema.org/InStock",
        OutOfStock: "https://schema.org/OutOfStock",
        PreOrder: "https://schema.org/PreOrder",
        BackOrder: "https://schema.org/BackOrder",
      };
      offer.availability = availMap[input.availability];
    }

    if (input.priceValidUntil) {
      offer.priceValidUntil = input.priceValidUntil;
    }

    node.offers = offer;
  }

  // Only emit AggregateRating from genuine, verified reviews
  if (input.aggregateRating && input.aggregateRating.reviewCount > 0) {
    node.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: input.aggregateRating.ratingValue,
      reviewCount: input.aggregateRating.reviewCount,
    };
  }

  return node;
}
