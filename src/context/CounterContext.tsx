"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import type { CounterItem, Remedy } from "@/lib/content/types";
import { getRemedyBySlug } from "@/lib/content/remedies";
import type { Cart } from "@/lib/commerce/shopify/types";

interface CounterLine extends CounterItem {
  remedy: Remedy;
  lineId?: string;
}

interface CounterContextValue {
  items: CounterLine[];
  itemCount: number;
  subtotal: number;
  addItem: (slug: string, variantId?: string) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCounter: () => void;
  checkoutUrl: string | null;
  isUpdating: boolean;
  discountCode: string | null;
  applyDiscount: (code: string) => void;
}

const STORAGE_KEY = "sunnah-remedies-counter";

const CounterContext = createContext<CounterContextValue | null>(null);

function loadStoredItems(): CounterItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CounterItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistItems(items: CounterItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function CounterProvider({ children }: { children: React.ReactNode }) {
  const [rawItems, setRawItems] = useState<CounterItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [shopifyCart, setShopifyCart] = useState<Cart | null>(null);
  const [isUpdating, startTransition] = useTransition();
  const [commerceMode, setCommerceMode] = useState<"local" | "shopify">("local");
  const [discountCode, setDiscountCode] = useState<string | null>(null);

  useEffect(() => {
    setRawItems(loadStoredItems());
    setHydrated(true);
    fetchCart();
  }, []);

  useEffect(() => {
    if (hydrated && commerceMode === "local") persistItems(rawItems);
  }, [rawItems, hydrated, commerceMode]);

  async function fetchCart() {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      if (data.mode === "local") {
        setCommerceMode("local");
        return;
      }
      if (data.cart) {
        setShopifyCart(data.cart);
        setCommerceMode("shopify");
      }
    } catch {
      setCommerceMode("local");
    }
  }

  async function cartAction(body: Record<string, unknown>) {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.cart) setShopifyCart(data.cart);
    return data;
  }

  const items = useMemo(() => {
    if (commerceMode === "shopify" && shopifyCart) {
      return shopifyCart.lines.map((line) => {
        const slug = line.merchandise.product.handle;
        const remedy = getRemedyBySlug(slug);
        return {
          slug,
          quantity: line.quantity,
          lineId: line.id,
          remedy: remedy ?? ({
            slug,
            name: line.merchandise.product.title,
            price: parseFloat(line.merchandise.price.amount),
          } as Remedy),
        };
      });
    }

    return rawItems
      .map((item) => {
        const remedy = getRemedyBySlug(item.slug);
        if (!remedy) return null;
        return { ...item, remedy };
      })
      .filter((item): item is CounterLine => item !== null);
  }, [rawItems, shopifyCart, commerceMode]);

  const itemCount = commerceMode === "shopify" && shopifyCart
    ? shopifyCart.totalQuantity
    : items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = commerceMode === "shopify" && shopifyCart
    ? parseFloat(shopifyCart.cost.subtotalAmount.amount)
    : items.reduce((sum, item) => sum + item.remedy.price * item.quantity, 0);

  const checkoutUrl = shopifyCart?.checkoutUrl ?? null;

  const addItem = useCallback((slug: string, variantId?: string) => {
    if (commerceMode === "shopify" && variantId) {
      startTransition(async () => {
        await cartAction({
          action: "add",
          lines: [{ merchandiseId: variantId, quantity: 1 }],
        });
      });
    } else {
      setRawItems((prev) => {
        const existing = prev.find((i) => i.slug === slug);
        if (existing) {
          return prev.map((i) =>
            i.slug === slug ? { ...i, quantity: i.quantity + 1 } : i
          );
        }
        return [...prev, { slug, quantity: 1 }];
      });
    }
  }, [commerceMode]);

  const removeItem = useCallback((slug: string) => {
    if (commerceMode === "shopify" && shopifyCart) {
      const line = shopifyCart.lines.find(
        (l) => l.merchandise.product.handle === slug
      );
      if (line) {
        startTransition(async () => {
          await cartAction({ action: "remove", lineId: line.id });
        });
      }
    } else {
      setRawItems((prev) => prev.filter((i) => i.slug !== slug));
    }
  }, [commerceMode, shopifyCart]);

  const updateQuantity = useCallback((slug: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(slug);
      return;
    }

    if (commerceMode === "shopify" && shopifyCart) {
      const line = shopifyCart.lines.find(
        (l) => l.merchandise.product.handle === slug
      );
      if (line) {
        startTransition(async () => {
          await cartAction({ action: "update", lineId: line.id, quantity });
        });
      }
    } else {
      setRawItems((prev) =>
        prev.map((i) => (i.slug === slug ? { ...i, quantity } : i))
      );
    }
  }, [commerceMode, shopifyCart, removeItem]);

  const clearCounter = useCallback(() => {
    if (commerceMode === "shopify") {
      startTransition(async () => {
        await cartAction({ action: "clear" });
        setShopifyCart(null);
      });
    } else {
      setRawItems([]);
    }
  }, [commerceMode]);

  const applyDiscount = useCallback((code: string) => {
    if (commerceMode === "shopify" && shopifyCart) {
      startTransition(async () => {
        await cartAction({ action: "discount", discountCode: code });
        setDiscountCode(code);
      });
    } else {
      setDiscountCode(code);
    }
  }, [commerceMode, shopifyCart]);

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCounter,
      checkoutUrl,
      isUpdating,
      discountCode,
      applyDiscount,
    }),
    [items, itemCount, subtotal, addItem, removeItem, updateQuantity, clearCounter, checkoutUrl, isUpdating, discountCode, applyDiscount]
  );

  return (
    <CounterContext.Provider value={value}>{children}</CounterContext.Provider>
  );
}

export function useCounter() {
  const ctx = useContext(CounterContext);
  if (!ctx) throw new Error("useCounter must be used within CounterProvider");
  return ctx;
}
