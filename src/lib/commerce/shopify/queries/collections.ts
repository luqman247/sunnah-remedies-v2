/**
 * Collection queries — Storefront API.
 *
 * @see Phase 4 Part 2, Spec 02 §2.2
 */

import { MONEY_FRAGMENT } from "./fragments";

export const COLLECTION_BY_HANDLE = `
  query CollectionByHandle($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      id
      handle
      title
      products(first: $first) {
        edges {
          node {
            handle
            availableForSale
            priceRange {
              minVariantPrice { ...MoneyFields }
              maxVariantPrice { ...MoneyFields }
            }
          }
        }
      }
    }
  }
  ${MONEY_FRAGMENT}
`;

export const COLLECTION_PRODUCTS = `
  query CollectionProducts($id: ID!, $first: Int!, $after: String) {
    collection(id: $id) {
      products(first: $first, after: $after) {
        edges {
          node {
            handle
            availableForSale
            priceRange {
              minVariantPrice { ...MoneyFields }
              maxVariantPrice { ...MoneyFields }
            }
          }
          cursor
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
  ${MONEY_FRAGMENT}
`;
