"use client";

import { useTranslations } from "next-intl";
import { BOOKING_STEPS, type BookingStepId } from "@/lib/booking/types";

interface BookingProgressProps {
  current: BookingStepId;
}

export function BookingProgress({ current }: BookingProgressProps) {
  const t = useTranslations("booking.progress");
  const index = BOOKING_STEPS.indexOf(current);
  const total = BOOKING_STEPS.length;

  return (
    <nav className="booking-progress" aria-label={t("ariaLabel")}>
      <p className="booking-progress__status" aria-live="polite">
        {t("status", {
          current: index + 1,
          total,
          name: t(`steps.${current}`),
        })}
      </p>
      <ol className="booking-progress__list">
        {BOOKING_STEPS.map((step, i) => {
          const state =
            i < index ? "complete" : i === index ? "current" : "upcoming";
          return (
            <li
              key={step}
              className={`booking-progress__item booking-progress__item--${state}`}
              aria-current={state === "current" ? "step" : undefined}
            >
              <span className="booking-progress__marker" aria-hidden="true">
                {i < index ? "✓" : i + 1}
              </span>
              <span className="booking-progress__name">{t(`steps.${step}`)}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
