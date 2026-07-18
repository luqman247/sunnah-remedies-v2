"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SolidAction } from "@/components/ui/Links";
import type { PractitionerGender } from "@/lib/booking/types";

/**
 * Production outcome when no booking persistence or email path exists.
 * Does not claim a request was received by a backend, nor invent a reference.
 */
interface BookingContactFallbackProps {
  practitioner: PractitionerGender | null;
  clinicName: string | null;
  clinicCountry: string | null;
  date: Date | null;
  time: string | null;
  onStartAgain: () => void;
}

export function BookingContactFallback({
  practitioner,
  clinicName,
  clinicCountry,
  date,
  time,
  onStartAgain,
}: BookingContactFallbackProps) {
  const locale = useLocale();
  const t = useTranslations("booking.contactFallback");
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
    <section
      className="booking-success booking-contact-fallback"
      aria-labelledby="booking-fallback-title"
    >
      <h1 id="booking-fallback-title" className="booking-success__title">
        {t("title")}
      </h1>
      <p className="booking-success__message">{t("message")}</p>
      <p className="booking-success__note" role="status">
        {t("notConfirmed")}
      </p>
      <p className="booking-success__note">{t("clinicWillContact")}</p>
      <p className="booking-success__note">{t("preferencesOnly")}</p>

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
      </dl>

      <div className="booking-success__actions">
        <SolidAction href="/correspondence">{t("contactCta")}</SolidAction>
        <SolidAction onClick={onStartAgain}>{t("startAgain")}</SolidAction>
        <Link href="/" className="quiet-link">
          {t("returnHome")}
        </Link>
      </div>
    </section>
  );
}
