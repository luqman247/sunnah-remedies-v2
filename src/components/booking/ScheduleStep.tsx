"use client";

import { useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { AvailabilityStatus, TimeSlot } from "@/lib/booking/types";

interface ScheduleStepProps {
  dates: Date[];
  date: Date | null;
  onDateChange: (date: Date) => void;
  slots: TimeSlot[];
  time: string | null;
  onTimeChange: (time: string) => void;
  availability: AvailabilityStatus;
  onRetry?: () => void;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function ScheduleStep({
  dates,
  date,
  onDateChange,
  slots,
  time,
  onTimeChange,
  availability,
  onRetry,
}: ScheduleStepProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const t = useTranslations("booking");

  return (
    <div className="booking-step">
      <p className="booking-step__label">{t("progress.steps.schedule")}</p>
      <h2 className="booking-step__title" id="schedule-heading">
        {t("steps.chooseSchedule")}
      </h2>

      <h3 className="booking-step__subtitle">{t("steps.chooseDate")}</h3>
      {dates.length === 0 ? (
        <p className="booking-availability booking-availability--empty" role="status">
          {t("availability.noDates")}
        </p>
      ) : (
        <div
          ref={scrollRef}
          className="date-selector"
          role="listbox"
          aria-labelledby="schedule-heading"
          aria-label={t("steps.availableDatesAria")}
        >
          {dates.map((d) => {
            const selected = date ? isSameDay(d, date) : false;
            const dayName = d
              .toLocaleDateString(locale, { weekday: "short" })
              .toUpperCase();
            const monthName = d
              .toLocaleDateString(locale, { month: "short" })
              .toUpperCase();

            return (
              <button
                key={d.toISOString()}
                type="button"
                className={`date-pill ${selected ? "date-pill--selected" : ""}`}
                onClick={() => onDateChange(d)}
                role="option"
                aria-selected={selected}
              >
                <span className="date-pill__day">{dayName}</span>
                <span className="date-pill__num">{d.getDate()}</span>
                <span className="date-pill__month">{monthName}</span>
              </button>
            );
          })}
        </div>
      )}

      {date ? (
        <div className="booking-schedule-times">
          <h3 className="booking-step__subtitle">{t("steps.chooseTime")}</h3>

          {availability === "loading" ? (
            <p className="booking-availability" role="status" aria-live="polite">
              {t("availability.loading")}
            </p>
          ) : null}

          {availability === "error" ? (
            <div className="booking-availability booking-availability--error" role="alert">
              <p>{t("availability.error")}</p>
              {onRetry ? (
                <button type="button" className="quiet-link" onClick={onRetry}>
                  {t("availability.retry")}
                </button>
              ) : null}
            </div>
          ) : null}

          {availability === "empty" ? (
            <div className="booking-availability booking-availability--empty" role="status">
              <p>{t("availability.empty")}</p>
              <p className="booking-availability__fallback">
                {t("availability.fallback")}{" "}
                <Link href="/correspondence" className="quiet-link">
                  {t("availability.contact")}
                </Link>
              </p>
            </div>
          ) : null}

          {availability === "ready" && slots.length > 0 ? (
            <div
              className="time-grid"
              role="listbox"
              aria-label={t("steps.availableTimesAria")}
            >
              {slots.map((slot) => {
                const selected = time === slot.time;
                return (
                  <button
                    key={slot.time}
                    type="button"
                    className={`time-pill ${selected ? "time-pill--selected" : ""} ${!slot.available ? "time-pill--disabled" : ""}`}
                    onClick={() => {
                      if (slot.available) onTimeChange(slot.time);
                    }}
                    role="option"
                    aria-selected={selected}
                    aria-disabled={!slot.available}
                    disabled={!slot.available}
                    title={
                      slot.available
                        ? slot.time
                        : t("availability.slotUnavailable")
                    }
                  >
                    <span className="time-pill__label">{slot.time}</span>
                    {!slot.available ? (
                      <span className="time-pill__state">
                        {t("availability.unavailable")}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
