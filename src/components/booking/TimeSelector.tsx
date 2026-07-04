"use client";

import { motion } from "framer-motion";
import type { TimeSlot } from "@/lib/booking/types";

interface TimeSelectorProps {
  slots: TimeSlot[];
  value: string | null;
  onChange: (time: string) => void;
}

export function TimeSelector({ slots, value, onChange }: TimeSelectorProps) {
  return (
    <div className="booking-step">
      <p className="booking-step__label">Step 4</p>
      <h2 className="booking-step__title">Choose Time</h2>

      <div className="time-grid" role="listbox" aria-label="Available times">
        {slots.map((slot) => (
          <motion.button
            key={slot.time}
            type="button"
            className={`time-pill ${value === slot.time ? "time-pill--selected" : ""} ${!slot.available ? "time-pill--disabled" : ""}`}
            onClick={() => slot.available && onChange(slot.time)}
            role="option"
            aria-selected={value === slot.time}
            aria-disabled={!slot.available}
            whileTap={slot.available ? { scale: 0.95 } : undefined}
          >
            {slot.time}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
