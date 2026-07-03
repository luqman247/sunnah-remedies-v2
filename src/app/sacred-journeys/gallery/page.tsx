import type { Metadata } from "next";
import { JourneyGallery } from "@/components/journeys/JourneyGallery";
import { JourneySectionPage } from "@/components/journeys/JourneySectionPage";
import { journeys } from "@/lib/content/journeys";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Line studies of places and paths encountered on programme.",
};

export default function JourneysGalleryPage() {
  const galleryItems = journeys.flatMap((j) =>
    j.gallery.map((item) => ({
      ...item,
      caption: `${j.name} — ${item.caption}`,
    }))
  );

  return (
    <JourneySectionPage
      folio="xvi"
      title="Gallery"
      lede="Line studies of place, recorded without staging."
      currentHref="/sacred-journeys/gallery"
      breadcrumbLabel="Gallery"
      intro={
        <p>
          The institution does not use stock photography or staged promotional
          imagery. These studies record places and paths as encountered.
        </p>
      }
    >
      <JourneyGallery items={galleryItems} />
    </JourneySectionPage>
  );
}
