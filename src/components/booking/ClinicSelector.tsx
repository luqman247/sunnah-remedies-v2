"use client";

import { motion } from "framer-motion";
import type { Clinic } from "@/lib/booking/types";

interface ClinicSelectorProps {
  clinics: Clinic[];
  value: Clinic | null;
  onChange: (clinic: Clinic) => void;
}

export function ClinicSelector({ clinics, value, onChange }: ClinicSelectorProps) {
  return (
    <div className="booking-step">
      <p className="booking-step__label">Step 2</p>
      <h2 className="booking-step__title">Choose Clinic</h2>

      <div className="selection-grid selection-grid--three" role="radiogroup" aria-label="Clinic location">
        {clinics.map((clinic) => (
          <motion.button
            key={clinic.id}
            type="button"
            className={`selection-card ${value?.id === clinic.id ? "selection-card--selected" : ""} ${!clinic.available ? "selection-card--disabled" : ""}`}
            onClick={() => clinic.available && onChange(clinic)}
            role="radio"
            aria-checked={value?.id === clinic.id}
            aria-disabled={!clinic.available}
            whileTap={clinic.available ? { scale: 0.98 } : undefined}
          >
            <span className="selection-card__radio" aria-hidden="true" />
            <span className="selection-card__flag" aria-hidden="true">{clinic.flag}</span>
            <span className="selection-card__name">{clinic.name}</span>
            <span className="selection-card__meta">{clinic.country}</span>
            <span
              className={`selection-card__availability ${!clinic.available ? "selection-card__availability--unavailable" : ""}`}
            >
              {clinic.availability}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
