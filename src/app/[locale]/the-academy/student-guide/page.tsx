import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { AcademySectionPage } from "@/components/academy/AcademySectionPage";
import { getHijamaDiploma } from "@/lib/content/academy";
import { getProgrammeBySlug } from "@/sanity/lib/fetch";
import { programmeToAcademyProgramme } from "@/sanity/lib/adapters";

export const metadata: Metadata = {
  title: "Student guide",
  description: "Guidance from induction through certification.",
};

export default async function StudentGuidePage({
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
      title="Student guide"
      lede="What to expect week by week"
      currentHref="/the-academy/student-guide"
      breadcrumbLabel="Student guide"
    >
      {p.studentGuide.map((block) => (
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
