import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { JourneyGallery } from "@/components/journeys/JourneyGallery";
import { JourneySectionPage } from "@/components/journeys/JourneySectionPage";
import { getAllJourneys } from "@/sanity/lib/fetch";
import { journeyToSacredJourney } from "@/sanity/lib/adapters";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photography of places, paths, and architecture encountered on programme.",
};

export default async function JourneysGalleryPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const sanityJourneys = await getAllJourneys(locale);
  const journeys = sanityJourneys.map(journeyToSacredJourney);

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
      lede="Places and paths as encountered — recorded without staging"
      currentHref="/sacred-journeys/gallery"
      breadcrumbLabel="Gallery"
      intro={
        <p>
          The institution does not use stock photography or staged promotional
          imagery. These photographs record places and paths as encountered
          on programme
        </p>
      }
    >
      <JourneyGallery items={galleryItems} />
    </JourneySectionPage>
  );
}
