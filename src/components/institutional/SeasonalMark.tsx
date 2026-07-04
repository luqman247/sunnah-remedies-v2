import { getCurrentSeason, getHijriDate, getNextEvent } from "@/lib/calendar/seasons";
import { Link } from "@/i18n/navigation";

/**
 * SeasonalMark — the footer's quiet acknowledgment of the institutional calendar.
 * Shows current season during sacred periods, or the Hijri date at standard times.
 * Always links to the institutional calendar.
 */
export function SeasonalMark() {
  const { season, label, greeting } = getCurrentSeason();
  const hijriDate = getHijriDate();
  const nextEvent = getNextEvent();

  if (season === "standard") {
    if (!hijriDate) return null;
    return (
      <div className="seasonal-mark" aria-label="Institutional calendar">
        <Link href="/calendar" className="seasonal-mark__link">
          <span className="seasonal-mark__date type-folio">{hijriDate}</span>
          {nextEvent && (
            <span className="seasonal-mark__next type-folio">
              Next: {nextEvent.title}
            </span>
          )}
        </Link>
      </div>
    );
  }

  return (
    <div
      className="seasonal-mark seasonal-mark--active"
      aria-label={`Current season: ${label}`}
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
