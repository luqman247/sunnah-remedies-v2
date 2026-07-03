import type { Metadata } from "next";
import { AcademySectionPage } from "@/components/academy/AcademySectionPage";
import { FacilityGallery } from "@/components/academy/FacilityGallery";
import { getHijamaDiploma } from "@/lib/content/academy";

const p = getHijamaDiploma();

export const metadata: Metadata = {
  title: "Gallery",
  description: "Line studies of teaching and clinical spaces.",
};

export default function AcademyGalleryPage() {
  return (
    <AcademySectionPage
      folio="vi"
      title="Gallery"
      lede="Line studies of institutional spaces, recorded without staging."
      currentHref="/the-academy/gallery"
      breadcrumbLabel="Gallery"
    >
      <FacilityGallery items={p.gallery} />
    </AcademySectionPage>
  );
}
