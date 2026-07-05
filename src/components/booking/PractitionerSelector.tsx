"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { PractitionerGender } from "@/lib/booking/types";

interface PractitionerSelectorProps {
  value: PractitionerGender | null;
  onChange: (gender: PractitionerGender) => void;
}

export function PractitionerSelector({ value, onChange }: PractitionerSelectorProps) {
  const t = useTranslations("booking.steps");

  return (
    <div className="booking-step">
      <p className="booking-step__label">{t("step1")}</p>
      <h2 className="booking-step__title">{t("choosePractitioner")}</h2>

      <div className="selection-grid selection-grid--two" role="radiogroup" aria-label={t("practitionerGenderAria")}>
        <motion.button
          type="button"
          className={`selection-card ${value === "male" ? "selection-card--selected" : ""}`}
          onClick={() => onChange("male")}
          role="radio"
          aria-checked={value === "male"}
          whileTap={{ scale: 0.98 }}
        >
          <span className="selection-card__radio" aria-hidden="true" />
          <span className="selection-card__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="7" r="4" />
              <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
            </svg>
          </span>
          <span className="selection-card__name">{t("malePractitioner")}</span>
        </motion.button>

        <motion.button
          type="button"
          className={`selection-card ${value === "female" ? "selection-card--selected" : ""}`}
          onClick={() => onChange("female")}
          role="radio"
          aria-checked={value === "female"}
          whileTap={{ scale: 0.98 }}
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
        </motion.button>
      </div>
    </div>
  );
}
