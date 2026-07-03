import type { Metadata } from "next";
import { AcademySectionPage } from "@/components/academy/AcademySectionPage";
import { getHijamaDiploma } from "@/lib/content/academy";

const p = getHijamaDiploma();

export const metadata: Metadata = {
  title: "Assessment",
  description: "Written papers, clinical logbook, and OSCE assessment.",
};

export default function AssessmentPage() {
  return (
    <AcademySectionPage
      folio="viii"
      title="Assessment"
      lede="Rubrics are published at enrolment; remediation is limited per component."
      currentHref="/the-academy/assessment"
      breadcrumbLabel="Assessment"
    >
      <ul className="monograph-list">
        {p.assessment.map((item) => (
          <li key={item.slice(0, 48)}>{item}</li>
        ))}
      </ul>
    </AcademySectionPage>
  );
}
