import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { AcademySectionPage } from "@/components/academy/AcademySectionPage";
import { getHijamaDiploma } from "@/lib/content/academy";
import { getProgrammeBySlug } from "@/sanity/lib/fetch";
import { programmeToAcademyProgramme } from "@/sanity/lib/adapters";

export const metadata: Metadata = {
  title: "Clinical standards",
  description: "Contraindications, technique standards, and infection control.",
};

export default async function ClinicalStandardsPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const programme = await getProgrammeBySlug("hijama-diploma", locale);
  const p = programme ? programmeToAcademyProgramme(programme) : getHijamaDiploma();
  return (
    <AcademySectionPage
      folio="iv"
      title="Clinical standards"
      lede="The patient is received as a guest, with limits stated without compromise"
      currentHref="/the-academy/clinical-standards"
      breadcrumbLabel="Clinical standards"
      intro={
        <p>
          Standards align with institutional protocol and mainstream clinical
          caution on cupping — taught before any volunteer contact
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
