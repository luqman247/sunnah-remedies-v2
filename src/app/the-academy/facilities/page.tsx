import type { Metadata } from "next";
import { AcademySectionPage } from "@/components/academy/AcademySectionPage";
import { FacilityGallery } from "@/components/academy/FacilityGallery";
import { getHijamaDiploma } from "@/lib/content/academy";

const p = getHijamaDiploma();

export const metadata: Metadata = {
  title: "Facilities",
  description: "Clinical suite, reading room, and seminar teaching spaces.",
};

export default function FacilitiesPage() {
  return (
    <AcademySectionPage
      folio="vii"
      title="Facilities"
      lede="Purpose-built for supervised clinical education."
      currentHref="/the-academy/facilities"
      breadcrumbLabel="Facilities"
    >
      {p.facilities.map((f) => (
        <article key={f.name} className="facility-card">
          <h2 className="type-title">{f.name}</h2>
          <p className="type-body">{f.description}</p>
        </article>
      ))}
      <FacilityGallery items={p.gallery} />
    </AcademySectionPage>
  );
}
