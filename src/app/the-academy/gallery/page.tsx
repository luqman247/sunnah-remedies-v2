import type { Metadata } from "next";
import { AcademySectionPage } from "@/components/academy/AcademySectionPage";
import { FacilityGallery } from "@/components/academy/FacilityGallery";
import { getHijamaDiploma } from "@/lib/content/academy";

const p = getHijamaDiploma();

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photography of teaching, clinical, and scholarly spaces.",
};

export default function AcademyGalleryPage() {
  return (
    <AcademySectionPage
      folio="vi"
      title="Gallery"
      lede="Institutional spaces recorded without staging — the clinical suite, reading room, and seminar hall."
      currentHref="/the-academy/gallery"
      breadcrumbLabel="Gallery"
    >
      <FacilityGallery items={p.gallery} />
    </AcademySectionPage>
  );
}
