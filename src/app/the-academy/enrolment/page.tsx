import type { Metadata } from "next";
import { AcademySectionPage } from "@/components/academy/AcademySectionPage";
import { EnrolmentForm } from "@/components/academy/EnrolmentForm";
import { EnrolmentJourney } from "@/components/academy/EnrolmentJourney";
import { getHijamaDiploma } from "@/lib/content/academy";
import { getProgrammeBySlug } from "@/sanity/lib/fetch";
import { programmeToAcademyProgramme } from "@/sanity/lib/adapters";

export const metadata: Metadata = {
  title: "Enrolment",
  description: "Application journey and form for the Hijāma Diploma.",
};

export default async function EnrolmentPage() {
  const programme = await getProgrammeBySlug("hijama-diploma");
  const p = programme ? programmeToAcademyProgramme(programme) : getHijamaDiploma();
  return (
    <AcademySectionPage
      folio="xv"
      title="Enrolment"
      lede="Application pathway. Admission is decided by faculty review."
      currentHref="/the-academy/enrolment"
      breadcrumbLabel="Enrolment"
      intro={
        <p>
          Read the Hijāma Diploma programme, clinical standards, and assessment
          criteria before applying.
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
