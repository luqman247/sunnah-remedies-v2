"use client";

import { useLocale, useTranslations } from "next-intl";
import type { BookingSummaryData } from "@/lib/booking/types";

interface BookingSummaryProps {
  data: BookingSummaryData;
  canSubmit: boolean;
  submitting: boolean;
  submitError?: string | null;
  onSubmit?: () => void;
  showSubmit?: boolean;
}

function genderLabel(
  gender: string | null,
  t: ReturnType<typeof useTranslations>,
): string {
  if (gender === "male") return t("male");
  if (gender === "female") return t("female");
  return "";
}

export function BookingSummary({
  data,
  canSubmit,
  submitting,
  submitError,
  onSubmit,
  showSubmit = true,
}: BookingSummaryProps) {
  const locale = useLocale();
  const t = useTranslations("booking.summary");

  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    return date.toLocaleDateString(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const items = [
    {
      label: t("practitioner"),
      value: genderLabel(data.practitioner, t),
    },
    { label: t("clinic"), value: data.clinicName },
    {
      label: t("location"),
      value: data.clinicCountry,
    },
    { label: t("date"), value: data.date ? formatDate(data.date) : null },
    { label: t("time"), value: data.time },
    { label: t("duration"), value: data.duration || null },
    {
      label: t("price"),
      value: data.practitioner && data.clinicName ? data.price : null,
      isPrice: true,
    },
    {
      label: t("paymentTiming"),
      value: data.practitioner && data.clinicName ? data.paymentTiming : null,
    },
    {
      label: t("cancellation"),
      value: data.practitioner && data.clinicName ? data.cancellation : null,
    },
  ];

  let submitLabel = t("submit");
  if (submitting) submitLabel = t("submitting");

  return (
    <aside
      id="booking-appointment-summary"
      className="booking-summary"
      aria-label={t("ariaLabel")}
    >
      <div className="booking-summary__inner">
        <p className="booking-summary__label">{t("label")}</p>

        <dl className="booking-summary__list">
          {items.map((item) => (
            <div key={item.label} className="booking-summary__item">
              <dt className="booking-summary__item-label">{item.label}</dt>
              <dd
                className={`booking-summary__item-value ${item.isPrice ? "booking-summary__item-value--price" : ""} ${!item.value ? "booking-summary__item-value--empty" : ""}`}
              >
                {item.value || "—"}
              </dd>
            </div>
          ))}
        </dl>

        {submitError ? (
          <p className="booking-summary__error" role="alert">
            {submitError}
          </p>
        ) : null}

        {showSubmit && onSubmit ? (
          <button
            type="button"
            className={`booking-cta ${submitting ? "booking-cta--loading" : ""}`}
            disabled={!canSubmit || submitting}
            onClick={onSubmit}
            aria-busy={submitting}
            aria-label={t("submitAria")}
          >
            {submitLabel}
          </button>
        ) : null}
      </div>
    </aside>
  );
}
