import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { AcademySectionPage } from "@/components/academy/AcademySectionPage";
import { FacilityGallery } from "@/components/academy/FacilityGallery";
import { getHijamaDiploma } from "@/lib/content/academy";
import { getProgrammeBySlug } from "@/sanity/lib/fetch";
import { programmeToAcademyProgramme } from "@/sanity/lib/adapters";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photography of teaching, clinical, and scholarly spaces.",
};

export default async function AcademyGalleryPage({
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
      folio="vi"
      title="Gallery"
      lede="Institutional spaces recorded without staging — the clinical suite, reading room, and seminar hall"
      currentHref="/the-academy/gallery"
      breadcrumbLabel="Gallery"
    >
      <FacilityGallery items={p.gallery} />
    </AcademySectionPage>
  );
}
