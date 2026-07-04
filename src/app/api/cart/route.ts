/**
 * Cart API route — server-side proxy for Shopify Cart operations.
 *
 * All cart mutations go through this route. The cart ID is stored in
 * an httpOnly cookie for security. Variant IDs never leak to localStorage.
 *
 * @see Phase 4 Part 2, Spec 03 §3.2
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  createCart,
  getCart,
  addToCart,
  updateCartLines,
  removeFromCart,
  applyDiscountCode,
} from "@/lib/commerce/shopify/cart";
import { isCommerceConfigured } from "@/lib/commerce/config/env";

const CART_COOKIE = "sr-cart-id";
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 14; // 14 days

export async function GET() {
  if (!isCommerceConfigured()) {
    return NextResponse.json({ cart: null, mode: "local" });
  }

  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE)?.value;

  if (!cartId) {
    return NextResponse.json({ cart: null });
  }

  try {
    const cart = await getCart(cartId);
    if (!cart) {
      const response = NextResponse.json({ cart: null });
      response.cookies.delete(CART_COOKIE);
      return response;
    }
    return NextResponse.json({ cart });
  } catch (error) {
    console.error("[Cart API] GET error:", error);
    return NextResponse.json({ cart: null, error: "Cart unavailable" }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  if (!isCommerceConfigured()) {
    return NextResponse.json({ error: "Commerce not configured" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { action, lines, lineId, quantity, discountCode } = body as {
      action: string;
      lines?: Array<{ merchandiseId: string; quantity: number }>;
      lineId?: string;
      quantity?: number;
      discountCode?: string;
    };

    const cookieStore = await cookies();
    let cartId = cookieStore.get(CART_COOKIE)?.value;

    switch (action) {
      case "create": {
        const cart = await createCart(lines ?? []);
        const response = NextResponse.json({ cart });
        response.cookies.set(CART_COOKIE, cart.id, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: CART_COOKIE_MAX_AGE,
          path: "/",
        });
        return response;
      }

      case "add": {
        if (!lines?.length) {
          return NextResponse.json({ error: "Lines required" }, { status: 400 });
        }

        if (!cartId) {
          const cart = await createCart(lines);
          const response = NextResponse.json({ cart });
          response.cookies.set(CART_COOKIE, cart.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: CART_COOKIE_MAX_AGE,
            path: "/",
          });
          return response;
        }

        const cart = await addToCart(cartId, lines);
        return NextResponse.json({ cart });
      }

      case "update": {
        if (!cartId || !lineId || quantity === undefined) {
          return NextResponse.json({ error: "cartId, lineId, and quantity required" }, { status: 400 });
        }
        const cart = await updateCartLines(cartId, [{ id: lineId, quantity }]);
        return NextResponse.json({ cart });
      }

      case "remove": {
        if (!cartId || !lineId) {
          return NextResponse.json({ error: "cartId and lineId required" }, { status: 400 });
        }
        const cart = await removeFromCart(cartId, [lineId]);
        return NextResponse.json({ cart });
      }

      case "discount": {
        if (!cartId || !discountCode) {
          return NextResponse.json({ error: "cartId and discountCode required" }, { status: 400 });
        }
        const cart = await applyDiscountCode(cartId, [discountCode]);
        return NextResponse.json({ cart });
      }

      case "clear": {
        const response = NextResponse.json({ cart: null });
        response.cookies.delete(CART_COOKIE);
        return response;
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (error) {
    console.error("[Cart API] POST error:", error);
    const message = error instanceof Error ? error.message : "Cart operation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
