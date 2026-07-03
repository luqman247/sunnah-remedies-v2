"use client";

import Link from "next/link";
import type { Remedy } from "@/lib/content/types";
import { formatPrice } from "@/lib/content/remedies";
import { AddToCounter } from "./AddToCounter";

interface MonographLedgerProps {
  remedy: Remedy;
}

export function MonographLedger({ remedy }: MonographLedgerProps) {
  return (
    <aside className="monograph-ledger" aria-label="Remedy dispensation summary">
      <div className="monograph-ledger__inner">
        <p className="type-eyebrow monograph-ledger__label">Cabinet dispensation</p>
        <p className="type-title monograph-ledger__name">{remedy.name}</p>
        <p className="type-micro monograph-ledger__measure">{remedy.volume}</p>

        {remedy.inStock ? (
          <>
            <p className="monograph-ledger__fee">{formatPrice(remedy.price)}</p>
            <p className="type-small monograph-ledger__delivery">{remedy.priceNote}</p>
            <AddToCounter slug={remedy.slug} name={remedy.name} />
          </>
        ) : (
          <p className="type-body">
            Currently unavailable.{" "}
            <Link href="/correspondence" className="quiet-link">
              Contact the dispensary
            </Link>
          </p>
        )}

        <p className="type-small monograph-ledger__note">
          <Link href="#dispensation" className="quiet-link">
            Read the monograph before ordering
          </Link>
        </p>
      </div>
    </aside>
  );
}
