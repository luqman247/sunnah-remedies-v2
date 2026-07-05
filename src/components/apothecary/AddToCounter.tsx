"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCounter } from "@/context/CounterContext";

interface AddToCounterProps {
  slug: string;
  name: string;
}

export function AddToCounter({ slug, name }: AddToCounterProps) {
  const t = useTranslations("apothecary.addToCounter");
  const { addItem } = useCounter();
  const [confirmed, setConfirmed] = useState(false);

  if (confirmed) {
    return (
      <p className="counter-confirmation" role="status">
        {t("added", { name })}{" "}
        <Link href="/the-apothecary/counter" className="quiet-link">
          {t("reviewItem")}
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
      {t("addButton")}
    </button>
  );
}
