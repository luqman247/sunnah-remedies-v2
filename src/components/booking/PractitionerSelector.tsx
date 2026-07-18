"use client";

import { useTranslations } from "next-intl";
import type { PractitionerGender } from "@/lib/booking/types";

interface PractitionerSelectorProps {
  value: PractitionerGender | null;
  onChange: (gender: PractitionerGender) => void;
}

export function PractitionerSelector({ value, onChange }: PractitionerSelectorProps) {
  const t = useTranslations("booking.steps");
  const tProgress = useTranslations("booking.progress.steps");

  return (
    <div className="booking-step">
      <p className="booking-step__label">{tProgress("practitioner")}</p>
      <h2 className="booking-step__title">{t("choosePractitioner")}</h2>

      <div
        className="selection-grid selection-grid--two"
        role="radiogroup"
        aria-label={t("practitionerGenderAria")}
      >
        <button
          type="button"
          className={`selection-card ${value === "male" ? "selection-card--selected" : ""}`}
          onClick={() => onChange("male")}
          role="radio"
          aria-checked={value === "male"}
        >
          <span className="selection-card__radio" aria-hidden="true" />
          <span className="selection-card__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="7" r="4" />
              <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
            </svg>
          </span>
          <span className="selection-card__name">{t("malePractitioner")}</span>
        </button>

        <button
          type="button"
          className={`selection-card ${value === "female" ? "selection-card--selected" : ""}`}
          onClick={() => onChange("female")}
          role="radio"
          aria-checked={value === "female"}
        >
          <span className="selection-card__radio" aria-hidden="true" />
          <span className="selection-card__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="7" r="4" />
              <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
              <path d="M9 11c0 0 1.5 2 3 2s3-2 3-2" />
            </svg>
          </span>
          <span className="selection-card__name">{t("femalePractitioner")}</span>
        </button>
      </div>
    </div>
  );
}
