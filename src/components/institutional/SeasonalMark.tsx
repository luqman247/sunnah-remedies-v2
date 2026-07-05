"use client";

import { useLocale, useTranslations } from "next-intl";
import { getCurrentSeason, getHijriDate, getNextEvent } from "@/lib/calendar/seasons";
import { Link } from "@/i18n/navigation";

/**
 * SeasonalMark — the footer's quiet acknowledgment of the institutional calendar.
 * Shows current season during sacred periods, or the Hijri date at standard times.
 * Always links to the institutional calendar.
 */
export function SeasonalMark() {
  const locale = useLocale();
  const t = useTranslations("seasonal");
  const { season } = getCurrentSeason();
  const hijriDate = getHijriDate(locale);
  const nextEvent = getNextEvent();

  if (season === "standard") {
    if (!hijriDate) return null;
    const nextTitle = nextEvent
      ? t(`events.${nextEvent.id}.title` as "events.new-year.title")
      : "";
    return (
      <div className="seasonal-mark" aria-label={t("calendarAriaLabel")}>
        <Link href="/calendar" className="seasonal-mark__link">
          <span className="seasonal-mark__date type-folio">{hijriDate}</span>
          {nextEvent && (
            <span className="seasonal-mark__next type-folio">
              {t("next", { title: nextTitle })}
            </span>
          )}
        </Link>
      </div>
    );
  }

  const label = t(`seasons.${season}.label`);
  const greeting = t(`seasons.${season}.greeting`);

  return (
    <div
      className="seasonal-mark seasonal-mark--active"
      aria-label={t("currentSeason", { label })}
    >
      <Link href="/calendar" className="seasonal-mark__link">
        <span className="seasonal-mark__season type-eyebrow">{label}</span>
        {greeting && (
          <p className="seasonal-mark__greeting type-small">{greeting}</p>
        )}
        {hijriDate && (
          <span className="seasonal-mark__date type-folio">{hijriDate}</span>
        )}
      </Link>
    </div>
  );
}
