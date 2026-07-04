/**
 * Cart service — wraps Shopify Storefront Cart API.
 *
 * Server-side only. Handles creating carts, adding/updating/removing lines,
 * discount codes, and buyer identity. Returns normalized Cart type.
 *
 * @see Phase 4 Part 2, Spec 03
 */

import { storefrontQuery } from "../storefront-client";
import {
  CART_CREATE,
  CART_LINES_ADD,
  CART_LINES_UPDATE,
  CART_LINES_REMOVE,
  CART_DISCOUNT_CODES_UPDATE,
  CART_NOTE_UPDATE,
  GET_CART,
} from "../queries/cart";
import type { Cart, CartLine } from "../types";

interface CartResponse {
  cart: RawCart | null;
  userErrors?: Array<{ field: string[]; message: string }>;
}

interface RawCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: {
    edges: Array<{ node: RawCartLine }>;
  };
  cost: {
    subtotalAmount: { amount: string; currencyCode: string };
    totalAmount: { amount: string; currencyCode: string };
    totalTaxAmount: { amount: string; currencyCode: string } | null;
  };
  discountCodes: { code: string; applicable: boolean }[];
  note: string | null;
}

interface RawCartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: { handle: string; title: string };
    price: { amount: string; currencyCode: string };
    image: { url: string; altText: string | null; width: number; height: number } | null;
  };
  cost: {
    totalAmount: { amount: string; currencyCode: string };
    compareAtAmountPerQuantity: { amount: string; currencyCode: string } | null;
  };
}

export async function createCart(
  lines: Array<{ merchandiseId: string; quantity: number }> = []
): Promise<Cart> {
  const data = await storefrontQuery<{ cartCreate: CartResponse }>(CART_CREATE, {
    input: { lines },
  });

  if (data.cartCreate.userErrors?.length) {
    throw new CartError(data.cartCreate.userErrors[0].message);
  }

  return normalizeCart(data.cartCreate.cart!);
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await storefrontQuery<{ cart: RawCart | null }>(GET_CART, { cartId });
  if (!data.cart) return null;
  return normalizeCart(data.cart);
}

export async function addToCart(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>
): Promise<Cart> {
  const data = await storefrontQuery<{ cartLinesAdd: CartResponse }>(CART_LINES_ADD, {
    cartId,
    lines,
  });

  if (data.cartLinesAdd.userErrors?.length) {
    throw new CartError(data.cartLinesAdd.userErrors[0].message);
  }

  return normalizeCart(data.cartLinesAdd.cart!);
}

export async function updateCartLines(
  cartId: string,
  lines: Array<{ id: string; quantity: number }>
): Promise<Cart> {
  const data = await storefrontQuery<{ cartLinesUpdate: CartResponse }>(CART_LINES_UPDATE, {
    cartId,
    lines,
  });

  if (data.cartLinesUpdate.userErrors?.length) {
    throw new CartError(data.cartLinesUpdate.userErrors[0].message);
  }

  return normalizeCart(data.cartLinesUpdate.cart!);
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[]
): Promise<Cart> {
  const data = await storefrontQuery<{ cartLinesRemove: CartResponse }>(CART_LINES_REMOVE, {
    cartId,
    lineIds,
  });

  if (data.cartLinesRemove.userErrors?.length) {
    throw new CartError(data.cartLinesRemove.userErrors[0].message);
  }

  return normalizeCart(data.cartLinesRemove.cart!);
}

export async function applyDiscountCode(
  cartId: string,
  discountCodes: string[]
): Promise<Cart> {
  const data = await storefrontQuery<{ cartDiscountCodesUpdate: CartResponse }>(
    CART_DISCOUNT_CODES_UPDATE,
    { cartId, discountCodes }
  );

  if (data.cartDiscountCodesUpdate.userErrors?.length) {
    throw new CartError(data.cartDiscountCodesUpdate.userErrors[0].message);
  }

  return normalizeCart(data.cartDiscountCodesUpdate.cart!);
}

export async function updateCartNote(cartId: string, note: string): Promise<Cart> {
  const data = await storefrontQuery<{ cartNoteUpdate: CartResponse }>(CART_NOTE_UPDATE, {
    cartId,
    note,
  });

  if (data.cartNoteUpdate.userErrors?.length) {
    throw new CartError(data.cartNoteUpdate.userErrors[0].message);
  }

  return normalizeCart(data.cartNoteUpdate.cart!);
}

// ── Normalize ──

function normalizeCart(raw: RawCart): Cart {
  return {
    id: raw.id,
    checkoutUrl: raw.checkoutUrl,
    totalQuantity: raw.totalQuantity,
    lines: raw.lines.edges.map((e) => normalizeCartLine(e.node)),
    cost: {
      subtotalAmount: raw.cost.subtotalAmount,
      totalAmount: raw.cost.totalAmount,
      totalTaxAmount: raw.cost.totalTaxAmount,
    },
    discountCodes: raw.discountCodes,
    note: raw.note,
  };
}

function normalizeCartLine(raw: RawCartLine): CartLine {
  return {
    id: raw.id,
    quantity: raw.quantity,
    merchandise: {
      id: raw.merchandise.id,
      title: raw.merchandise.title,
      product: raw.merchandise.product,
      price: raw.merchandise.price,
      image: raw.merchandise.image
        ? {
            url: raw.merchandise.image.url,
            altText: raw.merchandise.image.altText,
            width: raw.merchandise.image.width,
            height: raw.merchandise.image.height,
          }
        : null,
    },
    cost: {
      totalAmount: raw.cost.totalAmount,
      compareAtAmountPerQuantity: raw.cost.compareAtAmountPerQuantity,
    },
  };
}

export class CartError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CartError";
  }
}
