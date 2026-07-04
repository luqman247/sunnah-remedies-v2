import type { Metadata } from "next";
import { AcademySectionPage } from "@/components/academy/AcademySectionPage";
import { GoLink } from "@/components/ui/Links";
import { getHijamaDiploma } from "@/lib/content/academy";
import { getProgrammeBySlug } from "@/sanity/lib/fetch";
import { programmeToAcademyProgramme } from "@/sanity/lib/adapters";

export const metadata: Metadata = {
  title: "Graduate pathways",
  description: "Post-certification pathways described without career guarantees.",
};

export default async function GraduatePathwaysPage() {
  const programme = await getProgrammeBySlug("hijama-diploma");
  const p = programme ? programmeToAcademyProgramme(programme) : getHijamaDiploma();
  return (
    <AcademySectionPage
      folio="xi"
      title="Graduate pathways"
      lede="Typical pathways after certification, without institutional guarantees"
      currentHref="/the-academy/graduate-pathways"
      breadcrumbLabel="Graduate pathways"
    >
      {p.graduatePathways.map((path) => (
        <article key={path.title} className="policy-block">
          <h2 className="type-title">{path.title}</h2>
          {path.body.map((para) => (
            <p key={para.slice(0, 48)} className="type-body">{para}</p>
          ))}
          {path.href && (
            <p className="type-body">
              <GoLink href={path.href}>Read further</GoLink>
            </p>
          )}
        </article>
      ))}
    </AcademySectionPage>
  );
}
