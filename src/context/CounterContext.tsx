"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CounterItem, Remedy } from "@/lib/content/types";
import { getRemedyBySlug } from "@/lib/content/remedies";

interface CounterLine extends CounterItem {
  remedy: Remedy;
}

interface CounterContextValue {
  items: CounterLine[];
  itemCount: number;
  subtotal: number;
  addItem: (slug: string) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCounter: () => void;
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

  useEffect(() => {
    setRawItems(loadStoredItems());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) persistItems(rawItems);
  }, [rawItems, hydrated]);

  const items = useMemo(
    () =>
      rawItems
        .map((item) => {
          const remedy = getRemedyBySlug(item.slug);
          if (!remedy) return null;
          return { ...item, remedy };
        })
        .filter((item): item is CounterLine => item !== null),
    [rawItems]
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.remedy.price * item.quantity,
    0
  );

  const addItem = useCallback((slug: string) => {
    setRawItems((prev) => {
      const existing = prev.find((i) => i.slug === slug);
      if (existing) {
        return prev.map((i) =>
          i.slug === slug ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { slug, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((slug: string) => {
    setRawItems((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const updateQuantity = useCallback((slug: string, quantity: number) => {
    if (quantity < 1) {
      setRawItems((prev) => prev.filter((i) => i.slug !== slug));
      return;
    }
    setRawItems((prev) =>
      prev.map((i) => (i.slug === slug ? { ...i, quantity } : i))
    );
  }, []);

  const clearCounter = useCallback(() => setRawItems([]), []);

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCounter,
    }),
    [items, itemCount, subtotal, addItem, removeItem, updateQuantity, clearCounter]
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
