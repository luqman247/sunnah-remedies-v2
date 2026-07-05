"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import type { BookingSummaryData } from "@/lib/booking/types";

interface BookingSummaryProps {
  data: BookingSummaryData;
  canSubmit: boolean;
  submitting: boolean;
  onSubmit: () => void;
}

function capitalize(str: string | null): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function BookingSummary({ data, canSubmit, submitting, onSubmit }: BookingSummaryProps) {
  const locale = useLocale();
  const t = useTranslations("booking.summary");

  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    return date.toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
    });
  };

  const items = [
    { label: t("practitioner"), value: capitalize(data.practitioner) },
    { label: t("clinic"), value: data.clinicName },
    { label: t("date"), value: data.date ? formatDate(data.date) : null },
    { label: t("time"), value: data.time },
    { label: t("duration"), value: data.duration },
    { label: t("price"), value: data.practitioner ? data.price : null, isPrice: true },
  ];

  return (
    <aside className="booking-summary" aria-label={t("ariaLabel")}>
      <div className="booking-summary__inner">
        <p className="booking-summary__label">{t("label")}</p>

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
          aria-label={t("submitAria")}
        >
          {t("submit")}
        </button>
      </div>
    </aside>
  );
}
