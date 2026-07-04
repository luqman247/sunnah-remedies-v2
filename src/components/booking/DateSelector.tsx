"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

interface DateSelectorProps {
  dates: Date[];
  value: Date | null;
  onChange: (date: Date) => void;
}

const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTH_NAMES = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function DateSelector({ dates, value, onChange }: DateSelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="booking-step">
      <p className="booking-step__label">Step 3</p>
      <h2 className="booking-step__title">Choose Date</h2>

      <div
        ref={scrollRef}
        className="date-selector"
        role="listbox"
        aria-label="Available dates"
      >
        {dates.map((date) => {
          const selected = value ? isSameDay(date, value) : false;

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
              <span className="date-pill__day">{DAY_NAMES[date.getDay()]}</span>
              <span className="date-pill__num">{date.getDate()}</span>
              <span className="date-pill__month">{MONTH_NAMES[date.getMonth()]}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
