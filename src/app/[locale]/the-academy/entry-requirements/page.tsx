import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { AcademySectionPage } from "@/components/academy/AcademySectionPage";
import { getHijamaDiploma } from "@/lib/content/academy";
import { getProgrammeBySlug } from "@/sanity/lib/fetch";
import { programmeToAcademyProgramme } from "@/sanity/lib/adapters";

export const metadata: Metadata = {
  title: "Entry requirements",
  description: "Entry qualifications, safeguarding checks, and interview process.",
};

export default async function EntryRequirementsPage({
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
      folio="ix"
      title="Entry requirements"
      lede="Applications are reviewed by clinical and academic judgement"
      currentHref="/the-academy/entry-requirements"
      breadcrumbLabel="Entry requirements"
    >
      <ul className="monograph-list">
        {p.entryRequirements.map((item) => (
          <li key={item.slice(0, 48)}>{item}</li>
        ))}
      </ul>
    </AcademySectionPage>
  );
}
