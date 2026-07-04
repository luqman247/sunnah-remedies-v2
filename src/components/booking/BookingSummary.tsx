"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { BookingSummaryData } from "@/lib/booking/types";

interface BookingSummaryProps {
  data: BookingSummaryData;
  canSubmit: boolean;
  submitting: boolean;
  onSubmit: () => void;
}

function formatDate(date: Date | null): string {
  if (!date) return "";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
  });
}

function capitalize(str: string | null): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function BookingSummary({ data, canSubmit, submitting, onSubmit }: BookingSummaryProps) {
  const items = [
    { label: "Practitioner", value: capitalize(data.practitioner) },
    { label: "Clinic", value: data.clinicName },
    { label: "Date", value: data.date ? formatDate(data.date) : null },
    { label: "Time", value: data.time },
    { label: "Duration", value: data.duration },
    { label: "Price", value: data.practitioner ? data.price : null, isPrice: true },
  ];

  return (
    <aside className="booking-summary" aria-label="Appointment summary">
      <div className="booking-summary__inner">
        <p className="booking-summary__label">Appointment Summary</p>

        <dl className="booking-summary__list">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item.label}
                className="booking-summary__item"
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <dt className="booking-summary__item-label">{item.label}</dt>
                <dd
                  className={`booking-summary__item-value ${item.isPrice ? "booking-summary__item-value--price" : ""} ${!item.value ? "booking-summary__item-value--empty" : ""}`}
                >
                  {item.value || "—"}
                </dd>
              </motion.div>
            ))}
          </AnimatePresence>
        </dl>

        <button
          type="button"
          className={`booking-cta ${submitting ? "booking-cta--loading" : ""}`}
          disabled={!canSubmit || submitting}
          onClick={onSubmit}
          aria-label="Book my appointment"
        >
          Book My Appointment
        </button>
      </div>
    </aside>
  );
}
