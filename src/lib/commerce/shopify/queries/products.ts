/**
 * Product commerce queries — Storefront API.
 *
 * Fetches only commerce state (price, availability, variants).
 * Editorial content comes from Sanity separately.
 *
 * @see Phase 4 Part 2, Spec 02 §2.2
 */

import { MONEY_FRAGMENT, PRODUCT_VARIANT_FRAGMENT } from "./fragments";

export const PRODUCT_COMMERCE_BY_HANDLE = `
  query ProductCommerceByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      availableForSale
      priceRange {
        minVariantPrice { ...MoneyFields }
        maxVariantPrice { ...MoneyFields }
      }
      compareAtPriceRange {
        minVariantPrice { ...MoneyFields }
        maxVariantPrice { ...MoneyFields }
      }
      variants(first: 50) {
        edges {
          node { ...ProductVariantFields }
        }
      }
      totalInventory
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

export const PRODUCT_COMMERCE_BY_ID = `
  query ProductCommerceById($id: ID!) {
    node(id: $id) {
      ... on Product {
        id
        handle
        availableForSale
        priceRange {
          minVariantPrice { ...MoneyFields }
          maxVariantPrice { ...MoneyFields }
        }
        compareAtPriceRange {
          minVariantPrice { ...MoneyFields }
          maxVariantPrice { ...MoneyFields }
        }
        variants(first: 50) {
          edges {
            node { ...ProductVariantFields }
          }
        }
        totalInventory
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

export const PRODUCT_CARD_COMMERCE = `
  query ProductCardCommerce($handles: [String!]!) {
    nodes(ids: []) {
      __typename
    }
  }
`;

export const PRODUCT_CARDS_BY_HANDLES = `
  query ProductCardsByHandles($first: Int!, $query: String!) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          handle
          availableForSale
          priceRange {
            minVariantPrice { ...MoneyFields }
            maxVariantPrice { ...MoneyFields }
          }
          variants(first: 1) {
            edges {
              node { id }
            }
          }
        }
      }
    }
  }
  ${MONEY_FRAGMENT}
`;

export const INVENTORY_STATUS = `
  query InventoryStatus($id: ID!) {
    node(id: $id) {
      ... on ProductVariant {
        id
        availableForSale
        quantityAvailable
      }
    }
  }
`;
