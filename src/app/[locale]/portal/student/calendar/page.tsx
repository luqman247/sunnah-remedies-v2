import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { setRequestLocale } from "next-intl/server";
import { StudentSectionPage } from "@/components/portal/StudentSectionPage";
import { getHijamaDiploma } from "@/lib/content/academy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  return pageMetadata("portal.student.calendar", "/portal/student/calendar");
}

export default async function CalendarPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const programme = getHijamaDiploma();

  return (
    <StudentSectionPage
      folio="vi"
      title="Calendar"
      lede="Office hours, practical sessions, and institutional events — personal view"
      currentHref="/portal/student/calendar"
      breadcrumbLabel="Calendar"
    >
      <section className="policy-block">
        <h2 className="type-title">Practical sessions</h2>
        {programme.practicalSessions.map((s) => (
          <article key={s.title} style={{ marginBottom: "var(--s4)" }}>
            <p className="type-title">{s.title}</p>
            <p className="type-micro" style={{ color: "var(--muted)" }}>
              {s.schedule} · {s.hours} hours
            </p>
            <p className="type-body">{s.description}</p>
          </article>
        ))}
      </section>

      <p className="type-micro" style={{ color: "var(--muted)" }}>
        Personal calendar integration and event registration will appear here as
        institutional events are published to the campus
      </p>
    </StudentSectionPage>
  );
}
