import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import "./dhikr-time-navigation.css";

export type DhikrTime = "morning" | "evening";

const DESTINATIONS: Record<DhikrTime, string> = {
  morning: "/knowledge/dhikr/morning",
  evening: "/knowledge/dhikr/evening",
};

interface DhikrTimeNavigationProps {
  activeTime?: DhikrTime;
}

/**
 * Shared Morning / Evening Dhikr hero navigation.
 *
 * Server Component — locale-aware Link destinations, no client state.
 * Active destination follows DepartmentNav: remains a Link with aria-current.
 */
export async function DhikrTimeNavigation({ activeTime }: DhikrTimeNavigationProps) {
  const t = await getTranslations("dhikr.timeNavigation");
  const pageTitle =
    activeTime === "morning" ? t("morning") : activeTime === "evening" ? t("evening") : t("eyebrow");

  return (
    <div className="dhikr-time-nav">
      <p className="dhikr-time-nav__eyebrow type-eyebrow">{t("eyebrow")}</p>
      <h1 className="sr-only">{pageTitle}</h1>
      <nav className="dhikr-time-nav__nav" aria-label={t("ariaLabel")}>
        <ul className="dhikr-time-nav__list">
          <li className="dhikr-time-nav__item">
            <TimeLink
              href={DESTINATIONS.morning}
              label={t("morning")}
              isActive={activeTime === "morning"}
            />
          </li>
          <li className="dhikr-time-nav__divider" aria-hidden="true">
            <span className="dhikr-time-nav__rule" />
            <span className="dhikr-time-nav__slash">/</span>
            <span className="dhikr-time-nav__rule" />
          </li>
          <li className="dhikr-time-nav__item">
            <TimeLink
              href={DESTINATIONS.evening}
              label={t("evening")}
              isActive={activeTime === "evening"}
            />
          </li>
        </ul>
      </nav>
      <p className="dhikr-time-nav__supporting">{t("supporting")}</p>
    </div>
  );
}

function TimeLink({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={`dhikr-time-nav__link${isActive ? " dhikr-time-nav__link--active" : ""}`}
      aria-current={isActive ? "page" : undefined}
      aria-label={label}
    >
      <span className="dhikr-time-nav__link-label">{label}</span>
      <span className="dhikr-time-nav__underline" aria-hidden="true" />
    </Link>
  );
}
