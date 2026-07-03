"use client";

import { useState } from "react";
import Link from "next/link";
import { useCounter } from "@/context/CounterContext";

interface AddToCounterProps {
  slug: string;
  name: string;
}

export function AddToCounter({ slug, name }: AddToCounterProps) {
  const { addItem } = useCounter();
  const [confirmed, setConfirmed] = useState(false);

  if (confirmed) {
    return (
      <p className="counter-confirmation" role="status">
        {name} has been placed on the counter.{" "}
        <Link href="/the-apothecary/counter" className="quiet-link">
          Review before dispensation
        </Link>
      </p>
    );
  }

  return (
    <button
      type="button"
      className="solid-action"
      onClick={() => {
        addItem(slug);
        setConfirmed(true);
      }}
    >
      Add to the counter
    </button>
  );
}
