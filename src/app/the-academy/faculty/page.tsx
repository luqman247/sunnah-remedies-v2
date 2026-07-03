import type { Metadata } from "next";
import { AcademySectionPage } from "@/components/academy/AcademySectionPage";
import { getHijamaDiploma } from "@/lib/content/academy";
import { getProgrammeBySlug } from "@/sanity/lib/fetch";
import { programmeToAcademyProgramme } from "@/sanity/lib/adapters";

export const metadata: Metadata = {
  title: "Faculty",
  description: "Named faculty, training lineage, and academic accountability.",
};

export default async function FacultyPage() {
  const programme = await getProgrammeBySlug("hijama-diploma");
  const p = programme ? programmeToAcademyProgramme(programme) : getHijamaDiploma();
  return (
    <AcademySectionPage
      folio="iii"
      title="Faculty"
      lede="Each programme names its teaching faculty before enrolment."
      currentHref="/the-academy/faculty"
      breadcrumbLabel="Faculty"
    >
      {p.faculty.map((member) => (
        <article key={member.name} className="faculty-card">
          <h2 className="type-title faculty-card__name">{member.name}</h2>
          <p className="type-micro faculty-card__title">{member.title}</p>
          <p className="type-small faculty-card__chain">{member.licence}</p>
          <p className="type-small faculty-card__chain">{member.chain}</p>
          {member.biography.map((bio) => (
            <p key={bio.slice(0, 40)} className="type-body faculty-card__bio">{bio}</p>
          ))}
        </article>
      ))}
    </AcademySectionPage>
  );
}
