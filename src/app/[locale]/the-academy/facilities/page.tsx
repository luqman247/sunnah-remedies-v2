import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { AcademySectionPage } from "@/components/academy/AcademySectionPage";
import { FacilityGallery } from "@/components/academy/FacilityGallery";
import { getHijamaDiploma } from "@/lib/content/academy";
import { getProgrammeBySlug } from "@/sanity/lib/fetch";
import { programmeToAcademyProgramme } from "@/sanity/lib/adapters";

export const metadata: Metadata = {
  title: "Facilities",
  description: "Clinical suite, reading room, and seminar teaching spaces.",
};

export default async function FacilitiesPage({
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
      folio="vii"
      title="Facilities"
      lede="Purpose-built for supervised clinical education"
      currentHref="/the-academy/facilities"
      breadcrumbLabel="Facilities"
    >
      {p.facilities.map((f) => (
        <article key={f.name} className="facility-card">
          <h2 className="type-title">{f.name}</h2>
          <p className="type-body">{f.description}</p>
        </article>
      ))}
      <FacilityGallery items={p.gallery} />
    </AcademySectionPage>
  );
}
