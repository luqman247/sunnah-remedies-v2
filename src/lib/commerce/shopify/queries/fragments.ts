/**
 * GraphQL fragments — shared field selections for Shopify Storefront API.
 *
 * Minimal fields only. We never fetch editorial content from Shopify
 * (that belongs to Sanity). Commerce fields only.
 *
 * @see Phase 4 Part 2, Spec 02 §2.2
 */

export const MONEY_FRAGMENT = `
  fragment MoneyFields on MoneyV2 {
    amount
    currencyCode
  }
`;

export const PRODUCT_VARIANT_FRAGMENT = `
  fragment ProductVariantFields on ProductVariant {
    id
    title
    availableForSale
    quantityAvailable
    price { ...MoneyFields }
    compareAtPrice { ...MoneyFields }
    sku
    barcode
    weight
    weightUnit
  }
  ${MONEY_FRAGMENT}
`;

export const CART_LINE_FRAGMENT = `
  fragment CartLineFields on CartLine {
    id
    quantity
    merchandise {
      ... on ProductVariant {
        id
        title
        product {
          handle
          title
        }
        price { ...MoneyFields }
        image {
          url
          altText
          width
          height
        }
      }
    }
    cost {
      totalAmount { ...MoneyFields }
      compareAtAmountPerQuantity { ...MoneyFields }
    }
  }
  ${MONEY_FRAGMENT}
`;

export const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    lines(first: 100) {
      edges {
        node { ...CartLineFields }
      }
    }
    cost {
      subtotalAmount { ...MoneyFields }
      totalAmount { ...MoneyFields }
      totalTaxAmount { ...MoneyFields }
    }
    discountCodes {
      code
      applicable
    }
    note
  }
  ${CART_LINE_FRAGMENT}
`;
