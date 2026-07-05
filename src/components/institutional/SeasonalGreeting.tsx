import { getLocale, getTranslations } from "next-intl/server";
import { getCurrentSeason, getHijriDate } from "@/lib/calendar/seasons";

/**
 * SeasonalGreeting — a quiet, reverent acknowledgment of the current sacred season.
 * Renders only during major seasons. Never promotional, never urgent.
 */
export async function SeasonalGreeting() {
  const locale = await getLocale();
  const t = await getTranslations("seasonal");
  const { season } = getCurrentSeason();
  const hijriDate = getHijriDate(locale);

  if (season === "standard") return null;

  const label = t(`seasons.${season}.label`);
  const greeting = t(`seasons.${season}.greeting`);
  const reflection = t(`seasons.${season}.reflection`);

  return (
    <aside className="seasonal-greeting" aria-label={t("currentSeason", { label })}>
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
