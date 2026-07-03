import type { Metadata } from "next";
import { AcademySectionPage } from "@/components/academy/AcademySectionPage";
import { getHijamaDiploma } from "@/lib/content/academy";

const p = getHijamaDiploma();

export const metadata: Metadata = {
  title: "Clinical standards",
  description: "Contraindications, technique standards, and infection control.",
};

export default function ClinicalStandardsPage() {
  return (
    <AcademySectionPage
      folio="iv"
      title="Clinical standards"
      lede="The patient is received as a guest, with limits stated without compromise."
      currentHref="/the-academy/clinical-standards"
      breadcrumbLabel="Clinical standards"
      intro={
        <p>
          Standards align with institutional protocol and mainstream clinical
          caution on cupping — taught before any volunteer contact.
        </p>
      }
    >
      {p.clinicalStandards.map((block) => (
        <article key={block.title} className="policy-block">
          <h2 className="type-title">{block.title}</h2>
          {block.body.map((para) => (
            <p key={para.slice(0, 48)} className="type-body">{para}</p>
          ))}
        </article>
      ))}
    </AcademySectionPage>
  );
}
