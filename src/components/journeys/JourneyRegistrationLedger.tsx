"use client";

import { Link } from "@/i18n/navigation";
import type { SacredJourney } from "@/lib/content/journeys/types";

interface JourneyRegistrationLedgerProps {
  journey: SacredJourney;
}

export function JourneyRegistrationLedger({ journey }: JourneyRegistrationLedgerProps) {
  return (
    <aside className="monograph-ledger programme-ledger" aria-label="Journey registration summary">
      <div className="monograph-ledger__inner">
        <p className="type-eyebrow monograph-ledger__label">Upcoming departure</p>
        <p className="type-title monograph-ledger__name">{journey.name}</p>
        <p className="type-micro monograph-ledger__measure">{journey.nextDeparture}</p>
        <p className="monograph-ledger__fee">{journey.fee}</p>
        <p className="type-small monograph-ledger__delivery">{journey.duration}</p>
        <Link href="#registration" className="solid-action programme-ledger__cta">
          Register your interest
        </Link>
        <p className="type-small monograph-ledger__note">
          <Link href="/sacred-journeys/registration" className="quiet-link">
            Review registration pathway
          </Link>
        </p>
      </div>
    </aside>
  );
}
