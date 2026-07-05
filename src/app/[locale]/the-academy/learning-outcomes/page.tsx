import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { setRequestLocale } from "next-intl/server";
import { AcademySectionPage } from "@/components/academy/AcademySectionPage";
import { SectionLabel } from "@/components/ui/PageIntro";
import { getHijamaDiploma } from "@/lib/content/academy";
import { getProgrammeBySlug } from "@/sanity/lib/fetch";
import { programmeToAcademyProgramme } from "@/sanity/lib/adapters";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  return pageMetadata("theAcademy.learningOutcomes", "/the-academy/learning-outcomes");
}

export default async function LearningOutcomesPage({
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
      folio="iii"
      title="Learning outcomes"
      lede="Published before enrolment and assessed by written examination and OSCE"
      currentHref="/the-academy/learning-outcomes"
      breadcrumbLabel="Learning outcomes"
    >
      <ul className="outcome-list">
        {p.learningOutcomes.map((o) => (
          <li key={o.outcome} className="outcome-list__item">
            <span className="type-body">{o.outcome}</span>
            {o.assessed && <span className="type-micro outcome-list__badge">Formally assessed</span>}
          </li>
        ))}
      </ul>
    </AcademySectionPage>
  );
}
