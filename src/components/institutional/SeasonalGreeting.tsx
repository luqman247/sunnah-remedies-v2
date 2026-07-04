import { getCurrentSeason, getHijriDate } from "@/lib/calendar/seasons";

/**
 * SeasonalGreeting — a quiet, reverent acknowledgment of the current sacred season.
 * Renders only during major seasons. Never promotional, never urgent.
 * "The whole register deepens" — this is that deepening made visible.
 */
export function SeasonalGreeting() {
  const { season, label, greeting, reflection } = getCurrentSeason();
  const hijriDate = getHijriDate();

  if (season === "standard") return null;

  return (
    <aside className="seasonal-greeting" aria-label={`Current season: ${label}`}>
      <div className="seasonal-greeting__inner">
        <span className="seasonal-greeting__season type-eyebrow">{label}</span>
        {greeting && (
          <p className="seasonal-greeting__text type-body">{greeting}</p>
        )}
        {reflection && (
          <p className="seasonal-greeting__reflection">{reflection}</p>
        )}
        {hijriDate && (
          <time className="seasonal-mark__date type-folio" style={{ display: "block", marginTop: "var(--s2)" }}>
            {hijriDate}
          </time>
        )}
      </div>
    </aside>
  );
}
