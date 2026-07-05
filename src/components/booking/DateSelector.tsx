"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

interface DateSelectorProps {
  dates: Date[];
  value: Date | null;
  onChange: (date: Date) => void;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function DateSelector({ dates, value, onChange }: DateSelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const t = useTranslations("booking.steps");

  return (
    <div className="booking-step">
      <p className="booking-step__label">{t("step3")}</p>
      <h2 className="booking-step__title">{t("chooseDate")}</h2>

      <div
        ref={scrollRef}
        className="date-selector"
        role="listbox"
        aria-label={t("availableDatesAria")}
      >
        {dates.map((date) => {
          const selected = value ? isSameDay(date, value) : false;
          const dayName = date.toLocaleDateString(locale, { weekday: "short" }).toUpperCase();
          const monthName = date.toLocaleDateString(locale, { month: "short" }).toUpperCase();

          return (
            <motion.button
              key={date.toISOString()}
              type="button"
              className={`date-pill ${selected ? "date-pill--selected" : ""}`}
              onClick={() => onChange(date)}
              role="option"
              aria-selected={selected}
              whileTap={{ scale: 0.95 }}
            >
              <span className="date-pill__day">{dayName}</span>
              <span className="date-pill__num">{date.getDate()}</span>
              <span className="date-pill__month">{monthName}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
