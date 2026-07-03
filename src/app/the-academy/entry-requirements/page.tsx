import type { Metadata } from "next";
import { AcademySectionPage } from "@/components/academy/AcademySectionPage";
import { getHijamaDiploma } from "@/lib/content/academy";

const p = getHijamaDiploma();

export const metadata: Metadata = {
  title: "Entry requirements",
  description: "Entry qualifications, safeguarding checks, and interview process.",
};

export default function EntryRequirementsPage() {
  return (
    <AcademySectionPage
      folio="ix"
      title="Entry requirements"
      lede="Applications are reviewed by clinical and academic judgement."
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
