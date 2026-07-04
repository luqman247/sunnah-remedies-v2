"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
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
        {name} has been added to the counter.{" "}
        <Link href="/the-apothecary/counter" className="quiet-link">
          Review item details
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
      Add to counter
    </button>
  );
}
