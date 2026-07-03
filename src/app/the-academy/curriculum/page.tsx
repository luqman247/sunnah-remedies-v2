import type { Metadata } from "next";
import { AcademySectionPage } from "@/components/academy/AcademySectionPage";
import { getHijamaDiploma } from "@/lib/content/academy";
import { getProgrammeBySlug } from "@/sanity/lib/fetch";
import { programmeToAcademyProgramme } from "@/sanity/lib/adapters";

export const metadata: Metadata = {
  title: "Curriculum",
  description: "Curriculum modules with sources and practical components.",
};

export default async function CurriculumPage() {
  const programme = await getProgrammeBySlug("hijama-diploma");
  const p = programme ? programmeToAcademyProgramme(programme) : getHijamaDiploma();
  return (
    <AcademySectionPage
      folio="ii"
      title="Curriculum"
      lede="Modules are sourced, scheduled, and assessed to published standards."
      currentHref="/the-academy/curriculum"
      breadcrumbLabel="Curriculum"
    >
      {p.curriculum.map((mod) => (
        <article key={mod.number} className="curriculum-module">
          <header className="curriculum-module__header">
            <span className="curriculum-module__numeral">{mod.number}</span>
            <div>
              <h2 className="type-title curriculum-module__title">{mod.title}</h2>
              <p className="type-micro curriculum-module__hours">{mod.hours} contact hours</p>
            </div>
          </header>
          <p className="type-body">{mod.description}</p>
          {mod.practical && (
            <p className="type-small" style={{ color: "var(--muted)" }}>
              Practical: {mod.practical}
            </p>
          )}
          <p className="type-small" style={{ color: "var(--muted)" }}>
            Sources: {mod.sources.join(" · ")}
          </p>
        </article>
      ))}
    </AcademySectionPage>
  );
}
