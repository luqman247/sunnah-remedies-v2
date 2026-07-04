import type { Metadata } from "next";
import { AcademySectionPage } from "@/components/academy/AcademySectionPage";
import { getHijamaDiploma } from "@/lib/content/academy";
import { getProgrammeBySlug } from "@/sanity/lib/fetch";
import { programmeToAcademyProgramme } from "@/sanity/lib/adapters";

export const metadata: Metadata = {
  title: "Practical sessions",
  description: "Supervised clinical timetable for the Hijāma Diploma.",
};

export default async function PracticalSessionsPage() {
  const programme = await getProgrammeBySlug("hijama-diploma");
  const p = programme ? programmeToAcademyProgramme(programme) : getHijamaDiploma();
  return (
    <AcademySectionPage
      folio="iv"
      title="Practical sessions"
      lede="Supervised practice with staged progression before independent work"
      currentHref="/the-academy/practical-sessions"
      breadcrumbLabel="Practical sessions"
    >
      {p.practicalSessions.map((session) => (
        <article key={session.title} className="curriculum-module">
          <h2 className="type-title">{session.title}</h2>
          <p className="type-micro curriculum-module__hours">
            {session.schedule} · {session.hours} hours
          </p>
          <p className="type-body">{session.description}</p>
          <p className="type-small" style={{ color: "var(--muted)" }}>
            Supervision: {session.supervision}
          </p>
        </article>
      ))}
    </AcademySectionPage>
  );
}
