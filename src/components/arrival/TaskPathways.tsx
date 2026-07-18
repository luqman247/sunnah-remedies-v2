import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { getAllJourneys } from "@/sanity/lib/fetch";

type TaskId = "book" | "remedies" | "programmes" | "duaDhikr" | "institute" | "journeys";

interface TaskDef {
  id: TaskId;
  href: string;
}

const CORE_TASKS: TaskDef[] = [
  { id: "book", href: "/consultations" },
  { id: "remedies", href: "/the-apothecary" },
  { id: "programmes", href: "/the-academy" },
  { id: "duaDhikr", href: "/knowledge-library/dua-dhikr" },
  { id: "institute", href: "/institute" },
];

/**
 * Restrained editorial pathways — intention before department name.
 * Not a marketing card grid. Journeys appear only when public journey
 * content exists (interest/registration surface is published).
 */
export async function TaskPathways({ locale }: { locale: AppLocale }) {
  const [t, journeys] = await Promise.all([
    getTranslations({ locale, namespace: "homepage.tasks" }),
    getAllJourneys(locale),
  ]);

  const tasks: TaskDef[] = [...CORE_TASKS];
  if (journeys.length > 0) {
    tasks.push({ id: "journeys", href: "/sacred-journeys" });
  }

  return (
    <section className="arrival-section arrival-tasks-section" aria-labelledby="tasks-heading">
      <div className="arrival-container">
        <div className="arrival-measure" style={{ marginInline: "auto" }}>
          <p className="type-eyebrow-v2" style={{ marginBlockEnd: "var(--space-4)" }}>
            {t("stamp")}
          </p>
          <h2 id="tasks-heading" className="type-section-title" style={{ marginBlockEnd: "var(--space-4)" }}>
            {t("heading")}
          </h2>
          <p className="type-standfirst" style={{ maxInlineSize: "55ch", marginBlockEnd: "var(--space-8)" }}>
            {t("lede")}
          </p>
          <nav className="arrival-tasks" aria-label={t("ariaLabel")}>
            <ul className="arrival-tasks__list">
              {tasks.map((task) => (
                <li key={task.id} className="arrival-tasks__item">
                  <Link href={task.href} className="arrival-tasks__link">
                    <span className="arrival-tasks__copy">
                      <span className="arrival-tasks__label">{t(`${task.id}.label`)}</span>
                      <span className="arrival-tasks__description">{t(`${task.id}.description`)}</span>
                      <span className="arrival-tasks__action">
                        {t(`${task.id}.action`)}
                        <span className="arrival-tasks__arrow" aria-hidden="true">
                          ⟶
                        </span>
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
}
