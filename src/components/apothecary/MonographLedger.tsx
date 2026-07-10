"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Remedy } from "@/lib/content/types";
import { formatPrice } from "@/lib/content/remedies";
import { AddToCounter } from "./AddToCounter";

interface MonographLedgerProps {
  remedy: Remedy;
}

export function MonographLedger({ remedy }: MonographLedgerProps) {
  const t = useTranslations("apothecary.monographLedger");

  return (
    <aside className="monograph-ledger" aria-label={t("ariaLabel")}>
      <div className="monograph-ledger__inner">
        <p className="type-eyebrow monograph-ledger__label">{t("label")}</p>
        <p className="type-title monograph-ledger__name">{remedy.name}</p>
        <p className="type-micro monograph-ledger__measure">{remedy.volume}</p>

        {remedy.inStock ? (
          <>
            <p className="monograph-ledger__fee">
              {formatPrice(remedy.price, remedy.currency || "GBP")}
            </p>
            <p className="type-small monograph-ledger__delivery">{remedy.priceNote}</p>
            <AddToCounter slug={remedy.slug} name={remedy.name} />
          </>
        ) : (
          <p className="type-body">
            {t("unavailable")}{" "}
            <Link href="/correspondence" className="quiet-link">
              {t("contactDispensary")}
            </Link>
          </p>
        )}

        <p className="type-small monograph-ledger__note">
          <Link href="#dispensation" className="quiet-link">
            {t("readBeforeOrder")}
          </Link>
        </p>
      </div>
    </aside>
  );
}
