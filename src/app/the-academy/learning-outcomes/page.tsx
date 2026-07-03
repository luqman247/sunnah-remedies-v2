import type { Metadata } from "next";
import { AcademySectionPage } from "@/components/academy/AcademySectionPage";
import { SectionLabel } from "@/components/ui/PageIntro";
import { getHijamaDiploma } from "@/lib/content/academy";

const p = getHijamaDiploma();

export const metadata: Metadata = {
  title: "Learning outcomes",
  description: "Assessed competencies for the Hijāma Diploma.",
};

export default function LearningOutcomesPage() {
  return (
    <AcademySectionPage
      folio="iii"
      title="Learning outcomes"
      lede="Published before enrolment and assessed by written examination and OSCE."
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
