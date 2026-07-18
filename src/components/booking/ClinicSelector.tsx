"use client";

import { useTranslations } from "next-intl";
import type { Clinic } from "@/lib/booking/types";

interface ClinicSelectorProps {
  clinics: Clinic[];
  value: Clinic | null;
  onChange: (clinic: Clinic) => void;
}

export function ClinicSelector({ clinics, value, onChange }: ClinicSelectorProps) {
  const t = useTranslations("booking.steps");
  const tProgress = useTranslations("booking.progress.steps");
  const tAvail = useTranslations("booking.clinicAvailability");

  return (
    <div className="booking-step">
      <p className="booking-step__label">{tProgress("clinic")}</p>
      <h2 className="booking-step__title">{t("chooseClinic")}</h2>

      <div
        className="selection-grid selection-grid--three"
        role="radiogroup"
        aria-label={t("clinicLocationAria")}
      >
        {clinics.map((clinic) => {
          const availabilityLabel =
            clinic.id === "london" || clinic.id === "aarhus" || clinic.id === "riyadh"
              ? tAvail(clinic.id)
              : clinic.availability;
          return (
            <button
              key={clinic.id}
              type="button"
              className={`selection-card ${value?.id === clinic.id ? "selection-card--selected" : ""} ${!clinic.available ? "selection-card--disabled" : ""}`}
              onClick={() => {
                if (clinic.available) onChange(clinic);
              }}
              role="radio"
              aria-checked={value?.id === clinic.id}
              aria-disabled={!clinic.available}
              disabled={!clinic.available}
            >
              <span className="selection-card__radio" aria-hidden="true" />
              <span className="selection-card__flag" aria-hidden="true">
                {clinic.flag}
              </span>
              <span className="selection-card__name">{clinic.name}</span>
              <span className="selection-card__meta">{clinic.country}</span>
              <span
                className={`selection-card__availability ${!clinic.available ? "selection-card__availability--unavailable" : ""}`}
              >
                {availabilityLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
