"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { SacredJourney } from "@/lib/content/journeys/types";

interface JourneyRegistrationLedgerProps {
  journey: SacredJourney;
}

export function JourneyRegistrationLedger({ journey }: JourneyRegistrationLedgerProps) {
  const tLedger = useTranslations("journeys.journeyLedger");
  const tView = useTranslations("journeys.view");

  return (
    <aside className="monograph-ledger programme-ledger" aria-label={tLedger("ariaLabel")}>
      <div className="monograph-ledger__inner">
        <p className="type-eyebrow monograph-ledger__label">{tLedger("upcomingDeparture")}</p>
        <p className="type-title monograph-ledger__name">{journey.name}</p>
        <p className="type-micro monograph-ledger__measure">{journey.nextDeparture}</p>
        <p className="monograph-ledger__fee">{journey.fee}</p>
        <p className="type-small monograph-ledger__delivery">{journey.duration}</p>
        <Link href="#registration" className="solid-action programme-ledger__cta">
          {tView("registerInterest")}
        </Link>
        <p className="type-small monograph-ledger__note">
          <Link href="/sacred-journeys/registration" className="quiet-link">
            {tView("reviewRegistration")}
          </Link>
        </p>
      </div>
    </aside>
  );
}
