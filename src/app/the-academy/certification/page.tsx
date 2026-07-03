import type { Metadata } from "next";
import { AcademySectionPage } from "@/components/academy/AcademySectionPage";
import { getHijamaDiploma } from "@/lib/content/academy";

const p = getHijamaDiploma();

export const metadata: Metadata = {
  title: "Certification",
  description: "Scope of certification and its stated limits.",
};

export default function CertificationPage() {
  return (
    <AcademySectionPage
      folio="v"
      title="Certification"
      lede="Certification attests completed training and does not grant medical licensure."
      currentHref="/the-academy/certification"
      breadcrumbLabel="Certification"
    >
      <ul className="monograph-list">
        {p.certification.map((item) => (
          <li key={item.slice(0, 48)}>{item}</li>
        ))}
      </ul>
    </AcademySectionPage>
  );
}
