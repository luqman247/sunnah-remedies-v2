import type { Metadata } from "next";
import { AcademySectionPage } from "@/components/academy/AcademySectionPage";
import { getHijamaDiploma } from "@/lib/content/academy";
import { getProgrammeBySlug } from "@/sanity/lib/fetch";
import { programmeToAcademyProgramme } from "@/sanity/lib/adapters";

export const metadata: Metadata = {
  title: "Certification",
  description: "Scope of certification and its stated limits.",
};

export default async function CertificationPage() {
  const programme = await getProgrammeBySlug("hijama-diploma");
  const p = programme ? programmeToAcademyProgramme(programme) : getHijamaDiploma();
  return (
    <AcademySectionPage
      folio="v"
      title="Certification"
      lede="Certification attests completed training and does not grant medical licensure"
      currentHref="/the-academy/certification"
      breadcrumbLabel="Certification"
    >
      <ul className="monograph-list">
        {p.certification.map((item) => (
          <li key={item.slice(0, 48)}>{item}</li>
        ))}
      </ul>
    </AcademySectionPage>
  );
}
