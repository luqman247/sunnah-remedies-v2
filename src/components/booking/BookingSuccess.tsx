"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SolidAction } from "@/components/ui/Links";
import type { PractitionerGender } from "@/lib/booking/types";

interface BookingSuccessProps {
  /** Only set for local mock confirmations (TEST-SR-…). Never invent live references. */
  referenceId?: string;
  isMockConfirmation?: boolean;
  practitioner: PractitionerGender | null;
  clinicName: string | null;
  clinicCountry: string | null;
  date: Date | null;
  time: string | null;
  duration: string;
  price: string;
  onBookAnother: () => void;
}

export function BookingSuccess({
  referenceId,
  isMockConfirmation = false,
  practitioner,
  clinicName,
  clinicCountry,
  date,
  time,
  duration,
  price,
  onBookAnother,
}: BookingSuccessProps) {
  const locale = useLocale();
  const t = useTranslations("booking.success");
  const tSummary = useTranslations("booking.summary");

  const formatDate = (d: Date | null): string => {
    if (!d) return "—";
    return d.toLocaleDateString(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const gender =
    practitioner === "male"
      ? tSummary("male")
      : practitioner === "female"
        ? tSummary("female")
        : "—";

  return (
    <section className="booking-success" aria-labelledby="booking-success-title">
      <div className="booking-success__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12l5 5L20 7" />
        </svg>
      </div>

      <h1 id="booking-success-title" className="booking-success__title">
        {t("title")}
      </h1>

      <p className="booking-success__message">{t("message")}</p>
      <p className="booking-success__note" role="status">
        {t("notConfirmed")}
      </p>
      <p className="booking-success__note">{t("clinicWillContact")}</p>

      {isMockConfirmation ? (
        <p className="booking-success__test-banner" role="status">
          {t("testBanner")}
        </p>
      ) : null}

      {isMockConfirmation && referenceId ? (
        <p className="booking-success__reference">
          {t("testReference", { id: referenceId })}
        </p>
      ) : null}

      <dl className="booking-success__details">
        <div>
          <dt>{tSummary("practitioner")}</dt>
          <dd>{gender}</dd>
        </div>
        <div>
          <dt>{tSummary("clinic")}</dt>
          <dd>{clinicName || "—"}</dd>
        </div>
        <div>
          <dt>{tSummary("location")}</dt>
          <dd>{clinicCountry || "—"}</dd>
        </div>
        <div>
          <dt>{tSummary("date")}</dt>
          <dd>{formatDate(date)}</dd>
        </div>
        <div>
          <dt>{tSummary("time")}</dt>
          <dd>{time || "—"}</dd>
        </div>
        <div>
          <dt>{tSummary("duration")}</dt>
          <dd>{duration}</dd>
        </div>
        <div>
          <dt>{tSummary("price")}</dt>
          <dd>{price}</dd>
        </div>
      </dl>

      <p className="booking-success__note">{t("preferencesOnly")}</p>
      <p className="booking-success__note">{t("noEmailClaim")}</p>
      <p className="booking-success__note">
        {t("cancellation")}{" "}
        <Link href="/correspondence" className="quiet-link">
          {t("contact")}
        </Link>
      </p>

      <div className="booking-success__actions">
        <SolidAction href="/">{t("returnHome")}</SolidAction>
        <SolidAction onClick={onBookAnother}>{t("bookAnother")}</SolidAction>
      </div>
    </section>
  );
}
