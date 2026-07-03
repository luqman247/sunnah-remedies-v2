import type { Metadata } from "next";
import { JourneyGallery } from "@/components/journeys/JourneyGallery";
import { JourneySectionPage } from "@/components/journeys/JourneySectionPage";
import { journeys } from "@/lib/content/journeys";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photography of places, paths, and architecture encountered on programme.",
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
      lede="Places and paths as encountered — recorded without staging."
      currentHref="/sacred-journeys/gallery"
      breadcrumbLabel="Gallery"
      intro={
        <p>
          The institution does not use stock photography or staged promotional
          imagery. These photographs record places and paths as encountered
          on programme.
        </p>
      }
    >
      <JourneyGallery items={galleryItems} />
    </JourneySectionPage>
  );
}
