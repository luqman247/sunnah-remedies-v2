import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { setRequestLocale } from "next-intl/server";
import { AcademySectionPage } from "@/components/academy/AcademySectionPage";
import { EnrolmentForm } from "@/components/academy/EnrolmentForm";
import { EnrolmentJourney } from "@/components/academy/EnrolmentJourney";
import { getHijamaDiploma } from "@/lib/content/academy";
import { getProgrammeBySlug } from "@/sanity/lib/fetch";
import { programmeToAcademyProgramme } from "@/sanity/lib/adapters";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  return pageMetadata("theAcademy.enrolment", "/the-academy/enrolment");
}

export default async function EnrolmentPage({
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
      folio="xv"
      title="Enrolment"
      lede="Application pathway. Admission is decided by faculty review"
      currentHref="/the-academy/enrolment"
      breadcrumbLabel="Enrolment"
      intro={
        <p>
          Read the Hijāma Diploma programme, clinical standards, and assessment
          criteria before applying
        </p>
      }
    >
      <EnrolmentJourney steps={p.enrolmentJourney} />
      <div id="application" style={{ marginTop: "var(--s6)" }}>
        <EnrolmentForm programmeName={p.name} />
      </div>
    </AcademySectionPage>
  );
}
