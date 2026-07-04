import type { Metadata } from "next";
import { ListingRow } from "@/components/ui/Attestation";
import { JourneySectionPage } from "@/components/journeys/JourneySectionPage";
import { SectionLabel } from "@/components/ui/PageIntro";
import { getAllJourneys } from "@/sanity/lib/fetch";
import { journeyToSacredJourney } from "@/sanity/lib/adapters";

export const metadata: Metadata = {
  title: "Itineraries",
  description: "Day-by-day educational itineraries published before departure.",
};

export default async function ItinerariesPage() {
  const sanityJourneys = await getAllJourneys();
  const journeyCatalogue = sanityJourneys.map((j) => {
    const adapted = journeyToSacredJourney(j);
    return {
      slug: adapted.slug,
      name: adapted.name,
      href: `/sacred-journeys/${adapted.slug}`,
      season: adapted.season,
      duration: adapted.duration,
      description: adapted.subtitle,
    };
  });

  return (
    <JourneySectionPage
      folio="iii"
      title="Daily itineraries"
      lede="Each journey publishes its educational itinerary before registration"
      currentHref="/sacred-journeys/itineraries"
      breadcrumbLabel="Itineraries"
      intro={
        <p>
          Open a journey to read the day-by-day programme: scholars, learning
          focus, sessions, and practical organisation. Comfort and limitations
          are stated plainly
        </p>
      }
    >
      <SectionLabel>Considered departures · {journeyCatalogue.length} programmes</SectionLabel>
      {journeyCatalogue.map((j) => (
        <ListingRow
          key={j.slug}
          title={j.name}
          subtitle={j.description}
          provenance={`${j.season} · ${j.duration}`}
          href={j.href}
        />
      ))}
    </JourneySectionPage>
  );
}
