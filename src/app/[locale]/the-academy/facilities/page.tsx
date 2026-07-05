import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { setRequestLocale } from "next-intl/server";
import { AcademySectionPage } from "@/components/academy/AcademySectionPage";
import { FacilityGallery } from "@/components/academy/FacilityGallery";
import { getHijamaDiploma } from "@/lib/content/academy";
import { getProgrammeBySlug } from "@/sanity/lib/fetch";
import { programmeToAcademyProgramme } from "@/sanity/lib/adapters";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  return pageMetadata("theAcademy.facilities", "/the-academy/facilities");
}

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
